import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './db/initialize';
import vehiclesRouter from './routes/vehicles';
import operationsRouter from './routes/operations';
import telemetryRouter from './routes/telemetry';
import aiRouter from './routes/ai';
import authRouter from './routes/auth';
import notificationsRouter from './routes/notifications';
import auditRouter from './routes/audit';
import maintenanceRouter from './routes/maintenance';
import customersRouter from './routes/customers';
import analyticsRouter from './routes/analytics';
import geofenceRouter from './routes/geofence';
import driversRouter from './routes/drivers';
import partsRouter from './routes/parts';
import { authenticateToken } from './middleware/auth';
import { auditLog } from './middleware/auditLog';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

// Public routes
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Protected routes
app.use('/api/vehicles', authenticateToken, auditLog, vehiclesRouter);
app.use('/api/operations', authenticateToken, auditLog, operationsRouter);
app.use('/api/telemetry', authenticateToken, auditLog, telemetryRouter);
app.use('/api/ai', authenticateToken, aiRouter);
app.use('/api/notifications', authenticateToken, notificationsRouter);
app.use('/api/audit', authenticateToken, auditRouter);
app.use('/api/maintenance', authenticateToken, auditLog, maintenanceRouter);
app.use('/api/customers', authenticateToken, auditLog, customersRouter);
app.use('/api/analytics', authenticateToken, analyticsRouter);
app.use('/api/geofence', authenticateToken, auditLog, geofenceRouter);
app.use('/api/drivers', authenticateToken, auditLog, driversRouter);
app.use('/api/parts', authenticateToken, auditLog, partsRouter);

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

initializeDatabase();

app.listen(PORT, () => {
  console.log(`Fleet-OPS API server running on http://localhost:${PORT}`);
});

export default app;
