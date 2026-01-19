import Groq from 'groq-sdk';

let _groq: Groq | null = null;

function getGroq(): Groq {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Missing GROQ_API_KEY environment variable');
    }
    _groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return _groq;
}

export const openai = new Proxy({} as Groq, {
  get(_target, prop) {
    return getGroq()[prop as keyof Groq];
  },
});
