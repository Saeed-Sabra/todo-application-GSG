import createError from "http-errors";
import jwt from "jsonwebtoken";

const secret = "basic-secret";

export const generateToken = (id, username) => {
  return jwt.sign(
    {
      id,
      username,
    },
    secret
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, secret, (error, user) => {
    if (error) throw error;
    return user;
  });
};

export const authenticationMiddleware = (req, res, next) => {
  const token = req?.headers["authorization"]?.split(" ")?.[1];
  if (!token) {
    throw createError.Unauthorized();
  }
  const user = jwt.verify(token, secret, (error, user) => {
    if (error) return;
    return user;
  });
  if (!user) {
    throw createError.Forbidden();
  }
  req["user"] = user;
  next();
};
