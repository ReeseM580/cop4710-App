import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server';
import SpotifyWebApi from "spotify-web-api-node";
import LikeButton from "./LikeButton";

export default async function Posts(){
    
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);

    const {
        data: {session},
    } = await supabase.auth.getSession()

    const usersWithPostsQuery = supabase.from('reference_users').select(`
        user_id,
        display_name,
        pfp_url,
        posts (
            user_id,
            track_id,
            comment
        )
    `)
    .order('created_at', { ascending: false });

    const { data, error } = await usersWithPostsQuery
    if(error) throw error

    type userPost = {
        user_id: string;
        track_id: string;
        comment: string;
    };

    const filteredData = data.filter((user: any) => user.posts.length > 0);

    const postsArray: [string, userPost][] = [];
    for (const user of filteredData){
        postsArray.push([user.display_name, user.posts[user.posts.length - 1]])     
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

    const modifiedPostsArray = await Promise.all(filteredData.map(async (user: any) => {
        const latestPost: userPost = user.posts[user.posts.length - 1];
        const trackDetails = await spotifyApi.getTrack(latestPost.track_id);
        return { displayName: user.display_name, trackDetails };
        
    }));

    return (
        <div className="overflow-y-scroll scrollbar-hide">
            {modifiedPostsArray?.map((postInfo, index) => (
                <div key={index} style={{border: 'solid', padding: 5, borderRadius: 10, 
                    display: 'flex', flexDirection: 'column', alignItems: 'center', margin: 20}}
                    className="border-white border-collapse-10%">
                    <p style={{padding: 5}}>{postInfo.displayName}</p>
                    <img src={postInfo.trackDetails.body.album.images[0].url}
                    width={500} height={500}
                    style={{margin:2}}/>
                    <p>{postInfo.trackDetails.body.name}</p>
                    <p>by {postInfo.trackDetails.body.artists[0].name}</p>
                    <p>{postsArray[index][1].comment}</p>
                    {<LikeButton/>}   
                </div>
            ))}
        </div>
    )
}