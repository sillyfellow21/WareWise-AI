import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import { register } from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";
import { createProduct } from "./controllers/products.js";
import productRoutes from "./routes/products.js";

/*CONFIGURATION*/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 6001);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/warehouse";
const JWT_SECRET = process.env.JWT_SECRET || "development-secret";

process.env.JWT_SECRET = JWT_SECRET;

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

/*FILE STORAGE*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

/*ROUTES WITH FILES*/
app.post("/auth/register", upload.single("picture"), register);
app.post("/products", upload.single("picture"), verifyToken, createProduct);

/*ROUTES*/
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

/* MONGOOSE SETUP*/
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((error) => console.log(`${error} did not connect`));
