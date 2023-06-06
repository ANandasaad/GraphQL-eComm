import { GraphQLError } from "graphql";
import Admin from "../model/admin.js";
import { validationLogin, validationSignUp } from "../utils/validator.js";
import bcrypt from "bcryptjs";
import adminTokenGenerator from "../config/adminTokenGenerator.js";

const adminResolvers = {
  Query: {
    getAdmin: async (_, args,context) => {
        // console.log('hit');
        // console.log(context);
      try {
        const existingAdmin = await Admin.findById(args.id);
        if (!existingAdmin) {
          throw new GraphQLError("Admin not found", {
            extensions: {
              code: "ADMIN_NOT_FOUND",
            },
          });
        } else {
          return existingAdmin;
        }
      } catch (error) {
        throw new GraphQLError(`Error__:${error}`, {
          extensions: {
            code: `ERROR__:${error}`,
          },
        });
      }
    },
  },
  Mutation: {
    createAdmin: async (_, args, context) => {
      const { username, email, password, confirmPassword,role } = args.input;

      try {
        const { valid, error } = validationSignUp(
          username,
          password,
          email,
          confirmPassword
        );
        const errors = Object.values(error).join("/");
        if (!valid) {
          throw new GraphQLError(`Error__:${errors}`, {
            extensions: {
              code: `ERROR__${errors}`,
            },
          });
        }
        const existingAdminUsername = await Admin.findOne({ username });
        if (existingAdminUsername) {
          throw new GraphQLError("Admin already exists", {
            extensions: {
              code: "ADMIN_ALREADY_EXISTS",
            },
          });
        } else {
          let passwords = await bcrypt.hash(password, 12);
          const token = adminTokenGenerator(role,username, email, passwords);
          console.log("hit");
          console.log(token);
          const newAdmin = new Admin({
            role,
            username,
            email,
            password:passwords,
            token:token
          });
          const res = await newAdmin.save();
          return {
            id: res.id,
            ...res._doc,
            token,
          };
        }
      } catch (error) {
        throw new GraphQLError(`Error__${error}`, {
          extensions: {
            code: `ERROR___${error}`,
          },
        });
      }
    },
    updateAdmin: async (_, args, context) => {
        console.log(args);
        const {username,email,password,confirmPassword}= args.input;

      try {
        
        const existingAdmin = await Admin.findById(args.id);
        console.log(existingAdmin);
        if (!existingAdmin) {
          throw new GraphQLError("Admin not exist", {
            extensions: {
              code: "ADMIN_NOT_EXIST",
            },
          });
        } else {
        //     const {valid,error}= validationSignUp(username,email,password,confirmPassword);
        // const errors = Object.values(error).join("/");
        // console.log(errors);
        // if (!valid) {
        //   throw new GraphQLError(`Error__:${errors}`, {
        //     extensions: {
        //       code: `ERROR__${errors}`,
        //     },
        //   });
        // }
          const updatedAdmin = await Admin.findByIdAndUpdate(
            args.id,
            args.input,
            { new: true }
          );
          return updatedAdmin;
        }
      } catch (error) {
        throw new GraphQLError(`Error__${error}`, {
          extensions: {
            code: `ERROR__${error}`,
          },
        });
      }
    },
    deleteAdmin: async (_, args, context) => {
      try {
        const isAmdinDeleted = await Admin.findById(args.id);
        if (!isAmdinDeleted) {
          throw new GraphQLError("Admin not found", {
            extensions: {
              code: "Admin",
            },
          });
        } else {
          const deleteAdmin = await Admin.findByIdAndDelete(args.id);
          return deleteAdmin;
        }
      } catch (error) {
        throw new GraphQLError(`Error__${error}`, {
          extensions: {
            code: `ERROR__${error}`,
          },
        });
      }
    },
    loginAdmin: async (_, args, context) => {
        // console.log('hit');
        // console.log(context);
        // console.log(args);
      const { username, password } = args.input;
      try {
        const { valid, error } = validationLogin(username, password);
        const errors = Object.values(error).join("/");
        console.log(errors);
        if (!valid) {
          throw new GraphQLError(`${errors}`, {
            extensions: {
              code: `ERROR /${errors}`,
            },
          });
        }
        const admin = await Admin.findOne({ username });
        console.log(admin);
        if (!admin) {
          throw new GraphQLError(`Admin is not found`, {
            extensions: {
              code: "ADMIN_NOT_FOUND",
            },
          });
        }
        const match = await bcrypt.compare(password, admin.password);
        // console.log(password);
        // console.log('admin pass');
        // console.log(admin.password);
        // console.log(match);
        if (!match) {
          throw new GraphQLError(`${errors}`, {
            extensions: {
              code: "PASSWORD_IS_NOT_FOUND",
            },
          });
        }
        const token = adminTokenGenerator(admin);
        return {
          id: admin.id,
          ...admin._doc,
          token,
        };
      } catch (error) {
        throw new GraphQLError(`Error__${error}`, {
          extensions: {
            code: `ERROR__${error}`,
          },
        });
      }
    },
  },
};

export default adminResolvers;
