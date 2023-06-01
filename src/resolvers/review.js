import User from "../model/user.js";
import { GraphQLError } from "graphql";
import Review from "../model/reviews.js";
import Product from "../model/product.js";
const reviewResolvers = {
  // Its not compulsory that we have use this approach for fetch the data from user . we can also use populate
  // Review:{
  //     userId: async(parent)=>{
  //         console.log("hit");
  //         console.log(parent);
  //         try {
  //             const user= await User.findById(parent.userId).populate('userId');
  //             if(!user)
  //             {
  //                 throw new GraphQLError('User not found',{extensions:{
  //                     code:"USER_NOT_FOUND"
  //                 }})
  //             }
  //             else
  //             {
  //                 return user.userId;
  //             }
  //         } catch (error) {
  //             throw new GraphQLError(`Error ${error}`,{extensions:{
  //                 code:`ERROR_${error}`
  //             }})
  //         }

  //     }

  // },
  Query: {
    getAllReview: async () => {
      try {
        const review = await Review.find()
          .populate("userId")
          .populate("productId");
        if (!review) {
          throw new GraphQLError("Review is not found for this product", {
            extensions: {
              code: "REVIEW_NOT_FOUND_FOR_THE_PRODUCT",
            },
          });
        } else {
          console.log(review);
          return review;
        }
      } catch (error) {
        throw new GraphQLError(`Error / ${error}`, {
          extensions: {
            code: `ERROR / ${error}`,
          },
        });
      }
    },
    getReview: async (_, args, context) => {
      console.log(args);
      try {
        const reviewId = await Review.findById(args.id)
          .populate("userId")
          .populate("productId");
        if (!reviewId) {
          throw new GraphQLError("Review not found", {
            extensions: {
              code: "REVIEW_NOT_FOUND",
            },
          });
        } else {
          console.log(reviewId);
          return reviewId;
        }
      } catch (error) {
        throw new GraphQLError(`Error Found \ ${error}`, {
          extensions: {
            code: `ERROR_FOUND \ ${error}`,
          },
        });
      }
    },
  },
  Mutation: {
    createReview: async (_, args, context) => {
      // console.log(args);
      try {
        const { userId, productId, rating, comment } = args.input;
        const user = await User.findById(userId);
        if (!user) {
          throw new GraphQLError(`User is not found`, {
            extensions: {
              code: `USER_NOT_FOUND`,
            },
          });
        }
        const product = await Product.findById(productId);
        if (!product) {
          throw new GraphQLError(`Product is not found`, {
            extensions: {
              code: `PRODUCT_NOT_FOUND`,
            },
          });
        }

        const newReview = new Review({
          userId,
          productId,
          rating,
          comment,
        });
        const res = await newReview.save();
        return {
          id: res.id,
          ...res._doc,
        };
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
    updateReview: async (_, args, context) => {
      console.log("hit");
      console.log(args);
      console.log("end");
      try {
        const reviewId = await Review.findById(args.id);

        if (!reviewId) {
          throw new GraphQLError("Review Detail is not Found", {
            extensions: {
              code: "REVIEW_DETAILS_NOT_FOUND",
            },
          });
        } else {
          const updatedReview = await Review.findByIdAndUpdate(
            args.id,
            args.input,
            { new: true }
          );
          return updatedReview;
        }
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR \ ${error}`,
          },
        });
      }
    },
    deleteReview: async(_,args,context)=>{
           try {
             const reviewId= await Review.findById(args.id);
             if(!reviewId)
             {
                throw new GraphQLError("Review Detail is not Found", {
                    extensions: {
                      code: "REVIEW_DETAILS_NOT_FOUND",
                    },
                  });
             }
             else{
                const deletedReview= await Review.findByIdAndDelete(args.id).populate('productId').populate('userId');
                return deletedReview;
             }
           } catch (error) {
            throw new GraphQLError(`Error ${error}`, {
                extensions: {
                  code: `ERROR \ ${error}`,
                },
              });
           }
    }
  },
};

export default reviewResolvers;
