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
            }
            rows.push(tile);
            this.tilesContainer.addChild(tile);
        }
        this.tiles.push(rows);
    }

    this.tiles[2][2].setFilling(1);

    this.tiles[1][5].setFilling(1);
    this.tiles[2][4].setFilling(1);
    this.tiles[2][5].setFilling(1);
    this.tiles[3][5].setFilling(1);
    this.tiles[2][6].setFilling(1);

    this.tiles[4][6].setFilling(1);
    this.tiles[6][4].setFilling(1);
    this.tiles[4][1].setFilling(1);
    this.tiles[1][3].setFilling(1);

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
                frame = 9;
                break;
            case 10:
                frame = 11;
                break;
            case 18:
                frame = 10;
                break;
            /* T-Shapes */
            case 88:
                frame = 13;
                break;
            case 74:
                frame = 14;
                break;
            case 26:
                frame = 17;
                break;
            case 82:
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
                frame = 12;
                break;
            default:
                /* Last connection */

                /* Horizontal & vertical */
                if (total & 8 && total & 16) {
                    frame = 2;
                } else if (total & 8) {
                    frame = 3;
                } else if (total & 16) {
                    frame = 1;
                }
                
                if (total & 2 && total & 64) {
                    frame = 6;
                } else if (total & 2) {
                    frame = 7;
                } else if (total & 64) {
                    frame = 5;
                }
        }
        tile.setBorder(frame);
    }
        /*
        tile.setBorder(0);
        if (this.getFilled(gridX, gridY, 'y') == 2) {
            if (this.isTileFilled(gridX-1, gridY) && this.getFilled(gridX-1, gridY, 'y') == 2) {
                tile.setBorder(6);
            }
            if (this.isTileFilled(gridX+1, gridY) && this.getFilled(gridX+1, gridY, 'y') == 2) {
                tile.setBorder(6);
            }
        } else if (this.getFilled(gridX, gridY, 'y') == 0) {
            //tile.setWaterCorner(3);
        }

        if (this.getFilled(gridX, gridY, 'x') == 2) {
            if (this.isTileFilled(gridX, gridY-1) && this.getFilled(gridX, gridY-1, 'x') == 2) {
                tile.setBorder(2);
            }
            if (this.isTileFilled(gridX, gridY+1) && this.getFilled(gridX, gridY+1, 'x') == 2) {
                tile.setBorder(2);
            }
        }
        tile.generateCorners();
    } else if (!tile.isFilled) {
        if (this.getFilled(gridX, gridY, 'y') == 0) {
            //tile.setCorner(2);
        }
    }
    */
};

Map.prototype.getFilled = function(gridX, gridY, direction) {
    let total = 0;
    for (let i=-1; i<=1; i++) {
        let x = gridX;
        let y = gridY;
        let limit = 0;
        if (i != 0) {
            if (direction == 'x') {
                x += i;
            } else {
                y += i;
            }

            /* Out of bounds counts as grass */
            total += (this.isTileFilled(x, y) ? 1 : 0);
        }
    }
    return total;
};

Map.prototype.isTileFilled = function(gridX, gridY) {
    if (gridX < 0 || gridY < 0 || gridX > this.gridWidth + 1 || gridY > this.gridHeight + 1) {
        return false;
    }
    return this.tiles[gridY][gridX].isFilled;
};

Map.prototype.getTileAt = function(gridX, gridY, container) {
    let wantedTile = null;

    container.forEach(function(tile) {
        if (tile.gridX == gridX && tile.gridY == gridY) {
            wantedTile = tile;
        }
    }, this);

    return wantedTile;
};

Map.prototype.getTilesEmpty = function() {
    let tiles = new Array();
    for (let gridY=0; gridY<this.gridHeight; gridY++) {
        for (let gridX=0; gridX<this.gridWidth; gridX++) {
            if (this.getTileAt(gridX, gridY, this.itemsContainer) == null) {
                tiles.push({gridX:gridX, gridY:gridY});
            }
        }
    }
    return tiles;
};

Map.prototype.getTileAtRandom = function() {
    let tiles = this.getTilesEmpty();

    return tiles[Math.floor(Math.random() * (tiles.length-1))];
};

/* Events */

/* Destroy the previously highlighted block */
Map.prototype.onBlockInputUp = function(tile, pointer) {
    if (tile.alpha == 0.5) {
        tile.inputEnabled = false;
        tile.alpha = 0;
        
        /* Show the items (if any) in this tile */
        let item = this.getTileAt(tile.gridX, tile.gridY, this.itemsContainer);
        if (item != null) {
            if (item.type == "enemy") {
                this.onHitTaken.dispatch(item, 1);
            } else if (item.type == "hazard") {
                this.onHitTaken.dispatch(item, 2);
            } else if (item.type == "gem") {
                this.onCoinsTaken.dispatch(item, 1);
            }
            item.alpha = 1;
        }

        /* Change the tile bellow (if any) to show a hole is now visible */
        let tileUnder = this.getTileAt(tile.gridX, tile.gridY+1, this.blocksContainer);
        if (tileUnder != null) {
            tileUnder.frame = 0;
        }
    }
};

/* Highlight the tile */
Map.prototype.onBlockInputDown = function(tile, pointer) {
    tile.alpha = 0.5;
};

/* Restore the previously highlighted tile */
Map.prototype.onBlockInputOut = function(tile, pointer) {
    if (tile.alpha == 0.5) {
        tile.alpha = 1;
    }
};
