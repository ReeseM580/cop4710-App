import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import SpotifyWebApi from "spotify-web-api-node";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import CreatePostButton from "@/components/CreatePostForm";
//import React, { FormEvent, useState } from "react"

export default async function(){
    //const [isLoading, setIsLoading] = useState<boolean>(false)
    //const [error, setError] = useState<string | null>(null)
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    
    const {
        data: {session},
    } = await supabase.auth.getSession()

    if(!session){
        return redirect("/login");
    }

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

    
    /*async function onSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        setIsLoading(true)
        setError(null)

        try{
            //create post
            
        } catch(error){
            setError(error.message)
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }
    */
    const createPost = async () => {
        "use server";
        const { data } = await supabase.from("posts").insert({
            created_at: new Date().toISOString(), user_id: session?.user.id, track_id: trackId})
            .single();
        //console.log(track.body.artists.name);
    
    }


    return track ? (
        <div className="w-full" style={{ fontFamily: 'monaco' }}>
            {/* @ts-expect-error Server Component */}
            <Navbar/>
            
            <div className="flex w-full justify-center">  
                <div className="m-16 p-3">
                    <img src={track.body.album.images[0].url}
                    width={500} height={500}/>
                        <p>{track.body.name}</p>
                        <p>by {track.body.artists[0].name}</p>
                        <label>Add a comment for today's song</label><br/>
                    {/* @ts-expect-error Server Component */}
                    <CreatePostButton/>
                </div>
            </div>
        </div>
    ) : (
        <div></div>
    );
}