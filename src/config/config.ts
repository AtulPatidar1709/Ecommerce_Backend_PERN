import { config as conf } from 'dotenv';

conf();

const _config = {
  // -- Dev Environment -- //
  environment: process.env.NODE_ENV,

  // -- Ports -- //
  port: process.env.PORT,
  buildDomain: process.env.BUILD_DOMAIN,
  frontendDomain: process.env.FRONT_END_DOMAIN,

  // --- Database Keys --- //
  databaseUrl: process.env.DATABASE_URL,
  cloudinaryCloud: process.env.CLOUDINARY_CLOUD,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
  productsPerPage: process.env.PRODUCT_PER_PAGE,

  // --- Razorpay API Keys --- //
  rzpTestApiKey: process.env.RZP_TEST_API_KEY,
  rzpTestKeySecret: process.env.RZP_TEST_KEY_SECRET,
  rzpTestWebhookSecret: process.env.RZP_TEST_KEY_WEBHOOK_SECRET,

  // --- Mail Keys --- //
  mailSecretKey: process.env.MAIL_PASSKEY,
  mailAddressKey: process.env.MAIL_ADDRESS,

  // --- OpenAI Keys --- //
  openaiApiKey: process.env.OPENAI_API_KEY,

  // --- Auth / Security --- //
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  cookieSecret: process.env.COOKIE_SECRET,
  jwtRefreshSecret: process.env.JWTREFRESHSECRET,
  jwtSecret: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config);
