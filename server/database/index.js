//@ts-check

import { MongoClient } from 'mongodb';

import makePlayerDB from './playerDB.js';
import makeRoomDB from './roomDB.js';

const uri = `mongodb+srv://rbantug:${process.env.MONGODB_PASS}@clusterthefirst.kwpfczv.mongodb.net/?appName=ClusterTheFirst`;

const client = new MongoClient(uri);

async function runDB() {
  try {
    await client.connect();
    console.log('You are now connected to the DB');
    const db = client.db('mainDB');
    const roomsCollection = db.collection('room');
    return roomsCollection;
  } catch (e) {
    //@ts-ignore
    console.error(e.message);
    client.close();
  }
}

//@ts-ignore
const roomsCollection = await runDB();

let roomDB
let playerDB;
if (roomsCollection) {
  roomDB = makeRoomDB({ roomsCollection });
  playerDB = makePlayerDB({ roomsCollection });
}

export { playerDB, roomDB }