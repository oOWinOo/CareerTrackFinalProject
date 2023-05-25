import express from "express"
import type { Request,Response } from "express";
import {body,validationResult} from "express-validator";

import * as TaskService from "./Task.service";
import { request } from "http";

export const TaskRouter = express.Router();
//GET All
TaskRouter.get("/",async(request:Request,response:Response)=>{
    try{
        const Tasks = await TaskService.getAllTasks()
        return response.status(200).json(Tasks);
    }
    catch(error :any){
        return response.status(500).json(error.message);
    }
})
//GET by listId




//GET by id
TaskRouter.get("/:id",async(request:Request,response:Response)=>{
    try{
        const id:number = parseInt(request.params.id,10);
        const Task = await TaskService.getTask(id);
        if(Task){
            return response.status(200).json(Task);
        }
        return response.status(404).json("Task couldnt found")

    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})

//Create
//Param : 
TaskRouter.post("/",body("description").isString(),body("order").isInt(),body("duedate").isDate(),body("listId").isInt(),async(request:Request,response:Response) =>{
    const error = validationResult(request);
    if(!error.isEmpty){
        return response.status(400).json({errors:error.array()})
    }
    try{
        const Task = request.body
        const newTask = await TaskService.createTask(Task)
        return response.status(200).json(newTask)
    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})


//Update
TaskRouter.put("/:id",body("description").isString(),body("order").isInt(),body("duedate").isDate(),body("listId").isInt(),async(request:Request,response:Response) =>{
    
    const error = validationResult(request);
    if(!error.isEmpty){
        return response.status(400).json({errors:error.array()})
    }
    const id:number = parseInt(request.params.id,10);
    try{
        const Task = request.body
        const updateTask = await TaskService.updateTask(Task,id)
        return response.status(200).json(updateTask)
    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})


//Delete
TaskRouter.delete("/:id", async(request:Request, response:Response)=>{
    
    const id:number = parseInt(request.params.id,10);
    try{
        await TaskService.deleteTask(id);
        return response.status(200).json(`The Task id = ${id} has been deleted`)
    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})



//Move
TaskRouter.put("/move/:id",body("position").isInt(),async(request:Request,response:Response) =>{
    const error = validationResult(request);
    if(!error.isEmpty){
        return response.status(400).json({errors:error.array()})
    }
    const id:number = parseInt(request.params.id,10);
    try{
        const Task = request.body
        const updateTask = await TaskService.moveTask(Task.position,id)
        return response.status(200).json(updateTask)
    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})


TaskRouter.put("/change/:id",body("listId").isInt(),async(request:Request,response:Response) =>{
    const error = validationResult(request);
    if(!error.isEmpty){
        return response.status(400).json({errors:error.array()})
    }
    const id:number = parseInt(request.params.id,10);
    try{
        const Task = request.body
        const updateTask = await TaskService.changeList(id,Task.listId)
        return response.status(200).json(updateTask)
    }
    catch(error:any){
        return response.status(500).json(error.message);
    }
})