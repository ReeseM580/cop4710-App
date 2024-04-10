import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/server';
import { HomeIcon, MusicNoteIcon, SearchIcon, UserIcon } from '@heroicons/react/outline';
import { cookies } from 'next/headers';
import Link from 'next/link';


export default async function Profile() {
    const cookieStore = cookies();

    const supabase = createClient(cookieStore);

    const {
        data: {session},
    } = await supabase.auth.getSession()

    
        return (
            <div className="felx w-full flex-col items-center"  style={{ fontFamily: 'monaco' }}>
                {/* @ts-expect-error Server Component */}
                {<Navbar/>}
            </div>
        )

}