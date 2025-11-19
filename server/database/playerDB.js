//@ts-check

import { Collection } from 'mongodb';

import * as GlobalTypes from '../../globalCustomTypes.js'


/**
 *
 * @param {{ roomsCollection: Collection }} parameter
 * @returns import("../interface").returnMakePlayerDB
 */
export default function makePlayerDB({ roomsCollection }) {
  /**
   * 
   * @param {{ room_id: string }} parameter 
   */
  async function findAllPlayers({
    room_id
  }) {
    const query = { room_id };
    const option = { projection: { _id: 0 } };

    const documentCount = await roomsCollection.countDocuments(query);

    if (documentCount === 0) {
      throw new Error('The room does not exist');
    }

    const getRoom = await roomsCollection.findOne(query, option);

    return getRoom?.player
  }

  /**
   *
   * @param {{ socket_id: string, room_id: string }} parameters
   */
  async function findOnePlayer({ socket_id, room_id }) {
    const query = { room_id };
    const option = { projection: { _id: 0 } };

    const documentCount = await roomsCollection.countDocuments(query);

    if (documentCount === 0) {
      throw new Error('The room does not exist');
    }

    const getRoom = await roomsCollection.findOne(query, option);
    //@ts-ignore
    const playerIndex = getRoom?.player.findIndex((x) => x.id === socket_id);

    if (playerIndex === -1) {
      throw new Error('The player does not exist');
    }

    return getRoom?.player[playerIndex];
  }

  /**
   *
   * @param {{ socket_id: string, room_id: string, updateProp: Record<string, any> }} parameters
   */
  async function updateOnePlayer({ socket_id, room_id, updateProp }) {
    const query = { room_id };

    const documentCount = await roomsCollection.countDocuments(query);

    if (documentCount === 0) {
      throw new Error('The room does not exist');
    }

    // Converts updateProp key-value pairs into something mongoDB can understand when updating the embedded player object
    const keys = Object.keys(updateProp);

    /**
     * @type { Record<string, any> }
     */
    let propsToBeUpdated = {};

    for (let k of keys) {
      const key = `player.$.${k}`;
      const val = updateProp[k];
      propsToBeUpdated[key] = val;
    }

    const result = await roomsCollection.findOneAndUpdate(
      { room_id: room_id, 'player.id': socket_id },
      { $set: propsToBeUpdated },
      { projection: { _id: 0 }, upsert: false, returnDocument: 'after' }
    );

    const playerIndex = result?.player.findIndex(
      /**
       * @param { GlobalTypes.PlayerSchema } x
       */
      (x) => x.id === socket_id
    );

    if (playerIndex === -1) {
      throw new Error('The player does not exist');
    }

    return result?.player[playerIndex];
  }

  /**
   *
   * @param {{ room_id: string, body: object }} parameters
   */
  async function insertOnePlayer({ room_id, body }) {
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
      { $push: { player: body } },
      option
    );

    return result?.player[result?.player.length - 1];
  }
  /**
   *
   * @param {{ socket_id: string, room_id: string }} parameters
   */
  async function deleteOnePlayer({ socket_id, room_id }) {
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
      { $pull: { player: { id: socket_id } } },
      option
    );

    return result?.player.length;
  }

  return Object.freeze({
    findAllPlayers,
    findOnePlayer,
    updateOnePlayer,
    insertOnePlayer,
    deleteOnePlayer,
  });
}
