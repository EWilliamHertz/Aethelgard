// party/server.ts
import type * as Party from "partykit/server";

export default class AethelgardServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    console.log(`Player connected: ${conn.id} to zone: ${this.room.id}`);
    
    // Broadcast to everyone else in the room that a new player entered
    this.room.broadcast(JSON.stringify({
      type: 'PLAYER_JOINED',
      id: conn.id
    }), [conn.id]);
  }

  onMessage(message: string, sender: Party.Connection) {
    // When a player moves or acts, broadcast it to the room
    const data = JSON.parse(message);
    
    if (data.type === 'MOVE') {
      this.room.broadcast(JSON.stringify({
        type: 'PLAYER_MOVED',
        id: sender.id,
        position: data.position
      }), [sender.id]);
    }
  }

  onClose(conn: Party.Connection) {
    this.room.broadcast(JSON.stringify({
      type: 'PLAYER_LEFT',
      id: conn.id
    }));
  }
}