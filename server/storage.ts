import { User, InsertUser, Post, InsertPost } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllPosts(): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  deletePost(id: number): Promise<void>;
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  sessionStore: session.Store;
  private userId: number;
  private postId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.userId = 1;
    this.postId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user = {
      id,
      ...insertUser,
      isAdmin: false,
    };
    this.users.set(id, user);
    return user;
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postId++;
    const post: Post = {
      ...insertPost,
      id,
      createdAt: new Date(),
    };
    this.posts.set(id, post);
    return post;
  }

  async deletePost(id: number): Promise<void> {
    this.posts.delete(id);
  }
}

export const storage = new MemStorage();