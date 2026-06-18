import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('[OpenAI] OPENAI_API_KEY not found. AI features will be disabled.');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
});

// Embedding generation for RAG
export interface EmbeddingRequest {
  text: string;
  model?: 'text-embedding-3-small' | 'text-embedding-3-large';
}

export interface EmbeddingResult {
  embedding: number[];
  tokenCount: number;
}

export async function generateEmbedding(request: EmbeddingRequest): Promise<EmbeddingResult> {
  const { text, model = 'text-embedding-3-small' } = request;

  const response = await openai.embeddings.create({
    model,
    input: text,
  });

  return {
    embedding: response.data[0].embedding,
    tokenCount: response.usage.total_tokens,
  };
}

// Calculate cosine similarity between two embeddings
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Embeddings must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// RAG Chat completion
export interface RagChatRequest {
  userMessage: string;
  context: string;
  locale: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
}

export interface RagChatResult {
  response: string;
  tokensUsed: number;
}

export async function generateRagChatResponse(request: RagChatRequest): Promise<RagChatResult> {
  const { userMessage, context, locale, conversationHistory = [] } = request;

  const languageInstructions: Record<string, string> = {
    ja: '日本語で回答してください。丁寧な敬語を使用してください。',
    en: 'Please respond in English in a professional and friendly manner.',
    vi: 'Vui lòng trả lời bằng tiếng Việt một cách chuyên nghiệp và thân thiện.',
  };

  const systemPrompt = `あなたは「D'auchy.Studio」のAIアシスタントです。会社とその創設者「内田伸（Shin Uchida）」に関する質問に正確で親切に回答してください。

以下の情報を参考にして回答してください：

${context}

回答のガイドライン：
- 提供された情報に基づいて正確に回答してください
- 情報がない場合は、正直に「その情報はありません」と伝えてください
- ${languageInstructions[locale] || languageInstructions.ja}
- 簡潔で分かりやすい回答を心がけてください
- 会社の強みや特徴を積極的にアピールしてください

重要：実績（achievements）や成果について質問された場合：
- 内田伸（創設者）の個人的な実績・経歴・プロジェクト
- D'auchy.Studioの会社としての実績・製品（LingaLink、EduMate、OfficeBrain、Bayd-System等）
両方を統合して回答してください。内田伸はD'auchy.Studioの創設者であり、すべてのプロダクトの開発者です。`;

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.7,
    max_tokens: 1000,
  });

  return {
    response: response.choices[0]?.message?.content || '',
    tokensUsed: response.usage?.total_tokens || 0,
  };
}

export interface TranslationRequest {
  sourceText: string;
  sourceLanguage: string;
  targetLanguage: string;
  contentType: 'title' | 'excerpt' | 'content';
}

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
}

