import { Prisma,PrismaClient, Task } from "@prisma/client";
import {db} from "../utils/db.server";
import { listTask } from "../author/listTask.service";
import { isNull } from "util";
//List

type task ={
    id : number;
    description:string;
    duedate:string;
    order:number;
    listId:number;
};

export const getAllTasks = async(): Promise<Task[]> =>{
    return db.task.findMany()
}

export const getAllTaskInListId = async(listId:number): Promise<Task[]> =>{
    return db.task.findMany({
        where:{
            listId:listId
        }
    })
}

export const getTask = async(id:number): Promise<Task | null> =>{
    return db.task.findUnique({
        where:{
            id:id
        },
        select:{
            id:true,
            description:true,
            duedate:true,
            order:true,
            listId:true
        }
    })
}


export const createTask = async (task:Omit<Task,"id">): Promise<Task> =>{
    const{ description,order,duedate,listId}=task;
    return db.task.create({
        data:{
            description,
            order,
            duedate,
            listId
        },
        select:{
            id:true,
            description:true,
            duedate:true,
            order:true,
            listId:true
        }
    })
}


export const updateTask = async(task:Omit<Task,"id">,id:number): Promise<Task> => {
    const{
        description,
        order,
        duedate,
        listId
    } = task;
   const done = db.task.update({
        where:{
            id,
        },
        data:{
            description,
            order,
            duedate,
            listId
        },
        select:{
            id:true,
            description:true,
            duedate:true,
            order:true,
            listId:true
        }

    })
    return done

}

export const deleteTask = async (id: number): Promise<void> => {
    
    const task = await getTask(id)
    const listId = task?.listId
    const changeOrder = task?.order
    

    const prisma = new PrismaClient();
    async function updateRecordWithCondition() {
        try {
            const updateRecords = await prisma.task.updateMany({
                where: {
                    listId:listId,
                    order: {
                        gte: changeOrder,
                    },
                },
                data: {
                    order: { decrement: 1 }
                }
            })
        }
        catch {

        }
    }
    
    await updateRecordWithCondition();
    
    await db.task.delete({
        where: {
            id,
        }
    })
    
}

export const moveTask = async (position: number, id: number): Promise<string> => {
    const task = await getTask(id)
    const listId = task?.listId
    const changeOrder = task?.order
    console.log(changeOrder,position);

    
    const prisma = new PrismaClient();
    async function updateRecordWithCondition() : Promise<string>{
        if (!changeOrder) {
            try {
                const updateRecords = await prisma.task.updateMany({
                    where: {
                        listId:listId,
                        order: {
                            gte: changeOrder
                        },
                    },
                    data: {
                        order: { increment: 1 }
                    }
                })
                
                return `Move Task Id ${id} from ${changeOrder} to ${position} Already`
            }
            catch (e){
    
            }
            return "";
        }
        
        
        else if (changeOrder! > position) {
            
            try {
                const updateRecords = await prisma.task.updateMany({
                    where: {
                        listId:listId,
                        order: {
                            gte: position,
                            lt: changeOrder
                        },
                    },
                    data: {
                        order: { increment: 1 }
                    }
                })
                const change = {
                    description : task?.description!,
                    order : position,
                    duedate : task?.duedate!,
                    listId : task?.listId!
                }
                await updateTask(change,id);
                return `Move Task Id ${id} from ${changeOrder} to ${position} Already`
            }
            catch (e){

            }
        }
        else if (changeOrder! < position){
            try {
                const updateRecords = await prisma.task.updateMany({
                    where: {
                        order: {
                            gt : 0,
                            gte: changeOrder,
                            lte: position
                        },
                    },
                    data: {
                        order: { decrement: 1 }
                    }
                })
                const change = {
                    description : task?.description!,
                    order : position,
                    duedate : task?.duedate!,
                    listId : task?.listId!
                }
                await updateTask(change,id);
                return `Move Task Id ${id} from ${changeOrder} to ${position} Already`;
            }
            catch {

            }
        }
        return  `Task Id ${id} is order ${changeOrder} Already`;
        
    };
    return await updateRecordWithCondition();

}

//ChangeList
export const changeList = async (id: number,listId:number): Promise<void> => {
    const task = await getTask(id);
    const description = task?.description;
    const duedate = task?.duedate;
    
    const nTask = await createTask({
        description: description!,
        duedate: duedate!,
        order: 0,
        listId: listId
    });
    await moveTask(1,nTask.id);
    await deleteTask(id)


}



//delete All Task in listId
export const deleteAllTask = async (listId: number): Promise<void> => {
    const tasks = await getAllTaskInListId(listId)
    for(const i of tasks){
        console.log("deleteTask",i.id)
        await db.task.delete({
            where: {
                id:i.id,
            }
        })
    }

}