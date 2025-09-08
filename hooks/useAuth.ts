import {useEffect, useState } from "react";
import {supabase} from "@/lib/supabase";
import { User as SupabaseUser,Session } from "@supabase/supabase-js";
import {User} from "@/types/User";

export const useAuth=()=>{
    const [user,setUser] = useState<SupabaseUser | null>(null);
    const [session,setSession] = useState<Session | null>(null);
    const [loading,setLoading] = useState(true);
    const [profile, setProfile] = useState<User | null>(null);

    useEffect(()=>{
        supabase.auth.getSession().then(({data})=>{
            setSession(data.session);
            setUser(data.session?.user ?? null);
            setLoading(false);
        });

        const {data:{subscription},}= supabase.auth.onAuthStateChange((_event,session)=>{
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return ()=>subscription.unsubscribe();
    },[]);

    const fetchProfile = async (userId: string) => {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();
    
          if (error) {
            if (error.code === "PGRST116") {
              // Profile doesn't exist, create it from auth user data
              await createProfileFromAuth(userId);
              return;
            }
            throw error;
          }
    
          setProfile(data);
        } catch (error:any) {
          console.error("Error fetching profile:", error?.message || error);
        } finally {
          setLoading(false);
        }
      };
    
      const createProfileFromAuth = async (userId: string) => {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;
    
          const profileData = {
            id: userId,
            email: user.email || "",
            full_name:
              user.user_metadata?.full_name || user.user_metadata?.name || "User",
            avatar_url:
              user.user_metadata?.avatar_url || user.user_metadata?.picture,
            linkedin_url: user.user_metadata?.linkedin_url,
          };
    
          const { data, error } = await supabase
            .from("users")
            .insert([profileData])
            .select()
            .single();
    
          if (error) throw error;
          setProfile(data);
        } catch (error) {
          console.error("Error creating profile:", error);
        }
      };

    return{
        user,
        profile,
        session,
        loading,
        isAuthenticated: !!user,
    };
};