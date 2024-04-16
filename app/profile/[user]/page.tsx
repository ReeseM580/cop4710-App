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
            console.error('Error modifying data:', error);
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
                    
                <div className=" column middle" 
                    style={{padding:2}}>
                    <div className="flex items-center">
                        <img alt="" src={session?.user.user_metadata.picture} style={{  height: 200, width: 200}}
                        className="rounded-full"/>
                        <h1 className="font-bold text-xl "
                            style={{padding: 100}}>{session?.user.user_metadata.name}</h1>
                    </div>
                    <div className="flex" style={{alignItems: 'center', justifyContent: 'center'}}>
                        <h1 style={{padding: 10}}>Posts</h1>
                    </div>
                    <div>
                        {/* New Code */}
                        <div style={{ fontFamily: 'monaco', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 10}}
                            className="">
                            {/* Table */}
                            <table>
                                <tbody>
                                    {/* Mapping over modifiedData to display each post */}
                                    {modifiedData?.map((post, index) => (
                                        <tr key={index} style={{border: 'solid', padding: 30, borderRadius: 10}}
                                            className="border-white border-collapse-10%">
                                            <td>
                                                <img src={post.track_id.body.album.images[0].url} alt="Album Cover"  style={{margin: 3}}/>
                                            </td>
                                            <td style={{ color: '#FFFFFF', padding: 4}}>{post.track_id.body.name}</td>
                                            <td style={{ color: '#FFFFFF', padding: 4}}>{post.track_id.body.artists[0].name}</td>
                                            <td style={{ color: '#FFFFFF', padding: 4}}>{post.comment}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* End of New Code */} 
                <div className="column side">
                    <p className='text-black'> .</p>
                </div>
            </div>
        </div>
    )

}

