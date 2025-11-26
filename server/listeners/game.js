//@ts-check

import * as Types from '../customTypes.js';
import onGameAddRow from '../socket-events/game/onGameAddRow.js';
import onGameCharacterMove from '../socket-events/game/onGameCharacterMove.js';
import onGameExit from '../socket-events/game/onGameExit.js';
import onGamePlayerHit from '../socket-events/game/onGamePlayerHit.js';
import onGamePlayerIsDead from '../socket-events/game/onGamePlayerIsDead.js';
import onGameRetry from '../socket-events/game/onGameRetry.js';
import onGameSetParameters from '../socket-events/game/onGameSetParameters.js';
import onGameSetScore from '../socket-events/game/onGameSetScore.js';

/**
 *
 * @param {Types.Listener} parameters
 */

export default function gameListener({
  io,
  socket,
  playerService,
  roomService,
  state,
  data,
  utilRemoveClient,
  utilAddRow,
  createRoomId,
  createGameUrl,
  createLobbyUrl,
  randomInt,
  outputPlayerData,
}) {
  socket.on(
    'game:request-new-rows',
    onGameAddRow({ io, state, data, utilAddRow })
  );

  socket.on(
    'game:character-move',
    onGameCharacterMove({ io, socket, data, state })
  );

  socket.on('game:player-hit', onGamePlayerHit({ io, socket }));

  socket.on(
    'game:player-is-dead',
    onGamePlayerIsDead({ io, socket, playerService, roomService })
  );

  socket.on(
    'game:set-game-parameters',
    onGameSetParameters({ io, state, socket, data })
  );

  socket.on('game:score', onGameSetScore({ io, state, socket, data }));

  socket.on('game:exit', onGameExit({ roomService, playerService, socket }));

  socket.on(
    'game:retry',
    onGameRetry({
      io,
      socket,
      createLobbyUrl,
      playerService,
      roomService,
      utilAddRow
    })
  );
}
