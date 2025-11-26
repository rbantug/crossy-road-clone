//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onRoomSendLobbyUrl} parameters
 */

export default function onRoomSendLobbyUrl({ socket, createLobbyUrl }) {
  return () => {
    const newLobbyUrl = createLobbyUrl();
    socket.emit('room:getLobbyUrl', newLobbyUrl);
  };
}
