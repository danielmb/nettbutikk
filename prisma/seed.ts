import { type Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const items: Prisma.ItemCreateManyInput[] = [
  {
    id: 1,
    name: 'Item 1',
    price: 100,
    image: 'https://picsum.photos/id/1/200/300',
  },
  {
    id: 2,
    name: 'Item 2',
    price: 200,
    image: 'https://picsum.photos/id/2/200/300',
  },
  {
    id: 3,
    name: 'Item 3',
    price: 300,
    image: 'https://picsum.photos/id/3/200/300',
  },
];

const promises: Promise<any>[] = [];
for (const item of items) {
  promises.push(
    prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: item,
    }),
  );
}

Promise.all(promises)
  .then(() => {
    console.log('Seeding complete');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
