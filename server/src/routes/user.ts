import { Router, Request, Response } from "express";
import { userStore } from "../db/userStore";

const router = Router();

// Get user profile
router.get("/profile", (req: Request, res: Response) => {
  const session = req.session as any;
  if (!session.userId) return res.json({ user: null });

  const user = userStore.get(session.userId);
  return res.json({ user });
});

// Update user profile (name, preferences)
router.patch("/profile", (req: Request, res: Response) => {
  const session = req.session as any;
  if (!session.userId) return res.status(401).json({ error: "No session" });

  const { name, preferences } = req.body;
  const updated = userStore.upsert(session.userId, { name, preferences });
  return res.json({ user: updated });
});

export default router;
