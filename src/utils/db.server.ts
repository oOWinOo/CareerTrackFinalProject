import {Prisma, PrismaClient} from "@prisma/client";

let db : PrismaClient;
declare global {
    var __db : PrismaClient | undefined;
}
globalThis.__db

if(!globalThis.__db){
    globalThis.__db = new PrismaClient();

}

db = globalThis.__db;
export {db};
