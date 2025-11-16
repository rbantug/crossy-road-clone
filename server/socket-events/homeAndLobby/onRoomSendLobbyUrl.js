//@ts-check

import * as Types from '../../customTypes.js';

/**
 *
 * @param {Types.onRoomSendLobbyUrl} parameters
 */

export default function onRoomSendLobbyUrl({ socket, createLobbyUrl, state }) {
  return () => {
    const newLobbyUrl = createLobbyUrl();
    state.lobbyUrl = newLobbyUrl;
    socket.emit('room:getLobbyUrl', newLobbyUrl);
  };
}
