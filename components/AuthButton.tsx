import {
    LogoutIcon,
    LoginIcon,
} from "@heroicons/react/outline"
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { data } from "autoprefixer";

export default async function AuthButton() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const signOut = async () => {
        "use server";

        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
        await supabase.auth.signOut();
        return redirect("/login");
    };

        const {
            data: {session},
        } = await supabase.auth.getSession()

        //console.log(session); //THIS IS WHERE THE PROVIDER TOKEN IS WHICH IS NEEDED TO MAKE API CALLS

    return user ? (
        <div className="flex items-center gap-4">
            {user.user_metadata.name}
            <img alt="Avatar" src={user.user_metadata.picture} style={{ borderRadius: '50%' }} 
            className="h-11 w-11"/>
            
            <form action={signOut}>
                <button className="flex space-x-2 bg-black rounded-full
                border-white border
                    hover:bg-gray-500 items-center  
                    hover:text-white cursor-pointer
                    hover:opacity-80 p-1.5">
                    <LogoutIcon className="h-5 w-5"/>
                    Logout
                </button>
            </form>

        </div>
    ) : (
        <Link href="/login"
        className="flex bg-black rounded-full
        border-white border
        hover:bg-gray-500 items-center space-x-2 
        hover:text-white cursor-pointer
        hover:opacity-80 p-1.5">
            <LoginIcon className="h-5 w-5"/>
            Login
        </Link>
    );
}
