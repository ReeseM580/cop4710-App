import {
    ArrowLeftIcon
} from "@heroicons/react/outline"
import Link from "next/link";
import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default function Login({
    searchParams,
}: {
    searchParams: { message: string };
}) {

    async function signInWithSpotify() {
        "use server";

        const cookieStore = cookies();
        const supabase = createClient(cookieStore);
        const origin = headers().get('origin');

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'spotify',
            options: {redirectTo: `${origin}/auth/callback`, scopes: "user-read-email playlist-read-private playlist-read-collaborative streaming user-read-private user-library-read user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-recently-played user-follow-read"}
        })
        



        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        if(data.url)
            return redirect(data.url)
        
        
        return redirect("/login?message=Could not authenticate user");
      }
      

   const signIn = async (formData: FormData) => {
        "use server";

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        console.log(error);

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        return redirect("/");
  };

  const signUp = async (formData: FormData) => {
        "use server";

        const origin = headers().get("origin");
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const cookieStore = cookies();
        const supabase = createClient(cookieStore);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
            emailRedirectTo: `${origin}/auth/callback`,
            },
        });

    if (error) {
        return redirect("/login?message=Could not authenticate user");
    }

        return redirect("/login?message=Check email to continue sign in process");
    };

  return (
        <div className="flex-1 flex justify-center items-center flex-col w-full px-8 sm:max-w-md" style={{ fontFamily: 'monaco' }}>
            <Link
                href="/"
                className="absolute left-8 top-8 flex bg-black rounded-full
                border-white border
                hover:bg-gray-500 items-center space-x-2 
                hover:text-white cursor-pointer
                hover:opacity-80 p-1.5">
                <ArrowLeftIcon className="h-5 w-5 space-x-2"/>
                Back
            </Link>
            
            <div className="animate-in flex-1 flex flex-col w-full justify-center text-center">
                <h1 className="text-large font-bold py-4">Welcome to Now Playing</h1>
                <form>
                    <button
                        formAction={signInWithSpotify}
                        className="bg-black rounded-full border-white border hover:bg-gray-500
                        hover:text-white cursor-pointer hover:opacity-80 p-1.5"
                        >
                        Sign In With Spotify
                    </button>
                </form>
            </div>
        </div>
    );
}
