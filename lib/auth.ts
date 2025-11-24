import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { getDataSource } from "./db";
import { User } from "@/entities/User";

const SESSION_COOKIE_NAME = "auth-session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(userId: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<number | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session) return null;
  return parseInt(session.value, 10);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = await getSession();
  if (!userId) return null;

  const dataSource = await getDataSource();
  const userRepository = dataSource.getRepository(User);
  return userRepository.findOne({ where: { id: userId } });
}

