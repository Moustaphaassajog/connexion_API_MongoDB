const SpotifyWebApi = require('spotify-web-api-node');
const { MongoClient } = require('mongodb');

// === 1. Connexion à l'API Spotify === //
const spotifyApi = new SpotifyWebApi({
  clientId: '97f19960cab441829a37aec88f66657a',
  clientSecret: 'c372e9fafd854e839b5c691ceb8abff1'
});

spotifyApi.clientCredentialsGrant().then(
  async function(data) {
    console.log('✅ Access token récupéré !');
    spotifyApi.setAccessToken(data.body['access_token']);

    // === 2. Récupérer les infos d'un artiste === //
    const artistData = await spotifyApi.getArtist('1Xyo4u8uXC1ZmMpatF05PJ');
    console.log('🎤 Artiste récupéré :', artistData.body.name);

    // === 3. Connexion à MongoDB Atlas === //
    const uri = 'mongodb+srv://moustaphaa014:assajog01@spotifyprojet.nyuxmq6.mongodb.net/'; // remplace par ton URI MongoDB
    const client = new MongoClient(uri);

    try {
      await client.connect();
      const database = client.db('spotify_dashboard');
      const artists = database.collection('artists');

      // === 4. Insérer les données de l'artiste dans MongoDB === //
      const result = await artists.insertOne(artistData.body);
      console.log('✅ Artiste inséré dans MongoDB avec l\'ID :', result.insertedId);
    } catch (err) {
      console.error('❌ Erreur MongoDB :', err);
    } finally {
      await client.close();
    }
  },
  function(err) {
    console.error('❌ Erreur Spotify :', err);
  }
);