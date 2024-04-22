import React from "react";
import { createClient } from '@/utils/supabase/server';
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import SpotifyWebApi from "spotify-web-api-node";
import LikeButton from "@/components/LikeButton";

export default async function Profile({ params }: { params: { user: string } }) {

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
        if (provider_token && provider_refresh_token) {
            await spotifyApi.setAccessToken(provider_token);
            await spotifyApi.setRefreshToken(provider_refresh_token);
        }
    }

    const { data: user, error: userError} = await supabase
        .from('reference_users')
        .select('*')
        .eq('user_id', params.user)

    if (userError) 
            console.error('Error fetching posts:', userError.message);
    
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', params.user)
        .order('created_at', { ascending: false });

    let modifiedData;

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
            <Navbar/>
            <div className="flex items-center border-white border-collapse-10% m-16" style={{border: 'solid', padding: 5, borderRadius: 10}}>
                        <img alt="" src={user?.[0].pfp_url} style={{ height: 200, width: 200}}
                        className="rounded-full"/>
                        <h1 className="font-bold text-xl "
                            style={{padding: 100}}>{user?.[0].display_name}</h1>
                    </div>
                    <div className="items center">
                        <p>Posts</p>
                    </div>
            <div className="">
                {modifiedData?.map((post, index) => {
                    return (
                        <div key={index} className="flex items-center m-16 border-white border-collapse-10%" style={{border: 'solid', padding: 5, borderRadius: 10, 
                        display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 20}}>
                            <img src={post.track_id.body.album.images[0].url} style={{height: 500, width: 500}}/>
                            <p style={{ color: '#FFFFFF', padding: 4}}>{post.track_id.body.name}</p>
                            <p style={{ color: '#FFFFFF', padding: 4}}>{post.comment}</p>
                            {<LikeButton/>}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}