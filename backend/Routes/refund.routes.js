import express from 'express'
import {refund,refundgetOrdersByCustomerId,refundallitems,deleterefund } from '../controllers/refund.controller.js';


const router=express.Router();



router.post("/refund_store",refund)
router.get("/refund_user/:id",refundgetOrdersByCustomerId)//for data fetch user id
router.get("/refund_users/items",refundallitems)
router.delete("/deleterefund/:id",deleterefund)
export default router