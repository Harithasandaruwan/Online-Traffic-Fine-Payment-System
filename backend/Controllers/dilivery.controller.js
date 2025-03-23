
import Dilivery from "../models/Dilivery.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'


export const AddDiliver=async(req,res,next)=>{
    const {userId,dilivery_id,fine_id,delivery_type,tracking_id,delivery_status,expected_delivery_date,
     
        }=req.body;

    //create auto id for orderid
    function idGen(userId){
        const randomString=Math.random().toString(36).substring(2,10);
        const id='ORD'+randomString+userId;
        return id;
    }
    const petId=idGen(userId)
   

    const newItem=new Dilivery({petId,userId,dilivery_id,fine_id,delivery_type,tracking_id,delivery_status,expected_delivery_date});
    try{
        await newItem.save();
        res.status(202).json({message:"item created successfully"});
    }catch(error){
        next(error);
    }
   
}


export const DilivergetOrdersByCustomerId = async (req, res, next) => {
    try{
       const customerId=req.params.id;
        const orders=await Dilivery.find({userId:customerId})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
};


export const Diliveryallitems = async (req, res, next) => {
    try{
    
        const orders=await Dilivery.find({})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
};

export const deleteDiliver = async (req, res, next) => {
    let petId=req.params.id;
    console.log(petId)
    try {
        await Dilivery.findByIdAndDelete(petId);
        res.status(200).json('The Order has been deleted');
    } catch (error) {
        next(error);
    }
}


export const DilivergetItem= async (req, res) => {
    const id = req.params.id;

    try {
        const discount = await Dilivery.findById(id);

        if (!discount) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        res.send({ success: true, message: "User fetched successfully", data: discount });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
};


export const updateItem =async(req,res)=>{
    const {id,...rest}=req.body
    const data=await Dilivery.updateOne({_id:id},rest)
    res.send({success:true,message:"updated successfuly",data:data})
}


