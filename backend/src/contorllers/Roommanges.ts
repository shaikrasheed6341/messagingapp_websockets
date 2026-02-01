import db from "../db/db.js";
import { rooms, users } from "../db/schema.js";
import { eq } from "drizzle-orm";

interface ActiveRoom {
  roomcode: string;
  password: string;
  users: string[];
  participant: Map<string, string>;
}

export class Roommanger {
  private room: Map<string, ActiveRoom>;

  private constructor() {
    this.room = new Map();
  }

  private static instance: Roommanger;

  static getInstance() {
    if (!Roommanger.instance) {
      Roommanger.instance = new Roommanger();
    }
    return Roommanger.instance;
  }

  async createroom(roomcode: string, roompassword: string, email: string) {
    if (!email || !roomcode || !roompassword) {
      throw new Error("Please enter all fields");
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    const [user] = existingUser;
    if (!user) {
      throw new Error("Email not registered");
    }

    const existingRoom = await db
      .select()
      .from(rooms)
      .where(eq(rooms.roomcode, roomcode));
    if (existingRoom.length > 0) {
      throw new Error("Room code already exists");
    }

    const inserted = await db
      .insert(rooms)
      .values({
        roomcode,
        roompassword,
        roomowner: user.id,
      })
      .returning();

    const [newroom] = inserted;
    if (!newroom) {
      throw new Error("Room creation failed");
    }

    const roomobj: ActiveRoom = {
      roomcode: newroom.roomcode,
      password: newroom.roompassword,
      users: [],
      participant: new Map(),
    };

    this.room.set(roomcode, roomobj);
  }
}
