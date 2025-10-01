export interface PlayerSchema {
  id: String
  position: { 
    currentRow: Number; 
    currentTile: Number 
  }
  score: Number
  movesQueue: [String]
  ready: Boolean
}
