import express from 'express';
import cors from 'cors';
import { validateImages } from '../core/validator.js';
import { saveJsonReport } from '../reporters/jsonReporter.js';
import chokidar from 'chokidar';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Watch for report file changes
const reportPath = path.join(__dirname, '../../validation-report.json');
const watcher = chokidar.watch(reportPath, {
  persistent: true,
  ignoreInitial: true
});

// WebSocket-like SSE setup for file change notifications
app.get('/api/watch-report', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendUpdate = () => {
    res.write('data: updated\n\n');
  };

  watcher.on('change', sendUpdate);

  req.on('close', () => {
    watcher.removeListener('change', sendUpdate);
  });
});

app.post('/api/validate', async (req, res) => {
  try {
    const { imagePath, emberAppPath } = req.body;
    
    if (!imagePath || !emberAppPath) {
      return res.status(400).json({ error: 'Both image path and Ember app path are required' });
    }

    const results = await validateImages(imagePath, emberAppPath);
    await saveJsonReport(results, reportPath);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});