import { GraphQLError } from "graphql";
import Inventory from "../model/inventory.js";
import Product from "../model/product.js"

const inventoryResolvers = {
  // Inventory:{
  //     product : async(parent)=>{
  //       console.log("hit");
  //       console.log(parent);
  //       console.log("end");
  //      const productId=parent.product;
  //     //  const name=Product.find({_id:{$in: productId}})
  //     //  console.log("name");
  //     //  console.log(name.schema.Schema);
  //      return Product.find({ _id: { $in: productId } });

  //     }
  // },  
  Query: {
   
    getAllInventory: async () => {
      try {
        const inventory = await Inventory.find().populate('product');
        // console.log(inventory[3].product[0].name);
        if (!inventory) {
          throw new GraphQLError("Inventory is not found", {
            extensions: {
              code: "INVENTORY IS NOT FOUND",
            },
          });
        } else {
          // console.log(inventory);
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
      // console.log(args);
      try {
        const inventoryId = await Inventory.findById(args.id).populate('product');
        // console.log("hit");
        // const productIds= inventoryId.product;
        // const products= await Product.find({_id:{$in:productIds}});
        // console.log(products);
        // console.log(productIds);
        
        // console.log("end");
        if (!inventoryId) {
          throw new GraphQLError("Inventory not found", {
            extensions: {
              code: "INVENTORY_NOT_FOUND",
            },
          });
        } else {
          // console.log(inventoryId);
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
      // console.log(args);
      // console.log(args.input.product);
      try {
        const { name, location,product } = args.input;
        const CreateProducts= await Promise.all(product.map( async(data)=>{
          console.log("hit")
          console.log(data);
          console.log("end");
         const {name,description,price,category}= data;
         const newProduct= new Product({
           name:name,
           description:description,
           price:price,
           category:category
         } )
        const res= await newProduct.save();
         return res;
       }));
        const newInventory = new Inventory({
          name,
          location,
          product:CreateProducts.map((product)=>product._id)
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
