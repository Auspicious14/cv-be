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

mongoose
  .connect(URI)
  .then(() =>
    app.listen(port, () => console.log(`server is istening on ${port}`))
  )
  .catch((err: any) => console.log(err));

app.use(appRoute);
