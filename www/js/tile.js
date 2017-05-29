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

    let tile = this.createTile("map:borders", 0);
    this.bordersContainer.add(tile);
};

Tile.prototype.reset = function() {
    this.bordersContainer.getChildAt(0).alpha = 0;
};

Tile.prototype.setBorder = function(frame) {
    if (this.background.inputEnabled) {
        this.bordersContainer.getChildAt(0).frame = frame;
        this.bordersContainer.getChildAt(0).alpha = 1;
    } else {
        this.bordersContainer.getChildAt(0).frame = frame;
        this.bordersContainer.getChildAt(0).alpha = 0.5;
    }
};

Tile.prototype.setFilling = function(state) {
    this.isFilled = state;
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
