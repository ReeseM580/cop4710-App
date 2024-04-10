import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import SpotifyWebApi from "spotify-web-api-node";
import { redirect } from "next/navigation";

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

    var trackToPost = await (await spotifyApi.getMyCurrentPlayingTrack()).body.item?.name;

    if(!trackToPost)
        trackToPost = await (await spotifyApi.getMyRecentlyPlayedTracks()).body.items.at(0)?.track.name;

    return(
        <div>
            {trackToPost}
        </div>
    );
}