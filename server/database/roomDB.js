//@ts-check

import { Collection, ObjectId } from 'mongodb';

import * as GlobalTypes from '../../globalCustomTypes.js'

/**
 * @param {{ roomsCollection:Collection }} parameter
 * @returns import("../interface").returnMakeRoomDB
 */

export default function makeRoomDB({ roomsCollection }) {
  /**
   *
   * @returns GlobalTypes.RoomSchema[]
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

    return data
  }

  /**
   *
   * @param {{id: string}} parameter
   * @returns GlobalTypes.RoomSchema
   */
  async function findRoomById({ id }) {
    const query = { room_id: id };
    const option = { projection: { _id: 0 } };

    const documentCount = await roomsCollection.countDocuments(query)

    if (documentCount === 0) {
      throw new Error('The room does not exist');
    }

    const data = await roomsCollection.findOne(query, option);

    return data;
  }

  /**
   *
   * @param {{ id: string, updateProp: object }} parameter
   * @returns GlobalTypes.RoomSchema
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
   *
   * @param {{body: object}} parameter
   * @returns ObjectId
   */
  async function insertOneRoom({ body }) {
    const data = await roomsCollection.insertOne(body);

    if (data?.acknowledged) {
      return data.insertedId;
    }
  }

  /**
   *
   * @param {{ id: string }} parameter
   * @returns boolean
   */
  async function deleteOneRoom({ id }) {
    const query = { room_id: id };

    const countDocuments = await roomsCollection.countDocuments(query)

    if (countDocuments === 0) {
      throw new Error('This room does not exist');
    }

    if (countDocuments > 1) {
      throw new Error('This query is invalid');
    }

    await roomsCollection.deleteOne(query);
    return 'room was deleted'
  }

  return Object.freeze({
    findAll,
    findRoomById,
    updateOneRoom,
    insertOneRoom,
    deleteOneRoom,
  });
}
