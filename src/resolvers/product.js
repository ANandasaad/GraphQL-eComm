import { GraphQLError } from "graphql";
import Product from "../model/product.js";
const productResolvers = {
  Query: {
    getAllProduct: async (_, args, { user }) => {
      console.log(user);
      try {
        if (user || user.role === "admin") {
          const res = await Product.find();
          //   console.log(res);
          return res;
        } else {
          throw new GraphQLError("User is not Authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
      } catch (error) {
        throw new GraphQLError(`Error_${error}`, {
          extensions: {
            code: `ERROR_${error}`,
          },
        });
      }
    },
    getProduct: async (_, args, context) => {
      //   console.log(args.id);
      console.log(context);
      const { user } = context;
      try {
        if (!user || !user.role) {
          throw new GraphQLError("User is not Authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
        if (user || user.role === "admin") {
          const productId = await Product.findById(args.id);
          if (!productId) {
            throw new GraphQLError("Product not Found", {
              extensions: {
                code: "PRODUCT NOT FOUND",
              },
            });
          } else {
            return productId;
          }
        }
      } catch (error) {
        throw new GraphQLError(`Error_${error}`, {
          extensions: {
            code: `ERROR_${error}`,
          },
        });
      }
    },
  },
  Mutation: {
    createProduct: async (_, args, context) => {
      const { user } = context;
      console.log(user);
      try {
        if (!user) {
          throw new GraphQLError("User is not Authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
        //  console.log(user.role)
        if (user) {
          if (user.role === undefined) {
            const newProduct = new Product({
              name: args.input.name,
              description: args.input.description,
              price: args.input.price,
              category: args.input.category,
            });

            const res = await newProduct.save();
            return {
              id: res.id,
              ...res._doc,
            };
          } else {
            throw new GraphQLError("Admin is not Allowed", {
              extensions: {
                code: "ADMIN_NOT_ALLOWED",
              },
            });
          }
        }
      } catch (error) {
        throw new GraphQLError(`Error_${error}`, {
          extensions: {
            code: `ERROR_${error}`,
          },
        });
      }
    },
    updateProduct: async (_, args, context) => {
      // console.log(args);
      const { user } = context;
      try {
        if (!user) {
          throw new GraphQLError("User is not Authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
        if (user) {
          if (user.role === undefined) {
            const productID = await Product.findById(args.id);
            if (!productID) {
              throw new GraphQLError("Product Not Found", {
                extensions: {
                  code: "PRODUCT NOT FOUND",
                },
              });
            } else {
              const updatedProduct = await Product.findByIdAndUpdate(
                args.id,
                args.input,
                { new: true }
              );
              console.log(updatedProduct);
              return updatedProduct;
            }
          } else {
            throw new GraphQLError("Admin is not Allowed", {
              extensions: {
                code: "ADMIN_NOT_ALLOWED",
              },
            });
          }
        }
      } catch (error) {
        throw new GraphQLError(`Error_${error}`, {
          extensions: {
            code: `ERROR_${error}`,
          },
        });
      }
    },
    deleteProduct: async (_, args, context) => {
      // console.log(args);
      const { user } = context;
      try {
        if (!user) {
          throw new GraphQLError("User is not Authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
        if (user) {
          if (user.role === undefined) {
            const productID = await Product.findById(args.id);
            if (!productID) {
              throw new GraphQLError("Product id is not Found", {
                extensions: {
                  code: "PRODUCT ID IS NOT FOUND",
                },
              });
            } else {
              const deletedProduct = await Product.findByIdAndDelete(args.id);
              console.log(deletedProduct);
              return deletedProduct;
            }
          } else {
            throw new GraphQLError("Admin is not Allowed", {
              extensions: {
                code: "ADMIN_NOT_ALLOWED",
              },
            });
          }
        }
      } catch (error) {
        throw new GraphQLError(`Error_${error}`, {
          extensions: {
            code: `ERROR_${error}`,
          },
        });
      }
    },
  },
};

export default productResolvers;
