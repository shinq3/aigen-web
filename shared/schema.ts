import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, json, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table - updated for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default('user'), // guest, user, premium, moderator
  permissions: json("permissions"), // specific permissions array for granular control
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Admin Users table - for custom authentication
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  passwordHash: varchar("password_hash").notNull(),
  role: varchar("role").notNull().default('admin'), // admin, superadmin, editor, viewer
  permissions: json("permissions"), // specific admin permissions array for granular control
  departmentAccess: json("department_access"), // which departments/modules they can access
  isActive: boolean("is_active").default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

// Permission and Role Management Schema
export const userRoleSchema = z.enum(['guest', 'user', 'premium', 'moderator']);
export const adminRoleSchema = z.enum(['admin', 'superadmin', 'editor', 'viewer']);

export const userPermissionSchema = z.array(z.enum([
  'view_public_content',
  'create_comments', 
  'upload_files',
  'access_premium_content',
  'moderate_comments',
  'manage_basic_content'
]));

export const adminPermissionSchema = z.array(z.enum([
  'view_admin_dashboard',
  'manage_news',
  'manage_contacts', 
  'manage_users',
  'manage_admin_users',
  'manage_uploads',
  'view_analytics',
  'system_configuration',
  'user_impersonation',
  'delete_content',
  'manage_permissions'
]));

export const departmentAccessSchema = z.array(z.enum([
  'news_management',
  'user_management', 
  'contact_management',
  'content_management',
  'analytics_dashboard',
  'system_settings',
  'security_management'
]));

// Enhanced insert schemas for users and admin users
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
  permissions: true,
  isActive: true
}).extend({
  role: userRoleSchema.optional(),
  permissions: userPermissionSchema.optional()
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).pick({
  username: true,
  email: true,
  role: true,
  permissions: true,
  departmentAccess: true,
  isActive: true
}).extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: adminRoleSchema.optional(),
  permissions: adminPermissionSchema.optional(),
  departmentAccess: departmentAccessSchema.optional()
});

export const updateAdminUserSchema = insertAdminUserSchema.partial().omit({
  password: true
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().optional(), // Required for self-change, optional for superadmin reset
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Types for permissions and roles
export type UserRole = z.infer<typeof userRoleSchema>;
export type AdminRole = z.infer<typeof adminRoleSchema>;
export type UserPermission = z.infer<typeof userPermissionSchema>;
export type AdminPermission = z.infer<typeof adminPermissionSchema>;
export type DepartmentAccess = z.infer<typeof departmentAccessSchema>;
export type InsertUserData = z.infer<typeof insertUserSchema>;
export type InsertAdminUserData = z.infer<typeof insertAdminUserSchema>;
export type UpdateAdminUserData = z.infer<typeof updateAdminUserSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

// CMS Tables - matching existing database schema
export const news = pgTable("news", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug"),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: text("category").notNull().default('company'), // product, company, technology
  tags: json("tags"),
  featuredImage: text("featured_image"),
  isExternal: boolean("is_external").default(false),
  externalUrl: text("external_url"),
  sourceUrl: text("source_url"), // Original article URL for RSS-sourced articles
  sourceAttribution: text("source_attribution"), // Source name (e.g., "Google Research Blog")
  originalPublishedAt: timestamp("original_published_at"), // Original publication date from RSS
  status: text("status").notNull().default('draft'), // draft, published, archived
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  authorId: varchar("author_id").notNull()
});

export const newsUpdates = pgTable("news_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  newsId: varchar("news_id").references(() => news.id, { onDelete: 'cascade' }).notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  inquiryType: text("inquiry_type"),
  message: text("message").notNull(),
  status: text("status").notNull().default('new'), // new, in-progress, resolved, closed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const uploads = pgTable("uploads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: varchar("size").notNull(),
  url: text("url").notNull(),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});

// Admin Sessions table for custom authentication
export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  adminUserId: varchar("admin_user_id").references(() => adminUsers.id, { onDelete: 'cascade' }).notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = typeof adminSessions.$inferInsert;

