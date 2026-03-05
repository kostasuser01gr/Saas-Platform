import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../db/initialize';
import { AuthRequest } from './auth';

export function auditLog(req: AuthRequest, res: Response, next: NextFunction): void {
  if (req.method === 'GET') {
    next();
    return;
  }

  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    try {
      const db = getDb();
      db.prepare(`
        INSERT INTO audit_log (id, tenant_id, user_id, user_name, action, entity_type, entity_id, new_value, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        uuidv4(),
        req.user?.tenant_id || 'default',
        req.user?.id || null,
        req.user?.name || 'Unknown',
        `${req.method} ${req.originalUrl}`,
        req.originalUrl.split('/')[2] || null,
        req.params.id || null,
        JSON.stringify(req.body).substring(0, 2000),
        req.ip,
        req.headers['user-agent'] || null
      );
    } catch (err) {
      console.error('Audit log error:', err);
    }
    return originalJson(body);
  };
  next();
}
