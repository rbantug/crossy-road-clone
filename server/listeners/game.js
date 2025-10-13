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

export { onGameAddRow, onGameCharacterMove };
