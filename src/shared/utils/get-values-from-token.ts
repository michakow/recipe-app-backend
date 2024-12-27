export const getValuesFromToken = <T>(token: string, keys: (keyof T)[]): T => {
  const tokenWithoutBearer = token.startsWith('Bearer ')
    ? token.split(' ')[1]
    : token;

  const jsonToken: T = JSON.parse(
    Buffer.from(tokenWithoutBearer.split('.')[1], 'base64').toString(),
  );

  const newObj = {} as T;

  keys.forEach((k) => {
    if (jsonToken.hasOwnProperty(k)) {
      newObj[k] = jsonToken[k];
    }
  });

  console.log(newObj);

  return newObj;
};
