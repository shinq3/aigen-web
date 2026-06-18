import * as fs from 'fs';
import * as path from 'path';
import { storage } from '../storage';
import { generateEmbedding, cosineSimilarity, generateRagChatResponse } from './openaiClient';
import type { RagDocument } from '@shared/schema';

interface ContentChunk {
  sourceType: string;
  sourceId?: string;
  title: string;
  content: string;
  locale: string;
  metadata?: Record<string, any>;
}

function flattenJSON(obj: any, prefix = ''): { key: string; value: string }[] {
  const results: { key: string; value: string }[] = [];
  
  for (const key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    
    if (typeof value === 'string') {
      results.push({ key: newKey, value });
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'string') {
          results.push({ key: `${newKey}[${index}]`, value: item });
        } else if (typeof item === 'object') {
          results.push(...flattenJSON(item, `${newKey}[${index}]`));
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      results.push(...flattenJSON(value, newKey));
    }
  }
  
  return results;
}

function extractContentFromTranslationFile(
  filePath: string,
  sourceType: string,
  sourceId: string,
  locale: string
): ContentChunk[] {
  const chunks: ContentChunk[] = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(content);
    const flattened = flattenJSON(json);
    
    let combinedContent = '';
    let title = json.meta?.title || json.hero?.title || sourceId;
    
    for (const { key, value } of flattened) {
      if (value && value.length > 10) {
        combinedContent += `${value}\n`;
      }
    }
    
    if (combinedContent.trim()) {
      chunks.push({
        sourceType,
        sourceId,
        title,
        content: combinedContent.trim(),
        locale,
        metadata: { filePath }
      });
    }
  } catch (error) {
    console.error(`[RAG] Failed to read translation file ${filePath}:`, error);
  }
  
  return chunks;
}

async function extractProfilesFromDB(): Promise<ContentChunk[]> {
  const chunks: ContentChunk[] = [];
  
  try {
    const profiles = await storage.getAllCreatorProfiles();
    
    for (const profile of profiles) {
      const contentParts: string[] = [];
      
      if (profile.name) contentParts.push(`名前: ${profile.name}`);
      if (profile.nameReading) contentParts.push(`読み: ${profile.nameReading}`);
      if (profile.title) contentParts.push(`肩書き: ${profile.title}`);
      if (profile.about) contentParts.push(`紹介: ${profile.about}`);
      if (profile.vision) contentParts.push(`ビジョン: ${profile.vision}`);
      if (profile.projects) contentParts.push(`プロジェクト: ${profile.projects}`);
      if (profile.background) contentParts.push(`経歴: ${profile.background}`);
      if (profile.company) contentParts.push(`会社: ${profile.company}`);
      if (profile.chatbot) contentParts.push(`チャットボット: ${profile.chatbot}`);
      if (profile.contact) contentParts.push(`連絡先: ${profile.contact}`);
      
      if (contentParts.length > 0) {
        chunks.push({
          sourceType: 'profile',
          sourceId: `creator-${profile.locale}`,
          title: profile.name || 'Creator Profile',
          content: contentParts.join('\n'),
          locale: profile.locale,
          metadata: { source: 'database' }
        });
      }
    }
    
    console.log(`[RAG] Extracted ${chunks.length} profile chunks from database`);
  } catch (error) {
    console.error('[RAG] Failed to extract profiles from database:', error);
  }
  
  return chunks;
}

