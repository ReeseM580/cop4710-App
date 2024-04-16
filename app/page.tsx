
import DeployButton from "../components/DeployButton";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import { PlusCircleIcon } from "@heroicons/react/outline";
import Posts from "@/components/Posts";
import { redirect } from 'next/navigation';


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

    if(!session){
        return redirect("/login");
    }

    const isSupabaseConnected = canInitSupabaseClient();

    const { data: recentPosts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching recent posts:', error.message);
        return null;
    }    

    return (

        <div className="min-h-screen flex flex-col items-center"  style={{ fontFamily: 'monaco' }}>
            {/* @ts-expect-error Server Component */}
            {<Navbar/>}

            <div className="flex-1 flex-col gap-20 max-w-4xl px-4 w-full full-div border-white m-16" >
                {/* @ts-expect-error Server Component */}
                {<Posts/>}
            </div>

            <footer className="animate-in flex justify-center w-full fixed bottom-0 border-t border-t-foreground/10 h-16">
                <div className="flex justify-end gap-2 p-2">
                    <Link
                    href="/create_post"
                    className="flex bg-black rounded-full border-white border hover:bg-gray-500 items-center gap-2 hover:text-white cursor-pointer hover:opacity-80 p-1.5"
                    >
                    <PlusCircleIcon className="h-5 w-5" />
                    <p>Create Post</p>
                    </Link>
                </div>
            </footer>
        </div>        
    );
}






