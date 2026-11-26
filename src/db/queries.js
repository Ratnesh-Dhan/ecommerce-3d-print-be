import { db } from "./client.js";
import { users } from "./schema.js";
import { eq, sql } from "drizzle-orm";

const createUser = async (user) => {
  return await db.insert(users).values(user).returning();
};

const getUserByEmail = async (email) => {
  return await db.select().from(users).where(eq(users.email, email));
};

const getUserById = async (id) => {
  return await db.select().from(users).where(eq(users.id, id));
};

const updateUser = async (id, user) => {
  return await db.update(users).set(user).where(eq(users.id, id));
};

const updateUserLastLogin = async (id) => {
  return await db
    .update(users)
    .set({ lastLogin: sql`(unixepoch())` })
    .where(eq(users.id, id));
};

const deleteUser = async (id) => {
  return await db.delete(users).where(eq(users.id, id));
};

export {
  createUser,
  getUserByEmail,
  getUserById,
  updateUser,
  updateUserLastLogin,
  deleteUser,
};
