function Map(game, width, height) {
    Phaser.Group.call(this, game);

    this.gridWidth = width;
    this.gridHeight = height;

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
            if (gridY % 2) {
                tile.alpha = 0.95
            }
            tile.x = gridX * tile.width;
            tile.y = gridY * tile.height;
            tile.gridX = gridX;
            tile.gridY = gridY;
            if (gridX == 0 || gridY == 0 || gridX == (this.gridWidth+1) || gridY == (this.gridHeight+1)) {
                tile.setFilling(1);
            } else {
                tile.enableClick();
                tile.onClicked.add(this.onTileClicked, this);
            }
            rows.push(tile);
            this.tilesContainer.addChild(tile);
        }
        this.tiles.push(rows);
    }

    this.refreshTiles();
};

/* Helpers */

Map.prototype.refreshTiles = function() {
    for (let gridY=0; gridY<this.gridHeight+2; gridY++) {
        for (let gridX=0; gridX<this.gridWidth+2; gridX++) {
            this.refreshTile(gridX, gridY);
        }
    }
};

Map.prototype.refreshTile = function(gridX, gridY) {
    /* Out of bounds */
    if (gridX < 0 && gridY < 0 && gridX >= this.gridWidth + 1 && gridY >= this.gridHeight + 1) {
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
        switch (total) {
            /* Corners TL, TR, BR, BL */
            case 80:
                frame = 8;
                break;
            case 72:
            case 104:
            case 200:
            case 232:
            case 233:
                frame = 9;
                break;
            case 10:
                frame = 11;
                break;
            case 18:
            case 22:
                frame = 10;
                break;
            /* T-Shapes */
            case 88:
            case 249:
                frame = 13;
                break;
            case 74:
            case 235:
                frame = 14;
                break;
            case 26:
            case 27:
            case 30:
            case 31:
                frame = 17;
                break;
            case 82:
            case 210:
            case 214:
                frame = 16;
                break;
            /* 1 connection */
            case 39:
                frame = 7;
                break;
            case 148:
                frame = 1;
                break;
            case 41:
                frame = 3;
                break;
            case 224:
                frame = 5;
                break;
            /* + Shape */
            case 90:
            case 251:
                frame = 12;
                break;
            /* Surrounded */
            case 255:
                frame = 12;
                break;
            default:

                console.log(gridX + "x" + gridY + " = " + total);

                /* Horizontal */
                if (total & 8 && total & 16) {
                    /* Check for y-1 OR y+1 */
                    frame = 2;
                } else if (total & 8) {
                    frame = 3;
                } else if (total & 16) {
                    frame = 1;
                }
                
                /* Vertical */
                if (total & 2 && total & 64) {
                    /* Check for x-1 OR x+1 */
                    frame = 6;
                } else if (total & 2) {
                    frame = 7;
                } else if (total & 64) {
                    frame = 5;
                }
        }
        tile.setBorder(frame);
    }
};

Map.prototype.isTileFilled = function(gridX, gridY) {
    if (gridX < 0 || gridY < 0 || gridX > this.gridWidth + 1 || gridY > this.gridHeight + 1) {
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
