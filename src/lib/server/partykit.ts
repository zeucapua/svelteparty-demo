import type {
  Party,
  PartyConnection,
  PartyConnectionContext,
  PartyServer,
  PartyWorker
} from "partykit/server";

export default class RnLiveParty implements PartyServer {

  // can access to Party's state within class with 'this.party'
  constructor(public party : Party) {}

  // runs when a connection JOINS the party
  onConnect(connection : PartyConnection, context : PartyConnectionContext) {
    // 'this.party.broadcast' sends a message from server to client
    this.party.broadcast(`[${this.party.id} (onConnect)] PARTY BROADCAST: ${connection.id} has joined room!`);

    // just to show (this.party state) connections on server console
    console.log("this.party.getConnections(): ");
    for (const c of this.party.getConnections()) {
      console.log(c.id);
    }
  }

  // runs when a connection SENDS a message using 'socket.send(msg)'
  onMessage(message : string, connection : PartyConnection) {
    this.party.broadcast(`[${this.party.id} (onMessage)] PARTY BROADCAST: ${message} [Connection ID: ${connection.id}]`); 
  }

  // runs when a connection LEAVES the party
  onClose(connection : PartyConnection) {
    this.party.broadcast(`[${this.party.id} (onClose)] PARTY BROADCAST: ${connection.id} has left(?)`) 
  }
}

RnLiveParty satisfies PartyWorker;
