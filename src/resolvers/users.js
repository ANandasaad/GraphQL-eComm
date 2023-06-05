import { GraphQLError } from "graphql";
import User from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationSignUp, validationLogin } from "../utils/validator.js";
import TokenGenerator from "../config/tokenGenerator.js";

// const GenerateToken = (username,email,passwords) => {
//   return jwt.sign(
//     { username: username, email:email, password:passwords },
//     process.env.SECRET__KEY,
//     { expiresIn: "1h" }
//   );
// };

const userResolvers = {
  Query: {
    me: async(_,args,{user})=>{
    
      console.log(user);
         if(!user){
            throw new GraphQLError("Token is not Valid",{extensions:{
              code:"TOKEN IS NOT VALID"
            }});
         }
         return user;
    },
    getAllUser: async (_,args,{user}) => {
      console.log("hit");
       console.log(user);
       if(user)
       {
        try {
          const users = await User.find();
          console.log("end");
          console.log(users);            // Log the retrieved users for debugging
          return users;
        } catch (error) {
          console.error(error); // Log any error that occurs during retrieval
          throw new GraphQLError("Failed to retrieve users.", {
            extensions: {
              code: "USER_RETRIEVAL_ERROR",
            },
          });
        }
       }
       else
       {
        throw new GraphQLError('User is not authenticated',{extensions:{
          code: 'UNAUTHENTICATED',
          http: { status: 401 },
        }})
       }
      
    },
    getUser: async (_, args, {user}) => {
        if(user)
        {
          try {
            const existingUser = await User.findById(args.id);
            console.log(existingUser.username);
            if(user.username===existingUser.username)
            {
              return existingUser;
            }
            else
            {
              throw new GraphQLError("User not found", {
                extensions: {
                  code: "USER NOT FOUND",
                },
              });
            }
            
           } catch (error) {
              throw new GraphQLError(`Error__${error}`,{extensions:{
                code:`ERROR__${error}`
              }})
           }
        }
        else
        {
          throw new GraphQLError('User is not authenticated',{extensions:{
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
          }})
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

       
        // const token = GenerateToken(username,email,passwords);
        const token= TokenGenerator(username,email,passwords);
        const newUser = new User({
          name,
          username,
          email,
          password: passwords,
          token:token,
          createdAt: new Date().toISOString(),
        });
      
        const res = await newUser.save();
        console.log('hit');
        console.log(res);
     
        return {
          id: res.id,
          ...res._doc,
          token,
        };
      }
    },
    loginUser: async (_, args, context) => {
      console.log(context);
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

      const token = TokenGenerator(user);

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
