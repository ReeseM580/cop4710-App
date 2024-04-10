import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { useRouter } from 'next/router'


export default async function Profile() {
    const router = useRouter();
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);

        const {
            data: {session},
        } = await supabase.auth.getSession()

        console.log(session);
    
        return (
            <div>
                <p>{session?.expires_at}</p>
            </div>
        )

}