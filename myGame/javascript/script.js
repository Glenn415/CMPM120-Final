
var game = new Phaser.Game(800, 600, Phaser.AUTO);
//status variables
var text; men = 10, moneyPoints = 50, suspicion = 0, comPoints = 0, noblePoints = 0, questCounter = 0;
var commoner, noble;
//====Below is a series of arrays holding input values for NPC object creation====
var menArg = [5, 7]; 
var suspArg = [7, 10]; 
var comPtsArg = [10, 10]; 
var nobPtsArg = [0, 0];
var negNobPtsArg = [0, 0]; 
var negComPtsArg = [3, 5]; 
var moneyArg = [20, 40];
//================================
var story = []; //empty array variable, will later be used to temporarily store scrolling texts

var storyBase = [
["Hello,",
"I’m from Heaton and I have a request for you.",
"Our town is on the coast with a thriving port.",
"But recently we’re having trouble with pirates.",
"For months they’ve been coming in and stealing",
"from us. If anyone tries to stop them,",
"they’ll get kidnapped or killed. These pirates",
"have been here too long and it has to end.",
"Since nobody in our town can do it without",
"being kidnapped or killed, we’d be so relieved",
"if you’d come help. We can pay a fair amount",
"as well as some men in return. This quest",
"should only take a few men to complete."], 
["Hello,",
"We, the people of Castow, are in need of your", 
"immediate help. Bandits have taken over our town.",
"We are a small, peaceful town, but unfortunately,", 
"we have no major authority here. They’ve damaged our", 
"poor town and harassed us so much and we’re sick of it.", 
"Please come and kill these bandits. We may not be able to",
"provide much but we’d be so grateful if you came and helped!"]
]; //an array of strings for quest description
var aD = [
["Oh thank you so much! I don’t really care if you kill the", 
"pirates or scare them off.Just make sure they don’t come back!", 
"We’ll provide payment once the job is done."],
["test test"]
]; //accept dialogue array of array of strings :D
var dD = [
["Oh. I’m sorry to have bothered you then. I was just really hoping for help.",
"We really need these pirates gone before they destroy our town.",
"Guess I’ll keep looking."],
["Decline test", 
"woooooooo"]
]; //decline dialogue
var kD = [
["I should’ve just stayed home… ", "fuck"], 
["woops, test",
"kill dialogue test"]
]; //kill dialogue

//borrowed from https://stackoverflow.com/questions/31849667/how-to-type-word-by-word-or-line-by-line-in-phaser-js
//start
var line = [];
var wordIndex = 0;
var lineIndex = 0;
var wordDelay = 140;
var lineDelay = 400;
//end

var questStatus = false;

var haveRead = false;

