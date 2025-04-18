
import { useState, useEffect } from 'react';
import { User, UserRole } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true);
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_OUT') {
              setUser(null);
            } else if (session?.user) {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('Error fetching user profile:', error);
                return;
              }

              if (profile) {
                // Map database role to UserRole type, handling 'customer' specially
                let role = profile.role as string;
                if (role === 'customer') {
                  role = 'customer_service'; // Map 'customer' to 'customer_service' as fallback
                }

                setUser({
                  id: session.user.id,
                  email: session.user.email || '',
                  first_name: profile.first_name,
                  last_name: profile.last_name,
                  role: role as UserRole,
                  avatar_url: profile.avatar_url,
                  organization_id: profile.organization_id
                });
              }
            }
          }
        );

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user profile:', error);
          } else if (profile) {
            // Map database role to UserRole type, handling 'customer' specially
            let role = profile.role as string;
            if (role === 'customer') {
              role = 'customer_service'; // Map 'customer' to 'customer_service' as fallback
            }

            setUser({
              id: session.user.id,
              email: session.user.email || '',
              first_name: profile.first_name,
              last_name: profile.last_name,
              role: role as UserRole,
              avatar_url: profile.avatar_url,
              organization_id: profile.organization_id
            });
          }
        }

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error('Error initializing user:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize user'));
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  return {
    user,
    setUser,
    loading,
    error
  };
};
