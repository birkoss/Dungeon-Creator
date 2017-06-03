function Tile(game) {
    Phaser.Group.call(this, game);

    this.floorContainer = this.game.add.group();
    this.add(this.floorContainer);

    this.labelContainer = this.game.add.group();
    this.add(this.labelContainer);

    this.onSelected = new Phaser.Signal();
    this.onConfirmed = new Phaser.Signal();

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
    if (this.decor != undefined) {
        this.decor.inputEnabled = true;
        this.decor.events.onInputDown.add(this.onBackgroundInputDown, this);
        this.decor.events.onInputUp.add(this.onBackgroundInputUp, this);
    }
};

Tile.prototype.init = function() {
    //jthis.background = this.createTile("tile:ground", 0);
    //jthis.floorContainer.addChild(this.background);
};

Tile.prototype.setDecor = function() {
    this.decor = this.createTile("tile:ground", 6);
    this.floorContainer.addChild(this.decor);
};

Tile.prototype.reset = function() {
};

Tile.prototype.setBorder = function(frame) {
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
    this.text = this.game.add.bitmapText(0, 0, 'font:guiOutline', label, (10 * GAME.scale.sprite));
    this.text.anchor.set(0.5, 0.5);
    this.text.x = this.decor.width/2;
    this.text.y = this.decor.height/2 - (3 * GAME.scale.sprite);
    this.text.originalY = this.text.y;
    this.labelContainer.addChild(this.text);
};

/* Events */

Tile.prototype.onBackgroundInputDown = function(tile, pointer) {
    this.onSelected.dispatch(this);
};

Tile.prototype.onBackgroundInputUp = function(tile, pointer) {
    this.onConfirmed.dispatch(this);
};
