import { z } from 'zod';

// model Item {
//   id          Int     @id @default(autoincrement())
//   name        String
//   description String?
//   price       Float
//   image       String // main image
//   images      Image[]

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   users     User[]

//   // All the single relations
//   brand   AttributeValue? @relation("brand", fields: [brandId], references: [id])
//   brandId Int?

//   category   AttributeValue? @relation("category", fields: [categoryId], references: [id]) // main category
//   categoryId Int?

//   // Eav model
//   attributes ItemAttributeValue[]

//   // Variant model

//   variants        ItemVariant[] @relation("ItemVariants")
//   parentVariant   ItemVariant?  @relation("ParentVariants", fields: [parentVariantId], references: [id])
//   parentVariantId Int?
// }

export const itemsPostSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  price: z.number(),
  image: z.string(), // main image

  brandId: z.number().nullish(),
  categoryId: z.number().nullish(),

  images: z.array(z.string()).optional(),
  attributes: z.array(z.number()).nullish(),
  variants: z.array(z.number()).nullish(),
});