export async function translateWithGPT4(request: TranslationRequest): Promise<TranslationResult> {
  const { sourceText, sourceLanguage, targetLanguage, contentType } = request;

  const languageNames: Record<string, string> = {
    ja: 'Japanese',
    en: 'English',
    vi: 'Vietnamese',
  };

  const systemPrompt = `You are a professional translator. Your task is to translate text from ${languageNames[sourceLanguage]} to ${languageNames[targetLanguage]}. Return ONLY the translated text, nothing else.`;

  const userPrompt = contentType === 'title'
    ? `Translate this ${languageNames[sourceLanguage]} news headline to ${languageNames[targetLanguage]}. Keep it concise and impactful:\n\n${sourceText}`
    : contentType === 'excerpt'
    ? `Translate this ${languageNames[sourceLanguage]} excerpt to ${languageNames[targetLanguage]}. Maintain the tone and style:\n\n${sourceText}`
    : `Translate this ${languageNames[sourceLanguage]} article to ${languageNames[targetLanguage]}. Maintain tone, style, and formatting:\n\n${sourceText}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: contentType === 'title' ? 100 : contentType === 'excerpt' ? 300 : 2000,
  });

  const translatedText = response.choices[0]?.message?.content || sourceText;

  return {
    translatedText,
    detectedLanguage: sourceLanguage,
  };
}

export interface ImageGenerationRequest {
  prompt: string;
  style?: 'vivid' | 'natural';
  quality?: 'standard' | 'hd';
  size?: '1024x1024' | '1792x1024' | '1024x1792';
}

export interface ImageGenerationResult {
  imageUrl: string;
  revisedPrompt?: string;
}

export async function generateImageWithDallE(request: ImageGenerationRequest): Promise<ImageGenerationResult> {
  const { prompt, style = 'natural', quality = 'standard', size = '1792x1024' } = request;

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size,
    quality,
    style,
  });

  const imageData = response.data?.[0];
  if (!imageData?.url) {
    throw new Error('Failed to generate image: No URL returned from DALL-E');
  }

  return {
    imageUrl: imageData.url,
    revisedPrompt: imageData.revised_prompt,
  };
}

export interface SummaryRequest {
  content: string;
  language: string;
  maxLength?: number;
}

export interface SummaryResult {
  summary: string;
}

export async function generateSummaryWithGPT4(request: SummaryRequest): Promise<SummaryResult> {
  const { content, language, maxLength = 200 } = request;

  const languageNames: Record<string, string> = {
    ja: 'Japanese',
    en: 'English',
    vi: 'Vietnamese',
  };

  const systemPrompt = `You are a professional content summarizer. Create a concise summary of the following article in ${languageNames[language]}. The summary should be around ${maxLength} characters and capture the key points of the article.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: content },
    ],
    temperature: 0.3,
    max_tokens: 300,
  });

  const summary = response.choices[0]?.message?.content || '';

  return {
    summary,
  };
}

// Profile translation for multilingual support
export interface ProfileTranslationRequest {
  sourceProfile: {
    name: string;
    nameReading?: string;
    title?: string;
    about?: string;
    vision?: string;
    projects?: string;
    background?: string;
    company?: string;
    chatbot?: string;
    contact?: string;
  };
  sourceLanguage: string;
  targetLanguage: string;
}

export interface ProfileTranslationResult {
  translatedProfile: {
    name: string;
    nameReading: string;
    title: string;
    about: string;
    vision: string;
    projects: string;
    background: string;
    company: string;
    chatbot: string;
    contact: string;
  };
}

export async function translateProfileWithGPT4(request: ProfileTranslationRequest): Promise<ProfileTranslationResult> {
  const { sourceProfile, sourceLanguage, targetLanguage } = request;

  const languageNames: Record<string, string> = {
    ja: 'Japanese',
    en: 'English',
    vi: 'Vietnamese',
  };

  const systemPrompt = `You are a professional translator specializing in business profiles and company information. 
Translate the following profile fields from ${languageNames[sourceLanguage]} to ${languageNames[targetLanguage]}.
Return ONLY a valid JSON object with the translated fields. Do not include any explanations or markdown formatting.

Special instructions:
- For names: Keep proper nouns (company names, product names like LingaLink, EduMate, OfficeBrain, Bayd-System, D'auchy.Studio) in their original form
- For nameReading: If translating to English or Vietnamese, this can be romanized or left empty
- Maintain professional tone appropriate for company/personal branding
- Keep formatting (newlines, bullet points) intact in longer text fields`;

  const userPrompt = `Translate this profile to ${languageNames[targetLanguage]}:

${JSON.stringify(sourceProfile, null, 2)}

Return as JSON with these exact keys: name, nameReading, title, about, vision, projects, background, company, chatbot, contact`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const content = response.choices[0]?.message?.content || '{}';
  
  // Parse the JSON response
  let translatedProfile;
  try {
    // Remove markdown code blocks if present
    const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
    translatedProfile = JSON.parse(cleanedContent);
  } catch (e) {
    console.error('[OpenAI] Failed to parse profile translation:', e);
    throw new Error('Failed to parse translated profile');
  }

  return {
    translatedProfile: {
      name: translatedProfile.name || sourceProfile.name,
      nameReading: translatedProfile.nameReading || '',
      title: translatedProfile.title || '',
      about: translatedProfile.about || '',
      vision: translatedProfile.vision || '',
      projects: translatedProfile.projects || '',
      background: translatedProfile.background || '',
      company: translatedProfile.company || '',
      chatbot: translatedProfile.chatbot || '',
      contact: translatedProfile.contact || '',
    },
  };
}
