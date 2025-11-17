//@ts-check

import { Socket } from 'socket.io';

import identity from '../../utils/id';
import makeAddPlayer from './addPlayer.js';
import makeDeletePlayer from './deletePlayer.js';
import makeEditPlayer from './editPlayer.js';
import makeListPlayer from './listPlayer.js';


export default function makePlayerService({ playerDB }) {
  const addPlayer = makeAddPlayer({ playerDB });
  const deletePlayer = makeDeletePlayer({
    playerDB,
    roomIdIsValid: identity.roomIdIsValid,
  });
  const editPlayer = makeEditPlayer({
    playerDB,
    roomIdIsValid: identity.roomIdIsValid,
  });
  const listPlayer = makeListPlayer({
    playerDB,
    roomIdIsValid: identity.roomIdIsValid,
  });

  return Object.freeze({
    addPlayer,
    deletePlayer,
    editPlayer,
    listPlayer
  })
}
