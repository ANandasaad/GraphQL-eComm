import jwt from "jsonwebtoken";

const adminTokenGenerator= (role,username,email,passwords)=>{

    return jwt.sign(
        { role:role,username: username, email:email, password:passwords },
        process.env.SECRET__KEY,
       
      );
}

export default adminTokenGenerator;