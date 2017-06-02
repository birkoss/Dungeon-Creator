var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.mapContainer = this.game.add.group();
        this.buttonsContainer = this.game.add.group();

        this.panelContainer = this.game.add.group();

        this.createMap();
    },
    update: function() {
    },

    /* Misc methods */

    createMap: function() {
        let puzzle = GAME.json['puzzles'][GAME.config.puzzleSize][GAME.config.puzzleID-1];
        console.log(puzzle);
        let mapConfig = {
            mapWidth: puzzle.width,
            mapHeight: puzzle.height,
            labels: puzzle.labels
        };
        GAME.scale.sprite = puzzle.width < 10 ? 2 : 1;
        let map = new Map(this.game, mapConfig);
        this.mapContainer.addChild(map);
    }
};
