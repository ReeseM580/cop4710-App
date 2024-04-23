import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import Posts from "@/components/Posts";
import SearchForUserForm from "@/components/SearchUserForm";

export default async function search(){
    
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);

    return (
        <div className="flex w-full flex-col items-center overflow-y-scroll scrollbar-hide"  style={{ fontFamily: 'monaco' }}>
            {/* @ts-expect-error Server Component */}
            {<Navbar/>}
            <div>
                <SearchForUserForm/>
            </div>
        </div>
    )

}