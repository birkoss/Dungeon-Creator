function Tile(game) {
    Phaser.Group.call(this, game);

    this.floorContainer = this.game.add.group();
    this.add(this.floorContainer);

    this.bordersContainer = this.game.add.group();
    this.add(this.bordersContainer);

    this.labelContainer = this.game.add.group();
    this.add(this.labelContainer);

    this.onClicked = new Phaser.Signal();

    this.init();
};

Tile.prototype = Object.create(Phaser.Group.prototype);
Tile.prototype.constructor = Tile;

Tile.prototype.createTile = function(spriteName, frame) {
    let tile = this.game.add.sprite(0, 0, spriteName);
    tile.scale.setTo(GAME.scale.sprite, GAME.scale.sprite);
    tile.anchor.set(0.5, 0.5);

    if (frame != null) {
        tile.frame = frame;
    }

    tile.x += tile.width/2;
    tile.y += tile.height/2;

    return tile;
};

Tile.prototype.enableClick = function() {
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.onBackgroundClicked, this);
};

Tile.prototype.init = function() {
    this.background = this.createTile("map:ground", 0);
    if (this.game.rnd.integerInRange(0, 5) == 2) {
        this.background.frame = 1;
    }
    this.floorContainer.addChild(this.background);

};

Tile.prototype.reset = function() {
    this.bordersContainer.removeAll();
};

Tile.prototype.setBorder = function(frame, spriteSheet) {
    if (spriteSheet == undefined) {
        spriteSheet = "borders";
    }
    let tile = this.createTile("map:" + spriteSheet, 0);
    tile.frame = frame;
    this.bordersContainer.add(tile);
};

Tile.prototype.setFilling = function(state) {
    this.isFilled = state;
    this.background.frame = (this.isFilled ? 2 : 0);
};

Tile.prototype.setLabel = function(label) {
    let text = this.game.add.bitmapText(0, 0, 'font:guiOutline', label, 20);
    text.anchor.set(0.5, 0.5);
    text.x = this.background.width/2;
    text.y = this.background.height/2;
    this.labelContainer.addChild(text);
};

/* Events */

Tile.prototype.onBackgroundClicked = function(tile, pointer) {
    this.onClicked.dispatch(this);
};
