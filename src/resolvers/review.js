
import { GraphQLError } from 'graphql';
import Review from '../model/reviews.js'
const reviewResolvers={
    Query:{
         getAllReview: async()=>{
            try{
                const review= await Review.find();
                if(!review)
                {
                    throw new GraphQLError('Review is not found for this product',{extensions:{
                        code:"REVIEW_NOT_FOUND_FOR_THE_PRODUCT"
                    }})
                }
                else{
                    console.log(review);
                    return review;
                }
               
            }catch(error){
                 throw new GraphQLError(`Error / ${error}`,{extensions:{
                    code:`ERROR / ${error}`
                 }})
            }
           

               
         },
         getReview: async(_,args,context)=>{

         }
    }
}


export default reviewResolvers;