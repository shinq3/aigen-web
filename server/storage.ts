import { 
  users, 
  adminUsers,
  news, 
  newsUpdates,
  newsTranslations,
  rssSources,
  rssImportQueue,
  aiGenerationJobs,
  contacts,
  uploads,
  ragDocuments,
  chatHistory,
  creatorProfiles,
  type User, 
  type UpsertUser,
  type AdminUser,
  type InsertAdminUser,
  type News, 
  type InsertNews,
  type NewsUpdate,
  type InsertNewsUpdate,
  type NewsTranslation,
  type InsertNewsTranslation,
  type RssSource,
  type InsertRssSource,
  type RssImportQueue,
  type InsertRssImportQueue,
  type AiGenerationJob,
  type InsertAiGenerationJob,
  type Contact,
  type InsertContact,
  type Upload,
  type InsertUpload,
  type RagDocument,
  type InsertRagDocument,
  type ChatHistory,
  type InsertChatHistory,
  type CreatorProfile,
  type InsertCreatorProfile
} from "@shared/schema";
import { eq, desc, like, or, and, lte, isNull } from "drizzle-orm";
import { db } from "./db";

export interface IStorage {
  // User operations - required for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Admin User operations - for custom authentication
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(adminUser: InsertAdminUser): Promise<AdminUser>;
  updateAdminUser(id: string, adminUser: Partial<InsertAdminUser>): Promise<AdminUser | undefined>;
  updateAdminUserLoginTime(id: string): Promise<void>;
  getAllAdminUsers(): Promise<AdminUser[]>;
  countAdminsByRole(role: string): Promise<number>;
  deleteAdminUser(id: string): Promise<void>;
  setAdminPassword(id: string, passwordHash: string): Promise<void>;
  
  // News operations
  getNews(id: string): Promise<News | undefined>;
  getAllNews(): Promise<News[]>;
  getPublishedNews(): Promise<News[]>;
  createNews(news: InsertNews & { authorId: string }): Promise<News>;
  updateNews(id: string, news: Partial<InsertNews>): Promise<News | undefined>;
  deleteNews(id: string): Promise<void>;
  
  // News updates operations
  getNewsUpdates(newsId: string): Promise<NewsUpdate[]>;
  createNewsUpdate(update: InsertNewsUpdate & { authorId: string }): Promise<NewsUpdate>;
  updateNewsUpdate(id: string, update: Partial<InsertNewsUpdate>): Promise<NewsUpdate | undefined>;
  deleteNewsUpdate(id: string): Promise<void>;
  
  // News translations operations
  getNewsTranslations(newsId: string): Promise<NewsTranslation[]>;
  getNewsTranslation(newsId: string, locale: string): Promise<NewsTranslation | undefined>;
  createNewsTranslation(translation: InsertNewsTranslation): Promise<NewsTranslation>;
  upsertNewsTranslation(translation: InsertNewsTranslation): Promise<NewsTranslation>;
  updateNewsTranslation(id: string, translation: Partial<InsertNewsTranslation>): Promise<NewsTranslation | undefined>;
  deleteNewsTranslation(id: string): Promise<void>;
  deleteNewsTranslations(newsId: string): Promise<void>;
  
  // RSS sources operations
  getRssSource(id: string): Promise<RssSource | undefined>;
  getAllRssSources(): Promise<RssSource[]>;
  getActiveRssSources(): Promise<RssSource[]>;
  createRssSource(source: InsertRssSource): Promise<RssSource>;
  updateRssSource(id: string, source: Partial<InsertRssSource>): Promise<RssSource | undefined>;
  deleteRssSource(id: string): Promise<void>;
  
