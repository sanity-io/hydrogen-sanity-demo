import entries from 'lodash/fp/entries';
import flow from 'lodash/fp/flow';
import join from 'lodash/fp/join';
import reduce from 'lodash/fp/reduce';

const DOCUMENT_SLUG_MAP = {
  'article.info': `"/" + slug.current`,
  'article.editorial': `"/editorial/" + slug.current`,
  home: `"/"`,
  product: `"/products/" + store.slug.current`,
};

export const DOCUMENT_SLUG = flow(
  entries,
  reduce((acc, [key, val]) => {
    acc.push(`
      (_type == "${key}") => {
        "slug": ${val},
      }
    `);
    return acc;
  }, []),
  join(','),
)(DOCUMENT_SLUG_MAP);
