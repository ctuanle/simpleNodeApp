import server from "./app";
import * as socketio from "socket.io";
import { socketHandler } from "./src/controllers/socket.controllers";
import { sequelize, sequeSync } from "./src/db/models";

// Synchronizing all models at once
(async () => {
    await sequeSync(sequelize);
})();

/**
 * Socket IO
 */

const io = new socketio.Server(server);

io.on("connection", (socket: socketio.Socket) => {
    socketHandler(io, socket);
});

/**
 * Server Activation
 */
server.listen(process.env.PORT, () => {
    console.log(`SERVER___Listening on port ${process.env.PORT}`);
});
