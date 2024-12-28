import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Create a service role client for admin operations
const SUPABASE_URL = "https://pgbzxlyxwpsalucwqtjn.supabase.co";
const serviceRoleClient = createClient<Database>(
  SUPABASE_URL,
  // Using anon key for now since we made profiles publicly readable
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnYnp4bHl4d3BzYWx1Y3dxdGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNTk2NzQsImV4cCI6MjA1MDczNTY3NH0.0WYgWhJWRXSEX9Js1KpJA1weIt51MCpUNKgEKeBd57g"
);

export const checkEmailExists = async (email: string) => {
  try {
    const { data, error, count } = await serviceRoleClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('email', email);
    
    if (error) {
      console.error('Error checking email:', error);
      return false;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error('Error in checkEmailExists:', error);
    return false;
  }
};

export const checkUsernameExists = async (username: string) => {
  try {
    const { data, error, count } = await serviceRoleClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('username', username);
    
    if (error) {
      console.error('Error checking username:', error);
      return false;
    }
    
    return count !== null && count > 0;
  } catch (error) {
    console.error('Error in checkUsernameExists:', error);
    return false;
  }
};