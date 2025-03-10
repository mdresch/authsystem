// app/dashboard/actions-dash.ts
'use server'; // Mark this as a server action

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from 'next/navigation';

export async function getDashboardData() {
    const supabase = await createSupabaseServerClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            redirect('/auth/login?redirect=/dashboard');
        }

        return { email: user.email };
    } catch (error) {
        console.error("Error fetching user data:", error);
        redirect('/auth/login?redirect=/dashboard'); // Redirect on error as well
        //Or consider throwing the error so the client component can render an error message
    }
}