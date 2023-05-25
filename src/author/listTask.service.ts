import { Prisma, PrismaClient } from "@prisma/client";
import { db } from "../utils/db.server";
import { pid } from "process";
import { deleteAllTask } from "./Task.service";
//List

export type listTask = {
    id: number;
    title: string;
    order: number;
};

export const Lists = async (): Promise<listTask[]> => {
    return db.listTask.findMany({
        select: {
            id: true,
            title: true,
            order: true,
        }
    })
}

export const getList = async (id: number): Promise<listTask | null> => {
    return db.listTask.findUnique({
        where: {
            id: id
        },
        select: {
            id: true,
            title: true,
            order: true,
        }
    })
}


export const createList = async (listTask: Omit<listTask, "id">): Promise<listTask> => {
    const { title, order } = listTask;
    return db.listTask.create({
        data: {
            title,
            order
        },
        select: {
            id: true,
            title: true,
            order: true,
        }
    })
}


export const updateList = async (listTask: Omit<listTask, "id">, id: number): Promise<listTask> => {
    
    const {
        title,
        order
    } = listTask;
    return db.listTask.update({
        where: {
            id,
        },
        data: {
            title,
            order
        },
        select: {
            id: true,
            title: true,
            order: true,
        }

    })

}

export const deleteList = async (id: number): Promise<void> => {
    const list = await getList(id)
    const changeOrder = list?.order

    const prisma = new PrismaClient();
    async function updateRecordWithCondition() {
        try {
            console.log("deletelist",id)
            await deleteAllTask(id);
            const updateRecords = await prisma.listTask.updateMany({
                where: {
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
    try{
        await db.listTask.delete({
            where: {
                id,
            }
        })
    }
    catch{
        
    }


}

export const moveList = async (position: number, id: number): Promise<string> => {
    const list = await getList(id)
    const changeOrder = list?.order
    
    if (!changeOrder) {
        
        return "Undefined Order";
    }
    
    const prisma = new PrismaClient();
    async function updateRecordWithCondition() :Promise<string>{
        console.log(changeOrder,position)
        if (changeOrder! > position) {
            
            try {
                const updateRecords = await prisma.listTask.updateMany({
                    where: {
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
                    title : list?.title!,
                    order : position
                }
                await updateList(change,id);
                return `Move List Id ${id} from ${changeOrder} to ${position} Already`;
            }
            catch (e){

            }
        }
        else if (changeOrder! < position){
            try {
                const updateRecords = await prisma.listTask.updateMany({
                    where: {
                        order: {
                            gte: changeOrder,
                            lte: position
                        },
                    },
                    data: {
                        order: { decrement: 1 }
                    }
                })
                const change = {
                    title : list?.title!,
                    order : position
                }
                await updateList(change,id);
                return `Move List Id ${id} from ${changeOrder} to ${position} Already`;
            }
            catch {

            }
        }
        return `List Id ${id} is Already`;

    };
    return await updateRecordWithCondition();

}