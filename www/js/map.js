function Map(game, config) {
    Phaser.Group.call(this, game);

    this.config = config;
    this.gridWidth = config.mapWidth;
    this.gridHeight = config.mapHeight;

    this.tiles = [];

    this.tilesContainer = this.game.add.group();
    this.add(this.tilesContainer);

    this.itemsContainer = this.game.add.group();
    this.add(this.itemsContainer);

    this.blocksContainer = this.game.add.group();
    this.add(this.blocksContainer);

    this.onHitTaken = new Phaser.Signal();
    this.onCoinsTaken = new Phaser.Signal();

    this.createMap();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.createMap = function() {
    for (let gridY=0; gridY<this.gridHeight + 2; gridY++) {
        let rows = [];
        for (let gridX=0; gridX<this.gridWidth + 2; gridX++) {
            let tile = new Tile(this.game);
            tile.x = gridX * tile.width;
            tile.y = gridY * tile.height;
            tile.gridX = gridX;
            tile.gridY = gridY;
            if (gridX == 0 || gridY == 0 || gridX == (this.gridWidth+1) || gridY == (this.gridHeight+1)) {
                if (gridX == 0) {
                    if (gridY == 0) {
                        tile.setBorder(8);
                    } else if (gridY == this.gridHeight + 1) {
                        tile.setBorder(10);
                    } else {
                        tile.setBorder(6);
                    }
                } else if (gridX == this.gridWidth + 1) {
                    if (gridY == 0) {
                        tile.setBorder(9);
                    } else if (gridY == this.gridHeight + 1) {
                        tile.setBorder(11);
                    } else {
                        tile.setBorder(6);
                    }
                } else if (gridY == 0 || gridY == this.gridHeight + 1) {
                    tile.setBorder(2);
                }
            } else {
                tile.enableClick();
                tile.onClicked.add(this.onTileClicked, this);
            }
            rows.push(tile);
            this.tilesContainer.addChild(tile);
        }
        this.tiles.push(rows);
    }

    this.config.labels.forEach(function(label) {
        this.tiles[label.gridY+1][label.gridX+1].setLabel(label.label);
    }, this);

    this.refreshTiles();
};

/* Helpers */

Map.prototype.refreshTiles = function() {
    for (let gridY=1; gridY<this.gridHeight+1; gridY++) {
        for (let gridX=1; gridX<this.gridWidth+1; gridX++) {
            this.refreshTile(gridX, gridY);
        }
    }
};

Map.prototype.refreshTile = function(gridX, gridY) {
    /* Out of bounds */
    if (gridX < 1 || gridY < 1 || gridX >= this.gridWidth + 1 || gridY >= this.gridHeight + 1) {
        return;
    }

    let tile = this.tiles[gridY][gridX];

    tile.reset();

    /* Borders */
    if (tile.isFilled) {
        let total = 0;

        let value = 1;
        for (let y=-1; y<=1; y++) {
            for (let x=-1; x<=1; x++) {
                if (x != 0 || y != 0) {
                    if (this.isTileFilled(gridX+x, gridY+y)) {
                        total += value;
                    }
                    //console.log(value); 
                    value += value;
                }
            }
        }

        let frame = 0

        let positions = [
            /* + Shape */
            {value: [2, 8, 16, 64], frame: 12},

            /* T Shapes */
            {value: [8, 16, 2], frame: 17},
            {value: [8, 16, 64], frame: 13},
            {value: [2, 64, 8], frame: 14},
            {value: [2, 64, 16], frame: 16},

            /* Simple line */
            {value: [8, 16], frame: 2},
            {value: [2, 64], frame: 6},

            /* Corners */
            {value: [8, 64], frame: 9},
            {value: [64, 16], frame: 8},
            {value: [8, 2], frame: 11},
            {value: [2, 16], frame: 10},

            /* Dead end */
            {value: [8], frame: 3},
            {value: [16], frame: 1},
            {value: [2], frame: 7},
            {value: [64], frame: 5}
        ];

        for (let i=0; i<positions.length; i++) {
            let ok = true;
            positions[i].value.forEach(function(val) {
                if ( !(total & val) ) {
                    ok = false;
                }
            }, this);

            if (ok) {
                frame = positions[i].frame;
                break;
            }
        }

        console.log(total);

        tile.setBorder(frame, "lava");
    }
};

Map.prototype.isTileFilled = function(gridX, gridY) {
    if (gridX < 1 || gridY < 1 || gridX > this.gridWidth || gridY > this.gridHeight) {
        return false;
    }
    return this.tiles[gridY][gridX].isFilled;
};

/* Events */

Map.prototype.onTileClicked = function(tile, pointer) {
    tile.setFilling(tile.isFilled ^= 1);

    for (let y=-1; y<=1; y++) {
        for (let x=-1; x<=1; x++) {
            this.refreshTile(tile.gridX + x, tile.gridY + y);
        }
    }
};
