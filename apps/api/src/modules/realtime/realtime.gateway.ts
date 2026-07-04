import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: { origin: true, credentials: true },
  namespace: "/ws",
})
export class RealtimeGateway {
  @WebSocketServer()
  server!: Server;

  @SubscribeMessage("join")
  handleJoin(@ConnectedSocket() socket: Socket, @MessageBody() payload: { tenantId?: string }) {
    const tenantId = payload?.tenantId?.trim();
    if (!tenantId) return;
    socket.join(`tenant:${tenantId}`);
    socket.emit("joined", { tenantId });
  }

  @SubscribeMessage("ping")
  handlePing(@ConnectedSocket() socket: Socket, @MessageBody() payload: unknown) {
    socket.emit("pong", { ok: true, payload });
  }
}

