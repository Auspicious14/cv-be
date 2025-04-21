import { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { engine } from 'express-handlebars';
import { format } from 'date-fns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { appRoute } from '../index';

dotenv.config();

const app = express();

// Setup handlebars engine
const exphbs = engine({
  helpers: {
    dateFormat: (date: string, formatStr: string) =>
      format(new Date(date), formatStr),
  },
});
app.engine('handlebars', exphbs);
app.set('view engine', 'handlebars');

// MongoDB connection (make sure this is only called once)
let isConnected = false;

async function connectToDB() {
  if (!isConnected) {
    await mongoose.connect(process.env.MONGODB_URL || '');
    isConnected = true;
    console.log('Connected to MongoDB');
  }
}

// Middleware and routes
app.use(express.json());
app.use(appRoute);

// Export handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectToDB();
  app(req as any, res as any);
}
