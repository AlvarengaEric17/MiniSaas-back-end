import { Request, Response, NextFunction } from "express";

export function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!adminEmail) {
    res.status(500).json({ error: "Admin email not configured" });
    return;
  }

  const companyEmail = req.body?.email || req.query?.email;
  
  if (companyEmail !== adminEmail) {
    res.status(403).json({ error: "Access denied. Admin only." });
    return;
  }

  next();
}
