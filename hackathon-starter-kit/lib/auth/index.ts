// Auth template for Clerk or Supabase Auth
// You can export common auth helpers here

export const authConfig = {
  providers: ['google', 'github'],
  callbacks: {
    signIn: async (user: any) => {
      console.log('User signing in:', user);
      return true;
    },
  },
};

import { supabase } from "@/lib/supabase";

export const getSession = async () => {
  if (!supabase) return { user: null };
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

export const logout = async () => {
  if (supabase) await supabase.auth.signOut();
};
