import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { insertNewsSchema, insertNewsUpdateSchema, insertNewsTranslationSchema, insertRssSourceSchema, insertContactSchema, adminUsers, insertAdminUserSchema, updateAdminUserSchema, changePasswordSchema } from "@shared/schema";
import { AuthService, isAdminAuthenticated as isAdminAuth, requireSuperadmin, requirePermission, allowSelfOrSuperadmin, protectLastSuperadmin } from "./lib/auth";
import { createInsertSchema } from "drizzle-zod";

// Utility: sanitize HTML content to remove layout-breaking tags from RSS-imported content
function sanitizeHtmlContent(html: string): string {
  if (!html) return '';
  let result = html;

  // Step 1: Decode one level of HTML entities if content has escaped tags (from Quill editor)
  if (/&lt;\w/.test(result)) {
    result = result
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;amp;/g, '&amp;')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }

  // Step 2: Remove elements that fully inject external resources (include content)
  result = result
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');

  // Step 3: Remove void/self-closing tags that inject external resources or are out of place
  result = result
    .replace(/<link[^>]*\/?>/gi, '')
    .replace(/<meta[^>]*\/?>/gi, '');

  // Step 4: Strip document structure tags entirely (just the tags, keep content)
  result = result
    .replace(/<\/?(html|head|body)[^>]*>/gi, '');

  // Step 5: Strip block container tags but keep their text content
  // These appear in RSS-imported articles but have no place in rendered prose
  result = result
    .replace(/<\/?(div|section|article|header|footer|aside|nav)[^>]*>/gi, '');

  // Step 6: Fix double-wrapped paragraphs: <p><p>text</p></p> -> <p>text</p>
  result = result
    .replace(/<p>(\s*)<p>/gi, '<p>')
    .replace(/<\/p>(\s*)<\/p>/gi, '</p>');

  // Step 7: Remove paragraphs that only contain a lone < or > character (tag remnants)
  result = result
    .replace(/<p>\s*[<>]\s*<\/p>/gi, '');

  // Step 8: Remove leading empty paragraphs
  result = result.replace(/^(\s*<p[^>]*>\s*(<br\s*\/?>)?\s*<\/p>\s*)+/gi, '');

  // Step 9: Add referrerpolicy="no-referrer" to external <img> tags to bypass hotlink protection
  result = result.replace(/<img([^>]*?)>/gi, (match, attrs) => {
    if (!attrs.includes('referrerpolicy')) {
      return `<img${attrs} referrerpolicy="no-referrer">`;
    }
    return match;
  });

  return result;
}

// Admin auth schemas
const adminRegisterSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(8)
});

const adminLoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});

