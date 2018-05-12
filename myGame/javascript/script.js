var game = new Phaser.Game(800, 600, Phaser.AUTO);
var text, moneyPoints, armyPoints, comPoints, noblePoints;

// Main State ==================================================
var Menu = function(game){};
Menu.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("Menu: preload");
		game.load.atlas("button", "assets/img/buttons.png", "assets/img/buttons.json");
		game.load.image("GamePlayUI", "assets/img/GamePlay_UI.png");
	},

	// place assets ==================================
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
		console.log("GamePlay: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("GamePlay: create");
		game.add.sprite(0, 0, "GamePlayUI");
		game.stage.backgroundColor = "#808080";

		// UI score
		var com = game.add.text(100, 50, "Commoners: ");
		var noble = game.add.text(70, 100, "Nobles: ");
		com.anchor.set(0.5);
		noble.anchor.set(0.5);
		text = game.add.text(game.width/2, game.height/2, "GamePlay state");
		text.anchor.set(0.5);

		// Player UI
		var money = game.add.text(650, 50, "Gold: ");
		var army = game.add.text(650, 100, "Amry: ");
	},

	// update, run the game loop =====================
	update: function(){
		// load 'GamePlay' state when user pressed ENTER key
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			game.state.start('Read');
		}
	},

	// debuging method ===============================
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
		text = game.add.text(game.width/2, game.height/2, "Read state\n"+
			"Press DELETE/BACKSPACE to go back");
		text.anchor.set(0.5);
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

