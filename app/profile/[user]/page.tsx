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
    
    const id = session?.user.id
    const artists = await spotifyApi.getMyTopArtists();
    console.log(artists.body.items?.at(0)?.name);

    // new code here

    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error.message);
    } else {
        let postsContainer = document.getElementById('posts-container');

        // Clear previous content
        postsContainer.innerHTML = '';

        // Loop through the data array and generate HTML for each post
        data.forEach(async post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            // Fetch additional data from Spotify using the track ID
            const spotifyData = await spotifyApi.getTrack(post.trackID);

            // Display Spotify information
            if (spotifyData) {
                const imgElement = document.createElement('img');
                imgElement.src = '${spotifyData.body.album.images[0].url}';

                const songElement = document.createElement('p');
                songElement.textContent = `${spotifyData.body.name}\n${spotifyData.body.artists[0].name}`;
                postElement.append(imgElement);
                postElement.appendChild(songElement);
            }

            // Display comment
            const commentElement = document.createElement('p');
            commentElement.textContent = `Comment: ${post.comment}`;
            postElement.appendChild(commentElement);

            postsContainer.appendChild(postElement);
        });
    }


    // new code above

    







    
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
                    <div id="posts-container">
                        {/* Dynamically generated content will be appended here */}
                    </div>
                    {/* End of New Code */}


                    
                    <div className="column side">
                        <p className='text-black'> .</p>
                    </div>
                </div>


            </div>
        )

}