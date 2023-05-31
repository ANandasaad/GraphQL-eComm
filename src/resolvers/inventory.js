import { GraphQLError } from "graphql";
import Inventory from "../model/inventory.js";

const inventoryResolvers = {
  Query: {
    getAllInventory: async () => {
      try {
        const inventory = await Inventory.find();
        if (!inventory) {
          throw new GraphQLError("Inventory is not found", {
            extensions: {
              code: "INVENTORY IS NOT FOUND",
            },
          });
        } else {
          console.log(inventory);
          return inventory;
        }
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
    getInventory: async (_, args, context) => {
      console.log(args);
      try {
        const inventoryId = await Inventory.findById(args.id);
        console.log("hit");
        console.log(inventoryId);
        if (!inventoryId) {
          throw new GraphQLError("Inventory not found", {
            extensions: {
              code: "INVENTORY_NOT_FOUND",
            },
          });
        } else {
          console.log(inventoryId);
          return inventoryId;
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
    createInventory: async (_, args, context) => {
      console.log(args);
      try {
        const { name, location } = args.input;
        const newInventory = new Inventory({
          name,
          location,
        });

        const res = await newInventory.save();
        return {
          id: res.id,
          ...res._doc,
        };
      } catch (error) {
        throw new GraphQLError(`Error - ${error}`, {
          extensions: {
            code: `ERROR -${error}`,
          },
        });
      }
    },
    updateInventory: async (_, args, context) => {
      try {
        const inventoryID = await Inventory.findById(args.id);
        if (!inventoryID) {
          throw new GraphQLError(`Inventory not found`, {
            extensions: {
              code: `INVENTORY_NOT_FOUND`,
            },
          });
        } else {
          const updatedInventory = await Inventory.findByIdAndUpdate(
            args.id,
            args.input,
            { new: true }
          );
          return updatedInventory;
        }
      } catch (error) {
        throw new GraphQLError(`Error - ${error}`, {
          extensions: {
            code: `ERROR - ${error}`,
          },
        });
      }
    },
    deleteInventory: async (_, args, context) => {
      try {
        const inventoryID = await Inventory.findById(args.id);
        if (!inventoryID) {
          throw new GraphQLError(`Inventory not found`, {
            extensions: {
              code: `INVENTORY_NOT_FOUND`,
            },
          });
        } else {
          const deletedInventory = await Inventory.findByIdAndDelete(args.id);
          return deletedInventory;
        }
      } catch (error) {
        throw new GraphQLError(`Error - ${error}`, {
          extensions: {
            code: `ERROR -${error}`,
          },
        });
      }
    },
  },
};

export default inventoryResolvers;
