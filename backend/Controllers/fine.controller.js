
import Fine from "../models/fine.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'


export const AddFine=async(req,res,next)=>{
    const {userId,fine_id,amount,status,issue_date,due_date,description
        }=req.body;

    //create auto id for orderid
    function idGen(userId){
        const randomString=Math.random().toString(36).substring(2,10);
        const id='ORD'+randomString+userId;
        return id;
    }
    const petId=idGen(userId)
   

    const newItem=new Fine({petId,userId,fine_id,amount,status,issue_date,due_date,description});
    try{
        await newItem.save();
        res.status(202).json({message:"item created successfully"});
    }catch(error){
        next(error);
    }
   
}


export const FinegetOrdersByCustomerId = async (req, res, next) => {
    try{
       const customerId=req.params.id;
        const orders=await Fine.find({userId:customerId})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
};


export const Fineallitems = async (req, res, next) => {
    try{
    
        const orders=await Fine.find({})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
};

export const deleteFine = async (req, res, next) => {
    let petId=req.params.id;
    console.log(petId)
    try {
        await Fine.findByIdAndDelete(petId);
        res.status(200).json('The Order has been deleted');
    } catch (error) {
        next(error);
    }
}

