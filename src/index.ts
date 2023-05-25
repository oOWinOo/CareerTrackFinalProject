import * as dotenv from "dotenv"
import express from "express"
import cors from "cors"

import { listTaskRouter } from "./author/listTask.router";
import { TaskRouter } from "./author/Task.router"
import { connected } from "process";

dotenv.config();
if(!process.env.PORT){
    process.exit(1);

}

const PORT : number = parseInt(process.env.PORT as string,10);

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/list", listTaskRouter);
app.use("/api/task", TaskRouter);

app.listen(PORT,() =>{
    console.log(`Listening on PORT ${PORT}`);
    
});


