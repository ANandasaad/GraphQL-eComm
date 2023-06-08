import { GraphQLError } from "graphql";
import Category from "../model/category.js";

const categoryResolver = {
  Query: {
    getAllCategory: async (_, args, context) => {
      const { user } = context;
      try {
        if (user) {
          if (user.role) {
            const category = await Category.find();
            if (!category) {
              throw new GraphQLError("Category is not found", {
                extensions: {
                  code: "CATEGORY_NOT_FOUND",
                },
              });
            } else {
              console.log(category);
              return category;
            }
          } else {
            throw new GraphQLError("Admin is not Authenticated/Not found", {
              extensions: {
                code: "ADMIN_NOT_AUTHENTICATED",
              },
            });
          }
        } else {
          throw new GraphQLError("User is not authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
    getCategory: async (_, args, context) => {
      const { user } = context;

      try {
        if (user) {
          if (user.role) {
            const categoryID = await Category.findById(args.id);
            if (!categoryID) {
              throw new GraphQLError("Category is Id not found", {
                extensions: {
                  code: "CATEGORY_ID_NOT_FOUND",
                },
              });
            } else {
              // console.log(categoryID);
              return categoryID;
            }
          } else {
            throw new GraphQLError("Admin is not Authenticated/Not found", {
              extensions: {
                code: "ADMIN_NOT_AUTHENTICATED",
              },
            });
          }
        } else {
          throw new GraphQLError("User is not authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
  },
  Mutation: {
    createCategory: async (_, args, context) => {
      // console.log(args);
      const { user } = context;
      try {
        if (user) {
          if (user.role) {
            const { name, description } = args.input;
            const categoryExit = await Category.findOne({ name });
            if (categoryExit) {
              throw new GraphQLError("Category name is already exist", {
                extensions: {
                  code: "CATEGORY_NAME_ALREADY_EXIST",
                },
              });
            } else {
              const newCategory = new Category({
                name,
                description,
              });
              const res = await newCategory.save();
              return {
                id: res.id,
                ...res._doc,
              };
            }
          } else {
            throw new GraphQLError("Admin is not Authenticated/Not found", {
              extensions: {
                code: "ADMIN_NOT_AUTHENTICATED",
              },
            });
          }
        } else {
          throw new GraphQLError("User is not authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
    updateCategory: async (_, args, context) => {
      // console.log(args);
      const { user } = context;
      try {
        if (user) {
          if (user.role) {
            const updateCategoryID = await Category.findById(args.id);
            if (!updateCategoryID) {
              throw new GraphQLError("Category is not found", {
                extensions: {
                  code: "CATEGORY_NOT_FOUND",
                },
              });
            } else {
              const updatedCategory = await Category.findByIdAndUpdate(
                args.id,
                args.input,
                { new: true }
              );
              return updatedCategory;
            }
          } else {
            throw new GraphQLError("Admin is not Authenticated/Not found", {
              extensions: {
                code: "ADMIN_NOT_AUTHENTICATED",
              },
            });
          }
        } else {
          throw new GraphQLError("User is not authenticated", {
            extensions: {
              code: "UNAUTHENTICATED",
              http: { status: 401 },
            },
          });
        }
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
    deleteCategory: async (_, args, context) => {
      const { user } = context;

      try {
        if (user.role) {
          const deletedCategory = await Category.findById(args.id);
          if (!deletedCategory) {
            throw new GraphQLError("Category ID is not found", {
              extensions: {
                code: "CATEGORY_ID_NOT_FOUND",
              },
            });
          } else {
            const deleted = await Category.findByIdAndDelete(args.id);
            return deleted;
          }
        } else {
          throw new GraphQLError("Admin is not Authenticated/Not found", {
            extensions: {
              code: "ADMIN_NOT_AUTHENTICATED",
            },
          });
        }
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
  },
};

export default categoryResolver;