export async function extractAllContent(): Promise<ContentChunk[]> {
  const chunks: ContentChunk[] = [];
  const localesDir = path.join(process.cwd(), 'client/src/i18n/locales');
  const locales = ['ja', 'en', 'vi'];
  
  for (const locale of locales) {
    const localeDir = path.join(localesDir, locale);
    
    if (!fs.existsSync(localeDir)) {
      console.log(`[RAG] Locale directory not found: ${localeDir}`);
      continue;
    }
    
    const pagesDir = path.join(localeDir, 'pages');
    if (fs.existsSync(pagesDir)) {
      const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.json'));
      for (const file of pageFiles) {
        const sourceId = file.replace('.json', '');
        chunks.push(...extractContentFromTranslationFile(
          path.join(pagesDir, file),
          'page',
          sourceId,
          locale
        ));
      }
    }
    
    const productsDir = path.join(localeDir, 'products');
    if (fs.existsSync(productsDir)) {
      const productFiles = fs.readdirSync(productsDir).filter(f => f.endsWith('.json'));
      for (const file of productFiles) {
        const sourceId = file.replace('.json', '');
        chunks.push(...extractContentFromTranslationFile(
          path.join(productsDir, file),
          'product',
          sourceId,
          locale
        ));
      }
    }
    
    const commonFiles = ['common.json', 'footer.json', 'header.json'];
    for (const file of commonFiles) {
      const filePath = path.join(localeDir, file);
      if (fs.existsSync(filePath)) {
        chunks.push(...extractContentFromTranslationFile(
          filePath,
          'common',
          file.replace('.json', ''),
          locale
        ));
      }
    }
  }
  
  const dbProfiles = await extractProfilesFromDB();
  chunks.push(...dbProfiles);
  
  console.log(`[RAG] Extracted ${chunks.length} total content chunks`);
  return chunks;
}

export async function rebuildRagIndex(): Promise<{ success: boolean; documentCount: number; error?: string }> {
  try {
    console.log('[RAG] Starting RAG index rebuild...');
    
    await storage.deleteAllRagDocuments();
    console.log('[RAG] Cleared existing documents');
    
    const chunks = await extractAllContent();
    let successCount = 0;
    
    for (const chunk of chunks) {
      try {
        const embeddingResult = await generateEmbedding({ text: chunk.content });
        
        await storage.createRagDocument({
          sourceType: chunk.sourceType,
          sourceId: chunk.sourceId,
          title: chunk.title,
          content: chunk.content,
          locale: chunk.locale,
          embedding: embeddingResult.embedding,
          metadata: chunk.metadata
        });
        
        successCount++;
        console.log(`[RAG] Indexed: ${chunk.sourceType}/${chunk.sourceId} (${chunk.locale})`);
      } catch (error) {
        console.error(`[RAG] Failed to index ${chunk.sourceId}:`, error);
      }
    }
    
    console.log(`[RAG] Index rebuild complete. Indexed ${successCount}/${chunks.length} documents`);
    return { success: true, documentCount: successCount };
  } catch (error) {
    console.error('[RAG] Index rebuild failed:', error);
    return { success: false, documentCount: 0, error: String(error) };
  }
}

export async function searchRelevantDocuments(
  query: string,
  locale: string,
  topK: number = 5
): Promise<{ document: RagDocument; score: number }[]> {
  try {
    const queryEmbedding = await generateEmbedding({ text: query });
    
    const documents = await storage.getRagDocumentsByLocale(locale);
    
    if (documents.length === 0) {
      console.log(`[RAG] No documents found for locale: ${locale}`);
      return [];
    }
    
    const scored = documents
      .filter(doc => doc.embedding && Array.isArray(doc.embedding))
      .map(doc => ({
        document: doc,
        score: cosineSimilarity(queryEmbedding.embedding, doc.embedding as number[])
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
    
    console.log(`[RAG] Found ${scored.length} relevant documents for query: "${query.slice(0, 50)}..."`);
    return scored;
  } catch (error) {
    console.error('[RAG] Search failed:', error);
    return [];
  }
}

export async function generateChatResponse(
  userMessage: string,
  locale: string,
  sessionId: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ response: string; retrievedDocIds: string[] }> {
  try {
    const relevantDocs = await searchRelevantDocuments(userMessage, locale, 5);
    
    let context = '';
    const retrievedDocIds: string[] = [];
    
    for (const { document, score } of relevantDocs) {
      if (score > 0.3) {
        context += `\n---\n【${document.title}】\n${document.content}\n`;
        retrievedDocIds.push(document.id);
      }
    }
    
    if (!context) {
      context = '該当する情報が見つかりませんでした。一般的な質問にお答えします。';
    }
    
    const result = await generateRagChatResponse({
      userMessage,
      context,
      locale,
      conversationHistory
    });
    
    await storage.createChatHistory({
      sessionId,
      userMessage,
      assistantMessage: result.response,
      locale,
      retrievedDocIds
    });
    
    return {
      response: result.response,
      retrievedDocIds
    };
  } catch (error) {
    console.error('[RAG] Chat response generation failed:', error);
    throw error;
  }
}
