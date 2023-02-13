// This code generates a random number between 0 and 1000000 for the nonce
export const generateNonce = (): number => {
  return Math.floor(Math.random() * 1000000);
};
