var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.backgroundContainer = this.game.add.group();
        this.mapContainer = this.game.add.group();
        this.buttonsContainer = this.game.add.group();
        this.panelContainer = this.game.add.group();

        this.createMap();
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
        this.map.onCompleted.add(this.onMapCompleted, this);

        /* Create an animated background under the map */
        let backgroundWidth = Math.max(this.game.width, this.map.width) / GAME.scale.sprite;
        let backgroundHeight = Math.max(this.game.height, this.map.height) / GAME.scale.sprite;
        let background = this.game.add.tileSprite(0, 0, backgroundWidth, backgroundHeight, "tile:ground");
        background.scale.setTo(GAME.scale.sprite, GAME.scale.sprite);
        background.frame = 3;
        background.animations.add("idle", [3, 4], 2, true);
        background.animations.play("idle");
        this.mapContainer.addChild(background);

        /* Create a grass background under the map */
        let mapBackground = this.mapContainer.create(0, 0, "tile:ground");
        mapBackground.x = 24 * GAME.scale.sprite;
        mapBackground.y = 24 * GAME.scale.sprite;
        mapBackground.width = this.map.width - (2 * mapBackground.x);
        mapBackground.height = this.map.height - (2 * mapBackground.y);
        this.mapContainer.addChild(mapBackground);

        /* Add the transparent map on top of the background */
        this.mapContainer.addChild(this.map);

        let borderSize = 24 * GAME.scale.sprite;
        if (this.map.width-(2 * borderSize) > this.game.width || this.map.height-(2 * borderSize) > this.game.height) {
            this.game.input.onDown.add(this.onMapDragStart, this);
        }
        if (this.map.width-(2*borderSize) < this.game.width) {
            let position = (this.game.width-this.map.width)/2;
            this.map.x += position;
            mapBackground.x += position;
        }
        if (this.map.height < this.game.height) {
            let position = (this.game.height-this.map.height)/2;
            this.map.y += position;
            mapBackground.y += position;
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
    },
    onMapCompleted: function() {
        /* Unlock the next puzzle */
        let nextPuzzleID = GAME.config.puzzleID + 1;
        if (nextPuzzleID >= GAME.json["puzzles"][GAME.config.puzzleSize].length ) {
            nextPuzzleID = 0;
        }
        if (nextPuzzleID > 0 && GAME.config.puzzles[GAME.config.puzzleSize].indexOf(nextPuzzleID) == -1) {
            GAME.config.puzzles[GAME.config.puzzleSize].push(nextPuzzleID);
            GAME.save();
        }

        let popup = new Popup(this.game);
        popup.createOverlay();
        popup.createTitle("Good job!");
        if (nextPuzzleID > 0) {
            popup.addButton("Next", this.onNextPuzzleButtonClicked, this, "btnYellow");
        }
        popup.addButton("Back", this.onBackButtonClicked, this, "btnRed");

        popup.generate();
    },
    onBackButtonClicked: function() {
        this.state.start("Level");
    },
    onNextPuzzleButtonClicked: function() {
        GAME.config.puzzleID++;
        this.state.restart();
    }
};
