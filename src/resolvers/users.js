import { GraphQLError } from "graphql";
import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationSignUp, validationLogin } from "../utils/validator.js";


const GenerateToken = (username,email,passwords) => {
  return jwt.sign(
    { username: username, email:email, password:passwords },
    process.env.SECRET__KEY,
    { expiresIn: "1h" }
  );
};

const userResolvers = {
  Query: {
    me: async(_,args,context)=>{
      console.log("hit");
      console.log(context);
         if(!context.user){
            throw new GraphQLError("Token is not Valid",{extensions:{
              code:"TOKEN IS NOT VALID"
            }});
         }
         return context.user;
    },
    getAllUser: async (_,args,context) => {
      // console.log(context);
      try {
        const users = await User.find();
        // console.log(users);            // Log the retrieved users for debugging
        return users;
      } catch (error) {
        console.error(error); // Log any error that occurs during retrieval
        throw new GraphQLError("Failed to retrieve users.", {
          extensions: {
            code: "USER_RETRIEVAL_ERROR",
          },
        });
      }
    },
    getUser: async (_, args, context) => {
      const users = await User.findById(args.id);
      // console.log(users);
      if (users) {
        return users;
      } else {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "USER NOT FOUND",
          },
        });
      }
    },
  },
  Mutation: {
    createUser: async (_, args, context) => {
      const { name, email, username, password, confirmpassword } = args.input;

      // console.log(args);
      const { valid, error } = validationSignUp(
        username,
        password,
        email,
        confirmpassword
      );
      const errors = Object.values(error).join("/");
      // console.log(errors);
      console.log(JSON.stringify(error));
      if (!valid) {
        throw new GraphQLError(`Error ${errors}`, {
          extensions: {
            code: `ERROR_ ${errors}`,
          },
        });
      }

      const emailUsed = await User.findOne({ email: email });
      const userName= await User.findOne({username:username});
      // console.log(emailUsed);
      if (emailUsed || userName) {
        throw new GraphQLError("Email is already exist / Username is already exist", {
          extensions: {
            code: "EMAIL IS ALREADY USED / USERNAME IS ALREADY EXIST",
          },
        });
      } else {
        let passwords = await bcrypt.hash(password, 12);

        const newUser = new User({
          name,
          username,
          email,
          password: passwords,
          createdAt: new Date().toISOString(),
        });
        const token = GenerateToken(username,email,passwords);
        newUser.token=token;
        const res = await newUser.save();
        
     
        return {
          id: res.id,
          ...res._doc,
          token,
        };
      }
    },
    loginUser: async (_, args, context) => {
      const { username, password } = args.input;
      const { valid, error } = validationLogin(username, password);
      const errors = Object.values(error).join("/");
      if (!valid) {
        throw new GraphQLError(`${errors}`, {
          extensions: {
            code: `ERROR / ${errors}`,
          },
        });
      }
      const user = await User.findOne({ username: username });
      if (!user) {
        throw new GraphQLError(`${errors}`, {
          extensions: {
            code: "USER NOT FOUND",
          },
        });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new GraphQLError(`${errors}`, {
          extensions: {
            code: "PASSWORD_IS_NOT_CORRECT",
          },
        });
      }

      const token = GenerateToken(user);

      return {
        id: user.id,
        ...user._doc,
        token,
      };
    },
    updateUser: async (_, args, context) => {
      //   console.log(args.id);
      //   console.log(args.input);
      const userID = await User.findById(args.id);
      console.log(userID);
      if (!userID) {
        throw new GraphQLError("User Not Found", {
          extensions: {
            code: "USER NOT FOUND",
          },
        });
      } else {
        const user = await User.findByIdAndUpdate(args.id, args.input, {
          new: true,
        });
        return user;
      }
    },
    deleteUser: async (_, args, context) => {
      const userID = await User.findById(args.id);
      if (!userID) {
        throw new GraphQLError("User not Found", {
          extensions: {
            code: "USER NOT FOUND",
          },
        });
      } else {
        const deleteUser = await User.findByIdAndDelete(args.id);
        return deleteUser;
      }
    },
  },
};

export default userResolvers;
