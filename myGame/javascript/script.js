var game = new Phaser.Game(800, 600, Phaser.AUTO);

var text, men = 10, money = 50, suspicion = 0, comPoints = 0, noblePoints = 0;

var story = ["words", "words", "words"]; //an array of strings
		var line = [];

		var wordIndex = 0;
		var lineIndex = 0;

		var wordDelay = 140;
		var lineDelay = 400;

// Main State ==================================================
var Menu = function(game){};
Menu.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("Menu: preload");

		game.load.path = "../myGame/assets/img/";
		game.load.atlas("button", "buttons.png", "buttons.json");
		//game.load.atlas("bg", "bgSprites.png", "bgSprites.json");
		game.load.atlas("obj", "Items.png", "Items.json");
		//game.load.atlas("char", "charSprites.png", "charSprites.json");
		game.load.image("GamePlayUI", "GamePlay_UI.png");
	},

	// place assets =========================================
	create: function(){
		console.log("Menu: create");
		game.stage.backgroundColor = "#b373c6";
		text = game.add.text(game.width/2, game.height/2, "Infiltrator\n"+
			"Press ENTER to start the Tutorial or SPACE to Play");
		text.anchor.set(0.5);
	},

	// update, run game loop =========================
	update: function(){
		// load 'Tutorial' state when user pressed ENTER key
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			game.state.start('Tutorial');
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('GamePlay');
		}
	}
}

// Tutorial State ==============================================
var Tutorial = function(game){};
Tutorial.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("Tutorial: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("Tutorial: create");
		game.stage.backgroundColor = "#39aeb2";
		text = game.add.text(game.width/2, game.height/2, "Tutorial state");
		text.anchor.set(0.5);

		var tutButtonRed = game.add.button(game.width/4, game.width/2, "button", onChange, 1, 0, 2);
		tutButtonRed.anchor.set(0.5);
		text = game.add.text(0, 0, "Decline");
		text.anchor.set(0.5);
		text.x = tutButtonRed.x;
		text.y = tutButtonRed.y;

		var tutButtonGreen = game.add.button(game.width-200, game.width/2, "button", onChange, 4, 3, 5);
		tutButtonGreen.anchor.set(0.5);
		text = game.add.text(0, 0, "Accept");
		text.anchor.set(0.5);
		text.x = tutButtonGreen.x;
		text.y = tutButtonGreen.y;
	},

	// update, run the game loop =====================
	update: function(){
		// load 'GamePlay' state when user pressed ENTER key
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			game.state.start('GamePlay');
		}
	}
}

