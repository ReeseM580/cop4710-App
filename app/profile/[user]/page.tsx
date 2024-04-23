import DeletePostButton from '@/components/DeletePostButton';
import LikeButton from '@/components/LikeButton';
import Navbar from '@/components/Navbar';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import SpotifyWebApi from "spotify-web-api-node";

export default async function Profile() {



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
        if (provider_token && provider_refresh_token) {
            await spotifyApi.setAccessToken(provider_token);
            await spotifyApi.setRefreshToken(provider_refresh_token);
        }
    }

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
                    <div className="flex items-center border-white border-collapse-10%" style={{border: 'solid', padding: 5, borderRadius: 10}}>
                        <img alt="" src={session?.user.user_metadata.picture} style={{ height: 200, width: 200}}
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
                            >
                            {/* Table */}
                            <div>
                                {modifiedData?.map((post, index) => {
                                    return (
                                        <div key={index} className="flex items-center m-16 border-white border-collapse-10%" style={{border: 'solid', padding: 5, borderRadius: 10, 
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 20}}>
                                            <img src={post.track_id.body.album.images[0].url} style={{height: 500, width: 500}}/>
                                            <p style={{ color: '#FFFFFF', padding: 4}}>{post.track_id.body.name}</p>
                                            <p style={{ color: '#FFFFFF', padding: 4}}>{post.comment}</p>
                                            {<LikeButton postId={post.post_id}/>}
                                            <DeletePostButton postId={post.post_id} />
                                        </div>
                                    );
                                })}
                            </div>
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

