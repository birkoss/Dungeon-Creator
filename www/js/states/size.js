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
        }
        let button = this.selector.addButton("Back", this.onBackButtonClicked, this, "btnRed");

        this.selector.generate();
        this.selectorContainer.addChild(this.selector);
    },
    onSizeButtonClicked: function(button, pointer) {
        let SizeID = button.SizeID;
        let Size = GAME.getSize(SizeID);

        let popup = new Popup(this.game);
        popup.createOverlay(0.5);
        popup.createTitle("Size " + SizeID);

        popup.createCloseButton();

        let description = popup.getContainer("description").group;
        let descriptionText = this.game.add.bitmapText(0, 0, "font:gui", "This is the deck of your enemy", 16);
        descriptionText.tint = 0x959595;
        descriptionText.maxWidth = popup.maxWidth - popup.padding;
        description.addChild(descriptionText);
        
        let listViewContainer = popup.getContainer("listView").group;
        let listViewBackground = new Ninepatch(this.game, "ninepatch:blue");
        listViewContainer.addChild(listViewBackground);

        listViewBackground.resize(popup.maxWidth - (popup.padding*2), 150);


        Size.cards.forEach(function(cardID) {
            let g = this.game.add.group()
            let sprite = g.create(0, 0, "tile:blank");
            sprite.width = 240;
            sprite.height = 100;
            sprite.alpha = 0;

            let c = new Card(this.game);
            c.configure(cardID);
            c.setOwner(1);
            c.x += 50;
            c.y += 50;
            g.addChild(c);

            let qtyLabel = this.game.add.bitmapText(0, 0, "font:gui", "Qty:" + (GAME.config.cards[cardID] == null ? 0 : GAME.config.cards[cardID]), 16);
            qtyLabel.anchor.set(0, 0.5);
            qtyLabel.y = g.height/2;
            qtyLabel.x = ((100 - qtyLabel.width) / 2) + 105;
            
            g.addChild(qtyLabel);
            
            popup.listViewItems.push(g);
        }, this);

        let group = popup.getContainer("buttons").group;
        let buttonPlay = this.game.add.button(0, 0, "gui:btnGreen", this.onBtnPlayClicked, this, 1, 0, 1, 0);
        buttonPlay.SizeID = SizeID;
        let textPlay = this.game.add.bitmapText(0, 0, "font:gui", "Fight", 16);
        textPlay.anchor.set(0.5, 0.5);
        textPlay.x += buttonPlay.width/2;
        textPlay.y += buttonPlay.height/2;
        buttonPlay.addChild(textPlay);
        group.addChild(buttonPlay);

        popup.generate();

        this.popupContainer.addChild(popup);
    },
    onBtnPlayClicked: function(button, pointer) {
        GAME.config.SizeID = button.SizeID;
        this.state.start("Game");
    },
    onBtnChangePageClicked: function(button, pointer) {
        this.page += button.direction;

        this.createSize();
    },
    onChangeDeckClicked: function() {
        let manager = new DeckManager(this.game);
        manager.generate();
    },
    onBackButtonClicked: function() {
        this.state.start("Main");
    }
};
