"use client";
import { SearchIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function searchForUser() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const supabase = createClient();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get("search") as string;

    try {
      const { data, error } = await supabase
        .from("reference_users")
        .select("*")
        .ilike("display_name", `%${searchTerm}%`);

      if (error) {
        console.error("Error searching for users:", error.message);
        return;
      }
 
      setSearchResults(data || []);
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  };


  return (
    <div>
      <form onSubmit={handleSearch} className="m-16 p-3 flex items-center gap-1">
        <input name="search" className="text-black h-8"></input>
        <br />
        <button
          className="flex bg-black rounded-full
                border-white border
                hover:bg-gray-500 
                items-center
                hover:text-white 
                cursor-pointer 
                hover:opacity-80 
                p-1.5 my-3 gap-2"
        >
          Search
          <SearchIcon className="h-5 w-5" />
        </button>
      </form>

      <div>
        {searchResults.map((user, index) => {
          return (
            <div key={user.display_name} className="m-16 flex bg-black rounded-full
            border-white border
            hover:bg-gray-500 
            items-center
            hover:text-white 
            cursor-pointer 
            hover:opacity-80 
            p-1.5 my-3 gap-2
            justify-center">
              <Link href={`/search/profile/${encodeURIComponent(user.user_id)}`} className="flex items-center gap-1">
                <img src={user.pfp_url} className="h-10 w-10" style={{ borderRadius: '50%' }}/>
                <p>{user.display_name}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}


