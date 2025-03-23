import express from 'express'
import {AddDiliver,DilivergetOrdersByCustomerId,Diliveryallitems,deleteDiliver ,updateItem,DilivergetItem} from '../controllers/dilivery.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router=express.Router();



router.post("/dilivery_store",AddDiliver)
router.get("/dilivery_user/:id",DilivergetOrdersByCustomerId)//for data fetch user id
router.get("/dilivery_users/items",Diliveryallitems)
router.delete("/deleteDiliver/:id",deleteDiliver)

router.get('/Dilivergetitem/:id', DilivergetItem);//for update fetch data
router.put("/updatediliver",verifyToken,updateItem)


export default router