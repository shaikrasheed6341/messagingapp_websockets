import { primaryKey } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { varchar } from "drizzle-orm/pg-core";
import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
 
export const users = pgTable("users",{
    id:uuid("id").primaryKey().defaultRandom(),
    name:varchar("name").notNull(),
    email:varchar("email").unique().notNull(),
    password:varchar("password").notNull(),
    createdAt:timestamp("createAt").defaultNow()
})
 export const rooms = pgTable("rooms",{
    id:uuid("id").primaryKey().defaultRandom(),
    roomowner:uuid("roomowner")
    .notNull()
    .references(() => users.id ),
    roomcode:varchar("roomcode",{length:4}).notNull().unique(),
    roompassword:varchar("roompassword").notNull(),
    createdAt:timestamp("createAt").defaultNow()
 })

 export const roomparticipants = pgTable("roomparticipants",{
      roomid : uuid("roomid")
      .notNull()
      .references(()=> rooms.id),
      userid:uuid("userid")
      .notNull()
      .references(()=> users.id)
 },
    (table)=>({
        pk:primaryKey({columns:[table.roomid,table.userid]})
    })
 )

 export const message = pgTable("message",{
    roomid:uuid("roomid")
    .notNull()
    .references(()=>rooms.id),

    sederid:uuid("senderid")
    .notNull()
    .references(()=> users.id),
    constext:text().notNull(),
    createdAt:timestamp("createdAt").defaultNow()
 })