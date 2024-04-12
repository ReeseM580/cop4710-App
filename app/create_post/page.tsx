import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import SpotifyWebApi from "spotify-web-api-node";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";

export default async function(){
    
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
        console.log("Found session");
        if (provider_token && provider_refresh_token) {
            console.log("Found tokens")
            await spotifyApi.setAccessToken(provider_token);
            await spotifyApi.setRefreshToken(provider_refresh_token);
        }
    }

    var trackId = await (await spotifyApi.getMyCurrentPlayingTrack()).body.item?.id;    

    if(!trackId)
        trackId = await (await spotifyApi.getMyRecentlyPlayedTracks()).body.items.at(0)?.track?.id;

    let track: any;

    if(trackId)
        track = await spotifyApi.getTrack(trackId);

    const { data, error } = await supabase.from("posts").insert({
        created_at: new Date().toISOString(), user_id: session?.user.id, track_id: trackId})
        .single();
    
        
    console.log(track.body.artists.name);
    

    return track ? (
        <div style={{ fontFamily: 'monaco' }}>
            {/* @ts-expect-error Server Component */}
            <Navbar/>
            
            <div className="flex w-full justify-center">  
                <form>
                    <img src={track.body.album.images[0].url}/>
                    <p>{track.body.name}</p>
                    <p>by {track.body.artists[0].name}</p>
                    <label>Add a comment for today's song</label><br/>
                    <input type="text" className="text-black"></input><br/>
                    <button className="flex bg-black rounded-full
                    border-white border
                    hover:bg-gray-500 
                    items-center
                    hover:text-white 
                    cursor-pointer 
                    hover:opacity-80 
                    p-1.5 my-3 gap-2"
                    
                    value="Post">  
                    Post
                    <ArrowNarrowRightIcon className="h-5 w-5"/>
                    </button>
                    
                </form>
            </div>

            
        </div>
        

    ) : (
        <div></div>
    );
}