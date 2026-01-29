import { createClient } from 'contentful';

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  console.warn('Contentful environment variables are missing. Using placeholders.');
}

const client = createClient({
  space: space || 'placeholder',
  accessToken: accessToken || 'placeholder',
});

export default client;
