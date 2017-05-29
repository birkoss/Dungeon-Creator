var GAME = GAME || {};

GAME.Preload = function() {};

GAME.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'gui:preloader');
        this.preloadBar.anchor.set(0.5);
        this.load.setPreloadSprite(this.preloadBar);

        this.load.spritesheet('map:borders', 'images/tiles/borders/dungeon.png', 24, 24);
        this.load.spritesheet('map:ground', 'images/tiles/ground/dungeon.png', 24, 24);
        this.load.spritesheet('map:corners-water', 'images/tiles/corners-water.png', 16, 16);
        this.load.spritesheet('map:floors', 'images/tiles/floors.png', 16, 16);

        this.load.bitmapFont('font:guiOutline', 'fonts/guiOutline.png', 'fonts/guiOutline.xml');
        this.load.bitmapFont('font:gui', 'fonts/gui.png', 'fonts/gui.xml');
    },
    create: function() {
        this.state.start('Main'); /* Game/Debug */
    }
};
