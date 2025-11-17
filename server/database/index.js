//@ts-check

import { createAdapter } from '@socket.io/mongo-adapter';
import { MongoClient } from 'mongodb';
import { Server } from 'socket.io';

import makePlayerDB from './playerDB.js';
import makeRoomDB from './roomDB.js';

/**
 *
 * @param {{io: Server}} param0
 */
export default async function roomDB({ io }) {
  const uri = `mongodb+srv://rbantug:${process.env.MONGODB_PASS}@clusterthefirst.kwpfczv.mongodb.net/?appName=ClusterTheFirst`;

  const client = new MongoClient(uri);

  async function runDB() {
    try {
      await client.connect();
      console.log('You are now connected to the DB');
      const db = client.db('mainDB');
      const roomsCollection = db.createCollection('room', {
        capped: true,
        size: 1e6,
      });
      return roomsCollection;
    } catch (e) {
      //@ts-ignore
      console.error(e.message);
      client.close();
    }
  }

  const roomsCollection = await runDB();

  let roomsDB;
  let playerDB;
  if (roomsCollection) {
    io.adapter(createAdapter(roomsCollection));
    roomsDB = makeRoomDB({ roomsCollection });
    playerDB = makePlayerDB({ roomsCollection })
  }
  return {roomsDB, playerDB};
}
