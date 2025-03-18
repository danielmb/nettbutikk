import { $fetch } from 'ofetch';

export default defineEventHandler(async (event) => {
  const imageUrl = 'https://picsum.photos/200/300';

  try {
    const response = await $fetch.raw(imageUrl, {
      responseType: 'stream',
    });

    if (response.status !== 200) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch image: ${response.statusText}`,
      });
    }

    if (response.headers.has('content-type')) {
      event.node.res.setHeader(
        'Content-Type',
        response.headers.get('content-type')!,
      );
    }
    if (response.headers.has('content-length')) {
      event.node.res.setHeader(
        'Content-Length',
        response.headers.get('content-length')!,
      );
    }

    return response.body;
  } catch (error) {
    if (error instanceof Error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Internal server error: ${error.message}`,
      });
    } else {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal server error',
      });
    }
  }
});
