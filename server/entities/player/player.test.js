import { describe, expect, it } from 'vitest';

import makeFakePlayer from '../../__test__/fixtures/makeFakePlayer';
import makePlayer from '.';

describe('player', () => {
  describe('id', () => {
    it('should be string with 20 characters', () => {
      const idIsNotString = makeFakePlayer({ id: 1234 });
      const idIsNot20Char = makeFakePlayer({ id: '1234567' });

      expect(() => makePlayer(idIsNotString)).toThrow(
        'ValidationError: "id" must be a string'
      );
      expect(() => makePlayer(idIsNot20Char)).toThrow(
        'ValidationError: "id" length must be 20 characters long'
      );
    });
  });

  describe('position', () => {
    it('should be an object with only 2 properties: currentRow and currentTile', () => {
      const invalidPosition = makeFakePlayer({
        position: {
          currentRow: 1,
          currentTile: 2,
          fake: 3,
        },
      });
      expect(() => makePlayer(invalidPosition)).toThrow(
        'ValidationError: "position.fake" is not allowed'
      );
    });

    it('should have the properties currentRow and currentTile that are numbers and integers', () => {
      const currentRowNotNumber = makeFakePlayer({
        position: {
          currentRow: 'a',
          currentTile: 1,
        },
      });
      const currentTileNotNumber = makeFakePlayer({
        position: {
          currentRow: 1,
          currentTile: 'a',
        },
      });
      const currentRowNotInteger = makeFakePlayer({
        position: {
          currentRow: 1.1,
          currentTile: 1,
        },
      });
      const currentTileNotInteger = makeFakePlayer({
        position: {
          currentRow: 1,
          currentTile: 1.1,
        },
      });

      expect(() => makePlayer(currentRowNotNumber)).toThrow(
        'ValidationError: "position.currentRow" must be a number'
      );
      expect(() => makePlayer(currentTileNotNumber)).toThrow(
        'ValidationError: "position.currentTile" must be a number'
      );
      expect(() => makePlayer(currentRowNotInteger)).toThrow(
        'ValidationError: "position.currentRow" must be an integer'
      );
      expect(() => makePlayer(currentTileNotInteger)).toThrow(
        'ValidationError: "position.currentTile" must be an integer'
      );
    });
  });

  describe('score', () => {
    it('should be a positive number and an integer', () => {
      const notNumber = makeFakePlayer({ score: 'assef' });
      const notInteger = makeFakePlayer({ score: 1.1 });
      const notPositive = makeFakePlayer({ score: -1 });

      expect(() => makePlayer(notNumber)).toThrow(
        'ValidationError: "score" must be a number'
      );
      expect(() => makePlayer(notInteger)).toThrow(
        'ValidationError: "score" must be an integer'
      );
      expect(() => makePlayer(notPositive)).toThrow(
        'ValidationError: "score" must be a positive number'
      );
    });
  });

  describe('movesQueue', () => {
    it('should be an array of strings', () => {
      const notArray = makeFakePlayer({ movesQueue: 'hey' })
      const notArrayOfStrings = makeFakePlayer({ movesQueue: ['1', 2] })

      expect(() => makePlayer(notArray)).toThrow(
        'ValidationError: "movesQueue" must be an array'
      );
      expect(() => makePlayer(notArrayOfStrings)).toThrow(
        'ValidationError: "movesQueue[1]" must be a string'
      );
    })
  });

  describe('ready', () => {
    it('should be a boolean', () => {
      const notBoolean = makeFakePlayer({ ready: 'hey' })
      expect(() => makePlayer(notBoolean)).toThrow(
        'ValidationError: "ready" must be a boolean'
      );
    })
  })

  describe('createdRoom', () => {
    it('should be a boolean', () => {
      const notBoolean = makeFakePlayer({ createdRoom: 'hey' });
      expect(() => makePlayer(notBoolean)).toThrow(
        'ValidationError: "createdRoom" must be a boolean'
      );
    });
  });

  describe('status', () => {
    it('should be a string', () => {
      const notString = makeFakePlayer({ status: 123 })
      expect(() => makePlayer(notString)).toThrow(
        'ValidationError: "status" must be one of [alive, dead]'
      );
    })
    it('should only accept "alive" and "dead"', () => {
      const notAliveOrDead = makeFakePlayer({ status: '1234' })
      expect(() => makePlayer(notAliveOrDead)).toThrow(
        'ValidationError: "status" must be one of [alive, dead]'
      );
    })
  })

  describe('hit', () => {
    it('should be a boolean', () => {
      const notBoolean = makeFakePlayer({ hit: 'hey' });
      expect(() => makePlayer(notBoolean)).toThrow(
        'ValidationError: "hit" must be a boolean'
      );
    });
  });

  describe('gameConnectionStatus', () => {
    it('should be a string', () => {
      const notString = makeFakePlayer({ gameConnectionStatus: 123 });
      expect(() => makePlayer(notString)).toThrow(
        'ValidationError: "gameConnectionStatus" must be one of [exit, connected, disconnected]'
      );
    });
    it('should only accept "exit", "connected" and "disconnected"', () => {
      const notInTheList = makeFakePlayer({ gameConnectionStatus: '1234' });
      expect(() => makePlayer(notInTheList)).toThrow(
        'ValidationError: "gameConnectionStatus" must be one of [exit, connected, disconnected]'
      );
    });
  });
});
