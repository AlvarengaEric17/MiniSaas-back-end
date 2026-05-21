import { Request, Response, NextFunction } from "express";

export function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminEmail || !adminPassword) {
    res.status(500).json({ error: "Admin credentials not configured" });
    return;
  }

  const emailHeader = req.headers["x-admin-email"];
  const passwordHeader = req.headers["x-admin-password"];
  
  if (emailHeader !== adminEmail || passwordHeader !== adminPassword) {
    res.status(403).json({ error: "Access denied. Invalid credentials." });
    return;
  }

  next();
}
