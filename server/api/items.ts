export default defineEventHandler(async (event) => {
  // You can access query parameters
  const query = getQuery(event);

  // You can access request body for POST/PUT requests
  // const body = await readBody(event)

  // Mock database data
  const users = [
    {
      id: 1,
      title: 'item1',
      description: 'This is item1',
      price: 100,
      stock: 10,
      image: 'https://picsum.photos/200/300',
      altImage: 'https://picsum.photos/200/300',
    },
    {
      id: 2,
      title: 'item2',
      description: 'This is item2',
      price: 200,
      stock: 1,
      image: 'https://picsum.photos/200/300',
      altImage: 'https://picsum.photos/200/300',
    },
    {
      id: 3,
      title: 'item3',
      description: 'This is item3',
      price: 300,
      stock: 4,
      image: 'https://picsum.photos/200/300',
      altImage: 'https://picsum.photos/200/300',
    },
  ];

  // Return all users
  return users;
});
