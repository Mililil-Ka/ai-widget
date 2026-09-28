import cors from 'cors';
import OpenAI from 'openai';

const allowedOrigins = [
  'http://localhost:5173',
  'https://ai-widget-omega.vercel.app',
  'https://my-portfolio-three-ochre-60.vercel.app',
];

const corsMiddleware = cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} не разрешён`));
  },
});

export default async function handler(req, res) {
  await new Promise((resolve, reject) =>
    corsMiddleware(req, res, (err) => (err ? reject(err) : resolve()))
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.proxyapi.ru/v1',
  });

  try {
    const { messages } = req.body;

    const stream = await openai.chat.completions.create({
      model: 'openai/gpt-5-mini',
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('OpenAI error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Ошибка сервера' })}\n\n`);
    res.end();
  }
}