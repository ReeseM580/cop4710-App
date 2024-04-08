export const getAccessToken = async () => {
    const client_id = process.env.SPOTIFY_CLIENT_ID; 
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET; 
  
    
    fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${client_id}:${client_secret}`)}`,
      },
      body: 'grant_type=client_credentials'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.access_token);
        return data.access_token;
      });
      return null;
  }


  