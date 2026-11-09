import { db } from "./client";
import { users } from "./schema";

export const createUser = async (user) => {
  return await db.insert(users).values(user);
};

export const getUserByEmail = async (email) => {
  return await db.select().from(users).where(eq(users.email, email));
};

export const getUserById = async (id) => {
  return await db.select().from(users).where(eq(users.id, id));
};

export const updateUser = async (id, user) => {
  return await db.update(users).set(user).where(eq(users.id, id));
};

export const deleteUser = async (id) => {
  return await db.delete(users).where(eq(users.id, id));
};
