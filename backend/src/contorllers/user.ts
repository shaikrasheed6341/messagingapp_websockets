import db from "../db/db.js"

import {type Request,type Response } from "express"; // ✅ correct
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
interface User{
    name:String,
    email:string,
    password:String
}
export  const createuser = async (req:Request,res:Response)=>{
   try{
    const{name,email,password} = req.body;

    if(!name || !email|| !password){
        return res.status(200).json({message:"plz enter all fildses"})
    }
   
      const existemail = await db.select().from(users).where(eq(users.email,email))
      if(existemail){
        return res.status(403).json({message:"you already exist in db"})
            
      }
     const creatinguser = await db.insert(users).values({
       name:  name,
        email:email,
        password:password
     })
        
       return res.json({message:"is user tcreated sucefuuly "})
    }catch(e){
        console.log("error")
    }
}

