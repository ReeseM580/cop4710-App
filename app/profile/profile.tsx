import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Profile() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);

    const {
        data: {session},
    } = await supabase.auth.getSession()

    console.log(session);
  
    return (
        <div>
            <p>hi</p>
        </div>
    )

}