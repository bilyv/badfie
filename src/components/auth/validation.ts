import { supabase } from "@/integrations/supabase/client";

export const checkEmailExists = async (email: string) => {
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('email', email);
  
  return count !== null && count > 0;
};

export const checkUsernameExists = async (username: string) => {
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('username', username);
  
  return count !== null && count > 0;
};