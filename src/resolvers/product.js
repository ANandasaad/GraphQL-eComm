import { GraphQLError } from "graphql";
import Product from "../model/product.js";
const productResolvers = {
  Query: {
    getAllProduct: async () => {
      const res = await Product.find();
    //   console.log(res);
      return res;
    },
    getProduct: async (_, args, context) => {
    //   console.log(args.id);
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
    },
  },
  Mutation :{
    createProduct: async(_,args,context)=>{
        console.log(args);
        const newProduct= new Product({
            name:args.input.name,
            description:args.input.description,
            price:args.input.price,
            category:args.input.category

        })

        const res= await newProduct.save();
        return {
            id:res.id,
            ...res._doc
        }
    },
    updateProduct: async(_,args,context)=>{
        console.log(args);
       const productID= await Product.findById(args.id);
       if(!productID)
       {
        throw new GraphQLError("Product Not Found",{extensions:{
            code:"PRODUCT NOT FOUND"
        }})
       }
       else{
        const updatedProduct= await Product.findByIdAndUpdate(args.id,args.input,{new:true});
        console.log(updatedProduct);
        return updatedProduct;
       }

    },
    deleteProduct: async(_,args,context)=>{
        console.log(args);
        const productID= await Product.findById(args.id);
        if(!productID)
        {
            throw new GraphQLError("Product id is not Found",{extensions:{
                code:"PRODUCT ID IS NOT FOUND"
            }})
        }
        else{
             const deletedProduct= await Product.findByIdAndDelete(args.id);
              return deletedProduct;
        }
    }


  }
};


export default productResolvers;