import express, { Express } from 'express';
import { errorHandler } from './middlewares/index.js';
import routes from './routes/index.js';
import { log } from './registry/index.js';

const app: Express = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  log.warn('Router', `404 Not Found: ${req.method} ${req.path}`);
  res.status(404).json({
    code: 404,
    message: 'Not found',
  });
});

export default app;
