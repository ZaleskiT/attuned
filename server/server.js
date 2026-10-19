import express from 'express';

const app = express();
const PORT = 3000;

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Attuned express server is up and running!' });
});

app.get('/api/genres', (req, res) => {
  res.json(GENRES);
});

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
