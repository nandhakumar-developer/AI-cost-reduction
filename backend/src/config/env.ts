import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL ?? 'file:./dev.db',
  jwtSecret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  allowDevAuth: process.env.ALLOW_DEV_AUTH === 'true',
  pythonPath: process.env.PYTHON_PATH ?? 'python',
  maxFilesPerUpload: parseInt(process.env.MAX_FILES_PER_UPLOAD ?? '10', 10),
  isProduction: process.env.NODE_ENV === 'production',
};
