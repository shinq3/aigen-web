# Overview

D'auchy.Studio is a Japanese AI product innovation company developing cutting-edge AI solutions across education, enterprise, and creative industries. The platform showcases four main products: LingaLink (AI-powered online learning), EduMate (collaborative study platform), OfficeBrain (enterprise RAG system), and Bayd-System (music studio management). The website serves as a company showcase with product galleries, news sections, and contact capabilities.

## News Article Fixes (2026-03-12)
- ✅ **HTML sanitization**: Aggressively strips div/section/nav/head/body tags from RSS-imported content
- ✅ **Dedicated detail endpoint**: `GET /api/news/:id?locale=X` returns full content including base64 images
- ✅ **List API performance**: `GET /api/news` strips base64 images → reduced from 5MB to 22KB per request
- ✅ **Base64 thumbnail**: Detail page shows embedded base64 image at the top when no external URL available
- ✅ **AI translate button in editor**: "AIで英語・ベトナム語に翻訳" button added directly in NewsTranslationsEditor
- ✅ **Language detection fix**: `generateContentForExistingNews` now uses JA translation content (not main news.content which may be 90% base64) for accurate Japanese detection
- ✅ **Translation notice**: Banner shown when EN/VI locale displays untranslated Japanese content
- ✅ **External image hotlink fix**: Added `referrerpolicy="no-referrer"` to all external img tags in sanitizer

## CMS Phase 2 Complete (2025-10-17)
- ✅ Multilingual news translation editor with ReactQuill WYSIWYG (ja/en/vi)
- ✅ RSS source management UI with CRUD operations and active/inactive toggle
- ✅ RSS feed polling system with automatic article import to queue (rss-parser)
- ✅ RSS import queue management UI with approve/reject workflow
- ✅ Enhanced error handling and status validation
- ✅ Structured logging for debugging
- ✅ End-to-end tested admin workflow

## AI Blog Generation (Phase 3 - 2025-10-17)
- ✅ OpenAI gpt-4o-mini integration for multilingual translation (ja/en/vi)
- ✅ DALL-E 3 featured image generation (optional)
- ✅ AI-powered content summarization
- ✅ Automated news creation from RSS import queue
- ✅ AI generation job tracking and status management
- ✅ Admin UI with "AI Generate" button in import queue manager
- ✅ E2E tested: Complete AI workflow from RSS queue → multilingual news
- ✅ **AI content generation for existing news articles** (2025-10-17)
  - Generate multilingual translations and summaries for any existing news
  - Convert external articles to internal blog posts with AI-generated content
  - Sparkles icon button in news manager for easy access
  - Preserves source attribution while making content internal
  - **Robust language detection**: Analyzes title + content (ignores excerpt to avoid contamination from previous AI generations)
  - **Translation failure protection**: Only saves translations when content translation succeeds, preserving existing translations on failure
  - **E2E tested**: English → Japanese/Vietnamese translations verified working correctly

## AIGen ONE Product Page (2026-05-24)
- ✅ New product page at `/products/aigen-one` (ja/en/vi routes)
- ✅ i18n content files: `locales/{ja,en,vi}/products/aigen-one.json`
- ✅ `aigen-one` namespace registered in `i18n/index.ts`
- ✅ Route added in `App.tsx` with locale redirect
- ✅ Footer product link added
- ✅ `Products.tsx` listing card with camelCase key `aigenone` from `pages/products.json`
- ✅ `Home.tsx` featured products carousel entry
- ✅ Fixed existing `enterprise-llm` / `bayd-system` key mismatch in `Products.tsx` (hyphen → camelCase)

## isExternal Flag Fix (2025-10-17)
- ✅ **Fixed API response**: Changed from `!!newsItem.sourceUrl` to `newsItem.isExternal || false`
- ✅ **Fixed admin UI**: Changed label from "Internal News" to "External Article" with clear description
- ✅ **Added news detail route**: `/news/:id` for internal article detail pages
- ✅ **E2E tested**: Internal articles navigate to detail page, external articles open source URL in new tab
- **Behavior**:
  - `is_external=false` → Navigates to internal detail page
  - `is_external=true` → Opens sourceUrl in new tab with external badge

