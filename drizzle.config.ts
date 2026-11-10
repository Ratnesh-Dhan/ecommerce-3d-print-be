const { defineConfig } = require("drizzle-kit");

export default defineConfig({
  schema: "./src/db/schema.js",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./src/db/database.db",
  },
});
