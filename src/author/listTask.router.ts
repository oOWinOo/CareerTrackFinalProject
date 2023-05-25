import express from "express"
import type { Request,Response } from "express";
import {body,validationResult} from "express-validator";

import * as listTaskService from "./listTask.service";
import { request } from "http";

export const listTaskRouter = express.Router();

listTaskRouter.get("/",async(request:Request,response:Response)=>{
    try{
        const listTasks = await listTaskService.Lists()
        return response.status(200).json(listTasks);
    }
    catch(error :any){
        return response.status(500).json(error.message);
    }
})

//GET by id
listTaskRouter.get("/:id",async(request:Request,response:Response)=>{
    try{
        const id:number = parseInt(request.params.id,10);
        const listTask = await listTaskService.getList(id);
        if(listTask){
            return response.status(200).json(listTask);
        }
        return response.status(404).json("listTask couldnt found")

    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})

//Create
//Param : 
listTaskRouter.post("/",body("title").isString(),body("order").isInt(),async(request:Request,response:Response) =>{
    const error = validationResult(request);
    if(!error.isEmpty){
        return response.status(400).json({errors:error.array()})
    }
    try{
        const listTask = request.body
        const newlistTask = await listTaskService.createList(listTask)
        return response.status(200).json(newlistTask)
    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})


//Update
listTaskRouter.put("/:id",body("title").isString(),body("order").isInt(),async(request:Request,response:Response) =>{
    
    const error = validationResult(request);
    if(!error.isEmpty){
        return response.status(400).json({errors:error.array()})
    }
    const id:number = parseInt(request.params.id,10);
    try{
        const listTask = request.body
        const updatelistTask = await listTaskService.updateList(listTask,id)
        return response.status(200).json(updatelistTask)
    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})


//Delete
listTaskRouter.delete("/:id", async(request:Request, response:Response)=>{
    
    const id:number = parseInt(request.params.id,10);
    try{
        await listTaskService.deleteList(id);
        return response.status(200).json(`The listTask id = ${id} has been deleted`)
    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})



//Move
listTaskRouter.put("/move/:id",body("position").isInt(),async(request:Request,response:Response) =>{
    console.log("Move")
    const error = validationResult(request);
    if(!error.isEmpty){
        return response.status(400).json({errors:error.array()})
    }
    const id:number = parseInt(request.params.id,10);
    try{
        const listTask = request.body
        const updatelistTask = await listTaskService.moveList(listTask.position,id)
        return response.status(200).json(updatelistTask)
    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})