  // RSS import queue operations
  getRssImportQueueItem(id: string): Promise<RssImportQueue | undefined>;
  getRssImportQueueItemBySourceUrl(sourceUrl: string): Promise<RssImportQueue | undefined>;
  getRssImportQueue(status?: string): Promise<RssImportQueue[]>;
  createRssImportQueueItem(item: InsertRssImportQueue): Promise<RssImportQueue>;
  updateRssImportQueueItem(id: string, item: Partial<InsertRssImportQueue>): Promise<RssImportQueue | undefined>;
  deleteRssImportQueueItem(id: string): Promise<void>;
  
  // AI generation jobs operations
  getAiGenerationJob(id: string): Promise<AiGenerationJob | undefined>;
  getAiGenerationJobsByNewsId(newsId: string): Promise<AiGenerationJob[]>;
  createAiGenerationJob(job: InsertAiGenerationJob): Promise<AiGenerationJob>;
  updateAiGenerationJob(id: string, job: Partial<InsertAiGenerationJob>): Promise<AiGenerationJob | undefined>;
  deleteAiGenerationJob(id: string): Promise<void>;
  
  // Contact operations
  getContact(id: string): Promise<Contact | undefined>;
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContactStatus(id: string, status: string): Promise<Contact | undefined>;
  
  // Upload operations
  getUpload(id: string): Promise<Upload | undefined>;
  createUpload(upload: InsertUpload & { uploadedBy?: string }): Promise<Upload>;
  deleteUpload(id: string): Promise<void>;
  
  // RAG Document operations
  getRagDocument(id: string): Promise<RagDocument | undefined>;
  getRagDocumentsByLocale(locale: string): Promise<RagDocument[]>;
  getAllRagDocuments(): Promise<RagDocument[]>;
  createRagDocument(doc: InsertRagDocument): Promise<RagDocument>;
  updateRagDocument(id: string, doc: Partial<InsertRagDocument>): Promise<RagDocument | undefined>;
  deleteRagDocument(id: string): Promise<void>;
  deleteAllRagDocuments(): Promise<void>;
  
  // Chat History operations
  getChatHistory(sessionId: string): Promise<ChatHistory[]>;
  createChatHistory(history: InsertChatHistory): Promise<ChatHistory>;
  
  // Creator Profile operations
  getCreatorProfile(locale: string): Promise<CreatorProfile | undefined>;
  getAllCreatorProfiles(): Promise<CreatorProfile[]>;
  upsertCreatorProfile(profile: InsertCreatorProfile): Promise<CreatorProfile>;
  deleteCreatorProfile(locale: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations - required for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    // First try to find existing user by email
    const existing = await db.select().from(users).where(eq(users.email, userData.email!)).limit(1);
    if (existing.length > 0) {
      const [user] = await db
        .update(users)
        .set({ ...userData, updatedAt: new Date() })
        .where(eq(users.email, userData.email!))
        .returning();
      return user;
    }
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Admin User operations - for custom authentication
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [adminUser] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return adminUser;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [adminUser] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return adminUser;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [adminUser] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return adminUser;
  }

  async createAdminUser(adminUserData: InsertAdminUser): Promise<AdminUser> {
    const [adminUser] = await db.insert(adminUsers).values(adminUserData).returning();
    return adminUser;
  }

  async updateAdminUser(id: string, adminUserData: Partial<InsertAdminUser>): Promise<AdminUser | undefined> {
    const [adminUser] = await db
      .update(adminUsers)
      .set({ ...adminUserData, updatedAt: new Date() })
      .where(eq(adminUsers.id, id))
      .returning();
    return adminUser;
  }

  async updateAdminUserLoginTime(id: string): Promise<void> {
    await db
      .update(adminUsers)
      .set({ lastLoginAt: new Date() })
      .where(eq(adminUsers.id, id));
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return db.select().from(adminUsers).orderBy(desc(adminUsers.createdAt));
  }

  async countAdminsByRole(role: string): Promise<number> {
    const result = await db.select().from(adminUsers).where(eq(adminUsers.role, role));
    return result.length;
  }

  async deleteAdminUser(id: string): Promise<void> {
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
  }

