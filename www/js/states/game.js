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
        let mapConfig = {
            mapWidth: 5,
            mapHeight: 5,
            labels: [
                {gridX:1, gridY:0, label:4},
                {gridX:3, gridY:0, label:5},
                {gridX:2, gridY:2, label:1},
                {gridX:0, gridY:3, label:4}
            ]
        };
        let map = new Map(this.game, mapConfig);
        this.mapContainer.addChild(map);
    }
};
