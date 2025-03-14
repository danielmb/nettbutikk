import { z } from 'zod';
import { prisma } from '~/lib/db';
export const userSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  password: z.string().min(8).max(255),
});
export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    userSchema.safeParse(body),
  );

  if (!result.success) {
    throw result.error.issues;
  }
  // per now its not encrypted do not use this in production; use bcrypt
  const user = await prisma.user.create({
    data: result.data,
  });

  return user;
});