  async setAdminPassword(id: string, passwordHash: string): Promise<void> {
    await db.update(adminUsers)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(adminUsers.id, id));
  }

  // News operations
  async getNews(id: string): Promise<News | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }

  async getAllNews(): Promise<News[]> {
    return db.select().from(news).orderBy(desc(news.createdAt));
  }

  async getPublishedNews(): Promise<News[]> {
    const now = new Date();
    return db.select()
      .from(news)
      .where(and(
        eq(news.status, 'published'),
        or(
          isNull(news.publishedAt),
          lte(news.publishedAt, now)
        )
      ))
      .orderBy(desc(news.publishedAt));
  }

  async createNews(newsData: InsertNews & { authorId: string }): Promise<News> {
    const [newsItem] = await db.insert(news).values(newsData).returning();
    return newsItem;
  }

  async updateNews(id: string, newsData: Partial<InsertNews>): Promise<News | undefined> {
    const [newsItem] = await db
      .update(news)
      .set({ ...newsData, updatedAt: new Date() })
      .where(eq(news.id, id))
      .returning();
    return newsItem;
  }

  async deleteNews(id: string): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  // News updates operations
  async getNewsUpdates(newsId: string): Promise<NewsUpdate[]> {
    return db.select()
      .from(newsUpdates)
      .where(eq(newsUpdates.newsId, newsId))
      .orderBy(desc(newsUpdates.createdAt));
  }

  async createNewsUpdate(updateData: InsertNewsUpdate & { authorId: string }): Promise<NewsUpdate> {
    const [update] = await db.insert(newsUpdates).values(updateData).returning();
    return update;
  }

  async updateNewsUpdate(id: string, updateData: Partial<InsertNewsUpdate>): Promise<NewsUpdate | undefined> {
    const [update] = await db
      .update(newsUpdates)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(newsUpdates.id, id))
      .returning();
    return update;
  }

  async deleteNewsUpdate(id: string): Promise<void> {
    await db.delete(newsUpdates).where(eq(newsUpdates.id, id));
  }

  // News translations operations
  async getNewsTranslations(newsId: string): Promise<NewsTranslation[]> {
    return db.select()
      .from(newsTranslations)
      .where(eq(newsTranslations.newsId, newsId));
  }

  async getNewsTranslation(newsId: string, locale: string): Promise<NewsTranslation | undefined> {
    const [translation] = await db.select()
      .from(newsTranslations)
      .where(and(
        eq(newsTranslations.newsId, newsId),
        eq(newsTranslations.locale, locale)
      ))
      .limit(1);
    return translation;
  }

  async createNewsTranslation(translationData: InsertNewsTranslation): Promise<NewsTranslation> {
    const [translation] = await db.insert(newsTranslations).values(translationData).returning();
    return translation;
  }

  async upsertNewsTranslation(translationData: InsertNewsTranslation): Promise<NewsTranslation> {
    const existing = await this.getNewsTranslation(translationData.newsId, translationData.locale);
    if (existing) {
      const { newsId, locale, ...updateData } = translationData;
      const updated = await this.updateNewsTranslation(existing.id, updateData);
      return updated as NewsTranslation;
    }
    return this.createNewsTranslation(translationData);
  }

  async updateNewsTranslation(id: string, translationData: Partial<InsertNewsTranslation>): Promise<NewsTranslation | undefined> {
    const [translation] = await db
      .update(newsTranslations)
      .set({ ...translationData, updatedAt: new Date() })
      .where(eq(newsTranslations.id, id))
      .returning();
    return translation;
  }

  async deleteNewsTranslation(id: string): Promise<void> {
    await db.delete(newsTranslations).where(eq(newsTranslations.id, id));
  }

  async deleteNewsTranslations(newsId: string): Promise<void> {
    await db.delete(newsTranslations).where(eq(newsTranslations.newsId, newsId));
  }

  // RSS sources operations
  async getRssSource(id: string): Promise<RssSource | undefined> {
    const [source] = await db.select().from(rssSources).where(eq(rssSources.id, id));
    return source;
  }

  async getAllRssSources(): Promise<RssSource[]> {
    return db.select().from(rssSources).orderBy(desc(rssSources.createdAt));
  }

  async getActiveRssSources(): Promise<RssSource[]> {
    return db.select().from(rssSources)
      .where(eq(rssSources.isActive, true))
      .orderBy(desc(rssSources.createdAt));
  }

  async createRssSource(sourceData: InsertRssSource): Promise<RssSource> {
    const [source] = await db.insert(rssSources).values(sourceData).returning();
    return source;
  }

  async updateRssSource(id: string, sourceData: Partial<InsertRssSource>): Promise<RssSource | undefined> {
    const [source] = await db
      .update(rssSources)
      .set({ ...sourceData, updatedAt: new Date() })
      .where(eq(rssSources.id, id))
      .returning();
    return source;
  }

  async deleteRssSource(id: string): Promise<void> {
    await db.delete(rssSources).where(eq(rssSources.id, id));
  }

  // RSS import queue operations
  async getRssImportQueueItem(id: string): Promise<RssImportQueue | undefined> {
    const [item] = await db.select().from(rssImportQueue).where(eq(rssImportQueue.id, id));
    return item;
  }

  async getRssImportQueueItemBySourceUrl(sourceUrl: string): Promise<RssImportQueue | undefined> {
    const items = await db.select().from(rssImportQueue);
    return items.find(item => {
      const payload = item.rawPayload as any;
      return payload?.link === sourceUrl;
    });
  }

  async getRssImportQueue(status?: string): Promise<RssImportQueue[]> {
    if (status) {
      return db.select().from(rssImportQueue)
        .where(eq(rssImportQueue.processingState, status))
        .orderBy(desc(rssImportQueue.createdAt));
    }
    return db.select().from(rssImportQueue).orderBy(desc(rssImportQueue.createdAt));
  }

  async createRssImportQueueItem(itemData: InsertRssImportQueue): Promise<RssImportQueue> {
    const [item] = await db.insert(rssImportQueue).values(itemData).returning();
    return item;
  }

  async updateRssImportQueueItem(id: string, itemData: Partial<InsertRssImportQueue>): Promise<RssImportQueue | undefined> {
    const [item] = await db
      .update(rssImportQueue)
      .set({ ...itemData, updatedAt: new Date() })
      .where(eq(rssImportQueue.id, id))
      .returning();
    return item;
  }

  async deleteRssImportQueueItem(id: string): Promise<void> {
    await db.delete(rssImportQueue).where(eq(rssImportQueue.id, id));
  }

  // AI generation jobs operations
  async getAiGenerationJob(id: string): Promise<AiGenerationJob | undefined> {
    const [job] = await db.select().from(aiGenerationJobs).where(eq(aiGenerationJobs.id, id));
    return job;
  }

  async getAiGenerationJobsByNewsId(newsId: string): Promise<AiGenerationJob[]> {
    return db.select().from(aiGenerationJobs)
      .where(eq(aiGenerationJobs.newsId, newsId))
      .orderBy(desc(aiGenerationJobs.createdAt));
  }

  async createAiGenerationJob(jobData: InsertAiGenerationJob): Promise<AiGenerationJob> {
    const [job] = await db.insert(aiGenerationJobs).values(jobData).returning();
    return job;
  }

  async updateAiGenerationJob(id: string, jobData: Partial<InsertAiGenerationJob>): Promise<AiGenerationJob | undefined> {
    const [job] = await db
      .update(aiGenerationJobs)
      .set(jobData)
      .where(eq(aiGenerationJobs.id, id))
      .returning();
    return job;
  }

  async deleteAiGenerationJob(id: string): Promise<void> {
    await db.delete(aiGenerationJobs).where(eq(aiGenerationJobs.id, id));
  }

  // Contact operations
  async getContact(id: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createContact(contactData: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(contactData).returning();
    return contact;
  }

  async updateContactStatus(id: string, status: string): Promise<Contact | undefined> {
    const [contact] = await db
      .update(contacts)
      .set({ status, updatedAt: new Date() })
      .where(eq(contacts.id, id))
      .returning();
    return contact;
  }

  // Upload operations
  async getUpload(id: string): Promise<Upload | undefined> {
    const [upload] = await db.select().from(uploads).where(eq(uploads.id, id));
    return upload;
  }

  async createUpload(uploadData: InsertUpload & { uploadedBy?: string }): Promise<Upload> {
    const [upload] = await db.insert(uploads).values(uploadData).returning();
    return upload;
  }

  async deleteUpload(id: string): Promise<void> {
    await db.delete(uploads).where(eq(uploads.id, id));
  }
  
  // RAG Document operations
  async getRagDocument(id: string): Promise<RagDocument | undefined> {
    const [doc] = await db.select().from(ragDocuments).where(eq(ragDocuments.id, id));
    return doc;
  }
  
  async getRagDocumentsByLocale(locale: string): Promise<RagDocument[]> {
    return db.select().from(ragDocuments).where(eq(ragDocuments.locale, locale));
  }
  
  async getAllRagDocuments(): Promise<RagDocument[]> {
    return db.select().from(ragDocuments);
  }
  
  async createRagDocument(docData: InsertRagDocument): Promise<RagDocument> {
    const [doc] = await db.insert(ragDocuments).values(docData).returning();
    return doc;
  }
  
  async updateRagDocument(id: string, docData: Partial<InsertRagDocument>): Promise<RagDocument | undefined> {
    const [doc] = await db
      .update(ragDocuments)
      .set({ ...docData, updatedAt: new Date() })
      .where(eq(ragDocuments.id, id))
      .returning();
    return doc;
  }
  
  async deleteRagDocument(id: string): Promise<void> {
    await db.delete(ragDocuments).where(eq(ragDocuments.id, id));
  }
  
  async deleteAllRagDocuments(): Promise<void> {
    await db.delete(ragDocuments);
  }
  
  // Chat History operations
  async getChatHistory(sessionId: string): Promise<ChatHistory[]> {
    return db
      .select()
      .from(chatHistory)
      .where(eq(chatHistory.sessionId, sessionId))
      .orderBy(chatHistory.createdAt);
  }
  
  async createChatHistory(historyData: InsertChatHistory): Promise<ChatHistory> {
    const [history] = await db.insert(chatHistory).values(historyData).returning();
    return history;
  }
  
  // Creator Profile operations
  async getCreatorProfile(locale: string): Promise<CreatorProfile | undefined> {
    const [profile] = await db.select().from(creatorProfiles).where(eq(creatorProfiles.locale, locale));
    return profile;
  }
  
  async getAllCreatorProfiles(): Promise<CreatorProfile[]> {
    return db.select().from(creatorProfiles).orderBy(creatorProfiles.locale);
  }
  
  async upsertCreatorProfile(profileData: InsertCreatorProfile): Promise<CreatorProfile> {
    const existing = await this.getCreatorProfile(profileData.locale || 'ja');
    if (existing) {
      const [profile] = await db
        .update(creatorProfiles)
        .set({ ...profileData, updatedAt: new Date() })
        .where(eq(creatorProfiles.locale, profileData.locale || 'ja'))
        .returning();
      return profile;
    } else {
      const [profile] = await db.insert(creatorProfiles).values(profileData).returning();
      return profile;
    }
  }
  
  async deleteCreatorProfile(locale: string): Promise<void> {
    await db.delete(creatorProfiles).where(eq(creatorProfiles.locale, locale));
  }
}

export const storage = new DatabaseStorage();
