import * as schema from "../db/schema.js";
import { Pool } from "pg";
import dotenv from "dotenv"
import { drizzle } from "drizzle-orm/singlestore";
dotenv.config();

declare global{
    var poolchache: Pool | undefined
    var dbchache:ReturnType <typeof drizzle > | undefined
}

const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
    max:20
})

if(!globalThis.poolchache){
    globalThis.poolchache = pool;
}
const db = globalThis.dbchache || drizzle(pool,{schema});


if(!globalThis.dbchache){
    globalThis.dbchache = db
}  

export default db;
