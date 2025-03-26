// prisma/seed.ts
import { Prisma, PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clear existing data
  await prisma.image.deleteMany();
  await prisma.filters.deleteMany();
  await prisma.itemAttributeValue.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.attributeType.deleteMany();
  await prisma.item.deleteMany();
  await prisma.user.deleteMany();
  console.log('Deleted existing data');

  // Create attribute types
  const attributeTypes = await Promise.all([
    prisma.attributeType.create({
      data: {
        name: 'Brand',
        slug: 'brand',
        filterable: true,
        sortOrder: 1,
      },
    }),
    prisma.attributeType.create({
      data: {
        name: 'Size',
        slug: 'size',
        filterable: true,
        sortOrder: 2,
      },
    }),
    prisma.attributeType.create({
      data: {
        name: 'Color',
        slug: 'color',
        filterable: true,
        sortOrder: 3,
      },
    }),
    prisma.attributeType.create({
      data: {
        name: 'Style',
        slug: 'style',
        filterable: true,
        sortOrder: 4,
      },
    }),
    prisma.attributeType.create({
      data: {
        name: 'Category',
        slug: 'category',
        filterable: true,
        sortOrder: 0,
      },
    }),
    prisma.attributeType.create({
      data: {
        name: 'Gender',
        slug: 'main',
        filterable: true,
        sortOrder: 5,
      },
    }),
    prisma.attributeType.create({
      data: {
        name: 'Product Type',
        slug: 'producttype',
        filterable: true,
        sortOrder: 6,
      },
    }),
  ]);

  console.log(`Created ${attributeTypes.length} attribute types`);

  // Map of attribute types for easier access
  const attributeTypeMap = attributeTypes.reduce((acc, type) => {
    acc[type.slug] = type.id;
    return acc;
  }, {} as Record<string, number>);

  // Create attribute values
  const brandValues = await Promise.all(
    ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'New Balance'].map(
      (brand) =>
        prisma.attributeValue.create({
          data: {
            value: brand.toLowerCase(),
            displayName: brand,
            attributeTypeId: attributeTypeMap['brand'],
          },
        }),
    ),
  );

  const sizeValues = await Promise.all(
    ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) =>
      prisma.attributeValue.create({
        data: {
          value: size.toLowerCase(),
          displayName: size,
          attributeTypeId: attributeTypeMap['size'],
        },
      }),
    ),
  );

  const colorValues = await Promise.all(
    [
      'Red',
      'Blue',
      'Green',
      'Black',
      'White',
      'Yellow',
      'Purple',
      'Orange',
    ].map((color) =>
      prisma.attributeValue.create({
        data: {
          value: color.toLowerCase(),
          displayName: color,
          attributeTypeId: attributeTypeMap['color'],
        },
      }),
    ),
  );

  const styleValues = await Promise.all(
    ['Casual', 'Formal', 'Athletic', 'Vintage', 'Modern'].map((style) =>
      prisma.attributeValue.create({
        data: {
          value: style.toLowerCase(),
          displayName: style,
          attributeTypeId: attributeTypeMap['style'],
        },
      }),
    ),
  );

  const categoryValues = await Promise.all(
    // ['T-Shirts', 'Hoodies', 'Pants', 'Shoes', 'Accessories'].map((category) =>
    ['Clothing', 'Shoes', 'Accessories', 'Sportswear'].map((category) =>
      prisma.attributeValue.create({
        data: {
          value: category.toLowerCase().replace('-', ''),
          displayName: category,
          attributeTypeId: attributeTypeMap['category'],
        },
      }),
    ),
  );

  const productTypeMap = {
    // clothing: ['T-Shirts', 'Shorts', 'Hoodies', 'Trousers'],
    clothing: await Promise.all(
      ['T-Shirts', 'Shorts', 'Hoodies', 'Trousers'].map((product) =>
        prisma.attributeValue.create({
          data: {
            value: product.toLowerCase().replace('-', ''),
            displayName: product,
            attributeTypeId: attributeTypeMap['producttype'],
          },
        }),
      ),
    ),
    // shoes: ['Sneakers', 'Sandals', 'Boots', 'Slippers'],
    shoes: await Promise.all(
      ['Sneakers', 'Sandals', 'Boots', 'Slippers'].map((product) =>
        prisma.attributeValue.create({
          data: {
            value: product.toLowerCase().replace('-', ''),
            displayName: product,
            attributeTypeId: attributeTypeMap['producttype'],
          },
        }),
      ),
    ),

    // accessories: ['Watches', 'Sunglasses', 'Bags', 'Hats'],
    accessories: await Promise.all(
      ['Watches', 'Sunglasses', 'Bags', 'Hats'].map((product) =>
        prisma.attributeValue.create({
          data: {
            value: product.toLowerCase().replace('-', ''),
            displayName: product,
            attributeTypeId: attributeTypeMap['producttype'],
          },
        }),
      ),
    ),

    // sportswear: ['Running', 'Training', 'Yoga', 'Cycling'],
    sportswear: await Promise.all(
      ['Running', 'Training', 'Yoga', 'Cycling'].map((product) =>
        prisma.attributeValue.create({
          data: {
            value: product.toLowerCase().replace('-', ''),
            displayName: product,
            attributeTypeId: attributeTypeMap['producttype'],
          },
        }),
      ),
    ),
  };

  const mainValues = await Promise.all(
    // ['Men', 'Women', 'Unisex', 'Kids']

    (
      [
        {
          attributeTypeId: attributeTypeMap['main'],
          value: 'men',
          displayName: 'MEN',
          slug: 'men',
          description: 'Clothing for men',
          sortOrder: 0,
        },
        {
          attributeTypeId: attributeTypeMap['main'],
          value: 'women',
          slug: 'women',
          displayName: 'WOMEN',
          description: 'Clothing for women',
          sortOrder: 1,
        },
        // {
        //   attributeTypeId: attributeTypeMap['main'],
        //   value: 'unisex',
        //   slug: 'unisex',
        //   displayName: 'UNISEX',
        //   description: 'Clothing for everyone',
        //   sortOrder: 2,
        // },
        {
          attributeTypeId: attributeTypeMap['main'],
          value: 'kids',
          slug: 'kids',
          displayName: 'KIDS',
          description: 'Clothing for kids',
          sortOrder: 2,
        },
      ] satisfies Prisma.AttributeValueCreateManyInput[]
    ).map((mainValue) =>
      prisma.attributeValue.create({
        data: mainValue,
        // value: mainValue.toLowerCase(),
        // displayName: mainValue.toUpperCase(),
        // attributeTypeId: attributeTypeMap['main'],
      }),
    ),
  );

  console.log('Created attribute values');

  // Helper function to get random elements from an array
  function getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Create sample items
  const itemsData = [
    {
      name: 'Classic T-Shirt',
      description: 'A comfortable cotton t-shirt for everyday wear',
      price: 19.99,
      image: '/api/images/classic-tshirt.jpg',
      images: {
        createMany: {
          data: [
            { url: '/api/images/classic-tshirt-2.jpg', title: 'Back view' },
            { url: '/api/images/classic-tshirt-3.jpg', title: 'Side view' },
          ],
        },
      },
      attributes: {
        createMany: {
          data: [{ attributeValueId: categoryValues[0].id }],
        },
      },
    },
    {
      name: 'Running Shoes',
      description: 'Lightweight running shoes with good support',
      price: 89.99,
      image: '/api/images/running-shoes.jpg',
      images: {
        createMany: {
          data: [
            { url: '/api/images/running-shoes-2.jpg', title: 'Front view' },
            { url: '/api/images/running-shoes-3.jpg', title: 'Side view' },
          ],
        },
      },
      attributes: {
        createMany: {
          data: [{ attributeValueId: categoryValues[3].id }],
        },
      },
    },
    {
      name: 'Workout Hoodie',
      description: 'Warm and comfortable hoodie for workouts',
      price: 49.99,
      image: '/api/images/workout-hoodie.jpg',
      images: {
        createMany: {
          data: [
            { url: '/api/images/workout-hoodie-2.jpg', title: 'Back view' },
            { url: '/api/images/workout-hoodie-3.jpg', title: 'Side view' },
          ],
        },
      },
    },
    {
      name: 'Slim Fit Jeans',
      description: 'Modern slim fit jeans for a stylish look',
      price: 59.99,
      image: '/api/images/slim-jeans.jpg',
      images: {
        createMany: {
          data: [
            { url: '/api/images/slim-jeans-2.jpg', title: 'Back view' },
            { url: '/api/images/slim-jeans-3.jpg', title: 'Side view' },
          ],
        },
      },
    },
    {
      name: 'Sports Watch',
      description: 'Water-resistant sports watch with multiple features',
      price: 129.99,
      image: '/api/images/sports-watch.jpg',
      images: {
        createMany: {
          data: [
            { url: '/api/images/sports-watch-2.jpg', title: 'Side view' },
            { url: '/api/images/sports-watch-3.jpg', title: 'Close-up' },
          ],
        },
      },
    },
    {
      name: 'Premium Socks',
      description: 'Pack of 3 premium cotton socks',
      price: 12.99,
      image: '/api/images/premium-socks.jpg',
    },
    {
      name: 'Athletic Shorts',
      description: 'Breathable athletic shorts for running and gym',
      price: 29.99,
      image: '/api/images/athletic-shorts.jpg',
    },
    {
      name: 'Casual Shirt',
      description: 'Button-up casual shirt for everyday wear',
      price: 39.99,
      image: '/api/images/casual-shirt.jpg',
    },
    {
      name: 'Leather Wallet',
      description: 'Genuine leather wallet with multiple card slots',
      price: 34.99,
      image: '/api/images/leather-wallet.jpg',
    },
    {
      name: 'Polarized Sunglasses',
      description: 'Stylish polarized sunglasses with UV protection',
      price: 79.99,
      image: '/api/images/polarized-sunglasses.jpg',
      images: {
        createMany: {
          data: [
            {
              url: '/api/images/polarized-sunglasses-2.jpg',
              title: 'Side view',
            },
            {
              url: '/api/images/polarized-sunglasses-3.jpg',
              title: 'Close-up',
            },
          ],
        },
      },
    },
  ] satisfies Prisma.ItemCreateInput[];

  for (let i = 0; i < 100; i++) {
    itemsData.push({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      image: faker.image.urlPicsumPhotos(),
      price: Number(faker.commerce.price()),
    });
  }

  // Create all attribute values map for easier access
  const allAttributeValues = [
    // ...brandValues,
    ...sizeValues,
    ...colorValues,
    ...styleValues,
    ...categoryValues,
  ];

  const attributeValueMap = allAttributeValues.reduce((acc, value) => {
    if (value.attributeTypeId === attributeTypeMap['main']) {
      return acc;
    }
    if (!acc[value.attributeTypeId]) {
      acc[value.attributeTypeId] = [];
    }
    acc[value.attributeTypeId].push(value);
    return acc;
  }, {} as Record<number, typeof allAttributeValues>);

  // Create items with their attributes
  const items = [];
  for (const itemData of itemsData) {
    // Create the item
    const brand = getRandomElements(brandValues, 1)[0];
    const category = getRandomElements(categoryValues, 1)[0];
    const item = await prisma.item.create({
      data: {
        ...itemData,
        brandId: brand.id,
        categoryId: category.id,
      },
    });
    console.log(
      `ItemID: ${item.id} BrandID: ${brand.id} CategoryID: ${category.id}`,
    );
    await prisma.itemAttributeValue.upsert({
      where: {
        itemId_attributeValueId: {
          itemId: item.id,
          attributeValueId: brand.id,
        },
      },
      update: {},
      create: {
        itemId: item.id,
        attributeValueId: brand.id,
      },
    });

    await prisma.itemAttributeValue.upsert({
      where: {
        itemId_attributeValueId: {
          itemId: item.id,
          attributeValueId: category.id,
        },
      },
      update: {},
      create: {
        itemId: item.id,
        attributeValueId: category.id,
      },
    });

    // Assign attributes to the item
    // Each item needs one value from each attribute type
    let pickedIds = [
      // brand.id,
      category.id,
      brand.id,
    ];

    for (const typeId of Object.keys(attributeValueMap).map(Number)) {
      const possibleValues = attributeValueMap[typeId].filter((v) => {
        return !pickedIds.includes(v.id);
      });

      const selectedValue = getRandomElements(possibleValues, 1)[0];

      await prisma.itemAttributeValue.create({
        data: {
          itemId: item.id,
          attributeValueId: selectedValue.id,
        },
      });
    }

    // product type
    const productType =
      productTypeMap[category.value as keyof typeof productTypeMap];
    if (productType) {
      const product = getRandomElements(productType, 1)[0];
      await prisma.itemAttributeValue.create({
        data: {
          itemId: item.id,
          attributeValueId: product.id,
        },
      });
    }

    // pick a random main value
    const mainValue = getRandomElements(mainValues, 1)[0];
    await prisma.itemAttributeValue.create({
      data: {
        itemId: item.id,
        attributeValueId: mainValue.id,
      },
    });

    items.push(item);
  }

  console.log(`Created ${items.length} items with attributes`);

  // Create sample user
  const user = await prisma.user.create({
    data: {
      email: '1',
      password: '1',
      name: 'Sample User',
    },
  });

  console.log(`Created sample user: ${user.email}`);

  // create filters
  const mensId = mainValues.find((v) => v.value === 'men')?.id;
  const womensId = mainValues.find((v) => v.value === 'women')?.id;
  const tshirtsId = categoryValues.find((v) => v.value === 'clothing')?.id;
  if (!mensId || !tshirtsId || !womensId) {
    throw new Error('Could not find main or category attribute values');
  }

  const filters = [
    {
      name: "Men's t-shirts",
      description: "Men's t-shirts in various styles and colors",
      public: true,
      values: {
        connect: [{ id: mensId }, { id: tshirtsId }],
      },
    },
    {
      name: "Women's t-shirts",
      description: "Women's t-shirts in various styles and colors",
      public: true,
      values: {
        connect: [{ id: womensId }, { id: tshirtsId }],
      },
    },
  ] satisfies Prisma.FiltersCreateInput[];

  // await prisma.filters.createMany({
  //   data: filters,
  // });
  for (const filter of filters) {
    await prisma.filters.create({
      data: filter,
    });
  }

  console.log('Seeding completed successfully');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
