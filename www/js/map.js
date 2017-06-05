function Map(game, config) {
    Phaser.Group.call(this, game);

    this.config = config;
    this.gridWidth = config.mapWidth;
    this.gridHeight = config.mapHeight;

    this.tiles = [];

    this.tilesContainer = this.game.add.group();
    this.add(this.tilesContainer);

    this.onCompleted = new Phaser.Signal();

    this.createMap();
};

Map.prototype = Object.create(Phaser.Group.prototype);
Map.prototype.constructor = Map;

Map.prototype.createMap = function() {
    for (let gridY=0; gridY<this.gridHeight + 2; gridY++) {
        let rows = [];
        for (let gridX=0; gridX<this.gridWidth + 2; gridX++) {
            let tile = new Tile(this.game);
            if (gridX == 0 || gridY == 0 || gridX == (this.gridWidth+1) || gridY == (this.gridHeight+1)) {
                if (gridX == 0) {
                    if (gridY == 0) {
                        tile.setBorder(0);
                    } else if (gridY == this.gridHeight + 1) {
                        tile.setBorder(6);
                    } else {
                        tile.setBorder(3);
                    }
                } else if (gridX == this.gridWidth + 1) {
                    if (gridY == 0) {
                        tile.setBorder(2);
                    } else if (gridY == this.gridHeight + 1) {
                        tile.setBorder(8);
                    } else {
                        tile.setBorder(5);
                    }
                } else if (gridY == 0) {
                    tile.setBorder(1);
                } else if (gridY == this.gridHeight + 1) {
                    tile.setBorder(7);
                }
            } else {
                tile.setDecor();
                tile.enableClick();
                tile.onSelected.add(this.onTileSelected, this);
                tile.onConfirmed.add(this.onTileConfirmed, this);
            }
            tile.x = gridX * tile.width;
            tile.y = gridY * tile.height;
            tile.gridX = gridX;
            tile.gridY = gridY;
            rows.push(tile);
            this.tilesContainer.addChild(tile);
        }
        this.tiles.push(rows);
    }

    this.config.labels.forEach(function(label) {
        this.tiles[label.gridY+1][label.gridX+1].setLabel(label.label);
    }, this);
};

/* Helpers */

Map.prototype.completeMap = function() {
    for (let gridY = 1; gridY<this.gridHeight+1; gridY++) {
        for (let gridX = 1; gridX<this.gridWidth+1; gridX++) {
            if (this.tiles[gridY][gridX].isFilled) {
                this.game.add.tween(this.tiles[gridY][gridX].decor.scale).to({x:0, y:0}, 800).start();
                let tween = this.game.add.tween(this.tiles[gridY][gridX]).to({alpha: 0}, 800).start();
                tween.onComplete.add(this.mapCleaned, this);
                tween.start();
            }
        }
    }
};

Map.prototype.getNeighboors = function(neighboors, gridX, gridY, tileState) {
    if (tileState == undefined) {
        tileState = 0;
    }
    if (gridX > 0 && gridX < this.gridWidth + 1 && gridY > 0 && gridY < this.gridHeight + 1) {
        let tile = this.tiles[gridY][gridX];
        if (tile.isFilled == tileState && neighboors.indexOf(tile) == -1) {
            neighboors.push(tile);
            for (let y=-1; y<=1; y++) {
                for (let x=-1; x<=1; x++) {
                    if (Math.abs(x) != Math.abs(y)) {
                        this.getNeighboors(neighboors, gridX+x, gridY+y, tileState);
                    }
                }
            }
        }
    }
};

Map.prototype.containsSquare = function() {
    let newX = 0;
    let newY = 0;
    for (let gridY = 1; gridY<this.gridHeight; gridY++) {
        for (let gridX = 1; gridX<this.gridWidth; gridX++) {
            let total = 0;
            for (let y=0; y<=1; y++) {
                for (let x=0; x<=1; x++) {
                    newX = gridX + x;
                    newY = gridY + y;
                    
                    if (this.tiles[newY][newX].isFilled) {
                        total++;
                    }
                }
            }

            if (total >= 4) {
                return true;
            }
        }
    }

    return false;
};

/* Events */

Map.prototype.onTileSelected = function(tile, pointer) {
    this.selectedTile = tile;
};

Map.prototype.onTileConfirmed = function(tile, pointer) {
    if (this.selectedTile == tile) {
        tile.setFilling(tile.isFilled ^= 1);

        let islandCompleted = true;
        let totalIslandTiles = 0;
        this.config.labels.forEach(function(label) {
            let neighboors = [];
            this.getNeighboors(neighboors, label.gridX + 1, label.gridY + 1);
            this.tiles[label.gridY+1][label.gridX+1].text.alpha = (neighboors.length == label.label ? 0.5 : 1);
            if (neighboors.length != label.label) {
                islandCompleted = false;
            }
            totalIslandTiles += label.label;
        }, this);

        /* If all islands are completed, check if the road is OK */
        if (islandCompleted) {
            let emptyTile = null;
            for (let y=1; y<this.gridHeight+1; y++) {
                for (let x=1; x<this.gridWidth+1; x++) {
                    if (this.tiles[y][x].isFilled == 1 && emptyTile == null) {
                        emptyTile = this.tiles[y][x];
                    }
                }
            }

            /* If at least one tile was found... */
            if (emptyTile != null) {
                let neighboors = [];
                this.getNeighboors(neighboors, emptyTile.gridX, emptyTile.gridY, 1);
                if (neighboors.length == (this.gridWidth * this.gridHeight) - totalIslandTiles && !this.containsSquare()) {
                    this.completeMap();
                }
            }
        }
    }
};

Map.prototype.mapCleaned = function() {
    if (this.game.tweens.getAll().length <= 1) {
        this.onCompleted.dispatch(this);
    }
};
