import groq from 'groq';

export const LINK_INTERNAL = groq`
  _key,
  _type,
  title,
  ...reference-> {
    "documentType": _type,
    (_type == "article.editorial") => {
      "slug": "/editorial/" + slug.current,
    },
    (_type == "article.info") => {
      "slug": "/pages/" + slug.current,
    },
    (_type == "collection") => {
      "slug": "/collections/" + slug.current,
    },
    (_type == "home") => {
      "slug": "/",
    },
    (_type == "product" && store.isEnabled && store.status == "active") => {
      "slug": "/products/" + store.slug.current,
    },
  }
`;
