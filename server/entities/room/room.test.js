import { beforeEach, describe, expect, it } from 'vitest';

import makeFakeRoom from '../../__test__/fixtures/makeFakeRoom.js';
import makeFakePlayer from '../../__test__/fixtures/makeFakePlayer.js'
import makeRoom from './index.js';

describe('room', () => {
  describe('room_id', () => {
    it('should have a room id that is string', () => {
      const noRoomId = makeFakeRoom({ room_id: 1234 });
      expect(() => makeRoom(noRoomId)).toThrow(
        'ValidationError: "room_id" must be a string'
      );
    });

    it('should have a room id with that is not an empty string', () => {
      const invalidRoomId = makeFakeRoom({
        room_id: '',
      });
      expect(() => makeRoom(invalidRoomId)).toThrow(
        'ValidationError: "room_id" is not allowed to be empty'
      );
    });

    it('should have a room id that has 21 characters', () => {
      const invalidRoomId = makeFakeRoom({
        room_id: '12345',
      });
      expect(() => makeRoom(invalidRoomId)).toThrow(
        'ValidationError: "room_id" length must be 21 characters long'
      );
    });
  });

  describe('player', () => {
    it('should be an array', () => {
        const invalidPlayer = makeFakeRoom({ player: 123 })
        expect(() => makeRoom(invalidPlayer)).toThrow(
          'ValidationError: "player" must be an array'
        );
    })
    it('should be an array of players', () => {
      const invalidPlayer = makeFakeRoom({ player: [{
        id: '123'
      }] })
      expect(() => makeRoom(invalidPlayer)).toThrow(
        'ValidationError: "player[0].id" length must be 20 characters long'
      );
    })
  })

  describe('map', () => {
    it('should be an array', () => {
      const invalidMap = makeFakeRoom({ map: 123 });
      expect(() => makeRoom(invalidMap)).toThrow(
        'ValidationError: "map" must be an array'
      );
    });
  })

  describe('lobbyUrl', () => {
    it('should be a string', () => {
      const invalidLobbyUrl = makeFakeRoom({ lobbyUrl: 12345 })
      expect(() => makeRoom(invalidLobbyUrl)).toThrow(
        'ValidationError: "lobbyUrl" must be a string'
      );
    })

    it('should be have a length of 7', () => {
      const invalidLobbyUrl = makeFakeRoom({ lobbyUrl: 'abcdefgytsadf' })
      expect(() => makeRoom(invalidLobbyUrl)).toThrow(
        'ValidationError: "lobbyUrl" length must be 7 characters long'
      );
    })
  })

  describe('gameUrl', () => {
    it('should be a string', () => {
      const invalidGameUrl = makeFakeRoom({ gameUrl: 12345 });
      expect(() => makeRoom(invalidGameUrl)).toThrow(
        'ValidationError: "gameUrl" must be a string'
      );
    });

    it('should be have a length of 7', () => {
      const invalidGameUrl = makeFakeRoom({ gameUrl: 'abcdefgytsadf' });
      expect(() => makeRoom(invalidGameUrl)).toThrow(
        'ValidationError: "gameUrl" length must be 9 characters long'
      );
    });
  });

  describe('tileSet', () => {
    it('should be a Set', () => {
      const invalidTileSet = makeFakeRoom({ tileSet: {} })
      expect(() => makeRoom(invalidTileSet)).toThrow(
        'A Set is required'
      );
    })
  })

  describe('readyCount', () => {
    it('should be a number', () => {
      const invalidReadyCount = makeFakeRoom({ readyCount: 'hey' })
      expect(() => makeRoom(invalidReadyCount)).toThrow(
        'ValidationError: "readyCount" must be a number'
      );
    })

    it('should be an integer', () => {
      const invalidReadyCount = makeFakeRoom({ readyCount: 1.1 })
      expect(() => makeRoom(invalidReadyCount)).toThrow(
        'ValidationError: "readyCount" must be an integer'
      );
    })

    it('should be a positive number', () => {
      const invalidReadyCount = makeFakeRoom({ readyCount: -10 })
      expect(() => makeRoom(invalidReadyCount)).toThrow(
        'ValidationError: "readyCount" must be a positive number'
      );
    })
  })

  describe('activeAlivePlayers', () => {
    it('should be a string', () => {
      const invalidAAP = makeFakeRoom({ activeAlivePlayers: 1234 });
      expect(() => makeRoom(invalidAAP)).toThrow(
        'ValidationError: "activeAlivePlayers" must be a string'
      );
    })
  });

  describe('hasNewRoom', () => {
    it('should be a boolean', () => {
      const invalidHasNewRoom = makeFakeRoom({ hasNewRoom: 12345 })
      expect(() => makeRoom(invalidHasNewRoom)).toThrow(
        'ValidationError: "hasNewRoom" must be a boolean'
      );
    })
  });

  describe('newLobbyUrl', () => {
    it('should be a string', () => {
      const invalidNewLobbyUrl = makeFakeRoom({ newLobbyUrl: 12345 });
      expect(() => makeRoom(invalidNewLobbyUrl)).toThrow(
        'ValidationError: "newLobbyUrl" must be a string'
      );
    });

    it('should be have a length of 7', () => {
      const invalidNewLobbyUrl = makeFakeRoom({ newLobbyUrl: 'abcdefgytsadf' });
      expect(() => makeRoom(invalidNewLobbyUrl)).toThrow(
        'ValidationError: "newLobbyUrl" length must be 7 characters long'
      );
    });
  });

  describe('gameParameters', () => {
    let invalidGameParameters;

    beforeEach(() => {
      invalidGameParameters = makeFakeRoom();
    })

    it('should have gameParameters.duration', () => {
      delete invalidGameParameters.gameParameters.duration
      expect(() => makeRoom(invalidGameParameters)).toThrow(
        'ValidationError: "gameParameters.duration" is required'
      );
    })

    it('.duration should be a number', () => {
      invalidGameParameters.gameParameters.duration = 'abc'
      expect(() => makeRoom(invalidGameParameters)).toThrow(
        'ValidationError: "gameParameters.duration" must be a number'
      );
    })

    it('should have gameParameters.enableDuration', () => {
      delete invalidGameParameters.gameParameters.enableDuration;
      expect(() => makeRoom(invalidGameParameters)).toThrow(
        'ValidationError: "gameParameters.enableDuration" is required'
      );
    })

    it('.enableDuration should be a boolean', () => {
      invalidGameParameters.gameParameters.enableDuration = 'abc';
      expect(() => makeRoom(invalidGameParameters)).toThrow(
        'ValidationError: "gameParameters.enableDuration" must be a boolean'
      );
    });

    it('should have gameParameters.lives', () => {
      delete invalidGameParameters.gameParameters.lives;
      expect(() => makeRoom(invalidGameParameters)).toThrow(
        'ValidationError: "gameParameters.lives" is required'
      );
    })

    it('.lives should be a number', () => {
      invalidGameParameters.gameParameters.lives = 'abc';
      expect(() => makeRoom(invalidGameParameters)).toThrow(
        'ValidationError: "gameParameters.lives" must be a number'
      );
    });
  });
});
