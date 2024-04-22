import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import React from "react";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import SpotifyWebApi from "spotify-web-api-node";
import { redirect } from "next/navigation";


export default async function CreatePostButton(){
    //fucntion to call on action    
    const createPost = async (formData: FormData) => {
        'use server';

        const supabase = createServerActionClient({cookies});
    
        const {
            data: {session},
        } = await supabase.auth.getSession()
    
        let spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID ,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        });
    
        if (session) {
            const {provider_token, provider_refresh_token} = session;
            if (provider_token && provider_refresh_token) {
                await spotifyApi.setAccessToken(provider_token);
                await spotifyApi.setRefreshToken(provider_refresh_token);
            }
        }
        
        var trackId = await (
            await spotifyApi.getMyCurrentPlayingTrack()
            ).body.item?.id;    
        
    
        if(!trackId)
            trackId = await (
                await spotifyApi.getMyRecentlyPlayedTracks()
                ).body.items.at(0)?.track?.id;
        
        let track: any;
    
        if(trackId)
            track = await spotifyApi.getTrack(trackId);
                
        const comment = formData.get("comment")
        
        await supabase.from("posts").insert({
            created_at: new Date().toISOString(), user_id: session?.user.id, track_id: trackId, comment: comment})
            .single();

        return redirect('/')
    }

    return (
        <form action={createPost}> 
            <input name="comment" className="text-black" maxLength={55}></input><br/>
            <button className="flex bg-black rounded-full
                border-white border
                hover:bg-gray-500 
                items-center
                hover:text-white 
                cursor-pointer 
                hover:opacity-80 
                p-1.5 my-3 gap-2">  
                Post
                <ArrowNarrowRightIcon className="h-5 w-5"/>
            </button>
        </form>
    )    
}