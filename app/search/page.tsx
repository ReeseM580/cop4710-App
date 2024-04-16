import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';

export default async function search(){
    
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);

    const { data: recentPosts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching recent posts:', error.message);
        return null;
    }

    //console.log(recentPosts[0].track_id)

    
    return <pre>{JSON.stringify(recentPosts, null, 2)}</pre>
    
    /*return (
        <div className="flex w-full flex-col items-center overflow-y-scroll scrollbar-hide"
        style={{ fontFamily: 'monaco' }}>
            {/* @ts-expect-error Server Component }
            {<Navbar/>}
            <div className="m-16">
                <p>hi</p>
            </div>
        </div>
    )*/

}