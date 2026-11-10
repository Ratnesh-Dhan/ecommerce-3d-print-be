require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./src/routes/Routes");
const uploadRoutes = require("./src/routes/upload");
const quoteRoutes = require("./src/routes/quote");
const cookieParser = require("cookie-parser");
const adminRoutes = require("./src/routes/adminRoutes");
const authRoutes = require("./src/routes/authRoutes");
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
