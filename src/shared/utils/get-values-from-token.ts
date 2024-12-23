export const getValuesFromToken = (
  token: string,
  keys: string[],
): { [key: string]: any } => {
  const tokenWithoutBearer = token.startsWith('Bearer ')
    ? token.split(' ')[1]
    : token;

  const jsonToken: { [key: string]: any } = JSON.parse(
    Buffer.from(tokenWithoutBearer.split('.')[1], 'base64').toString(),
  );

  const newObj: { [key: string]: any } = {};

  keys.forEach((k) => {
    if (jsonToken.hasOwnProperty(k)) {
      newObj[k] = jsonToken[k];
    }
  });

  console.log(newObj);

  return newObj;
};
