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
        let mapConfig = {
            mapWidth: puzzle.width,
            mapHeight: puzzle.height,
            labels: puzzle.labels
        };

        this.map = new Map(this.game, mapConfig);
        this.mapContainer.addChild(this.map);

        if (this.map.width > this.game.width || this.map.width > this.game.height) {
            this.game.input.onDown.add(this.onMapDragStart, this);
        }
    },

    onMapDragStart: function() {
        this.mapContainer.startX = this.game.input.worldX;
        this.mapContainer.startY = this.game.input.worldY;

        this.mapContainer.saveX = this.mapContainer.x;
        this.mapContainer.saveY = this.mapContainer.y;

        this.game.input.onDown.remove(this.onMapDragStart, this);
        this.game.input.onUp.add(this.onMapDragStop, this);
        this.moveCallback = this.game.input.addMoveCallback(this.onMapDragMove, this);
    },
    onMapDragStop: function() {
        this.game.input.onDown.add(this.onMapDragStart, this);
        this.game.input.onUp.remove(this.onMapDragStop, this);
        this.game.input.deleteMoveCallback(this.onMapDragMove, this);
    },
    onMapDragMove: function() {
        let currentX = this.game.input.worldX;
        let currentY = this.game.input.worldY;

        let deltaX = this.mapContainer.startX - currentX;
        let deltaY = this.mapContainer.startY - currentY;

        /* Unselect the tile if the movement exceed the threshold */
        if (deltaX * deltaX + deltaY * deltaY > 25) {
            this.map.selectedTile = null;
        }

        let speed = 1; /* 1 = normal speed, 0.5 = half the finger speed */
        this.mapContainer.x = this.mapContainer.saveX - deltaX * speed;
        this.mapContainer.y = this.mapContainer.saveY - deltaY * speed;

        /* Force the map to stay in bounds of the screen */
        this.mapContainer.x = Math.min(0, Math.max(-this.mapContainer.width + this.game.width, this.mapContainer.x));
        this.mapContainer.y = Math.min(0, Math.max(-this.mapContainer.height + this.game.height, this.mapContainer.y));
    }

};
