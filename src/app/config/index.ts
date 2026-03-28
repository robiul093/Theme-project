import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database_url: process.env.DB_URL,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,

  nodemailer: {
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  stripe: {
    stripe_secret_key: process.env.STRIPE_SECRET_KEY,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  },
  frontend_url: process.env.FRONTEND_URL,
};