// News Article Translations table for multi-language support
export const newsTranslations = pgTable("news_translations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  newsId: varchar("news_id").references(() => news.id, { onDelete: 'cascade' }).notNull(),
  locale: varchar("locale").notNull(), // ja, en, vi
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  aiSummary: text("ai_summary"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => [
  index("idx_news_locale").on(table.newsId, table.locale)
]);

export type NewsTranslation = typeof newsTranslations.$inferSelect;
export type InsertNewsTranslation = typeof newsTranslations.$inferInsert;

// RSS Sources configuration table
export const rssSources = pgTable("rss_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  feedUrl: text("feed_url").notNull().unique(),
  language: varchar("language").notNull().default('ja'), // ja, en, vi
  category: text("category").notNull().default('technology'),
  pollingIntervalMinutes: varchar("polling_interval_minutes").notNull().default('60'),
  lastPolledAt: timestamp("last_polled_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export type RssSource = typeof rssSources.$inferSelect;
export type InsertRssSource = typeof rssSources.$inferInsert;

// RSS Import Queue table for automated news generation
export const rssImportQueue = pgTable("rss_import_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceId: varchar("source_id").references(() => rssSources.id, { onDelete: 'cascade' }).notNull(),
  rawPayload: json("raw_payload").notNull(),
  suggestedPublishAt: timestamp("suggested_publish_at"),
  processingState: varchar("processing_state").notNull().default('pending'), // pending, parsing, awaiting_review, approved, rejected
  newsId: varchar("news_id").references(() => news.id, { onDelete: 'set null' }),
  processedByAdminId: varchar("processed_by_admin_id").references(() => adminUsers.id),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export type RssImportQueue = typeof rssImportQueue.$inferSelect;
export type InsertRssImportQueue = typeof rssImportQueue.$inferInsert;

// AI Generation Jobs table for tracking AI operations
export const aiGenerationJobs = pgTable("ai_generation_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  newsId: varchar("news_id").references(() => news.id, { onDelete: 'cascade' }).notNull(),
  jobType: varchar("job_type").notNull(), // image_generation, content_summary, translation
  provider: varchar("provider").notNull(), // openai, anthropic, etc
  status: varchar("status").notNull().default('pending'), // pending, processing, completed, failed
  inputPayload: json("input_payload"),
  resultJson: json("result_json"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at")
});

export type AiGenerationJob = typeof aiGenerationJobs.$inferSelect;
export type InsertAiGenerationJob = typeof aiGenerationJobs.$inferInsert;

// Enhanced news status enum
export const newsStatusSchema = z.enum(['draft', 'awaiting_review', 'published', 'archived']);
export type NewsStatus = z.infer<typeof newsStatusSchema>;

// Locale enum
export const localeSchema = z.enum(['ja', 'en', 'vi']);
export type Locale = z.infer<typeof localeSchema>;

// Insert schemas
export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  category: true,
  tags: true,
  featuredImage: true,
  isExternal: true,
  externalUrl: true,
  sourceUrl: true,
  sourceAttribution: true,
  originalPublishedAt: true,
  status: true,
  publishedAt: true,
  authorId: true,
});

export const insertNewsTranslationSchema = createInsertSchema(newsTranslations).pick({
  newsId: true,
  locale: true,
  title: true,
  excerpt: true,
  content: true,
  seoTitle: true,
  seoDescription: true,
  aiSummary: true
}).extend({
  locale: localeSchema
});

export const insertRssSourceSchema = createInsertSchema(rssSources).pick({
  name: true,
  feedUrl: true,
  language: true,
  category: true,
  pollingIntervalMinutes: true,
  isActive: true
}).extend({
  language: localeSchema
});

export const insertRssImportQueueSchema = createInsertSchema(rssImportQueue).pick({
  sourceId: true,
  rawPayload: true,
  suggestedPublishAt: true,
  processingState: true
});

export const insertAiGenerationJobSchema = createInsertSchema(aiGenerationJobs).pick({
  newsId: true,
  jobType: true,
  provider: true,
  inputPayload: true
});

export const insertNewsUpdateSchema = createInsertSchema(newsUpdates).pick({
  content: true,
  newsId: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  company: true,
  inquiryType: true,
  message: true,
});

export const insertUploadSchema = createInsertSchema(uploads).pick({
  filename: true,
  originalName: true,
  mimeType: true,
  size: true,
  url: true
});

// RAG (Retrieval Augmented Generation) Documents for AI Chat
export const ragDocuments = pgTable("rag_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sourceType: varchar("source_type").notNull(), // 'page', 'product', 'news', 'about', 'faq'
  sourceId: varchar("source_id"), // Reference to original content if applicable
  title: text("title").notNull(),
  content: text("content").notNull(),
  locale: varchar("locale").notNull().default('ja'), // ja, en, vi
  embedding: json("embedding"), // OpenAI embedding vector (1536 dimensions for text-embedding-3-small)
  metadata: json("metadata"), // Additional context like page URL, category, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type RagDocument = typeof ragDocuments.$inferSelect;
export type InsertRagDocument = typeof ragDocuments.$inferInsert;

export const insertRagDocumentSchema = createInsertSchema(ragDocuments).pick({
  sourceType: true,
  sourceId: true,
  title: true,
  content: true,
  locale: true,
  embedding: true,
  metadata: true,
});

// Chat History for analytics and improvement
export const chatHistory = pgTable("chat_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  userMessage: text("user_message").notNull(),
  assistantMessage: text("assistant_message").notNull(),
  locale: varchar("locale").notNull().default('ja'),
  retrievedDocIds: json("retrieved_doc_ids"), // Array of document IDs used for response
  createdAt: timestamp("created_at").defaultNow(),
});

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = typeof chatHistory.$inferInsert;

export const insertChatHistorySchema = createInsertSchema(chatHistory).pick({
  sessionId: true,
  userMessage: true,
  assistantMessage: true,
  locale: true,
  retrievedDocIds: true,
});

// Creator Profile table - for RAG chatbot knowledge about the creator
export const creatorProfiles = pgTable("creator_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  locale: varchar("locale").notNull().default('ja'),
  name: varchar("name").notNull(),
  nameReading: varchar("name_reading"),
  title: varchar("title"),
  about: text("about"),
  vision: text("vision"),
  projects: text("projects"),
  background: text("background"),
  company: text("company"),
  chatbot: text("chatbot"),
  contact: text("contact"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type CreatorProfile = typeof creatorProfiles.$inferSelect;
export type InsertCreatorProfile = typeof creatorProfiles.$inferInsert;

export const insertCreatorProfileSchema = createInsertSchema(creatorProfiles).pick({
  locale: true,
  name: true,
  nameReading: true,
  title: true,
  about: true,
  vision: true,
  projects: true,
  background: true,
  company: true,
  chatbot: true,
  contact: true,
});

// Types
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type News = typeof news.$inferSelect;
export type InsertNewsUpdate = z.infer<typeof insertNewsUpdateSchema>;
export type NewsUpdate = typeof newsUpdates.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertUpload = z.infer<typeof insertUploadSchema>;
export type Upload = typeof uploads.$inferSelect;
