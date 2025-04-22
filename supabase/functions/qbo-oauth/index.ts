
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get URL parameters
    const url = new URL(req.url)
    const action = url.searchParams.get('action')
    
    // Get the organization ID from the request body
    const { organizationId, environment, redirectUri } = await req.json()
    
    if (!organizationId) {
      return new Response(JSON.stringify({ error: 'Organization ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Get QBO client credentials from env vars
    const qboClientId = Deno.env.get('QBO_CLIENT_ID')
    const qboClientSecret = Deno.env.get('QBO_CLIENT_SECRET')
    
    if (!qboClientId || !qboClientSecret) {
      console.error('QBO client credentials not configured')
      return new Response(JSON.stringify({ error: 'QBO integration not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Different logic based on the action
    if (action === 'authorize') {
      // Generate authorization URL for QBO OAuth
      const state = crypto.randomUUID() // Use for CSRF protection
      
      // Store the state for validation later
      const { error: stateError } = await supabase
        .from('qbo_auth_state')
        .insert({
          organization_id: organizationId,
          state,
          created_at: new Date().toISOString(),
          redirect_uri: redirectUri || url.origin,
          environment: environment || 'production'
        })
      
      if (stateError) {
        console.error('Error storing auth state:', stateError)
        return new Response(JSON.stringify({ error: 'Failed to initialize OAuth' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // QBO OAuth endpoints
      const qboBaseUrl = environment === 'sandbox' 
        ? 'https://appcenter.intuit.com/connect/oauth2'
        : 'https://appcenter.intuit.com/connect/oauth2'
      
      // Build authorization URL
      const authUrl = new URL(qboBaseUrl)
      authUrl.searchParams.append('client_id', qboClientId)
      authUrl.searchParams.append('response_type', 'code')
      authUrl.searchParams.append('scope', 'com.intuit.quickbooks.accounting')
      authUrl.searchParams.append('redirect_uri', redirectUri || `${url.origin}/qbo-callback`)
      authUrl.searchParams.append('state', state)
      
      return new Response(JSON.stringify({ authUrl: authUrl.toString() }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } 
    else if (action === 'callback') {
      // Handle OAuth callback from QBO
      const code = url.searchParams.get('code')
      const state = url.searchParams.get('state')
      
      if (!code || !state) {
        return new Response(JSON.stringify({ error: 'Invalid callback parameters' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Validate state to prevent CSRF
      const { data: stateData, error: stateError } = await supabase
        .from('qbo_auth_state')
        .select('organization_id, redirect_uri, environment')
        .eq('state', state)
        .single()
      
      if (stateError || !stateData) {
        console.error('Invalid state parameter:', stateError)
        return new Response(JSON.stringify({ error: 'Invalid state parameter' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Exchange code for tokens
      const tokenUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: stateData.redirect_uri,
          client_id: qboClientId,
          client_secret: qboClientSecret
        })
      })
      
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text()
        console.error('Token exchange failed:', errorData)
        return new Response(JSON.stringify({ error: 'Failed to exchange authorization code' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const tokenData = await tokenResponse.json()
      const {
        access_token,
        refresh_token,
        expires_in,
        x_refresh_token_expires_in,
        realmId
      } = tokenData
      
      if (!access_token || !refresh_token || !realmId) {
        console.error('Incomplete token data:', tokenData)
        return new Response(JSON.stringify({ error: 'Incomplete token data received' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Calculate expiration dates
      const now = new Date()
      const tokenExpiresAt = new Date(now.getTime() + expires_in * 1000)
      
      // Get company info from QBO API
      const companyInfoUrl = `https://quickbooks.api.intuit.com/v3/company/${realmId}/companyinfo/${realmId}`
      const companyResponse = await fetch(companyInfoUrl, {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/json'
        }
      })
      
      let companyName = 'QuickBooks Company'
      if (companyResponse.ok) {
        const companyData = await companyResponse.json()
        companyName = companyData.CompanyInfo?.CompanyName || companyName
      }
      
      // Store the connection in the database
      const { data: existingConnection, error: fetchError } = await supabase
        .from('qbo_connection')
        .select('id')
        .eq('organization_id', stateData.organization_id)
        .maybeSingle()
      
      if (fetchError) {
        console.error('Error checking existing connection:', fetchError)
        return new Response(JSON.stringify({ error: 'Database error' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const now_iso = now.toISOString()
      
      if (existingConnection) {
        // Update existing connection
        const { error: updateError } = await supabase
          .from('qbo_connection')
          .update({
            qbo_realm_id: realmId,
            qbo_company_id: realmId,
            qbo_access_token: access_token,
            qbo_refresh_token: refresh_token,
            qbo_token_expires_at: tokenExpiresAt.toISOString(),
            environment: stateData.environment,
            is_active: true,
            last_connected_at: now_iso,
            updated_at: now_iso
          })
          .eq('id', existingConnection.id)
        
        if (updateError) {
          console.error('Error updating connection:', updateError)
          return new Response(JSON.stringify({ error: 'Failed to update connection' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      } else {
        // Create new connection
        const { error: insertError } = await supabase
          .from('qbo_connection')
          .insert({
            organization_id: stateData.organization_id,
            qbo_realm_id: realmId,
            qbo_company_id: realmId,
            qbo_access_token: access_token,
            qbo_refresh_token: refresh_token,
            qbo_token_expires_at: tokenExpiresAt.toISOString(),
            environment: stateData.environment,
            is_active: true,
            last_connected_at: now_iso,
            created_at: now_iso,
            updated_at: now_iso
          })
        
        if (insertError) {
          console.error('Error creating connection:', insertError)
          return new Response(JSON.stringify({ error: 'Failed to create connection' }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
      }
      
      // Clean up the state record
      await supabase.from('qbo_auth_state').delete().eq('state', state)
      
      // Return success with redirect URL
      return new Response(JSON.stringify({
        success: true,
        companyName,
        realmId
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    else if (action === 'disconnect') {
      // Revoke QBO tokens and mark connection as inactive
      const { data: connection, error: fetchError } = await supabase
        .from('qbo_connection')
        .select('qbo_access_token, qbo_refresh_token')
        .eq('organization_id', organizationId)
        .maybeSingle()
      
      if (fetchError || !connection) {
        console.error('Error fetching connection:', fetchError)
        return new Response(JSON.stringify({ error: 'Connection not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Attempt to revoke tokens with Intuit
      if (connection.qbo_access_token) {
        try {
          const revokeUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/revoke'
          await fetch(revokeUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Basic ${btoa(`${qboClientId}:${qboClientSecret}`)}`
            },
            body: new URLSearchParams({
              token: connection.qbo_access_token,
              token_type_hint: 'access_token'
            })
          })
          
          // Also revoke refresh token
          if (connection.qbo_refresh_token) {
            await fetch(revokeUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${qboClientId}:${qboClientSecret}`)}`
              },
              body: new URLSearchParams({
                token: connection.qbo_refresh_token,
                token_type_hint: 'refresh_token'
              })
            })
          }
        } catch (e) {
          console.error('Error revoking tokens:', e)
          // Continue anyway to mark connection as inactive
        }
      }
      
      // Mark connection as inactive
      const { error: updateError } = await supabase
        .from('qbo_connection')
        .update({
          is_active: false,
          qbo_access_token: null,
          qbo_refresh_token: null,
          updated_at: new Date().toISOString()
        })
        .eq('organization_id', organizationId)
      
      if (updateError) {
        console.error('Error updating connection:', updateError)
        return new Response(JSON.stringify({ error: 'Failed to disconnect' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    else if (action === 'refresh') {
      // Refresh QBO access token
      const { data: connection, error: fetchError } = await supabase
        .from('qbo_connection')
        .select('id, qbo_refresh_token')
        .eq('organization_id', organizationId)
        .maybeSingle()
      
      if (fetchError || !connection || !connection.qbo_refresh_token) {
        console.error('Error fetching connection or no refresh token:', fetchError)
        return new Response(JSON.stringify({ error: 'Valid connection not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // Exchange refresh token for new access token
      const tokenUrl = 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer'
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: connection.qbo_refresh_token,
          client_id: qboClientId,
          client_secret: qboClientSecret
        })
      })
      
      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.text()
        console.error('Token refresh failed:', errorData)
        return new Response(JSON.stringify({ error: 'Failed to refresh token' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      const tokenData = await tokenResponse.json()
      const {
        access_token,
        refresh_token,
        expires_in
      } = tokenData
      
      // Calculate new expiration date
      const now = new Date()
      const tokenExpiresAt = new Date(now.getTime() + expires_in * 1000)
      
      // Update the connection with new tokens
      const { error: updateError } = await supabase
        .from('qbo_connection')
        .update({
          qbo_access_token: access_token,
          qbo_refresh_token: refresh_token || connection.qbo_refresh_token, // Use new refresh token if provided
          qbo_token_expires_at: tokenExpiresAt.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('id', connection.id)
      
      if (updateError) {
        console.error('Error updating connection with new tokens:', updateError)
        return new Response(JSON.stringify({ error: 'Failed to update tokens' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      return new Response(JSON.stringify({
        success: true,
        expires_at: tokenExpiresAt.toISOString()
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    else {
      return new Response(JSON.stringify({ error: 'Invalid action' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
