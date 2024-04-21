import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import Posts from "@/components/Posts";

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


    
    return <pre>
        <p>f</p>
        </pre>

}