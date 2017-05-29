function Tile(game) {
    Phaser.Group.call(this, game);

    this.floorContainer = this.game.add.group();
    this.add(this.floorContainer);

    this.bordersContainer = this.game.add.group();
    this.add(this.bordersContainer);

    this.cornersGroundContainer = this.game.add.group();
    this.add(this.cornersGroundContainer);

    this.cornersWaterContainer = this.game.add.group();
    this.add(this.cornersWaterContainer);

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
    this.bordersContainer.getChildAt(0).frame = frame;
    this.bordersContainer.getChildAt(0).alpha = 0.5;
};

Tile.prototype.setFilling = function(state) {
    this.isFilled = state;
};

/* Events */

Tile.prototype.onBackgroundClicked = function(tile, pointer) {
    this.onClicked.dispatch(this);
};