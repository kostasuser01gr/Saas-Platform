import { Router, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { AuthRequest } from '../middleware/auth';

const router = Router();

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
  return new GoogleGenerativeAI(apiKey);
}

function getFleetContext(db: any, tenantId: string): string {
  const vehicles = db.prepare('SELECT id, license, make, model, status, mileage, predictive_score, fuel_level FROM vehicles LEFT JOIN (SELECT vehicle_id, fuel_level FROM telemetry ORDER BY recorded_at DESC LIMIT 1) t ON vehicles.id = t.vehicle_id WHERE tenant_id = ?').all(tenantId);
  const maintenanceDue = db.prepare("SELECT mt.*, v.license FROM maintenance_tasks mt JOIN vehicles v ON mt.vehicle_id = v.id WHERE mt.status IN ('scheduled','overdue') AND mt.tenant_id = ?").all(tenantId);
  const recentOps = db.prepare('SELECT o.*, v.license FROM operations o LEFT JOIN vehicles v ON o.vehicle_id = v.id WHERE o.tenant_id = ? ORDER BY o.created_at DESC LIMIT 10').all(tenantId);

  return `Fleet Overview:\n- Total vehicles: ${vehicles.length}\n- Vehicles: ${JSON.stringify(vehicles)}\n- Pending maintenance: ${JSON.stringify(maintenanceDue)}\n- Recent operations: ${JSON.stringify(recentOps)}`;
}

// Chat with AI
router.post('/chat', async (req: AuthRequest, res: Response) => {
  try {
    const { message, sessionId } = req.body;
    if (!message) { res.status(400).json({ error: 'Message is required' }); return; }

    const db = getDb();
    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Get or create session
    let session = sessionId;
    if (!session) {
      session = uuidv4();
      db.prepare('INSERT INTO chat_sessions (id, user_id, tenant_id, title) VALUES (?, ?, ?, ?)').run(
        session, req.user!.id, req.user!.tenant_id, message.substring(0, 50)
      );
    }

    // Save user message
    db.prepare('INSERT INTO chat_messages (id, session_id, role, content) VALUES (?, ?, ?, ?)').run(uuidv4(), session, 'user', message);

    // Build context
    const fleetContext = getFleetContext(db, req.user!.tenant_id);
    const history = db.prepare('SELECT role, content FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC LIMIT 20').all(session) as any[];

    const systemPrompt = `You are FleetOps Copilot, an AI assistant for fleet management. You have access to the following fleet data:\n\n${fleetContext}\n\nHelp the user with fleet management tasks, answer questions about vehicles, maintenance, and operations. Be concise and actionable.`;

    const chatHistory = history.map((m: any) => `${m.role}: ${m.content}`).join('\n');
    const fullPrompt = `${systemPrompt}\n\nConversation:\n${chatHistory}\n\nuser: ${message}\nassistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response.text();

    // Save assistant message
    db.prepare('INSERT INTO chat_messages (id, session_id, role, content) VALUES (?, ?, ?, ?)').run(uuidv4(), session, 'assistant', response);

    // Update session
    db.prepare("UPDATE chat_sessions SET updated_at = datetime('now') WHERE id = ?").run(session);

    res.json({ sessionId: session, message: response });
  } catch (err: any) {
    console.error('AI error:', err);
    res.status(500).json({ error: err.message || 'AI service unavailable' });
  }
});

// Natural language query
router.post('/query', async (req: AuthRequest, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) { res.status(400).json({ error: 'Question is required' }); return; }

    const db = getDb();
    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const fleetContext = getFleetContext(db, req.user!.tenant_id);
    const prompt = `Given this fleet data:\n${fleetContext}\n\nAnswer this question concisely: ${question}\n\nProvide specific data points and actionable recommendations.`;

    const result = await model.generateContent(prompt);
    res.json({ answer: result.response.text() });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI service unavailable' });
  }
});

// Get chat sessions
router.get('/sessions', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const sessions = db.prepare('SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC').all(req.user!.id);
  res.json(sessions);
});

// Get session messages
router.get('/sessions/:id/messages', (req: AuthRequest, res: Response) => {
  const db = getDb();
  const messages = db.prepare('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC').all(req.params.id);
  res.json(messages);
});

// Delete session
router.delete('/sessions/:id', (req: AuthRequest, res: Response) => {
  const db = getDb();
  db.prepare('DELETE FROM chat_sessions WHERE id = ? AND user_id = ?').run(req.params.id, req.user!.id);
  res.json({ message: 'Session deleted' });
});

// Anomaly detection
router.get('/anomalies', async (req: AuthRequest, res: Response) => {
  try {
    const db = getDb();
    const genAI = getGemini();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const fleetContext = getFleetContext(db, req.user!.tenant_id);
    const telemetryData = db.prepare(`
      SELECT t.*, v.license, v.make, v.model FROM telemetry t
      JOIN vehicles v ON t.vehicle_id = v.id AND v.tenant_id = ?
      ORDER BY t.recorded_at DESC LIMIT 50
    `).all(req.user!.tenant_id);

    const prompt = `Analyze this fleet telemetry data for anomalies, patterns, and potential issues:\n\n${JSON.stringify(telemetryData)}\n\nFleet context:\n${fleetContext}\n\nReturn a JSON array of anomalies with fields: vehicleId, vehicleLicense, type (fuel|battery|engine|tire|speed|maintenance), severity (low|medium|high|critical), description, recommendation.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const anomalies = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      res.json({ anomalies });
    } catch {
      res.json({ anomalies: [], rawAnalysis: text });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI service unavailable' });
  }
});

export default router;
