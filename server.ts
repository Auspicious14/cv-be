import express from "express";
import { engine } from "express-handlebars";
import { format } from "date-fns";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { appRoute } from "./index";

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
const URI: string = process.env.MONGODB_URL || "";

const exphbs = engine({
  helpers: {
    dateFormat: (date: string, formatStr: string) =>
      format(new Date(date), formatStr),
  },
});

// Database connection and server start
const startServer = async () => {
  try {
    await mongoose.connect(URI);
    app.use(appRoute);
    app.listen(port, () => console.log(`Server listening on ${port}`));
  } catch (err) {
    console.error("Failed to start:", err);
    process.exit(1);
  }
};

startServer();

export default app;
