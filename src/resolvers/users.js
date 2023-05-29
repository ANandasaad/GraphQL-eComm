import { GraphQLError } from "graphql";
import User from "../model/user.js";

const userResolvers = {
  Query: {
    getAllUser: async () => {
      const res = await User.find();
      console.log(res);
      return res;
    },
    getUser: async (_, args, context) => {
      const users = await User.findById(args.id);
      console.log(users);
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
      console.log(args);
      const emailUsed = await User.findOne(args.email);
      if (emailUsed) {
        throw new GraphQLError("Email is already exist", {
          extensions: {
            code: "EMAIL IS ALREADY USED",
          },
        });
      } else {
        const newUser = new User({
          name: args.input.name,
          username: args.input.username,
          email: args.input.email,
        });

        const res = await newUser.save();
        return {
          id: res.id,
          ...res._doc,
        };
      }
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