### Critical Implementation Details (2025-10-17)
- **Translation Model**: `gpt-4o-mini` (GPT-5-nano does NOT translate - echoes input unchanged)
- **Configuration**: 
  - Model: `gpt-4o-mini`
  - Temperature: `0.3` (consistent translations)
  - max_tokens: 100 (title), 300 (excerpt/summary), 2000 (content)
- **Language Detection Logic**:
  - Analyzes ONLY title and content (ignores excerpt which may contain AI-generated text from previous runs)
  - Character ratio analysis: >5% Japanese chars → ja, >5% Vietnamese chars → vi, else → en
  - Critical: Must ignore excerpt to prevent misdetection when previous AI generation added localized summaries
- **Language Processing Order** (Fixed 2025-10-17):
  - Reorders target languages to process source language FIRST
  - Ensures firstLanguageSummary matches source language (not always Japanese)
  - Fixes SEO Description language mismatch (was showing Japanese for English articles)
- **Data Protection**:
  - Tracks translation success with flags (titleTranslationSuccess, excerptTranslationSuccess, contentTranslationSuccess)
  - Only saves translation when contentTranslationSuccess=true
  - Skips AI summary generation if content translation fails (prevents English summaries in localized records)
  - Preserves existing translations completely when translation fails

### Enhanced RSS Content Extraction (2025-10-17)
- **RSS Payload Fields**: contentSnippet, description, content, contentEncoded, creator, thumbnailUrl
- **Priority Order**: contentEncoded > content > description > contentSnippet
- **Featured Image**: Uses RSS thumbnailUrl when available, DALL-E 3 as optional enhancement
- **Source Metadata**: Captures sourceUrl, sourceAttribution, originalPublishedAt from RSS feeds

### Default Admin Credentials
- Username: `admin`
- Password: `admin123`
- Role: superadmin

### RSS Feed Automation
- Automatic polling every 5 minutes
- Deduplication by source URL
- Respects per-source polling intervals
- Structured error logging for failed feeds

## RAG Chat System (Phase 4 - 2025-12-08)
- ✅ Vector document schema with PostgreSQL storage for embeddings
- ✅ Content extraction pipeline from i18n translation files (ja/en/vi)
- ✅ OpenAI text-embedding-3-small for embedding generation
- ✅ Cosine similarity retrieval (top-5 documents)
- ✅ GPT-4o-mini for context-aware response generation
- ✅ Chat overlay component with framer-motion animations
- ✅ Locale-aware responses matching user's language
- ✅ E2E tested: Japanese questions about products return accurate AI responses

## Creator Profile Management (2026-01-06)
- ✅ Database schema `creator_profiles` with multilingual support (ja/en/vi)
- ✅ CRUD API endpoints for profile management
- ✅ Admin UI with ProfileManager component
- ✅ Manual refresh button to prevent data loss during editing
- ✅ RAG service integration - profiles loaded from database
- ✅ Auto RAG index rebuild when profiles are saved
- ✅ **AI Profile Translation** (2026-01-07)
  - Translate Japanese profile to English & Vietnamese with one click
  - Uses GPT-4o-mini for professional translation
  - Preserves product names (LingaLink, EduMate, etc.) in original form
  - API endpoint: POST /api/admin/profiles/translate
  - Button: "英語・ベトナム語に翻訳して保存" (only on ja tab)
- **Database Fields**: name, nameReading, title, about, vision, projects, background, company, chatbot, contact
- **RAG Content Extraction**: `extractProfilesFromDB()` in ragService.ts loads profiles and creates searchable chunks

