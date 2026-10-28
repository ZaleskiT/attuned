import express from 'express';

const app = express();
const PORT = 3000;
// Starting with 10, maybe user defined later
const TOTAL_ROUNDS = 10;
const games = new Map();

app.use(express.json());

// Genres; ids match Deezer's category ids
const GENRES = [
  { id: 0, name: 'Global Top' },
  { id: 132, name: 'Pop' },
  { id: 116, name: 'Hip Hop' },
  { id: 152, name: 'Rock' },
  { id: 113, name: 'Dance' },
  { id: 165, name: 'R&B' },
  { id: 85, name: 'Alternative' },
  { id: 106, name: 'Electro' },
  { id: 197, name: 'Latin' },
  { id: 464, name: 'Metal' },
  { id: 169, name: 'Soul & Funk' },
  { id: 466, name: 'Folk' },
  { id: 129, name: 'Jazz' },
  { id: 98, name: 'Classical' },
  { id: 173, name: 'Film & Games' },
];

/*
"id": 518458172,
      "title": "Sweet Child O' Mine",
      "titleShort": "Sweet Child O' Mine",
      "artist": "Guns N' Roses",
      "album": "Appetite For Destruction (Super Deluxe Edition)",
      "cover": "https://cdn-images.dzcdn.net/images/cover/8bfe7b3b0985d9ff0751090fb2b6f73f/500x500-000000-80-0-0.jpg",
      "link": "https://www.deezer.com/track/518458172",
      "preview": "https://cdnt-preview.dzcdn.net/api/1/1/5/9/1/0/59115eec88ea0bc7742eaba93facf49b.mp3?hdnea=exp=1792687859~acl=/api/1/1/5/9/1/0/59115eec88ea0bc7742eaba93facf49b.mp3*~data=user_id=0,application_id=42~hmac=cf7c3f9b16a8dd2f9365cd8e2ba9d68a4254fad17ea97201e01cbe156cef1ad1"
*/

// Based on past experience, fetching groups of tracks can contain invalid ones.
// I want to filter those out too.
async function fetchTracks(genreId) {

  const url = `https://api.deezer.com/chart/${genreId}/tracks?limit=100`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error: ${response.status} status from Deezer.`);
  }

  const body = await response.json();

  if (body.error) {
    // https://rapidapi.com/deezerdevs/api/Deezer/discussions/21000
    // Ran into this
    if (body.error.code === 4) {
      throw new Error('Deezer quota limit exceeded');
    }
    // General error
    throw new Error(`Deezer error: ${body.error.message}`);
  }

  // Filter out tracks that can't be played. I'm making the assumption that we can find at least 10 valid ones out of 100.
  const playable = body.data.filter((track) => track.readable !== false && track.preview);

  return playable.map((track) => ({
    id: track.id,
    title: track.title,
    titleShort: track.title_short,
    artist: track.artist.name,
    album: track.album.title,
    cover: track.album.cover_big,
    link: track.link,
    preview: track.preview,
  }));
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Stack Overflow in 2026!
function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// The best quick solution. Song variants and re-releases aren't covered.
function removeDuplicates(tracks) {
  const seen = new Set();
  return tracks.filter((track) => {
    const key = `${track.titleShort.toLowerCase()}|${track.artist.toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Attuned express server is up and running!' });
});

// Static list of acceptable genres
app.get('/api/genres', (req, res) => {
  res.json(GENRES);
});

// Fetch (playable) tracks.
app.get('/api/genres/:id/tracks', async (req, res) => {
  const genreId = Number(req.params.id);

  // Check if id is a number, and if it belongs to a genre
  if (!Number.isInteger(genreId)) {
    return res.status(400).json({ error: 'Id must be a number' });
  }

  const genre = GENRES.find((g) => g.id === genreId);
  if (!genre) {
    return res.status(404).json({ error: 'Id must belong to known genre' });
  }

  try {
    const tracks = await fetchTracks(genreId);
    res.json({ genre: genre.name, count: tracks.length, tracks });
  } catch (err) {
    console.error('Couldn\'t load tracks: ', err.message);
    res.status(400).json({ error: 'Could not load songs from Deezer' });
  }
});

app.post('/api/games', async (req, res) => {
  const genreId = req.body?.genreId;
  let tracks;

    // Check if id is a number
  if (!Number.isInteger(genreId)) {
    return res.status(400).json({ error: 'genreId must be a number' });
  }

  if (!GENRES.some((g) => g.id === genreId)) {
    return res.status(404).json({ error: 'genreId must belong to known genre' });
  }

  try {
    tracks = removeDuplicates(await fetchTracks(genreId));
  } catch (err) {
    console.error('Couldn\'t create game: ', err.message);
    return res.status(400).json({ error: 'Could not load songs from Deezer' });
  }

  // Need enough tracks to play the game
  if (tracks.length < TOTAL_ROUNDS) {
    return res.status(400).json({ error: 'Not enough playable songs for this genre selection' });
  }

  const game = {
    id: crypto.randomUUID(),
    genreId,
    tracks,
    songs: shuffle(tracks).slice(0, TOTAL_ROUNDS),
    currentRound: 1,
    score: 0,
  };

  games.set(game.id, game);

  res.status(201).json({ gameId: game.id, totalRounds: TOTAL_ROUNDS });
});

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
