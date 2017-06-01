function Tile(game) {
    Phaser.Group.call(this, game);

    this.floorContainer = this.game.add.group();
    this.add(this.floorContainer);

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
/*
    this.width = 32;
    this.height = 32;
    */

    tile.x += tile.width/2;
    tile.y += tile.height/2;

    return tile;
};

Tile.prototype.enableClick = function() {
    this.background.inputEnabled = true;
    this.background.events.onInputDown.add(this.onBackgroundClicked, this);
};

Tile.prototype.init = function() {
    this.background = this.createTile("tile:ground", 0);
    this.floorContainer.addChild(this.background);
};

Tile.prototype.setDecor = function() {
    this.decor = this.createTile("tile:ground", 6);
    this.floorContainer.addChild(this.decor);
};

Tile.prototype.reset = function() {
};

Tile.prototype.setBorder = function(frame) {
    this.background.frame = 3;
    this.background.animations.add("idle", [3, 4], 2, true);
    this.background.animations.play("idle");
    let sprite = this.createTile("tile:coast", frame);
    this.floorContainer.addChild(sprite);
};

Tile.prototype.setFilling = function(state) {
    this.isFilled = state;
    this.decor.frame = (this.isFilled ? 7 : 6);
    if (this.text != undefined) {
        this.text.y = this.text.originalY + (this.isFilled ? 3 : 0);
    }
};

Tile.prototype.setLabel = function(label) {
    this.text = this.game.add.bitmapText(0, 0, 'font:guiOutline', label, 20);
    this.text.anchor.set(0.5, 0.5);
    this.text.x = this.background.width/2;
    this.text.y = this.background.height/2 - 6;
    this.text.originalY = this.text.y;
    this.labelContainer.addChild(this.text);
};

/* Events */

Tile.prototype.onBackgroundClicked = function(tile, pointer) {
    this.onClicked.dispatch(this);
};
