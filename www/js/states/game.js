var GAME = GAME || {};

GAME.Game = function() {};

GAME.Game.prototype = {
    create: function() {
        this.lives = 3;
        this.coins = 0;

        this.mapContainer = this.game.add.group();
        this.buttonsContainer = this.game.add.group();

        this.createMap();
    },
    update: function() {
    },

    /* Misc methods */

    createMap: function() {
        this.map = new Map(this.game, 6, 6);
        this.map.onHitTaken.add(this.onMapHitTaken, this);
        this.map.onCoinsTaken.add(this.onMapCoinsTaken, this);

        let mapSize = (this.map.width) / GAME.scale.sprite;
        mapSize += 4;
        let background = this.game.add.tileSprite(0, 0, mapSize, mapSize, "tile:stone");
        background.scale.setTo(GAME.scale.sprite, GAME.scale.sprite);

        this.mapContainer.addChild(background);
        this.mapContainer.addChild(this.map);

        this.map.x = (this.mapContainer.width - this.map.width)/2;
        this.map.y = (this.mapContainer.height - this.map.height)/2;

        this.mapContainer.x = (this.game.width - this.mapContainer.width)/2;
        this.mapContainer.y = (this.game.height - this.mapContainer.height)/2;
    }
};
