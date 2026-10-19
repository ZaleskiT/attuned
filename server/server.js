import express from 'express';

const app = express();
const PORT = 3000;

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Attuned express server is up and running!' });
});

app.listen(PORT, () => {
  console.log(`Listening: http://localhost:${PORT}`);
});
