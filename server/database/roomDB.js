//@ts-check

import { Collection, ObjectId } from 'mongodb';

import * as GlobalTypes from '../../globalCustomTypes.js';

/**
 * @param {{ roomsCollection:Collection }} parameter
 * @returns import("../interface").returnMakeRoomDB
 */

export default function makeRoomDB({ roomsCollection }) {
  /**
   *
   * @returns Promise<GlobalTypes.RoomSchema[]>
   */
  async function findAll({ query = {} }) {
    let data = [];
    const option = { projection: { _id: 0 } };

    const documentCount = await roomsCollection.countDocuments(query);
    const cursor = await roomsCollection.find(query, option);

    if (documentCount !== 0) {
      let i = 0;
      for await (let doc of cursor) {
        data[i] = doc;
        i++;
      }
    }

    return data;
  }

  /**
   *
   * @param {{id: string}} parameter
   * @returns Promise<GlobalTypes.RoomSchema>
   */
  async function findRoomById({ id }) {
    const query = { room_id: id };
    const option = { projection: { _id: 0 } };

    const documentCount = await roomsCollection.countDocuments(query);

    if (documentCount === 0) {
      throw new Error('The room does not exist');
    }

    const data = await roomsCollection.findOne(query, option);

    return data;
  }

  /**
   *
   * @param {{ id: string, updateProp: object }} parameter
   * @returns Promise<GlobalTypes.RoomSchema>
   */
  async function updateOneRoom({ id, updateProp }) {
    const query = { room_id: id };
    const updateDoc = { $set: updateProp };

    const documentCount = await roomsCollection.countDocuments(query);

    if (documentCount === 0) {
      throw new Error('The room does not exist');
    }

    const data = await roomsCollection.findOneAndUpdate(query, updateDoc, {
      upsert: false,
      returnDocument: 'after',
    });

    return data;
  }

  /**
   * This is for pushing new elements to the "map" property
   * @param {{ room_id: string, map: Record<string,object>[] }} parameters
   */
  async function updateRoomMap({ room_id, map }) {
    const query = { room_id };
    const option = {
      upsert: false,
      returnDocument: 'after',
      projection: { _id: 0 },
    };

    const documentCount = await roomsCollection.countDocuments(query);

    if (documentCount === 0) {
      throw new Error('The room does not exist');
    }

    const result = await roomsCollection.findOneAndUpdate(
      query,
      //@ts-ignore
      { $push: { map: { $each: map } } },
      option
    );

    return result;
  }

  /**
   * This is for pushing new elements to the "tileSet" property
   * @param { object } parameters
   * @param { string } parameters.room_id
   * @param { number } parameters.currentTile
   * @param { 'push' | 'delete' } parameters.operation 
   */
  async function updateRoomTileSet({ room_id, currentTile, operation }) {
    const query = { room_id };

    const documentCount = await roomsCollection.countDocuments(query);

    if (documentCount === 0) {
      throw new Error('The room does not exist');
    }

    let update = {}
    if (operation === 'push') {
      update = { $addToSet: { tileSet: currentTile } }
    }

    if (operation === 'delete') {
      update = { $pull: { tileSet: currentTile } }
    }

    const result = await roomsCollection.findOneAndUpdate(
      query,
      update,
      {
        upsert: false,
        returnDocument: 'after',
        projection: { _id: 0 },
      }
    );

    return result;
  }

  /**
   *
   * @param {{body: object}} parameter
   * @returns Promise<GlobalTypes.RoomSchema>
   */
  async function insertOneRoom({ body }) {
    const data = await roomsCollection.insertOne(body);

    const newRoomObjId = data.insertedId;
    return roomsCollection.findOne(
      { _id: newRoomObjId },
      { projection: { _id: 0 } }
    );
  }

  /**
   *
   * @param {{ id: string }} parameter
   * @returns string
   */
  async function deleteOneRoom({ id }) {
    const query = { room_id: id };

    const countDocuments = await roomsCollection.countDocuments(query);

    if (countDocuments === 0) {
      throw new Error('This room does not exist');
    }

    if (countDocuments > 1) {
      throw new Error('This query is invalid');
    }

    await roomsCollection.deleteOne(query);
    return 'room was deleted';
  }

  return Object.freeze({
    findAll,
    findRoomById,
    updateOneRoom,
    updateRoomMap,
    updateRoomTileSet,
    insertOneRoom,
    deleteOneRoom,
  });
}
