function Map(game, config) {
    Phaser.Group.call(this, game);

    this.config = config;
    this.gridWidth = config.mapWidth;
    this.gridHeight = config.mapHeight;

    this.tiles = [];

    this.tilesContainer = this.game.add.group();
    this.add(this.tilesContainer);

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

Map.prototype.getNeighboors = function(neighboors, gridX, gridY) {
    if (gridX > 0 && gridX < this.gridWidth + 1 && gridY > 0 && gridY < this.gridHeight + 1) {
        let tile = this.tiles[gridY][gridX];
        if (!tile.isFilled && neighboors.indexOf(tile) == -1) {
            neighboors.push(tile);
            for (let y=-1; y<=1; y++) {
                for (let x=-1; x<=1; x++) {
                    if (Math.abs(x) != Math.abs(y)) {
                        this.getNeighboors(neighboors, gridX+x, gridY+y);
                    }
                }
            }
        }
    }
};

/* Events */

Map.prototype.onTileSelected = function(tile, pointer) {
    this.selectedTile = tile;
};

Map.prototype.onTileConfirmed = function(tile, pointer) {
    if (this.selectedTile == tile) {
        tile.setFilling(tile.isFilled ^= 1);

        this.config.labels.forEach(function(label) {
            let neighboors = [];
            this.getNeighboors(neighboors, label.gridX + 1, label.gridY + 1);
            this.tiles[label.gridY+1][label.gridX+1].text.alpha = (neighboors.length == label.label ? 0.8 : 1);
        }, this);
    }
};
