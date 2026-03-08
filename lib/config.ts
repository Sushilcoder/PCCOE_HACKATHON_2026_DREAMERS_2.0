// Configuration utility for environment variables with safe defaults
export const config = {
  api: {
    url: typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001')
      : 'http://localhost:3001',
  },
};
