import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Profile() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);

    
  
    return (
        <div>
            <p>hi</p>
        </div>
    )

}