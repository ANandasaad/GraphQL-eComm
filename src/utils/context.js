import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config.js";
import { GraphQLError } from "graphql";

const getUser = (token) => {
  try {
    if (token) {
      const user = jwt.verify(token, SECRET_KEY);
      console.log(user);
      return user;
    }
    return null;
  } catch (error) {
    throw new GraphQLError(`Error ${error}`, {
      extensions: {
        code: `ERROR ${error}`,
      },
    });
  }
};

const context = async ({ req }) => {
  const authHeader = req.headers.authorization || "";
   const token =authHeader;
   console.log('hit');
   console.log(token);
  const user = await getUser(token);

  if (!user) {
    throw new GraphQLError(`User is not authorized`, {
      extensions: {
        code: "USER IS NOT AUTHORIZED",
      },
    });
  }

  return { user };
};

export default context;
