import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Base URL for Attack on Titan external REST API
const AOT_API_BASE_URL = 'https://api.attackontitanapi.com';

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Fetch list of Titans
app.get('/api/titans', async (req, res) => {
  try {
    // Query external Titans endpoint
    const response = await fetch(`${AOT_API_BASE_URL}/titans`);
    if (!response.ok) {
      throw new Error(`Titans API responded with status: ${response.status}`);
    }
    const data = await response.json();
    
    // Normalize response: depending on API version, results are in data.results or directly in data
    const titans = Array.isArray(data) ? data : data.results || [];
    res.json({ results: titans });
  } catch (error) {
    console.error('Error fetching Titans:', error.message);
    res.status(500).json({ error: 'Failed to retrieve Titans data' });
  }
});

// Fetch paginated characters with optional search query
app.get('/api/characters', async (req, res) => {
  const page = req.query.page || 1;
  const search = req.query.search || '';

  try {
    // Build request URL with pagination support
    let url = `${AOT_API_BASE_URL}/characters?page=${page}`;
    if (search) {
      url += `&name=${encodeURIComponent(search)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Characters API responded with status: ${response.status}`);
    }
    const data = await response.json();

    res.json({
      info: data.info || {},
      results: data.results || []
    });
  } catch (error) {
    console.error('Error fetching characters:', error.message);
    res.status(500).json({ error: 'Failed to retrieve characters data' });
  }
});

// Start listening
app.listen(PORT, '0.0.0.0', () => {
  console.log(`AoT backend service running on http://0.0.0.0:${PORT}`);
});