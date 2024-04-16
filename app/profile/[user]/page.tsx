import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/server';
import { HomeIcon, MusicNoteIcon, SearchIcon, UserIcon } from '@heroicons/react/outline';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SpotifyWebApi from "spotify-web-api-node";

export default async function Profile() {

    console.log('888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888');

    const cookieStore = cookies();

    const supabase = createClient(cookieStore);
    

    let spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID ,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    const { user } = await supabase.auth.getUser();
    const {
        data: {session},
    } = await supabase.auth.getSession()

    if (session) {
        const {provider_token, provider_refresh_token} = session;
        //console.log("Found session");
        if (provider_token && provider_refresh_token) {
            //console.log("Found tokens")
            await spotifyApi.setAccessToken(provider_token);
            await spotifyApi.setRefreshToken(provider_refresh_token);
        }
    }
    
    const id = session?.user.id
    const artists = await spotifyApi.getMyTopArtists();
    console.log(artists.body.items?.at(0)?.name);

    // new code here
    let modifiedData;


    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error.message);
    } else {
        try {
            modifiedData = await Promise.all(data.map(async post => {
                const modifiedPost = { ...post };
                modifiedPost.track_id = await spotifyApi.getTrack(post.track_id);
                return modifiedPost;
            }));
        } catch (error) {
            console.error('Error modifying data:', error.message);
        }
    }







    
        return (
            <div className="flex w-full flex-col items-center overflow-y-scroll scrollbar-hide"  style={{ fontFamily: 'monaco' }}>
                {/* @ts-expect-error Server Component */}
                {<Navbar/>}
                <div className="full-div w-full m-20">
                    <div className="column side">
                        <p className='text-black'> .</p>
                    </div>
                    
                    <div className="flex column middle ">
                        <div>
                            <img alt="" src={session?.user.user_metadata.picture} style={{ borderRadius: '50%' }} 
                            width="" height=""/> 
                        </div>
                        <h1 className="py-16 font-bold text-xl">{session?.user.user_metadata.name}</h1>
                        <div>
                            {artists.body.items?.at(1)?.name}
                        </div>
                    </div>


                    {/* New Code */}
                    <table>
                        <tbody>
                            {modifiedData.map((post, index) => (
                                <tr key={index}>
                                    <td>
                                        <img src={post.track_id.body.album.images[0].url} alt="Album Cover" />
                                    </td>
                                    <td style={{ color: '#FFFFFF'}}>{post.track_id.body.name}</td>
                                    <td style={{ color: '#FFFFFF'}}>{post.track_id.body.artists[0].name}</td>
                                    <td style={{ color: '#FFFFFF' }}>{post.comment}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* End of New Code */}


                    
                    <div className="column side">
                        <p className='text-black'> .</p>
                    </div>
                </div>


            </div>
        )

}