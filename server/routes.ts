import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPostSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Blog post routes
  app.get("/api/posts", async (_req, res) => {
    const posts = await storage.getAllPosts();
    res.json(posts);
  });

  app.post("/api/posts", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    const parsed = insertPostSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json(parsed.error);
    }

    const post = await storage.createPost(parsed.data);
    res.status(201).json(post);
  });

  app.delete("/api/posts/:id", async (req, res) => {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      return res.sendStatus(403);
    }

    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.sendStatus(400);
    }

    await storage.deletePost(id);
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}