### RAG Technical Details
- **Embedding Model**: text-embedding-3-small (1536 dimensions)
- **Response Model**: gpt-4o-mini
- **Index Size**: 45 documents (15 per language x 3 languages)
- **Content Sources**: client/src/i18n/locales/{ja,en,vi}/*.json
- **Retrieval**: Top-5 similar documents via cosine similarity
- **API Endpoint**: POST /api/chat (public), POST /api/admin/rag/rebuild (admin)

### Chat UI Component
- **Location**: client/src/components/ChatOverlay.tsx
- **Test IDs**: button-chat-open, button-chat-close, input-chat-message, button-chat-send
- **Features**: Floating button, expandable chat panel, message history, loading states

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The application uses a modern React-based frontend with TypeScript and Vite as the build tool. Key architectural decisions include:

- **Component Library**: Built on Radix UI components with shadcn/ui styling for consistent, accessible UI elements
- **Styling Framework**: Tailwind CSS with custom design tokens following an orange-themed color palette inspired by modern tech companies
- **Routing**: Client-side routing implemented with Wouter for lightweight navigation
- **State Management**: React Query (TanStack Query) for server state management with custom query client configuration
- **Animation**: Framer Motion for smooth page transitions and interactive elements
- **Theme System**: Custom dark/light theme provider with CSS custom properties

## Backend Architecture
The server follows a clean Express.js architecture with TypeScript:

- **Framework**: Express.js with middleware for JSON parsing, CORS, and request logging
- **Storage Layer**: DatabaseStorage implementation with PostgreSQL for production data persistence
- **Type Safety**: Shared TypeScript schemas between client and server for consistent data contracts
- **Development Setup**: Vite middleware integration for hot module replacement in development

## Database Design
- **ORM**: Drizzle ORM configured for PostgreSQL with type-safe query building
- **Schema Management**: Centralized schema definitions in shared directory with Zod validation
- **Migration Strategy**: Drizzle Kit for database migrations and schema synchronization
- **Cascade Deletion**: Foreign key constraints with ON DELETE CASCADE for automatic cleanup of dependent data

### CMS Database Tables (Phase 1 Complete - 2025-10-17)
- **admin_users**: Custom admin authentication with bcryptjs password hashing, roles (superadmin/admin/editor), and permissions
- **admin_sessions**: Session token management with expiration tracking
- **news_translations**: Multilingual content storage (ja/en/vi) with SEO fields and AI-generated summaries
- **rss_sources**: RSS feed configuration with polling intervals and language settings
- **rss_import_queue**: Automated article import queue with processing states
- **ai_generation_jobs**: AI content/image generation job tracking with provider metadata

## Design System
The application implements a comprehensive design system based on modern tech aesthetics:

- **Color Palette**: Orange primary theme (25 85% 60%) with neutral backgrounds and semantic color tokens
- **Typography**: Inter font family with Noto Sans JP for Japanese text support
- **Component Variants**: Consistent button, card, and form styling with hover states and elevation effects
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Content Management
Currently uses mock data with clear TODO comments for future CMS integration:

- **Product Data**: Structured product information with images, status, and metadata
- **News System**: External and internal news article support with thumbnails and source attribution
- **Internationalization**: Japanese language support with English fallbacks

# External Dependencies

## Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection for serverless environments
- **drizzle-orm**: Type-safe database ORM with PostgreSQL dialect
- **openai**: Official OpenAI SDK for GPT-5-nano translations and DALL-E 3 image generation

## UI Framework
- **@radix-ui/***: Comprehensive accessible component primitives for forms, navigation, and overlays
- **framer-motion**: Animation library for smooth transitions and interactive effects
- **lucide-react**: Icon library providing consistent iconography

## Development Tools
- **vite**: Fast build tool with hot module replacement
- **typescript**: Type safety across frontend and backend
- **tailwindcss**: Utility-first CSS framework
- **@tanstack/react-query**: Server state management and caching

## Authentication & Sessions
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- Infrastructure prepared for user authentication with session management

## Validation & Forms
- **zod**: Runtime type validation and schema definition
- **@hookform/resolvers**: React Hook Form integration with Zod validation
- **react-hook-form**: Form state management with validation support

The architecture emphasizes type safety, developer experience, and scalability while maintaining clean separation of concerns between presentation, business logic, and data persistence layers.