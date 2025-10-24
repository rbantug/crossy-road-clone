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
    data.room[state.roomIndex].player[state.clientIndex].status = 'dead'
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
    state.gameParameters.lives = lives
    state.gameParameters.enableDuration = enableDuration

    if (enableDuration) {
      state.gameParameters.duration = duration
    }
    
    io.to(state.roomId).emit('game:set-client-game-params', socket.id, state.gameParameters)
  }
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
    data.room[state.roomIndex].player[state.clientIndex].score = score
    io.to(state.roomId).emit('game:set-score', score, socket.id)
  }
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
  }
}

export {
  onGameAddRow,
  onGameCharacterMove,
  onGameExit,
  onGamePlayerHit,
  onGamePlayerIsDead,
  onGameSetParameters,
  onGameSetScore,
};
