/**
 * Add new rows to the map
 * @param {import('../customTypes.js').onGameAddRow} parameters
 * @returns
 */
function onGameAddRow({ io, state, data, utilAddRow }) {
  return () => {
    const newRows = utilAddRow(data.room[state.roomIndex].map);

    io.to(state.roomId).emit('game:add-rows', newRows);
  };
}

/**
 *
 * @param {import('../customTypes.js').onGameCharacterMove} parameters
 * @returns
 */
function onGameCharacterMove({ io, socket, data, state }) {
  return (latestMove) => {
    const mqLength =
      data.room[state.roomIndex].player[state.clientIndex].movesQueue.push(
        latestMove
      );

    if (mqLength > 5) {
      data.room[state.roomIndex].player[state.clientIndex].movesQueue.shift();
    }

    io.to(state.roomId).emit('game:character-update-move', {
      clientId: socket.id,
      move: data.room[state.roomIndex].player[state.clientIndex].movesQueue[
        data.room[state.roomIndex].player[state.clientIndex].movesQueue.length -
          1
      ],
    });
  };
}

/**
 *
 * @param {import('../customTypes.js').onGamePlayerHit} parameters
 */
function onGamePlayerHit({ io, socket, state }) {
  return () => {
    io.to(state.roomId).emit('game:other-player-iframe', socket.id);
  };
}

/**
 *
 * @param {import('../customTypes.js').onGamePlayerIsDead} parameters
 */
function onGamePlayerIsDead({ io, socket, state, data }) {
  return () => {
    data.room[state.roomIndex].player[state.clientIndex].status = 'dead';
    data.room[state.roomIndex].activeAlivePlayers =
      data.room[state.roomIndex].activeAlivePlayers - 1;
    io.to(state.roomId).emit(
      'game:other-player-is-dead',
      socket.id,
      data.room[state.roomIndex].activeAlivePlayers
    );
  };
}

/**
 *
 * @param {import('../customTypes.js').onGameSetParameters} parameters
 */
function onGameSetParameters({ io, state, socket }) {
  return ({ lives, duration, enableDuration }) => {
    state.gameParameters.lives = lives;
    state.gameParameters.enableDuration = enableDuration;

    if (enableDuration) {
      state.gameParameters.duration = duration;
    }

    io.to(state.roomId).emit(
      'game:set-client-game-params',
      socket.id,
      state.gameParameters
    );
  };
}
/**
 *
 * @param {import('../customTypes.js').onGameSetScore} parameters
 */
function onGameSetScore({ io, socket, state, data }) {
  /**
   * @param { number } score
   */
  return (score) => {
    data.room[state.roomIndex].player[state.clientIndex].score = score;
    io.to(state.roomId).emit('game:set-score', score, socket.id);
  };
}

/**
 * This will run when the player exits from the popup window / result window
 * @param {import('../customTypes.js').onGameExit} parameters
 */

function onGameExit({ state, data }) {
  return () => {
    // TODO: if there are still players in the room, just remove the client. If the client is the remaining player, delete the room.

    data.room[state.roomIndex].player.splice(state.clientIndex, 1);

    if (data.room[state.roomIndex].player.length === 0) {
      data.room.splice(state.roomIndex, 1);
    }

    state.clientIndex = null;
    state.roomIndex = null;
    state.gameStart = false;
    state.roomId = null;
    state.lobbyUrl = null;
    state.gameUrl = null;
    state.gameParameters.duration = 5;
    state.gameParameters.lives = 3;
    state.gameParameters.enableDuration = true;
  };
}

/**
 *
 * @param {import('../customTypes.js').onGameRetry} parameters
 */
function onGameRetry({
  io,
  data,
  socket,
  state,
  createRoomId,
  createLobbyUrl,
  outputPlayerData,
  utilAddRow,
}) {
  return () => {
    io.to(state.roomId).emit('game:show-retryBtn-cd', socket.id)

    const oldRIndex = state.roomIndex;
    const oldCIndex = state.clientIndex;
    socket.leave(state.roomId);

    // delete player data from data.room.player

    data.room[oldRIndex].player.splice(oldCIndex, 1);

    // reset state to default values
    state.clientIndex = null;
    state.roomIndex = null;
    state.gameStart = false;
    state.roomId = null;
    state.lobbyUrl = null;
    state.gameUrl = null;
    state.gameParameters.duration = 5;
    state.gameParameters.lives = 3;
    state.gameParameters.enableDuration = true;

    // if data.room.hasNewRoom is false, create a new room
    if (data.room[oldRIndex].hasNewRoom === false) {
      const room_id = createRoomId();
      const lobbyUrl = createLobbyUrl();

      state.lobbyUrl = lobbyUrl;
      state.roomId = room_id;
      
      data.room[oldRIndex].newLobbyUrl = lobbyUrl;

      const roomData = {
        room_id,
        player: [],
        map: [],
        lobbyUrl: state.lobbyUrl,
        gameUrl: null,
        tileSet: new Set(),
        readyCount: 0,
        activeAlivePlayers: null,
        hasNewRoom: false,
        newLobbyUrl: null,
      };

      utilAddRow(roomData.map);

      const playerData = outputPlayerData(socket, roomData.tileSet);

      playerData.createdRoom = true;

      const cIndex = roomData.player.push(playerData);
      state.clientIndex = cIndex - 1;

      const rIndex = data.room.push(roomData);
      state.roomIndex = rIndex - 1;

      socket.join(room_id);

      data.room[oldRIndex].hasNewRoom = true;

      socket.emit('game:init', {
        room_id: roomData.room_id,
        player: roomData.player,
        map: roomData.map,
        lobbyUrl: roomData.lobbyUrl,
      });

      socket.emit('game:go-to-new-lobby', lobbyUrl);
    } else {
      // if data.room.hasNewRoom is true, emit the new lobbyUrl

      // retrieve newLobbyUrl from old room data
      const { newLobbyUrl } = data.room[oldRIndex];
      const newRoomIndex = data.room.findIndex(
        (x) => x.lobbyUrl === newLobbyUrl
      );

      // find new room and join it
      const { room_id } = data.room[newRoomIndex];
      socket.join(room_id);

      socket.emit('game:go-to-new-lobby', newLobbyUrl);
    }

    // if old room has no more player, delete it
    if (data.room[oldRIndex].player.length === 0) {
      data.room.splice(oldRIndex, 1);
    }
  };
}

export {
  onGameAddRow,
  onGameCharacterMove,
  onGameExit,
  onGamePlayerHit,
  onGamePlayerIsDead,
  onGameRetry,
  onGameSetParameters,
  onGameSetScore,
};
