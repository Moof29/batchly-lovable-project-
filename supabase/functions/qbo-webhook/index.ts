
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Handle CORS preflight requests
interface WebhookPayload {
  eventNotifications: Array<{
    realmId: string;
    dataChangeEvent: {
      entities: Array<{
        name: string;
        id: string;
        operation: string;
        lastUpdated: string;
      }>
    }
  }>
}

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
    
    // Get webhook signature from header for verification
    const qboSignature = req.headers.get('intuit-signature')
    
    if (!qboSignature) {
      console.error('Missing QBO webhook signature')
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    // Get request body
    const payload = await req.json() as WebhookPayload
    console.log('Received QBO webhook payload:', JSON.stringify(payload))
    
    // TODO: Verify webhook signature using your webhook verifier key
    // This would be a cryptographic verification in production
    
    // Process each notification
    for (const notification of payload.eventNotifications) {
      const realmId = notification.realmId
      
      // Find organization by realm ID
      const { data: orgData, error: orgError } = await supabase
        .from('qbo_connection')
        .select('organization_id')
        .eq('qbo_realm_id', realmId)
        .single()
      
      if (orgError) {
        console.error('Error finding organization:', orgError)
        continue
      }
      
      const organizationId = orgData.organization_id
      
      // Process each entity change
      for (const entity of notification.dataChangeEvent.entities) {
        const entityType = mapQboEntityType(entity.name)
        const entityId = entity.id
        const operation = entity.operation.toLowerCase()
        const timestamp = new Date()
        
        // Log webhook event
        const { data: eventData, error: eventError } = await supabase
          .from('qbo_webhook_events')
          .insert({
            organization_id: organizationId,
            webhook_id: crypto.randomUUID(),
            entity_type: entityType,
            entity_id: entityId,
            event_type: operation,
            event_data: entity,
            created_at: timestamp.toISOString()
          })
          .select()
          .single()
        
        if (eventError) {
          console.error('Error logging webhook event:', eventError)
          continue
        }
        
        // Queue sync from QBO to Batchly if entity changed in QBO
        // We'll create a sync operation to pull the updated entity from QBO
        const { error: opError } = await supabase
          .from('qbo_sync_operation')
          .insert({
            organization_id: organizationId,
            operation_id: crypto.randomUUID(),
            entity_type: entityType,
            entity_id: entityId, // This is the QBO ID; we'll need to look up the Batchly ID
            operation_type: operation === 'delete' ? 'delete' : 'update',
            sync_direction: 'from_qbo',
            status: 'pending',
            qbo_id: entityId,
            scheduled_at: timestamp.toISOString()
          })
        
        if (opError) {
          console.error('Error creating sync operation:', opError)
        }
      }
    }
    
    // Return success response
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// Helper to map QBO entity names to our entity types
function mapQboEntityType(qboEntityName: string): string {
  const mapping: Record<string, string> = {
    'Customer': 'customer_profile',
    'Vendor': 'vendor_profile',
    'Item': 'item_record',
    'Invoice': 'invoice_record',
    'Bill': 'bill_record',
    'Payment': 'payment_receipt',
  }
  return mapping[qboEntityName] || qboEntityName.toLowerCase()
}
