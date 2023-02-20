class Player {
  constructor(player, matchScore = 0, totalScore = 0) {
    this.color = undefined;
    this.matchScore = matchScore;
    this.totalScore = totalScore;
    this.player = player;
    this.winner = undefined;
  }
}