// Use shared admin authentication middleware from lib/auth.ts

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin Auth Routes - First superadmin bootstrap or existing superadmin-only  
  app.post('/api/admin/auth/register', async (req, res) => {
    try {
      // Check if this is first superadmin (bootstrap)
      const superadminCount = await storage.countAdminsByRole('superadmin');
      
      // If superadmins exist, require authentication
      if (superadminCount > 0) {
        return isAdminAuth(req, res, () => {
          return requireSuperadmin(req, res, async () => {
            return await registerAdminUser(req, res);
          });
        });
      }
      
      // Allow first superadmin creation without authentication
      return await registerAdminUser(req, res, true);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  });

  // Helper function for admin user registration
  async function registerAdminUser(req: any, res: any, isFirstSuperadmin = false) {
    try {
      const userData = adminRegisterSchema.parse(req.body);
      
      // Normalize and validate inputs
      const normalizedUsername = userData.username.trim().toLowerCase();
      const normalizedEmail = userData.email.trim().toLowerCase();
      
      if (!AuthService.isValidUsername(normalizedUsername)) {
        return res.status(400).json({ message: 'Invalid username format' });
      }
      
      if (!AuthService.isValidEmail(normalizedEmail)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      
      // Check if username or email already exists
      const existingUsername = await storage.getAdminUserByUsername(normalizedUsername);
      if (existingUsername) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      const existingEmail = await storage.getAdminUserByEmail(normalizedEmail);
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      
      // Validate password strength
      const passwordValidation = AuthService.isValidPassword(userData.password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ message: passwordValidation.message });
      }
      
      // Hash password and create user with server-enforced defaults
      const passwordHash = await AuthService.hashPassword(userData.password);
      
      const adminUser = await storage.createAdminUser({
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash,
        role: isFirstSuperadmin ? 'superadmin' : 'admin', // First user becomes superadmin
        permissions: isFirstSuperadmin ? ["view_admin_dashboard", "manage_news", "manage_contacts", "manage_users", "manage_admin_users", "manage_uploads", "view_analytics", "system_configuration", "user_impersonation", "delete_content", "manage_permissions"] : [],
        departmentAccess: isFirstSuperadmin ? ["news_management", "user_management", "contact_management", "content_management", "analytics_dashboard", "system_settings", "security_management"] : [],
        isActive: true
      });
      
      // Create corresponding user record for CMS authoring
      const cmsUser = await storage.upsertUser({
        id: adminUser.id, // Use same ID to link admin and CMS user
        email: normalizedEmail,
        firstName: normalizedUsername,
        lastName: 'Admin'
      });
      
      // Create session only if user logged in (not for bootstrap)
      if (!isFirstSuperadmin) {
        (req.session as any).adminUserId = adminUser.id;
        (req.session as any).authorUserId = cmsUser.id;
      }
      
      res.json({ 
        ...AuthService.sanitizeAdminUser(adminUser),
        message: isFirstSuperadmin ? 'First superadmin created successfully. Please log in.' : 'Admin user created successfully'
      });
    } catch (error) {
      console.error('Admin registration error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Registration failed' });
    }
  }

  app.post('/api/admin/auth/login', async (req, res) => {
    try {
      const { username, password } = adminLoginSchema.parse(req.body);
      
      // Normalize username to match registration
      const normalizedUsername = username.trim().toLowerCase();
      
      // Find user by username
      const adminUser = await storage.getAdminUserByUsername(normalizedUsername);
      if (!adminUser) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check if user is active
      if (!adminUser.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }
      
      // Verify password
      const passwordValid = await AuthService.verifyPassword(password, adminUser.passwordHash);
      if (!passwordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Update last login time
      await storage.updateAdminUserLoginTime(adminUser.id);
      
      // Create or update corresponding user record for CMS authoring
      const cmsUser = await storage.upsertUser({
        id: adminUser.id, // Use same ID to link admin and CMS user
        email: adminUser.email,
        firstName: adminUser.username,
        lastName: 'Admin'
      });
      
      // Create session with both admin and CMS user IDs
      (req.session as any).adminUserId = adminUser.id;
      (req.session as any).authorUserId = cmsUser.id;
      
      res.json(AuthService.sanitizeAdminUser(adminUser));
    } catch (error) {
      console.error('Admin login error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.post('/api/admin/auth/logout', isAdminAuth, async (req: any, res) => {
    try {
      req.session.destroy((err: any) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
      });
    } catch (error) {
      console.error('Admin logout error:', error);
      res.status(500).json({ message: 'Logout failed' });
    }
  });

  app.get('/api/admin/auth/me', isAdminAuth, async (req: any, res) => {
    try {
      res.json(AuthService.sanitizeAdminUser(req.currentAdmin));
    } catch (error) {
      console.error('Admin me error:', error);
      res.status(500).json({ message: 'Failed to fetch user info' });
    }
  });

  // Public API Routes

  // Get published news for frontend with translations
  app.get('/api/news', async (req, res) => {
    try {
      const locale = (req.query.locale as string) || 'ja';
      const allNews = await storage.getPublishedNews();
      
      // Fetch translations for each news item
      const newsWithTranslations = await Promise.all(
        allNews.map(async (newsItem) => {
          const translation = await storage.getNewsTranslation(newsItem.id, locale);
          
          // Filter out AI error messages from excerpt
          let summary = '';
          const excerpt = translation?.excerpt || newsItem.excerpt || '';
          if (excerpt && !excerpt.includes('Please provide')) {
            summary = excerpt;
          } else {
            // Fall back to AI summary if excerpt has error messages
            const aiSummary = translation?.aiSummary || '';
            summary = aiSummary && !aiSummary.includes('Please provide') ? aiSummary : '';
          }
          
          // Derive thumbnail: prefer featuredImage, then first image in content
          // Check both main content AND translation content (editor saves to translation.content)
          // Skip base64 data URIs – too large for list view
          let thumbnail = newsItem.featuredImage || '';
          if (!thumbnail || thumbnail.startsWith('data:')) {
            const combinedContent = (translation?.content || '') + (newsItem.content || '');
            // Match https:// URLs and /objects/... object storage paths, exclude base64
            const imgMatch = combinedContent.match(/<img[^>]+src="((?:https?:\/\/|\/objects\/)[^"]+)"/i);
            thumbnail = imgMatch ? imgMatch[1] : '';
          }

          // Strip base64 images from list content (kept for detail endpoint)
          const rawContent = sanitizeHtmlContent(translation?.content || newsItem.content || '');
          const listContent = rawContent.replace(/<img([^>]+)src="data:[^"]*"([^>]*)>/gi, '');

          return {
            id: newsItem.id,
            title: translation?.title || newsItem.title || '',
            summary,
            content: listContent,
            thumbnail,
            publishedAt: newsItem.publishedAt?.toISOString() || new Date().toISOString(),
            category: newsItem.category || 'technology',
            tags: newsItem.tags || [],
            source: newsItem.sourceAttribution || 'D\'auchy.Studio',
            sourceUrl: newsItem.sourceUrl || '',
            isExternal: newsItem.isExternal || false,
            status: newsItem.status
          };
        })
      );
      
      res.json(newsWithTranslations);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Get single news article with full content (including base64 images)
  app.get('/api/news/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const locale = (req.query.locale as string) || 'ja';
      const newsItem = await storage.getNews(id);
      if (!newsItem || newsItem.status !== 'published') {
        return res.status(404).json({ message: 'Article not found' });
      }
      const translation = await storage.getNewsTranslation(id, locale);

      let summary = '';
      const excerpt = translation?.excerpt || newsItem.excerpt || '';
      if (excerpt && !excerpt.includes('Please provide')) {
        summary = excerpt;
      } else {
        const aiSummary = translation?.aiSummary || '';
        summary = aiSummary && !aiSummary.includes('Please provide') ? aiSummary : '';
      }

      // For detail view, allow base64 thumbnails (single article fetch, not a list)
      let thumbnail = newsItem.featuredImage || '';
      if (!thumbnail) {
        const sourceContent = translation?.content || newsItem.content || '';
        // Prefer external URL; fall back to base64
        const extMatch = sourceContent.match(/<img[^>]+src="(https?:[^"]+)"/i);
        const b64Match = sourceContent.match(/<img[^>]+src="(data:image[^"]+)"/i);
        thumbnail = extMatch ? extMatch[1] : (b64Match ? b64Match[1] : '');
      }

      res.json({
        id: newsItem.id,
        title: translation?.title || newsItem.title || '',
        summary,
        content: sanitizeHtmlContent(translation?.content || newsItem.content || ''),
        thumbnail,
        publishedAt: newsItem.publishedAt?.toISOString() || new Date().toISOString(),
        category: newsItem.category || 'technology',
        tags: newsItem.tags || [],
        source: newsItem.sourceAttribution || 'D\'auchy.Studio',
        sourceUrl: newsItem.sourceUrl || '',
        isExternal: newsItem.isExternal || false,
        status: newsItem.status
      });
    } catch (error) {
      console.error("Error fetching news article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Submit contact form
  app.post('/api/contact', async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json(contact);
    } catch (error) {
      console.error("Error creating contact:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create contact" });
    }
  });

  // Protected CMS Routes (Admin only)

  // User Management API
  // List all admin users (superadmin only)
  app.get('/api/admin/users', isAdminAuth, requireSuperadmin, async (req, res) => {
    try {
      const users = await storage.getAllAdminUsers();
      const sanitizedUsers = users.map(user => AuthService.sanitizeAdminUser(user));
      res.json(sanitizedUsers);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  // Create new admin user (superadmin only)
  app.post('/api/admin/users', isAdminAuth, requireSuperadmin, async (req, res) => {
    try {
      const userData = insertAdminUserSchema.parse(req.body);
      
      // Normalize inputs
      const normalizedUsername = userData.username.trim().toLowerCase();
      const normalizedEmail = userData.email.trim().toLowerCase();
      
      // Check for existing users
      const existingUsername = await storage.getAdminUserByUsername(normalizedUsername);
      if (existingUsername) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      const existingEmail = await storage.getAdminUserByEmail(normalizedEmail);
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      
      // Validate password
      const passwordValidation = AuthService.isValidPassword(userData.password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ message: passwordValidation.message });
      }
      
      // Hash password and create user
      const passwordHash = await AuthService.hashPassword(userData.password);
      
      const adminUser = await storage.createAdminUser({
        username: normalizedUsername,
        email: normalizedEmail,
        passwordHash,
        role: userData.role || 'admin',
        permissions: userData.permissions || [],
        departmentAccess: userData.departmentAccess || [],
        isActive: userData.isActive !== false
      });
      
      // Create corresponding CMS user
      await storage.upsertUser({
        id: adminUser.id,
        email: normalizedEmail,
        firstName: normalizedUsername,
        lastName: 'Admin'
      });
      
      res.json(AuthService.sanitizeAdminUser(adminUser));
    } catch (error) {
      console.error('Error creating admin user:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  // Update admin user (superadmin only or self)
  app.put('/api/admin/users/:id', isAdminAuth, allowSelfOrSuperadmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = updateAdminUserSchema.parse(req.body);
      
      const targetUser = await storage.getAdminUser(id);
      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Only superadmin can change role and permissions
      const currentAdmin = (req as any).currentAdmin;
      if (currentAdmin.role !== 'superadmin') {
        delete updateData.role;
        delete updateData.permissions;
        delete updateData.departmentAccess;
        delete updateData.isActive;
      }
      
      // Prevent demoting last superadmin
      if (updateData.role && targetUser.role === 'superadmin' && updateData.role !== 'superadmin') {
        const superadminCount = await storage.countAdminsByRole('superadmin');
        if (superadminCount <= 1) {
          return res.status(403).json({ message: 'Cannot demote the last superadmin' });
        }
      }
      
      const updatedUser = await storage.updateAdminUser(id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(AuthService.sanitizeAdminUser(updatedUser));
    } catch (error) {
      console.error('Error updating admin user:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update user' });
    }
  });

  // Delete admin user (superadmin only, with protection)
  app.delete('/api/admin/users/:id', isAdminAuth, requireSuperadmin, protectLastSuperadmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      const currentAdmin = (req as any).currentAdmin;
      if (currentAdmin.id === id) {
        return res.status(403).json({ message: 'Cannot delete your own account' });
      }
      
      await storage.deleteAdminUser(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting admin user:', error);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  });

  // Change password (self or superadmin resetting others)
  app.patch('/api/admin/users/:id/password', isAdminAuth, allowSelfOrSuperadmin, async (req, res) => {
    try {
      const { id } = req.params;
      const passwordData = changePasswordSchema.parse(req.body);
      
      const currentAdmin = (req as any).currentAdmin;
      const targetUser = await storage.getAdminUser(id);
      
      if (!targetUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // If changing own password, verify current password
      if (currentAdmin.id === id && passwordData.currentPassword) {
        const isCurrentPasswordValid = await AuthService.verifyPassword(
          passwordData.currentPassword, 
          targetUser.passwordHash
        );
        if (!isCurrentPasswordValid) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }
      }
      
      // Validate new password
      const passwordValidation = AuthService.isValidPassword(passwordData.newPassword);
      if (!passwordValidation.valid) {
        return res.status(400).json({ message: passwordValidation.message });
      }
      
      // Hash and update password
      const newPasswordHash = await AuthService.hashPassword(passwordData.newPassword);
      await storage.setAdminPassword(id, newPasswordHash);
      
      // If changing own password, destroy current session to force re-login
      if (currentAdmin.id === id) {
        req.session.destroy(() => {});
      }
      
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to change password' });
    }
  });

  // News management
  app.get('/api/admin/news', isAdminAuth, async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  app.post('/api/admin/news', isAdminAuth, async (req: any, res) => {
    try {
      const { publishedAt, ...restData } = req.body;
      const newsData = insertNewsSchema.omit({ authorId: true, publishedAt: true }).parse(restData);
      const authorId = req.currentAdmin?.id;
      
      if (!authorId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      
      // Import helpers
      const { extractFirstImage, createInitialTranslations, generateSlug } = await import('./lib/newsHelpers.js');
      
      // Auto-generate slug if not provided
      if (!newsData.slug && newsData.title) {
        newsData.slug = generateSlug(newsData.title);
      }
      
      // Auto-extract featured image from content if not provided
      if (!newsData.featuredImage && newsData.content) {
        const firstImage = extractFirstImage(newsData.content);
        if (firstImage) {
          newsData.featuredImage = firstImage;
        }
      }
      
      const news = await storage.createNews({ 
        ...newsData, 
        authorId,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined
      });
      
      // Auto-create initial translation records for all languages
      const initialTranslations = createInitialTranslations({
        newsId: news.id,
        title: newsData.title || '',
        excerpt: newsData.excerpt || '',
        content: newsData.content || '',
        seoTitle: newsData.title || '',
        seoDescription: newsData.excerpt || '',
      });
      
      // Create translation records
      for (const translation of initialTranslations) {
        await storage.createNewsTranslation(translation);
      }
      
      console.log(`[News] Created news article with ${initialTranslations.length} translations`);
      
      res.json(news);
    } catch (error) {
      console.error("Error creating news:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create news" });
    }
  });

  app.put('/api/admin/news/:id', isAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      let body = req.body;
      
      // Import helpers
      const { extractFirstImage, createInitialTranslations } = await import('./lib/newsHelpers.js');

      // Process base64 images in content: resize → upload to object storage → replace src
      if (body.content && body.content.includes('data:image')) {
        const { processContentImages } = await import('./lib/imageUploader');
        const { processedContent, firstImagePath } = await processContentImages(body.content, id);
        body = { ...body, content: processedContent };
        // If featuredImage not explicitly set, use first processed image
        if (firstImagePath && body.featuredImage === undefined) {
          body = { ...body, featuredImage: firstImagePath };
        }
      }
      
      // Manually extract and transform fields
      const updateData: any = {};
      
      if (body.title !== undefined) updateData.title = body.title;
      if (body.slug !== undefined) updateData.slug = body.slug;
      if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
      if (body.content !== undefined) updateData.content = body.content;
      if (body.category !== undefined) updateData.category = body.category;
      if (body.tags !== undefined) updateData.tags = body.tags;
      if (body.isExternal !== undefined) updateData.isExternal = body.isExternal;
      if (body.externalUrl !== undefined) updateData.externalUrl = body.externalUrl;
      if (body.sourceUrl !== undefined) updateData.sourceUrl = body.sourceUrl;
      if (body.sourceAttribution !== undefined) updateData.sourceAttribution = body.sourceAttribution;
      if (body.originalPublishedAt !== undefined) updateData.originalPublishedAt = body.originalPublishedAt ? new Date(body.originalPublishedAt) : null;
      if (body.status !== undefined) updateData.status = body.status;
      if (body.publishedAt !== undefined) updateData.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
      
      // Auto-extract featured image from content if:
      // 1. Content is being updated
      // 2. featuredImage is not explicitly provided in the request
      if (body.featuredImage !== undefined) {
        updateData.featuredImage = body.featuredImage;
      } else if (body.content !== undefined) {
        const firstImage = extractFirstImage(body.content);
        // Only set non-base64 images; clear featuredImage if no image found in content
        if (firstImage && !firstImage.startsWith('data:')) {
          updateData.featuredImage = firstImage;
        } else if (!firstImage) {
          // Content has no images → clear the thumbnail
          updateData.featuredImage = null;
        }
      }
      
      const news = await storage.updateNews(id, updateData);
      if (!news) {
        return res.status(404).json({ message: "News not found" });
      }
      
      // Check if translations exist, if not create them
      const existingTranslations = await storage.getNewsTranslations(id);
      if (existingTranslations.length === 0) {
        console.log(`[News] No translations found for news ${id}, creating initial translations`);
        const initialTranslations = createInitialTranslations({
          newsId: id,
          title: updateData.title || news.title || '',
          excerpt: updateData.excerpt || news.excerpt || '',
          content: updateData.content || news.content || '',
          seoTitle: updateData.title || news.title || '',
          seoDescription: updateData.excerpt || news.excerpt || '',
        });
        
        for (const translation of initialTranslations) {
          await storage.createNewsTranslation(translation);
        }
        console.log(`[News] Created ${initialTranslations.length} initial translations`);
      } else {
        // Update the Japanese (base language) translation content to keep it in sync with the editor
        // Note: Only content is synced here. Title and excerpt in JA translation are managed
        // separately via the translation editor to prevent overwriting manual edits.
        const jaTranslation = existingTranslations.find(t => t.locale === 'ja');
        if (jaTranslation && updateData.content !== undefined) {
          await storage.updateNewsTranslation(jaTranslation.id, { content: updateData.content });
          console.log(`[News] Synced content to ja translation for news ${id}`);
        }
      }
      
      res.json(news);
    } catch (error) {
      console.error("Error updating news:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update news" });
    }
  });

  app.delete('/api/admin/news/:id', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNews(id);
      res.json({ message: "News deleted" });
    } catch (error) {
      console.error("Error deleting news:", error);
      res.status(500).json({ message: "Failed to delete news" });
    }
  });

  // Generate AI content for existing news
  app.post('/api/admin/news/:id/generate-content', isAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { generateImage } = req.body;
      
      const { generateContentForExistingNews } = await import('./lib/aiNewsGenerator.js');
      
      const result = await generateContentForExistingNews({
        newsId: id,
        generateImage: generateImage || false,
        targetLanguages: ['ja', 'en', 'vi'],
      });

      if (result.success) {
        res.json({ 
          message: "AI content generated successfully", 
          newsId: result.newsId,
          jobCount: result.jobIds.length 
        });
      } else {
        res.status(500).json({ message: result.error || "Failed to generate content" });
      }
    } catch (error) {
      console.error("Error generating AI content:", error);
      res.status(500).json({ message: "Failed to generate AI content" });
    }
  });

  // News updates management
  app.get('/api/admin/news/:newsId/updates', isAdminAuth, async (req, res) => {
    try {
      const { newsId } = req.params;
      const updates = await storage.getNewsUpdates(newsId);
      res.json(updates);
    } catch (error) {
      console.error("Error fetching news updates:", error);
      res.status(500).json({ message: "Failed to fetch news updates" });
    }
  });

  app.post('/api/admin/news/:newsId/updates', isAdminAuth, async (req: any, res) => {
    try {
      const { newsId } = req.params;
      const updateData = insertNewsUpdateSchema.parse({ ...req.body, newsId });
      const authorId = req.session.authorUserId;
      const update = await storage.createNewsUpdate({ ...updateData, authorId });
      res.json(update);
    } catch (error) {
      console.error("Error creating news update:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create news update" });
    }
  });

  app.put('/api/admin/news/updates/:id', isAdminAuth, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = insertNewsUpdateSchema.partial().parse(req.body);
      const update = await storage.updateNewsUpdate(id, updateData);
      if (!update) {
        return res.status(404).json({ message: "News update not found" });
      }
      res.json(update);
    } catch (error) {
      console.error("Error updating news update:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update news update" });
    }
  });

  app.delete('/api/admin/news/updates/:id', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNewsUpdate(id);
      res.json({ message: "News update deleted" });
    } catch (error) {
      console.error("Error deleting news update:", error);
      res.status(500).json({ message: "Failed to delete news update" });
    }
  });

  // News translations management
  app.get('/api/admin/news/:newsId/translations', isAdminAuth, async (req, res) => {
    try {
      const { newsId } = req.params;
      const translations = await storage.getNewsTranslations(newsId);
      res.json(translations);
    } catch (error) {
      console.error("Error fetching news translations:", error);
      res.status(500).json({ message: "Failed to fetch news translations" });
    }
  });

  app.get('/api/admin/news/:newsId/translations/:locale', isAdminAuth, async (req, res) => {
    try {
      const { newsId, locale } = req.params;
      const translation = await storage.getNewsTranslation(newsId, locale);
      if (!translation) {
        return res.status(404).json({ message: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      console.error("Error fetching news translation:", error);
      res.status(500).json({ message: "Failed to fetch news translation" });
    }
  });

  app.post('/api/admin/news/:newsId/translations', isAdminAuth, async (req, res) => {
    try {
      const { newsId } = req.params;
      let body = { ...req.body, newsId };

      // Process base64 images in content → upload to object storage
      if (body.content && body.content.includes('data:image')) {
        const { processContentImages } = await import('./lib/imageUploader');
        const { processedContent, firstImagePath } = await processContentImages(body.content, newsId);
        body.content = processedContent;
        // Set featuredImage on the news item if not already set
        if (firstImagePath) {
          const existing = await storage.getNews(newsId);
          if (existing && !existing.featuredImage) {
            await storage.updateNews(newsId, { featuredImage: firstImagePath });
          }
        }
      }

      const translationData = insertNewsTranslationSchema.parse(body);
      const translation = await storage.createNewsTranslation(translationData);
      res.json(translation);
    } catch (error) {
      console.error("Error creating news translation:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create news translation" });
    }
  });

  app.put('/api/admin/news/translations/:id', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      let body = req.body;

      // Process base64 images in content → upload to object storage
      if (body.content && body.content.includes('data:image')) {
        const newsId = body.newsId as string | undefined;
        if (newsId) {
          const { processContentImages } = await import('./lib/imageUploader');
          const { processedContent, firstImagePath } = await processContentImages(body.content, newsId);
          body = { ...body, content: processedContent };
          // Set featuredImage on the news item if not already set
          if (firstImagePath) {
            const existing = await storage.getNews(newsId);
            if (existing && !existing.featuredImage) {
              await storage.updateNews(newsId, { featuredImage: firstImagePath });
            }
          }
        }
      }

      const translationData = insertNewsTranslationSchema.partial().parse(body);
      const translation = await storage.updateNewsTranslation(id, translationData);
      if (!translation) {
        return res.status(404).json({ message: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      console.error("Error updating news translation:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update news translation" });
    }
  });

  app.delete('/api/admin/news/translations/:id', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNewsTranslation(id);
      res.json({ message: "Translation deleted" });
    } catch (error) {
      console.error("Error deleting news translation:", error);
      res.status(500).json({ message: "Failed to delete news translation" });
    }
  });

  // RSS sources management
  app.get('/api/admin/rss/sources', isAdminAuth, async (req, res) => {
    try {
      const sources = await storage.getAllRssSources();
      res.json(sources);
    } catch (error) {
      console.error("Error fetching RSS sources:", error);
      res.status(500).json({ message: "Failed to fetch RSS sources" });
    }
  });

  app.post('/api/admin/rss/poll-now', isAdminAuth, async (req, res) => {
    try {
      const { pollAllActiveRssFeeds } = await import('./lib/rssPoller');
      await pollAllActiveRssFeeds();
      res.json({ message: "RSS polling triggered successfully" });
    } catch (error) {
      console.error("Error triggering RSS poll:", error);
      res.status(500).json({ message: "Failed to trigger RSS polling" });
    }
  });

  app.post('/api/admin/rss/sources', isAdminAuth, async (req, res) => {
    try {
      const sourceData = insertRssSourceSchema.parse(req.body);
      const source = await storage.createRssSource(sourceData);
      res.json(source);
    } catch (error) {
      console.error("Error creating RSS source:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create RSS source" });
    }
  });

  app.put('/api/admin/rss/sources/:id', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const sourceData = insertRssSourceSchema.partial().parse(req.body);
      const source = await storage.updateRssSource(id, sourceData);
      if (!source) {
        return res.status(404).json({ message: "RSS source not found" });
      }
      res.json(source);
    } catch (error) {
      console.error("Error updating RSS source:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update RSS source" });
    }
  });

  app.delete('/api/admin/rss/sources/:id', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteRssSource(id);
      res.json({ message: "RSS source deleted" });
    } catch (error) {
      console.error("Error deleting RSS source:", error);
      res.status(500).json({ message: "Failed to delete RSS source" });
    }
  });

  // RSS import queue management
  app.get('/api/admin/rss/queue', isAdminAuth, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const queueItems = await storage.getRssImportQueue(status);
      res.json(queueItems);
    } catch (error) {
      console.error("Error fetching RSS import queue:", error);
      res.status(500).json({ message: "Failed to fetch RSS import queue" });
    }
  });

  app.post('/api/admin/rss/queue/:id/approve', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const existingItem = await storage.getRssImportQueueItem(id);
      
      if (!existingItem) {
        return res.status(404).json({ message: "Queue item not found" });
      }
      
      if (existingItem.processingState !== 'pending') {
        return res.status(400).json({ message: "Only pending items can be approved" });
      }
      
      const item = await storage.updateRssImportQueueItem(id, {
        processingState: 'approved',
        processedByAdminId: req.currentAdmin?.id,
        updatedAt: new Date(),
      });
      res.json(item);
    } catch (error) {
      console.error("Error approving queue item:", error);
      res.status(500).json({ message: "Failed to approve queue item" });
    }
  });

  app.post('/api/admin/rss/queue/:id/reject', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const existingItem = await storage.getRssImportQueueItem(id);
      
      if (!existingItem) {
        return res.status(404).json({ message: "Queue item not found" });
      }
      
      if (existingItem.processingState !== 'pending') {
        return res.status(400).json({ message: "Only pending items can be rejected" });
      }
      
      const item = await storage.updateRssImportQueueItem(id, {
        processingState: 'rejected',
        processedByAdminId: req.currentAdmin?.id,
        updatedAt: new Date(),
      });
      res.json(item);
    } catch (error) {
      console.error("Error rejecting queue item:", error);
      res.status(500).json({ message: "Failed to reject queue item" });
    }
  });

  // AI Generation Routes
  app.post('/api/admin/ai/generate-from-queue/:id', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { generateImage = false, targetLanguages = ['ja', 'en', 'vi'] } = req.body;
      const adminId = req.currentAdmin?.id;

      if (!adminId) {
        return res.status(401).json({ message: "Admin authentication required" });
      }

      const { generateNewsFromQueue } = await import('./lib/aiNewsGenerator.js');

      const result = await generateNewsFromQueue({
        queueItemId: id,
        adminId,
        generateImage,
        targetLanguages,
      });

      if (!result.success) {
        return res.status(400).json({ message: result.error || 'Failed to generate news' });
      }

      res.json(result);
    } catch (error: any) {
      console.error("Error generating news from queue:", error);
      res.status(500).json({ message: error.message || "Failed to generate news from queue" });
    }
  });

  app.get('/api/admin/ai/jobs/:newsId', isAdminAuth, async (req, res) => {
    try {
      const { newsId } = req.params;
      const jobs = await storage.getAiGenerationJobsByNewsId(newsId);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching AI jobs:", error);
      res.status(500).json({ message: "Failed to fetch AI jobs" });
    }
  });

  // Contact management
  app.get('/api/admin/contacts', isAdminAuth, async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.put('/api/admin/contacts/:id/status', isAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const contact = await storage.updateContactStatus(id, status);
      if (!contact) {
        return res.status(404).json({ message: "Contact not found" });
      }
      res.json(contact);
    } catch (error) {
      console.error("Error updating contact status:", error);
      res.status(500).json({ message: "Failed to update contact status" });
    }
  });

  // Object Storage routes - for serving uploaded images
  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const { ObjectStorageService, ObjectNotFoundError } = await import('./objectStorage');
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error: any) {
      if (error?.name === 'ObjectNotFoundError') {
        return res.sendStatus(404);
      }
      console.error("Error serving object:", error);
      return res.sendStatus(500);
    }
  });

  // =====================
  // RAG Chat API Routes
  // =====================
  
  // Public chat endpoint - for website visitors
  app.post('/api/chat', async (req, res) => {
    try {
      const { rebuildRagIndex, generateChatResponse } = await import('./lib/ragService');
      
      const { message, locale = 'ja', sessionId } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: 'Message is required' });
      }
      
      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ message: 'Session ID is required' });
      }
      
      // Get conversation history for this session
      const history = await storage.getChatHistory(sessionId);
      const conversationHistory = history.slice(-6).map(h => ([
        { role: 'user' as const, content: h.userMessage },
        { role: 'assistant' as const, content: h.assistantMessage }
      ])).flat();
      
      const result = await generateChatResponse(
        message,
        locale,
        sessionId,
        conversationHistory
      );
      
      res.json({
        response: result.response,
        retrievedDocIds: result.retrievedDocIds
      });
    } catch (error) {
      console.error("Error in chat:", error);
      res.status(500).json({ message: "Failed to generate response" });
    }
  });
  
  // Admin: Rebuild RAG index
  app.post('/api/admin/rag/rebuild', isAdminAuth, async (req, res) => {
    try {
      const { rebuildRagIndex } = await import('./lib/ragService');
      const result = await rebuildRagIndex();
      res.json(result);
    } catch (error) {
      console.error("Error rebuilding RAG index:", error);
      res.status(500).json({ message: "Failed to rebuild RAG index" });
    }
  });
  
  // Admin: Get RAG documents status
  app.get('/api/admin/rag/status', isAdminAuth, async (req, res) => {
    try {
      const documents = await storage.getAllRagDocuments();
      const byLocale = documents.reduce((acc, doc) => {
        acc[doc.locale] = (acc[doc.locale] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      res.json({
        totalDocuments: documents.length,
        byLocale,
        lastUpdated: documents.length > 0 
          ? Math.max(...documents.map(d => new Date(d.updatedAt || d.createdAt || 0).getTime()))
          : null
      });
    } catch (error) {
      console.error("Error fetching RAG status:", error);
      res.status(500).json({ message: "Failed to fetch RAG status" });
    }
  });

  // Admin: Get all creator profiles
  app.get('/api/admin/profiles', isAdminAuth, async (req, res) => {
    try {
      const profiles = await storage.getAllCreatorProfiles();
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ message: "Failed to fetch profiles" });
    }
  });
  
  // Admin: Get creator profile by locale
  app.get('/api/admin/profiles/:locale', isAdminAuth, async (req, res) => {
    try {
      const profile = await storage.getCreatorProfile(req.params.locale);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  
  // Admin: Create/update creator profile
  app.post('/api/admin/profiles', isAdminAuth, async (req, res) => {
    try {
      if (!req.body.name || !req.body.name.trim()) {
        return res.status(400).json({ message: "Name is required" });
      }
      
      const profile = await storage.upsertCreatorProfile(req.body);
      
      // Rebuild RAG index to include new profile data
      const { rebuildRagIndex } = await import('./lib/ragService');
      await rebuildRagIndex();
      
      res.json(profile);
    } catch (error) {
      console.error("Error saving profile:", error);
      res.status(500).json({ message: "Failed to save profile" });
    }
  });
  
  // Admin: Delete creator profile
  app.delete('/api/admin/profiles/:locale', isAdminAuth, async (req, res) => {
    try {
      await storage.deleteCreatorProfile(req.params.locale);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting profile:", error);
      res.status(500).json({ message: "Failed to delete profile" });
    }
  });
  
  // Admin: Translate profile from source language to target languages and save
  app.post('/api/admin/profiles/translate', isAdminAuth, async (req, res) => {
    try {
      const { sourceProfile, sourceLocale, targetLocales } = req.body;
      
      if (!sourceProfile || !sourceLocale || !targetLocales || !Array.isArray(targetLocales)) {
        return res.status(400).json({ message: "Invalid request: sourceProfile, sourceLocale, and targetLocales are required" });
      }
      
      const { translateProfileWithGPT4 } = await import('./lib/openaiClient');
      const { rebuildRagIndex } = await import('./lib/ragService');
      
      const results: { locale: string; success: boolean; error?: string }[] = [];
      
      // Save source profile first
      const sourceToSave = { ...sourceProfile, locale: sourceLocale };
      await storage.upsertCreatorProfile(sourceToSave);
      results.push({ locale: sourceLocale, success: true });
      
      // Translate and save to each target locale
      for (const targetLocale of targetLocales) {
        if (targetLocale === sourceLocale) continue;
        
        try {
          const translationResult = await translateProfileWithGPT4({
            sourceProfile,
            sourceLanguage: sourceLocale,
            targetLanguage: targetLocale,
          });
          
          const translatedToSave = {
            ...translationResult.translatedProfile,
            locale: targetLocale,
          };
          
          await storage.upsertCreatorProfile(translatedToSave);
          results.push({ locale: targetLocale, success: true });
        } catch (error: any) {
          console.error(`Failed to translate profile to ${targetLocale}:`, error);
          results.push({ locale: targetLocale, success: false, error: error.message });
        }
      }
      
      // Rebuild RAG index with all new profiles
      await rebuildRagIndex();
      
      res.json({ success: true, results });
    } catch (error: any) {
      console.error("Error translating profile:", error);
      res.status(500).json({ message: error.message || "Failed to translate profile" });
    }
  });

  // Sitemap.xml for Google Search Console
  app.get('/sitemap.xml', async (req, res) => {
    try {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const locales = ['ja', 'en', 'vi'];
      const staticPaths = [
        '/',
        '/products',
        '/products/lingalink',
        '/products/edumate',
        '/products/officebrain',
        '/products/enterprise-llm',
        '/about',
        '/contact',
        '/news',
        '/ai-proposal',
        '/ai-pair-coding',
        '/chat',
      ];

      const publishedNews = await storage.getPublishedNews();

      let urls = '';

      for (const path of staticPaths) {
        for (const locale of locales) {
          const loc = `${baseUrl}/${locale}${path === '/' ? '' : path}`;
          const alternates = locales.map(l =>
            `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}${path === '/' ? '' : path}" />`
          ).join('\n');
          urls += `  <url>\n    <loc>${loc}</loc>\n${alternates}\n    <changefreq>${path === '/news' ? 'daily' : 'weekly'}</changefreq>\n    <priority>${path === '/' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
        }
      }

      for (const news of publishedNews) {
        for (const locale of locales) {
          if (news.isExternal) continue;
          const loc = `${baseUrl}/${locale}/news/${news.id}`;
          const alternates = locales.map(l =>
            `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${l}/news/${news.id}" />`
          ).join('\n');
          urls += `  <url>\n    <loc>${loc}</loc>\n${alternates}\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
        }
      }

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.send(sitemap);
    } catch (error: any) {
      console.error("Error generating sitemap:", error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Sitemap XSL stylesheet for browser display
  app.get('/sitemap.xsl', (_req, res) => {
    const xsl = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>D'auchy.Studio - Sitemap</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 2rem; background: #0a0a0a; color: #e5e5e5; }
          h1 { color: #f97316; font-size: 1.5rem; margin-bottom: 0.5rem; }
          p.desc { color: #a3a3a3; margin-bottom: 2rem; font-size: 0.9rem; }
          table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
          th { text-align: left; padding: 0.75rem 1rem; background: #171717; color: #f97316; border-bottom: 2px solid #262626; }
          td { padding: 0.75rem 1rem; border-bottom: 1px solid #1a1a1a; }
          tr:hover td { background: #171717; }
          a { color: #fb923c; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .badge { display: inline-block; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
          .lang-ja { background: #7c2d12; color: #fdba74; }
          .lang-en { background: #1e3a5f; color: #93c5fd; }
          .lang-vi { background: #14532d; color: #86efac; }
        </style>
      </head>
      <body>
        <h1>D'auchy.Studio Sitemap</h1>
        <p class="desc">
          This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs with hreflang alternates for Google Search Console.
        </p>
        <table>
          <tr>
            <th>URL</th>
            <th>Lang</th>
            <th>Alternates</th>
            <th>Freq</th>
            <th>Priority</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <xsl:variable name="loc" select="sitemap:loc"/>
            <xsl:variable name="lang">
              <xsl:choose>
                <xsl:when test="contains($loc, '/ja')">ja</xsl:when>
                <xsl:when test="contains($loc, '/en')">en</xsl:when>
                <xsl:when test="contains($loc, '/vi')">vi</xsl:when>
                <xsl:otherwise>-</xsl:otherwise>
              </xsl:choose>
            </xsl:variable>
            <tr>
              <td><a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a></td>
              <td>
                <xsl:choose>
                  <xsl:when test="$lang='ja'"><span class="badge lang-ja">JA</span></xsl:when>
                  <xsl:when test="$lang='en'"><span class="badge lang-en">EN</span></xsl:when>
                  <xsl:when test="$lang='vi'"><span class="badge lang-vi">VI</span></xsl:when>
                </xsl:choose>
              </td>
              <td><xsl:value-of select="count(xhtml:link)"/></td>
              <td><xsl:value-of select="sitemap:changefreq"/></td>
              <td><xsl:value-of select="sitemap:priority"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>`;
    res.set('Content-Type', 'application/xslt+xml');
    res.send(xsl);
  });

  // robots.txt
  app.get('/robots.txt', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;
    res.set('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  const httpServer = createServer(app);
  return httpServer;
}
