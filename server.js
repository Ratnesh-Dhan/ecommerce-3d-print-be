import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./src/routes/Routes.js";
import uploadRoutes from "./src/routes/upload.js";
import quoteRoutes from "./src/routes/quote.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./src/routes/adminRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

dotenv.config();
console.log("Upload routes loaded");

const app = express();
// app.use(cors({ origin: process.env.ORIGINS.split(",") }));
// app.use(cors({
//   origin: process.env.ORIGINS
//     ? process.env.ORIGINS.split(",")
//     : "*"
// }));

const allowedOrigins = process.env.ORIGINS
  ? process.env.ORIGINS.split(",")
  : [];
console.log("Allowed Origins:", process.env.ORIGINS);
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/", router);
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api", quoteRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// hello i am sai
