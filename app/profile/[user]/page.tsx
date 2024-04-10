import AuthButton from '@/components/AuthButton';
import { createClient } from '@/utils/supabase/server';
import { HomeIcon, MusicNoteIcon, SearchIcon, UserIcon } from '@heroicons/react/outline';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { useRouter } from 'next/router'


export default async function Profile() {
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
                <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                    <div className="w-full flex justify-between items-center text-sm">
                        {/*<DeployButton />*/}
                        <div className="flex p-3">
                            <Link href={`/profile/${encodeURIComponent(session?.user.user_metadata.name)}`}
                            className="flex bg-black rounded-full
                            border-white border
                            hover:bg-gray-500 items-center space-x-2 
                            hover:text-white cursor-pointer
                            hover:opacity-80 p-1.5 m-2">
                                <UserIcon className="h-5 w-5"/>
                                <p>Profile</p>
                            </Link>

                            <Link href="/"className="flex bg-black rounded-full
                            border-white border
                            hover:bg-gray-500 items-center space-x-2 
                            hover:text-white cursor-pointer
                            hover:opacity-80 p-1.5 m-2">
                                <HomeIcon className="h-5 w-5"/>
                                <p>Home</p>
                            </Link>

                            <Link href="/"className="flex bg-black rounded-full
                            border-white border
                            hover:bg-gray-500 items-center space-x-2 
                            hover:text-white cursor-pointer
                            hover:opacity-80 p-1.5 m-2">
                                <SearchIcon className="h-5 w-5"/>
                                <p>Search</p>
                            </Link>
                        </div>

                        <div className="flex flex-grow space-x-2">
                            <h1>Now Playing</h1>
                            <MusicNoteIcon className="h-5 w-5" />
                        </div>

                        <div className="flex p-3">
                            {/* @ts-expect-error Server Component */}
                            {isSupabaseConnected && <AuthButton />}
                        </div>

                    </div>
                </nav>
            </div>
        )

}