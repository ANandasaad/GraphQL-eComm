import { GraphQLError } from "graphql";
import Category from "../model/category.js";

const categoryResolver = {
  Query: {
    getAllCategory: async () => {
      try {
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
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
    getCategory: async (_, args, context) => {
      try {
        const categoryID = await Category.findById(args.id);
        if (!categoryID) {
          throw new GraphQLError("Category is Id not found", {
            extensions: {
              code: "CATEGORY_ID_NOT_FOUND",
            },
          });
        } else {
          console.log(categoryID);
          return categoryID;
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
      console.log(args);
      try {
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
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
    updateCategory: async (_, args, context) => {
      console.log(args);
      try {
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
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
    deleteCategory: async (_, args, context) => {
      try {
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
