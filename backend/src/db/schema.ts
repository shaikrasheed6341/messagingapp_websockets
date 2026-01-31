import { varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable, PgTable } from "drizzle-orm/pg-core";
 
export const User = pgTable("users",{
    id:uuid("id").primaryKey().defaultRandom(),
    name:varchar("name").notNull(),
    email:varchar("")

})