import {
    HomeIcon,
    MusicNoteIcon,
    SearchIcon,
    UserIcon,
  } from "@heroicons/react/outline";
  import { createClient } from "@/utils/supabase/server";
  import { cookies } from "next/headers";
  import Link from "next/link";
  import AuthButton from "./AuthButton";
  
  export default async function Navbar() {
    const cookieStore = cookies();
    const canInitSupabaseClient = () => {
      try {
        createClient(cookieStore);
        return true;
      } catch (e) {
        return false;
      }
    };
  
    const supabase = createClient(cookieStore);
  
    const {
      data: { session },
    } = await supabase.auth.getSession();
  
    const isSupabaseConnected = canInitSupabaseClient();
  
    return (
      <nav className="animate-in w-full flex justify-center fixed bg-black border-b border-b-foreground/10 h-16">
        <div className="grid grid-cols-3 w-full gap-4 items-center">
          {/* Left Section */}
          <div className="flex justify-start gap-2 pl-2">
            <Link
              href="/"
              className="flex bg-black rounded-full border-white border hover:bg-gray-500 items-center gap-2 hover:text-white cursor-pointer hover:opacity-80 p-1.5"
            >
              <HomeIcon className="h-5 w-5" />
              <p>Home</p>
            </Link>
            <Link
              href={`/profile/${encodeURIComponent(
                session?.user.user_metadata.name
              )}`}
              className="flex bg-black rounded-full border-white border hover:bg-gray-500 items-center gap-2 hover:text-white cursor-pointer hover:opacity-80 p-1.5"
            >
              <UserIcon className="h-5 w-5" />
              <p>Profile</p>
            </Link>
  
            <Link
              href="/search"
              className="flex bg-black rounded-full border-white border hover:bg-gray-500 items-center gap-2 hover:text-white cursor-pointer hover:opacity-80 p-1.5"
            >
              <SearchIcon className="h-5 w-5" />
              <p>Search</p>
            </Link>
          </div>
          {/* Center Section */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <h1>Now Playing</h1>
              <MusicNoteIcon className="h-5 w-5" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex justify-end gap-2 pr-2">
            {/* @ts-expect-error Server Component */}
            {isSupabaseConnected && <AuthButton />}
          </div>
        </div>
      </nav>
    );
  }