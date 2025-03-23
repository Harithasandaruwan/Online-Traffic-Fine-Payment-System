
import Refund from "../models/Refund.model.js";




//item register
export const refund=async(req,res,next)=>{
    const {userId,ticket_nb,Name,refund_Amount,refund_reason
     
        }=req.body;

    //create auto id for orderid
    function idGen(userId){
        const randomString=Math.random().toString(36).substring(2,10);
        const id='ORD'+randomString+userId;
        return id;
    }
    const petId=idGen(userId)
   

    const newItem=new Refund({petId,userId,ticket_nb,Name,refund_Amount,refund_reason});
    try{
        await newItem.save();
        res.status(202).json({message:"Refund  successfully"});
    }catch(error){
        next(error);
    }
   
}

//get items by userid
export const refundgetOrdersByCustomerId = async (req, res, next) => {
    try{
       const customerId=req.params.id;
        const orders=await Refund.find({userId:customerId})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
};


//all items
export const refundallitems = async (req, res, next) => {
    try{
    
        const orders=await Refund.find({})
        res.json(orders)
    }catch(error){
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
};


export const deleterefund= async (req, res, next) => {
    let petId=req.params.id;
    console.log(petId)
    try {
        await Refund.findByIdAndDelete(petId);
        res.status(200).json('The Order has been deleted');
    } catch (error) {
        next(error);
    }
}

