import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat";
import userRoutes from "./routes/user";
import { initMongo } from "./services/mongoVectorService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "fallback-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 }, // 24 hours
}));

app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Connect to MongoDB Atlas, then start server
initMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ MongoDB connection failed:", err);
  process.exit(1);
});
