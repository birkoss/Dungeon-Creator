var GAME = GAME || {};

GAME.Size = function() {};

GAME.Size.prototype = {
    create: function() {
        this.panelContainer = this.game.add.group();
        this.selectorContainer = this.game.add.group();
        this.popupContainer = this.game.add.group();

        this.selector = new Popup(this.game);

        this.selector.createTitle("Choose a Size");

        /* Buttons */
        for (let puzzleSize in GAME.json['puzzles']) {
            let button = this.selector.addButton(puzzleSize, this.onSizeButtonClicked, this, "btnGreen");
            button.puzzleSize = puzzleSize;
        }
        let button = this.selector.addButton("Back", this.onBackButtonClicked, this, "btnRed");

        this.selector.generate();
        this.selectorContainer.addChild(this.selector);
    },
    onSizeButtonClicked: function(button, pointer) {
        GAME.config.puzzleSize = button.puzzleSize;
        this.state.start("Level");
    },
    onBackButtonClicked: function() {
        this.state.start("Main");
    }
};
