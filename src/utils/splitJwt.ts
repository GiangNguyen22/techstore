export const splitJwt = (inputString: string) => {
  const jwtToken = inputString.split("=")[1].split(";")[0];
  return jwtToken;
};