// Main State ==================================================
var Menu = function(game){};
Menu.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("Menu: preload");

		game.load.path = "../myGame/assets/img/";
		//game.load.atlas("bg", "bgSprites.png", "bgSprites.json");
		game.load.atlas("obj", "Items.png", "Items.json");
		game.load.atlas("npc", "npc_atlas.png", "npc_atlas.json");
		game.load.image("GamePlayUI", "GamePlay_UI.png");
		game.load.audio('bgMusic', ['bgmusic.wav']);
	},

	// place assets =========================================
	create: function(){
		console.log("Menu: create");
		game.stage.backgroundColor = "#003C93";
		text = game.add.text(game.width/2, game.height/2, "Infiltrator\n"+
			"Press ENTER to start the Tutorial or SPACE to Play");
		text.anchor.set(0.5);
		newGame();
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
		text = game.add.text(game.width/2, game.height/2, "Tutorial will go here.\n Hit either button to continue to game play.");
		text.anchor.set(0.5);

		// NOTE: Please add tutorial here
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
		//game.load.image("commoner", "commoner.png");

		game.load.path = 'assets/audio/';
		game.load.audio('bgMusic', ['bgmusic.wav']);
	},

	// place assets ==================================
	create: function(){
		console.log("GamePlay: create");
		game.stage.backgroundColor = "#900C3F";
		
		//spin up physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.add.sprite(0, 0, "GamePlayUI");

		//add sound
		bgMusic = game.add.audio('bgMusic');
		bgMusic.play('', 0, 1, true); //loops

		//scroll obj is also quest obj, it acts as a double
		scroll = new Item(game, 370, 420, 'obj', 'ReadScroll');
		game.add.existing(scroll);
		scroll.scale.set( .1, .1);
		scroll.body.immovable = true; //scroll cannot be moved, scroll is a rock
		scroll.body.setSize(700,500, 50, 32);
	console.log(questCounter);
	console.log(kD);
		//create npc depending on questNumber
		//NPC constructor parameters(game, x, y, key, frame, aD, dD, kD, noblePoints, comPoints, negNoblePts, negComPts, men, susp, money);
		commoner = new NPC(game, 400, 170,'npc', 4, aD[questCounter], dD[questCounter], kD[questCounter], nobPtsArg[questCounter], comPtsArg[questCounter], negNobPtsArg[questCounter], negComPtsArg[questCounter], menArg[questCounter], suspArg[questCounter], moneyArg[questCounter]);
		game.physics.enable(commoner, Phaser.Physics.ARCADE);
		game.add.existing(commoner);
		commoner.scale.set(.9);
		//this.commoner.enableBody();
		//this.commoner.body.immovable = true;
		commoner.body.setSize(100, 270, 135, 120);
		console.log(commoner.kD);

		//create objects
		knife = new Item(game, 200, 530, 'obj', 'Knife'); // (680, 530)
		game.add.existing(knife);	
		knife.alpha = 0.5; //set to be darkened

		stamp = new Item(game, 600, 450, 'obj', 'Stamp');
		game.add.existing(stamp);	
		stamp.alpha = 0.5;

		candle = new Item(game, 710, 560, 'obj', 'Candle');
		game.add.existing(candle);
		candle.input.enableDrag();
		candle.alpha = 0.5;

		// UI score
		printCP = game.add.text(135, 58, comPoints);
		printNP = game.add.text(113, 87, noblePoints);
		// com.anchor.set(0.5);
		// noble.anchor.set(0.5);

		// Player UI
		printMoney = game.add.text(665, 78, moneyPoints);
		printMen = game.add.text(700, 110, men);
		printSusp = game.add.text(715, 140, suspicion);

		game.input.mouse.capture = true;

	},

	// update, run the game loop =====================
	update: function(){
		game.physics.arcade.collide(knife, commoner, killMessenger, null, this);
		game.physics.arcade.collide(stamp, scroll, acceptQuest, null, this);
		//game.physics.arcade.collide(this.candle, this.scroll, this.declineQuest, null, this);

		//dimmed color if mouse isn't over it
		if(knife.input.pointerOver()){
			knife.alpha = 1;
		}else{
			knife.alpha = 0.5;
		}

		if(stamp.input.pointerOver()){
			stamp.alpha = 1;
		}else{
			stamp.alpha = 0.5;
		}

		if(candle.input.pointerOver()){
			candle.alpha = 1;
		}else{
			candle.alpha = 0.5;
		}

		//if moused over scroll and click left button, go to READ state
		if(game.input.activePointer.leftButton.isDown && scroll.input.pointerOver()){
			game.state.start('Read');
		}

		// Game over conditions
		if(men <= 0 || suspicion >= 100) {
			game.state.start('GameOver');
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
		 	game.state.start('GameOver');
		}
		haveRead = false;
		console.log(haveRead);
	},

	// debugging method ===============================
	render: function(){
		//game.debug.bodyInfo(scroll, 32, 32);
		//game.debug.body(scroll);
		//game.debug.bodyInfo(commoner, 32, 32);
		//game.debug.body(commoner);
	}
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
		haveRead = true;
		//set story content;
		story = storyBase[questCounter];
		//	Place ReadScroll
		game.add.sprite(0, 0, 'obj', 'ReadScroll');
		if(haveRead == true){
			lineIndex = 0;
			wordIndex = 0;
		}
		text = game.add.text(350,350,"Press DELETE/BACKSPACE to go back\n");
		text.anchor.set(0.5);

		this.text = game.add.text(32, 32, '', {font: "15px Arial", fill: "#19de65"});
		nextLine();
		questStatus = false;
	},

	// update, run the game loop =====================
	update: function(){
		console.log(haveRead);
		//haveRead = true;
		//console.log(haveRead);
		game.sound.stopAll();
		// load 'GamePlay' state when user pressed DELETE key
		if(game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE)) {
			game.state.start('GamePlay');
		}
		
		//console.log(haveRead);
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
		text = game.add.text(game.width/2, game.height/2, "You yawn and tiredly decide to go to bed.\n It was a long and exhausting day.\n The end.\n Hit enter to return to the main menu");
		text.anchor.set(0.5);
	},

	// update, run the game loop =====================
	update: function(){
		game.sound.stopAll();
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
function newGame(){
	men = 10;
	moneyPoints = 50;
	suspicion = 0; 
	comPoints = 0; 
	noblePoints = 0;
	questStatus = false;
	wordIndex = 0;
	lineIndex = 0;
	wordDelay = 140;
	lineDelay = 400;
	questCounter = 0;
}

//player choice functions
function acceptQuest(){
	// add correct values for accepting this quest!
	if (questStatus == false){
		questStatus = true;
		commoner.frameName = "Peasant004";
		comPoints += commoner.comPoints;
		moneyPoints += commoner.moneyPoints;
		men -= commoner.men;
		printCP.text = comPoints;
		printNP.text = noblePoints;
		printMoney.text = moneyPoints;
		printMen.text = men;
		story = commoner.aD;
		wordIndex = 0;
	lineIndex = 0;
	wordDelay = 140;
	lineDelay = 400;
		text = game.add.text(50, game.world.height - 100, '', {font: "15px Arial", fill: "#19de65"});
		nextLine();
		questCounter++;
	}
}

function declineQuest(){
	if (questStatus == false){
		questStatus = true;
		commoner.frameName = "Peasant003";
		comPoints -= commoner.negComPoints;
		this.com.text = comPoints;
		story = commoner.dD;
		text = game.add.text(50, game.world.height - 100, '', {font: "15px Arial", fill: "#19de65"});
		nextLine();
		questCounter++;
	}
}

function killMessenger(){
	if (questStatus == false){
		questStatus = true;
		commoner.frameName = "Peasant002";
		suspicion += commoner.susp;
		printSusp.text = suspicion;
		story = commoner.kD;
	wordIndex = 0;
	lineIndex = 0;
	wordDelay = 140;
	lineDelay = 400;
	console.log(lineIndex);
	console.log(story[lineIndex]);
		text = game.add.text(50, game.world.height - 100, '', {font: "15px Arial", fill: "#19de65"});
		console.log(text);
		nextLine();	
		questCounter++;
	}
}

//borrowed from https://stackoverflow.com/questions/31849667/how-to-type-word-by-word-or-line-by-line-in-phaser-js
//start
function nextLine(){
	console.log("entering nextLine() with index:",lineIndex);
	if(lineIndex == story.length){
		return; //we're done.
	}
	console.log("+++++++++++");
	console.log("line index",lineIndex);
	
	console.log("story:",story[lineIndex]);
	//split current line on spaces, so one word per array element
	line = story[lineIndex].split(' ');
	//reseet the word index to zero (first word in the line)
	wordIndex = 0;
	//call the nextWord function once for each word in the line (line.length)
	game.time.events.repeat(wordDelay, line.length, this.nextWord, this);
	lineIndex++;
}

function nextWord() {
	//add the next word onto the text string, followed by space
	text.text = text.text.concat(line[wordIndex] + ' ');
	wordIndex++;

	//last word?
	if (wordIndex === line.length){
		//add a carriage return
		text.text = text.text.concat("\n");
		//get the next line after the lineDelay amount of ms has passed
		game.time.events.add(lineDelay, nextLine, this);

	}
}
//end