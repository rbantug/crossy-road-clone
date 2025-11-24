//@ts-check

import { randomInt } from 'node:crypto'

import { Socket } from 'socket.io';

import { playerDB, roomDB } from '../../database/index.js';
import identity from '../../utils/id.js';
import makeAddPlayer from './addPlayer.js';
import makeDeletePlayer from './deletePlayer.js';
import makeEditAllPlayers from './editAllPlayers.js';
import makeEditPlayer from './editPlayer.js';
import makeListAllPlayers from './listAllPlayers.js'
import makeListPlayer from './listPlayer.js';

const addPlayer = makeAddPlayer({ playerDB, roomDB, randomInt });
const deletePlayer = makeDeletePlayer({
  playerDB,
  roomIdIsValid: identity.roomIdIsValid,
});
const editPlayer = makeEditPlayer({
  playerDB,
  roomIdIsValid: identity.roomIdIsValid,
});
const editAllPlayers = makeEditAllPlayers({
  playerDB,
  roomIdIsValid: identity.roomIdIsValid,
});
const listPlayer = makeListPlayer({
  playerDB,
  roomIdIsValid: identity.roomIdIsValid,
});
const listAllPlayers = makeListAllPlayers({ playerDB, roomIdIsValid: identity.roomIdIsValid })

const playerService = Object.freeze({
  addPlayer,
  deletePlayer,
  editPlayer,
  editAllPlayers,
  listPlayer,
  listAllPlayers
});

export default playerService;
