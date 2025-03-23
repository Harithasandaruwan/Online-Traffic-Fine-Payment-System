import express from 'express'
import {AddFine,FinegetOrdersByCustomerId,Fineallitems,deleteFine } from '../controllers/fine.controller.js';


const router=express.Router();



router.post("/add_fine",AddFine)
router.get("/find_user/:id",FinegetOrdersByCustomerId)//for data fetch user id
router.get("/find_users/items",Fineallitems)
router.delete("/deletefind/:id",deleteFine)
export default router