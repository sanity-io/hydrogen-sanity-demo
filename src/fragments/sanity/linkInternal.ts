import groq from 'groq';

export const LINK_INTERNAL = groq`
  _key,
  _type,
  title,
  ...reference-> {
    "documentType": _type,
    (_type == "collection") => {
      "slug": "/collections/" + store.slug.current,
    },
    (_type == "home") => {
      "slug": "/",
    },
    (_type == "page") => {
      "slug": "/pages/" + slug.current,
    },
    (_type == "product" && store.isEnabled && store.status == "active") => {
      "slug": "/products/" + store.slug.current,
    },
  }
`;
