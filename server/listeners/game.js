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
    io.to(state.roomId).emit('game:other-player-is-dead', socket.id);
  };
}

/**
 * 
 * @param {import('../customTypes.js').onGameSetParameters} parameters 
 */
function onGameSetParameters({ io, state }) {
  return ({ lives }) => {
    state.gameParameters.lives = lives
    io.to(state.roomId).emit('game:set-client-game-params', state.gameParameters)
  }
}

export {
  onGameAddRow,
  onGameCharacterMove,
  onGamePlayerHit,
  onGamePlayerIsDead,
  onGameSetParameters,
};
