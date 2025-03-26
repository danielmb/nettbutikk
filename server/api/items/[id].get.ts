import { prisma } from '~/lib/db';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import gemini from '~/lib/ai';

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const item = await prisma.item.findUnique({
    where: { id: Number(id) },
    include: {
      images: true,
      brand: true,
      category: true,
      attributes: {
        include: {
          attributeValue: {
            include: {
              attributeType: true,
            },
          },
        },
      },
      parentVariant: {
        include: {
          Items: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });
  if (!item) {
    throw createError({ status: 404, message: 'Item not found' });
  }
  const brand = item.attributes.find(
    (a) => a.attributeValue.attributeType.slug === 'brand',
  );
  if (brand && !brand.attributeValue.description) {
    const response = await gemini?.generateContent(
      // `I want a description for the brand ${brand.attributeValue.displayName}
      `You are tasked with creating a descriptions for a user inputed item.
Our brand name is 'Nettbutikken' and we sell a variety of clothing items
such as shirts, trousers, jackets, and suits.
Only respond with the description, do not wrap it in quotes or any other formatting.
Example style of a request to create a description for male clothing items:
Let's talk outfit inspo with our edit of men's bestselling clothing. For that main character moment, dial up your 'drobe essentials with Nettbutikken DESIGN - we've got everything from chino shorts and cargo trousers to printed shirts and three-piece suits. Or, set your loungewear looks up for success with T-shirts, sweatshirts and joggers from Nettbutikken (cos tbh, casj looks are where the fun's really at). Looking to switch up your outerwear? Nettbutikken are supplying puffer jackets, water-repellent coats and zip fleeces to bring your layering A-game. So, whether you're going for an on or off-duty style, our edit has you covered.

I want a description for the brand ${brand.attributeValue.displayName}`,
    );
    const res = response?.response.text();
    if (res) {
      brand.attributeValue.description = res ?? null;
      await prisma.attributeValue.update({
        where: { id: brand.attributeValue.id },
        data: {
          description: brand.attributeValue.description,
        },
      });
    }
    // }
  }
  return item;
});
