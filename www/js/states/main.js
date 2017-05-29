var GAME = GAME || {};

GAME.Main = function() {};

GAME.Main.prototype = {
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
        let mapWidth = 6;
        let mapHeight = 6;
        let map = new Map(this.game, mapWidth, mapHeight);
        this.mapContainer.addChild(map);
    }
};
