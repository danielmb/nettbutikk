import { prisma } from '@/lib/db';

export default defineEventHandler(async (event) => {
  return await prisma.navigationItem.findMany({});
});
