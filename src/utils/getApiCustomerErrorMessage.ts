import type {UserError} from '@shopify/hydrogen/storefront-api-types';

export function getApiCustomerErrorMessage(
  field: string,
  data: Record<string, any>,
  errors: UserError[],
) {
  if (errors?.length) return errors[0].message ?? errors[0];
  if (data?.[field]?.customerUserErrors?.length)
    return data[field].customerUserErrors[0].message;
  return null;
}
