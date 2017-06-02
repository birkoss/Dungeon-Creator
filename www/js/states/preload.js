var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.spritesheet('tile:ground', 'images/tiles/ground.png', 24, 24);
        this.load.spritesheet('tile:coast', 'images/tiles/coast.png', 24, 24);
        this.load.spritesheet('map:borders', 'images/tiles/borders/dungeon.png', 24, 24);
        this.load.spritesheet('map:ground', 'images/tiles/ground/dungeon.png', 24, 24);
        this.load.spritesheet('map:lava', 'images/tiles/borders/lava.png', 24, 24);
        this.load.spritesheet('map:corners-water', 'images/tiles/corners-water.png', 16, 16);
        this.load.spritesheet('map:floors', 'images/tiles/floors.png', 16, 16);
        this.load.spritesheet('map:tiles', 'images/tiles/tiles.png', 64, 64);

        this.load.spritesheet('ninepatch:background', 'images/gui/panel.png', 8, 8);
        this.load.spritesheet('ninepatch:blue', 'images/gui/title.png', 8, 8);
        this.load.spritesheet('gui:btnLevel', 'images/gui/buttons/level.png', 49, 49);
        this.load.spritesheet('gui:btnLevelLocked', 'images/gui/buttons/level-locked.png', 49, 49);
        this.load.image('gui:btnClose', 'images/gui/buttons/close.png');
        this.load.image('icon:close', 'images/gui/buttons/closeIcon.png');
        this.load.spritesheet('gui:btnChangePage', 'images/gui/buttons/changePage.png', 36, 36);
        this.load.image('icon:changePage', 'images/gui/buttons/changePageIcon.png');
        this.load.spritesheet('gui:btnGreen', 'images/gui/buttons/green.png', 190, 49);
        this.load.spritesheet('gui:btnYellow', 'images/gui/buttons/yellow.png', 190, 49);
        this.load.image('gui:btnGrey', 'images/gui/buttons/grey.png');
        this.load.spritesheet('gui:btnRed', 'images/gui/buttons/red.png', 190, 49);

        this.load.json('data:puzzles', 'data/puzzles.json');

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');
    },
    create: function() {
        GAME.json = {};
        GAME.json['puzzles'] = this.cache.getJSON('data:puzzles');

        this.state.start('Level');
    }
};
