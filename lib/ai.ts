import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GOOGLE_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
  : null;

const gemini = genAI?.getGenerativeModel({
  model: 'gemini-2.0-flash-lite',
});

export default gemini;
