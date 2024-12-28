import { supabase } from "@/integrations/supabase/client";

export const checkEmailExists = async (email: string) => {
  try {
    const { data, error, count } = await supabase
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
    const { data, error, count } = await supabase
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