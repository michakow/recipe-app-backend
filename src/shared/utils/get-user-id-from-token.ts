import { TokenUserObject } from 'src/users';
import { getValuesFromToken } from './get-values-from-token';

export const getUserIdFromToken = (token: string) => {
  return getValuesFromToken<TokenUserObject>(token, ['sub']).sub;
};
