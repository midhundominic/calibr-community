import {createClient} from "@supabase/supabase-js";

const supabaseuUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if(!supabaseuUrl || !supabaseAnonKey){
    throw new Error("Missing Environment Variables");
}

export const supabase = createClient(supabaseuUrl,supabaseAnonKey);

export const signInWithLinkedIn = async()=>{
    if(typeof window === "undefined") return;

    const redirectUrl= `${window.location.origin}/community`;

    const{data,error} =await supabase.auth.signInWithOAuth({
        provider: "linkedin_oidc",
        options:{redirectTo: redirectUrl},
    });

    if(error) throw error;
    return data;
};

export const signOut = async ()=>{
    const{error} = await supabase.auth.signOut();
    if(error) throw error;
}

