// app/login/actions.ts
'use server'; // Mark this as a server action

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from 'next/navigation';
import { Provider } from '@supabase/supabase-js';

async function signInWithOAuth(provider: Provider) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: 'https://katscktlmaqbkuncezlq.supabase.co/auth/v1/callback',
    },
  })
  
  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }
}