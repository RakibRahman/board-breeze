import argon2 from "argon2";

export const hashPassword = async (password: string) => {
  try {
    return await argon2.hash(password);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to hash password");
  }
};

export const isValidPassword = async (
  hashedPassword: string,
  password: string
) => {
  try {
    return (await argon2.verify(hashedPassword, password)) ? true : false;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to verify password");
  }
};
