import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import { convertCompilerOptionsFromJson } from "typescript";
import SpotifyWebApi from "spotify-web-api-node";

export default async function Posts(){
    
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);

    const {
        data: {session},
    } = await supabase.auth.getSession()

    const { data: recentPost, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) {
        console.error('Error fetching recent posts:', error.message);
        return null;
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

    const trackId = recentPost[0].track_id;
    const track = await spotifyApi.getTrack(trackId);
    
    console.log(track.body.name)


    
    return (
        <div>
            <img src={track.body.album.images[0].url}
                 width={500} height={500}/>
            <p>{track.body.name}</p>
            <p>by {track.body.artists[0].name}</p>
            {recentPost[0].comment}
        </div>
    )

}