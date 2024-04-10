import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/server';
import { HomeIcon, MusicNoteIcon, SearchIcon, UserIcon } from '@heroicons/react/outline';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SpotifyWebApi from "spotify-web-api-node";


export default async function Profile() {
    const cookieStore = cookies();

    const supabase = createClient(cookieStore);

    let spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID ,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    const {
        data: {session},
    } = await supabase.auth.getSession()

    if (session) {
        const {provider_token, provider_refresh_token} = session;
        console.log("Found session");
        if (provider_token && provider_refresh_token) {
            console.log("Found tokens")
            await spotifyApi.setAccessToken(provider_token);
            await spotifyApi.setRefreshToken(provider_refresh_token);
        }
    }

    const artists = await spotifyApi.getMyRecentlyPlayedTracks();
    console.log(artists.body.items?.at(0)?.track.name);

    
        return (
            <div className="w-full flex-col items-center"  style={{ fontFamily: 'monaco' }}>
                {/* @ts-expect-error Server Component */}
                {<Navbar/>}
                <div className="row">
                    <div className="column side">
                        <p className='text-black'> .</p>
                    </div>
                    
                    <div className="flex column middle">
                        <div>
                            <img alt="" src={session?.user.user_metadata.picture} style={{ borderRadius: '50%' }} 
                            className="p-10 h-lg w-lg"/> 
                        </div>
                        <h1 className="py-16 font-bold text-xl">{session?.user.user_metadata.name}</h1>
                        <div>
                            {artists.body.items?.at(0)?.track.album.name}
                        </div>
                    </div>
                    
                    <div className="column side">
                        <p className='text-black'> .</p>
                    </div>
                    </div>


            </div>
        )

}