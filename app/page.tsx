
import DeployButton from "../components/DeployButton";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from 'next/link';
import Navbar from "@/components/Navbar";



export default async function Index() {
    const cookieStore = cookies();
    const canInitSupabaseClient = () => {
        // This function is just for the interactive tutorial.
        // Feel free to remove it once you have Supabase connected.
        try {
            createClient(cookieStore);
            return true;
        } catch (e) {
            return false;
        }
  };

    const supabase = createClient(cookieStore);

    const {
        data: {session},
    } = await supabase.auth.getSession()

    const isSupabaseConnected = canInitSupabaseClient();

    return (
        <div className="felx w-full flex-col items-center"  style={{ fontFamily: 'monaco' }}>
            {/* @ts-expect-error Server Component */}
            {<Navbar/>}
      
            <div className="flex scrollbar-hide border-white">
            
            </div>
        </div>
    );
}






