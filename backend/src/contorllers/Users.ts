import { WebSocket } from "ws";
import { RoomManager } from "./Roommanges.js";
import { finduserbyemail } from "../controller/user.js";

export class User {
    private ws: WebSocket;
    private userEmail: string | null = null; // Store the email/username
    private username: string | null = null;
    private roomCode: string | null = null;

    constructor(ws: WebSocket) {
        this.ws = ws;
        this.initHandlers();
    }

    private initHandlers() {
        this.ws.on("message", (data) => {
            const rawMessage = data.toString();
            try {
                const message = JSON.parse(rawMessage);
                console.log("Received message:", message);
                this.handleMessage(message);
            } catch (error) {
                console.warn(`Received non-JSON message: ${rawMessage}`);
            }
        });

        this.ws.on("close", () => {
            // Handle disconnect (leave room etc)
            console.log("User disconnected");
        });
    }

    public send(message: any) {
        this.ws.send(JSON.stringify(message));
    }

    private handleMessage(message: any) {
        const { type, payload } = message;

        switch (type) {
            case "join_room":
                this.handleJoinRoom(payload);
                break;
            case "send_message":
                this.handleBroadcast(payload);
                break;
            case "create_room":
                this.handleCreateRoom(payload);
                break;
            default:
                console.warn("Unknown message type:", type);
        }
    }

    private handleBroadcast(payload: { message: string }) {
        if (!this.roomCode || !this.username) {
            this.send({ type: "error", message: "You are not in a room" });
            return;
        }

        try {
            // Pass userEmail to broadcast
            RoomManager.getInstance().broadcast(this.roomCode, this.username, this.userEmail || "Unknown", payload.message);
        } catch (error) {
            console.error("Broadcast failed:", error);
        }
    }

    private async handleJoinRoom(payload: { roomCode: string; password?: string; email: string }) {
        const { roomCode, password, email } = payload;

        console.log(`User ${email} attempting to join room ${roomCode} with password ${password}`);

        try {
            const userId = await finduserbyemail(email);
            if (!userId) {
                this.send({ type: "error", message: "User not found" });
                return;
            }

            const roomManager = RoomManager.getInstance();
            this.username = userId;
            this.userEmail = email; // Store the email
            const room = await roomManager.joinRoom(roomCode, this.username, password, this);

            this.roomCode = roomCode;

            console.log(`User ${email} (ID: ${this.username}) joined room ${roomCode} successfully`);

            // Notify others so they can call "me"
            RoomManager.getInstance().broadcastEvent(roomCode, "user_joined", {
                userId: this.username,
                email: email
            }, this.username);

            this.send({
                type: "room_joined",
                payload: {
                    roomCode: room.roomCode,
                    users: room.users // Note: This currently sends IDs. To send emails, RoomManager needs to track user objects or emails in the users array.
                }
            });

        } catch (error: any) {
            console.error(`Join room failed for ${email}:`, error.message);
            this.send({
                type: "error",
                message: error.message
            });
        }
    }

    private async handleCreateRoom(payload: { roomCode: string; password?: string; email: string }) {
        const { roomCode, password, email } = payload;

        console.log(`User ${email} attempting to create room ${roomCode} with password ${password}`);


        if (!password) {
            this.send({ type: "error", message: "Password is required to create a room" });
            return;
        }

        try {
            const userId = await finduserbyemail(email);
            if (!userId) {
                this.send({ type: "error", message: "User not found" });
                return;
            }

            const roomManager = RoomManager.getInstance();
            this.username = userId;
            this.userEmail = email; // Store the email
            const room = await roomManager.createRoom(this.username, roomCode, password);

            this.roomCode = roomCode;

            console.log(`User ${email} (ID: ${this.username}) created room ${roomCode} successfully`);

            this.send({
                type: "room_created",
                payload: {
                    roomCode: room.roomCode,
                    users: room.users
                }
            });

        } catch (error: any) {
            console.error(`Create room failed for ${email}:`, error.message);
            this.send({
                type: "error",
                message: error.message
            });
        }
    }
}