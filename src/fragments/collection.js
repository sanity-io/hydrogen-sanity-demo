import groq from 'groq';

export const COLLECTION = groq`
  _id,
  "slug": "/collections/" + store.slug.current,
  store,
  "title": store.title
`;