// Gameplay state ==============================================
var GamePlay = function(game){};
GamePlay.prototype = {
	// preload assets ================================
	preload: function(){
		game.load.image("commoner", "commoner.png");
		game.load.path = 'assets/audio/';
		game.load.audio('bgMusic', ['bgmusic.wav']);
	},

	// place assets ==================================
	create: function(){
		console.log("GamePlay: create");

		//spin up physics
		this.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0, 0, "GamePlayUI");
		game.stage.backgroundColor = "#808080";
		//add sound
		this.bgMusic = game.add.audio('bgMusic');
		this.bgMusic.play('', 0, 1, true); //loops
		game.stage.backgroundColor = "#ba2500";

		//create objects
		this.knife = new Item(game, 650, 500, 'obj', 'Knife');
		game.add.existing(this.knife);	
		this.knife.input.enableDrag(); //enable click and drag
		this.knife.alpha = 0.5; //set to be darkened

		this.stamp = new Item(game, 680, 530, 'obj', 'Stamp');
		game.add.existing(this.stamp);	
		this.stamp.input.enableDrag();
		this.stamp.alpha = 0.5;

		/*this.candle = new Item(game, 710, 560, 'obj', 'Candle');
		game.add.existing(candle);
		this.candle.input.enableDrag();
		this.candle.alpha = 0.5;*/

		//scroll obj is also quest obj, it acts as a double
		this.scroll = new Item(game, 500, 500, 'obj', 'ReadScroll');
		game.add.existing(this.scroll);
		this.scroll.scale.set( .1, .1);
		this.scroll.body.immovable = true; //scroll cannot be moved, scroll is a rock


		//create npc
		this.commoner = game.add.sprite(300, 100,  'commoner');
		this.physics.enable(this.commoner, Phaser.Physics.ARCADE);
		//this.commoner.enableBody();
		this.commoner.body.immovable = true;

		

		// UI score
		this.com = game.add.text(100, 50, "Commoners: " + comPoints);
		this.noble = game.add.text(70, 100, "Nobles: " + noblePoints);
		this.com.anchor.set(0.5);
		this.noble.anchor.set(0.5);
		// Player UI
		this.money = game.add.text(600, 50, "Gold: " + money);
		this.army = game.add.text(600, 100, "Soldiers: " + men);
		this.susp = game.add.text(600, 150, "Susp.: " + suspicion);

		game.input.mouse.capture = true;
		//this.scroll.input.mouse.capture = true;
	},

	//player choice functions
	acceptQuest: function(){
		comPoints += 10;
		money += 20;
		men -= 5;
		this.com.text = "Commoners: " + comPoints;
		this.noble.text = "Nobles: " + noblePoints;
		this.money.text = "Gold: " + money;
		this.army.text = "Soldiers: " + men;
		this.response = game.add.text(50, game.world.height - 100, "Oh thank you so much! I don’t really care if you kill the \npirates or scare them off.Just make sure they don’t come back! \nWe’ll provide payment once the job is done.");
	},

	declineQuest: function(){
		comPoints -= 3;
		this.com.text = "Commoners: " + comPoints;
		this.response = game.add.text(50, game.world.height - 100, "Oh. I’m sorry to have bothered you then. I was just really hoping for help.\nWe really need these pirates gone before they destroy our town. Guess I’ll keep looking.");
	},

	killMessenger: function(){
		suspicion += 10;
		this.susp.text = "Susp: " + suspicion;
		this.response = game.add.text(50, game.world.height - 100, "I should’ve just stayed home… ");
	},
	// update, run the game loop =====================
	update: function(){
		// load 'GamePlay' state when user pressed ENTER key
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			game.state.start('Read');
		}

		game.physics.arcade.collide(this.knife, this.commoner, this.killMessenger, null, this);
		game.physics.arcade.collide(this.stamp, this.scroll, this.acceptQuest, null, this);
		//x`game.physics.arcade.collide(this.candle, this.scroll, this.declineQuest, null, this);

		//dimmed color if mouse isn't over it
		if(this.knife.input.pointerOver()){
			this.knife.alpha = 1;
		}
		else{
			this.knife.alpha = 0.5;
		}

		if(this.stamp.input.pointerOver()){
			this.stamp.alpha = 1;
		}
		else{
			this.stamp.alpha = 0.5;
		}

		/*if(this.candle.input.pointerOver()){
			this.candle.alpha = 1;
		}
		else{
			this.candle.alpha = 0.5;
		}*/

		//if moused over scroll and click left button, go to READ state
		if(game.input.activePointer.leftButton.isDown && this.scroll.input.pointerOver()){
			game.state.start('Read');
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			game.state.start('GameOver');
		}

	},

	// debugging method ===============================
	render: function(){}
}

// Read State ==============================================
var Read = function(game){};
Read.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("Read: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("Read: create");

		//	Place ReadScroll
		game.add.sprite(0, 0, 'obj', 'ReadScroll');

		text = game.add.text(game.width/2, game.height/2, "Read state\n"+
			"Press DELETE/BACKSPACE to go back");
		text.anchor.set(0.5);

		


		this.text = game.add.text(32, 32, '', {font: "15px Arial", fill: "#19de65"});
		this.nextLine();

	},
	nextLine: function(){
		if(lineIndex === story.length){
			return; //we're done.
		}
		//split current line on spaces, so one word per array element
		line = story[lineIndex].split(' ');

		//reseet the word index to zero (first word in the line)
		wordIndex = 0;

		//call the nextWord function once for each word in the line (line.length)
		game.time.events.repeat(wordDelay, line.length, this.nextWord, this);

		lineIndex++;
	},

	nextWord: function() {
		//add the next word onto the text string, followed by space
		text.text = text.text.concat(line[wordIndex] + ' ');

		wordIndex++;

		//last word?
		if (wordIndex === line.length){
			//add a carriage return
			text.text = text.text.concat("\n");

			//get the next line after the lineDelay amount of ms has passed
			game.time.events.add(lineDelay, this.nextLine, this);

		}
	},

	// update, run the game loop =====================
	update: function(){
		// load 'GamePlay' state when user pressed DELETE key
		if(game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE)) {
			game.state.start('GamePlay');
		}
	}
}

// GameOver State ==============================================
var GameOver = function(game){};
GameOver.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("GameOver: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("GameOver: create");
		game.stage.backgroundColor = "#707070";
		text = game.add.text(game.width/2, game.height/2, "GameOver state");
		text.anchor.set(0.5);
	},

	// update, run the game loop =====================
	update: function(){
		// load 'GamePlay' state when user pressed ENTER key
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			game.state.start('Menu');
		}
	}
}

// Add the states to the StateManager and start in Menu
game.state.add("Menu", Menu);
game.state.add("Tutorial", Tutorial);
game.state.add("GamePlay", GamePlay);
game.state.add("Read", Read);
game.state.add("GameOver", GameOver);
game.state.start("Menu");

// Helper functions ============================================
function onChange(){
	game.state.start("GamePlay");
}

