
var game = new Phaser.Game(800, 600, Phaser.AUTO);
//status variables
var text; men = 10, moneyPoints = 50, suspicion = 0, comPoints = 0, noblePoints = 0, questCounter = 0;
var commoner, noble;
var playedKill = false;
var playedDecline = false;
var playedAccept = false;
var cutSceneTracker = true;
var acceptScene = false;
var declineScene = false;
var killScene = false;
//====Below is a series of arrays holding input values for NPC object creation====
var menArg = [5,7,0,5,4,0,7,0,5,0]; 
var suspArg = [7,0,0,10,12,0,20,0,15,0]; 
var comPtsArg = [10,0,0,0,15,0,0,0,30,0]; 
var nobPtsArg = [0,0,0,0,0,0,0,0,0,0];
var negNobPtsArg = [0,0,0,0,0,0,20,0,0,0]; 
var negComPtsArg = [5,0,0,10,5,0,3,0,7,0]; 
var moneyArg = [20,0,0,0,15,0,0,0,30,0];
//================================
var story = []; //empty array variable, will later be used to temporarily store scrolling texts

//This will be very long since it'll hold all the narrative for the game. 
//start
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
["quest 2"],
["quest 3"],
["quest 4"],
["quest 5"],
["quest 6"],
["quest 7"],
["quest 8"],
["quest 9"],
["quest 10"]
]; //an array of strings for quest description
var aD = [
["Oh thank you so much! I don’t really care if you kill the", 
"pirates or scare them off.Just make sure they don’t come back!", 
"We’ll provide payment once the job is done."],
["quest 2"],
["quest 3"],
["quest 4"],
["quest 5"],
["quest 6"],
["quest 7"],
["quest 8"],
["quest 9"],
["quest 10"]
]; //accept dialogue array of array of strings :D
var dD = [
["Oh. I’m sorry to have bothered you then. I was just really hoping for help.",
"We really need these pirates gone before they destroy our town.",
"Guess I’ll keep looking."],
["quest 2"],
["quest 3"],
["quest 4"],
["quest 5"],
["quest 6"],
["quest 7"],
["quest 8"],
["quest 9"],
["quest 10"]
]; //decline dialogue
var kD = [
["I should’ve just stayed home… "], 
["quest 2"],
["quest 3"],
["quest 4"],
["quest 5"],
["quest 6"],
["quest 7"],
["quest 8"],
["quest 9"],
["quest 10"]
]; //kill dialogue

//end

//borrowed from https://stackoverflow.com/questions/31849667/how-to-type-word-by-word-or-line-by-line-in-phaser-js
//start
var line = [];
var wordIndex = 0;
var lineIndex = 0;
var wordDelay = 140;
var lineDelay = 400;
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
		game.load.atlas("background", "background.png", "background.json");
		game.load.image("btnPlay", "btnPlay.png");
		game.load.image("btnTutorial", "btnTutorial.png");
		game.load.image("btnPlayAgain", "btnPlayAgain.png");
		game.load.image("btnNext", "btnNext.png");
		game.load.image("btnBack", "btnBack.png");

		//game.load.image("commoner", "commoner.png");
		game.load.path = 'assets/audio/';
		game.load.audio('bgMusic', ['bgmusic.wav']);
		game.load.audio('acceptMusic', ['stamp.wav']);
		game.load.audio('declineMusic', ['candle.wav']);
		game.load.audio('killMusic', ['knife.wav']);
	},

	// place assets =========================================
	create: function(){
		console.log("Menu: create");
		newGame();
		game.add.sprite(0, 0, "background", "GameTitle");
		game.add.button(150, 400, "btnPlay", gotoGame, this);
		game.add.button(450, 400, "btnTutorial", gotoPrologue, this);
	},

	// update, run game loop =========================
	update: function(){}
}

var Prologue = function(game){};
Prologue.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("Prologue: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("Prologue: create");
		game.stage.backgroundColor = "#39aeb2";
		text = game.add.text(0, 0, "Prologue:\n\nYou sigh and sit exhaustively on the bloodied chair.\nYou killed the current leader of the mercenary guild,\nwhile the floor is covered in blood. You’ve gotten into this\nkingdom unnoticed and now you’ll become valuable to them.\nYou can’t wait for it all to come crumbling down.\nFor this kingdom has kidnapped and killed your brother,\nand you want revenge. So naturally you’ve decided to\ninfiltrate the kingdom, gain the people’s trust and then\ndestroy the entire kingdom from the inside out.\nYou’ve grown a bit sadistic since your brother’s death\nbut everyone here, no matter how indirectly, was involved.\nBut this is the only way to avenge your brother and you’ll do\nwhatever it takes.\nHit Enter to read the tutorial.");
		//text.anchor.set(0.5);
		game.add.button(590, 520, "btnNext", gotoTutorial, this);
	},                                                                

	// update, run the game loop =====================
	update: function(){
		// load 'GamePlay' state when user pressed ENTER key
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			game.state.start('Tutorial');
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
		text = game.add.text(0, 0, "Tutorial:\nThere are several interactable objects within the game:\n\nThe quest scroll: This is the first thing that should be clicked on \neach quest iteration. It’ll explain the problem and what\n the person asks of you.\n\nThe stamp: Allows you to accept the given quest.\nPlayers click and drag it onto the scroll to see\nhow it affected them.\n\nThe candle: Allows you to deny the given quest.\nPlayers click and drag it onto the scroll to see\nhow it affected them.\n\nThe knife: Allows you to kill the messenger.\nPlayers click and drag it onto the person to see how\nit affected them.\nHit enter to go into gameplay.",{font: "23px"});
		//text.anchor.set(0.5);
		game.add.button(590, 520, "btnNext", gotoGame, this);
	},                                                                

	// update, run the game loop =====================
	update: function(){
		// load 'GamePlay' state when user pressed ENTER key
		// if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
		// 	game.state.start('GamePlay');
		// }
	}
}

// Gameplay state ==============================================
var GamePlay = function(game){};
GamePlay.prototype = {
	// preload assets ================================
	preload: function(){
		//game.load.image("commoner", "commoner.png");
		//game.load.path = 'assets/audio/';
		// game.load.audio('bgMusic', 'assets/audio/bgmusic.wav');
		// game.load.audio('acceptMusic', 'assets/audio/stamp.wav');
		// game.load.audio('declineMusic', 'assets/audio/candle.wav');
		// game.load.audio('killMusic', 'assets/audio/knife.wav');
	},
	preload: function(){},

	// place assets ==================================
	create: function(){
		console.log("GamePlay: create");
		//spin up physics
		game.add.sprite(0, 0, "background", "GamePlay");
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//add sound
		bgMusic = game.add.audio('bgMusic');
		acceptMusic = game.add.audio('acceptMusic');
		declineMusic = game.add.audio('declineMusic');
		killMusic = game.add.audio('killMusic');
		bgMusic.play('', 0, 0.5, true); //loops

		//scroll obj is also quest obj, it acts as a double
		scroll = new Item(game, 370, 400, 'obj', 'ReadScroll');
		game.add.existing(scroll);
		scroll.scale.set( .1, .1);
		//scroll.body.immovable = true; //scroll cannot be moved, scroll is a rock
		//scroll.body.setSize(700,500, 50, 32);
		scroll.alpha = 0;
		scroll.body.collideWorldBounds = false;
		scrollAnimation = game.add.tween(scroll).to({y: 460, alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2000);
		//console.log(questCounter);
		//console.log(kD);

		//create npc depending on questNumber
		//NPC constructor parameters(game, x, y, key, frame, aD, dD, kD, noblePoints, comPoints, negNoblePts, negComPts, men, susp, money);
		commoner = new NPC(game, 400, 240,'npc', 4, aD[questCounter], dD[questCounter], kD[questCounter], nobPtsArg[questCounter], comPtsArg[questCounter], negNobPtsArg[questCounter], negComPtsArg[questCounter], menArg[questCounter], suspArg[questCounter], moneyArg[questCounter]);
		//game.physics.enable(commoner, Phaser.Physics.ARCADE);
		game.add.existing(commoner);
		commoner.scale.set(.9);
		//this.commoner.enableBody();
		//this.commoner.body.immovable = true;
		commoner.body.setSize(100, 270, 135, 120);
		commoner.alpha = 0;
		character = game.add.tween(commoner).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2000);
		character.chain(scrollAnimation);
		//console.log(commoner.kD);

		noble = new NPC(game, 400, 170,'npc', 0, aD[questCounter], dD[questCounter], kD[questCounter], nobPtsArg[questCounter], comPtsArg[questCounter], negNobPtsArg[questCounter], negComPtsArg[questCounter], menArg[questCounter], suspArg[questCounter], moneyArg[questCounter]);
		game.physics.enable(noble, Phaser.Physics.ARCADE);
		game.add.existing(noble);
		noble.scale.set(.85);
		noble.alpha = 0;
		//character = game.add.tween(noble).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2000);
		//character.chain(scrollAnimation);

		//create objects
		knife = new Item(game, 200, 530, 'obj', 'Knife'); // (680, 530)
		game.add.existing(knife);	
		knife.alpha = 0.5; //set to be darkened

		stamp = new Item(game, 600, 450, 'obj', 'Stamp');
		game.add.existing(stamp);	
		stamp.alpha = 0.5;

		candle = new Item(game, 710, 560, 'obj', 'Candle');
		game.add.existing(candle);
		//candle.input.enableDrag();
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
		game.physics.arcade.collide(candle, scroll, declineQuest, null, this);

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
		if(comPoints >= 100 || noblePoints >=100){
			game.state.start('GameOverG');
		}else if(suspicion >= 100) {
			game.state.start('GameOverB1');
		}else if(men <= 0){
			game.state.start('GameOverB2');
		}else if(questCounter == 10){
			game.state.start('GameOverN');
		}
		//if(acceptScene == true){
		//	game.state.start('CutSceneAccept');
		//}
		//if(declineScene == true){
		//	game.state.start('CutSceneDecline');
		//}
		//if(killScene == true){
		//	game.state.start('CutSceneKill');
		//}
		haveRead = false;
		//haveRead = false;
		//console.log(haveRead);
	},

	// debugging method ===============================
	render: function(){
		//game.debug.bodyInfo(scroll, 32, 32);
		//game.debug.body(scroll);
		//game.debug.text("Over: " + scroll.input.pointerOver(), 32, 32);
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
		game.add.button(590, 530, "btnBack", gotoGame, this);

		this.text = game.add.text(32, 32, '', {font: "15px Arial", fill: "#19de65"});
		nextLine();
		questStatus = false;
		playedKill = false;
		playedDecline = false;
		playedAccept = false;
		//questStatus = false;
	},

	// update, run the game loop =====================
	update: function(){
		//console.log(haveRead);
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

//cut scene for all accepts
var CutSceneAccept = function(game){};
CutSceneAccept.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("CutSceneAccept: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("CutSceneAccept: create");
		game.stage.backgroundColor = "#707070";
		game.add.button(590, 520, "btnNext", gotoGame, this);
	},

	//checks to see which accept cutscene to display depending on the the current questNumber
	update: function(){
		game.sound.stopAll();
		//quest 1's
		if(cutSceneTracker == false && questCounter == 1){
			game.add.text(0,75,"TextA");
			cutSceneTracker = true;
			acceptScene = false;
			men += 10;
		}
		//quest 2's.
		if(cutSceneTracker == false && questCounter == 2){
			game.add.text(0,75,"new TextA");
			cutSceneTracker = true;
			acceptScene = false;
			//add men
		}
		//quest 3's.
		if(cutSceneTracker == false && questCounter == 3){
			game.add.text(0,75,"Some more textA");
			cutSceneTracker = true;
			acceptScene = false;
			//add men
		}
		//quest 4's.
		if(cutSceneTracker == false && questCounter == 4){
			game.add.text(0,75,"Some more textA");
			cutSceneTracker = true;
			acceptScene = false;
			//spy. no men are gained
		}
		//quest 5's.
		if(cutSceneTracker == false && questCounter == 5){
			game.add.text(0,75,"Some more textA");
			cutSceneTracker = true;
			acceptScene = false;
			men += 15;
		}
		//quest 6's.
		if(cutSceneTracker == false && questCounter == 6){
			game.add.text(0,75,"Some more textA");
			cutSceneTracker = true;
			acceptScene = false;
			//add men
		}
		//quest 7's.
		if(cutSceneTracker == false && questCounter == 7){
			game.add.text(0,75,"Some more textA");
			cutSceneTracker = true;
			acceptScene = false;
			//spy. no men are gained
		}
		//quest 8's.
		if(cutSceneTracker == false && questCounter == 8){
			game.add.text(0,75,"Some more textA");
			cutSceneTracker = true;
			acceptScene = false;
			//add men
		} 
		//quest 9's.
		if(cutSceneTracker == false && questCounter == 9){
			game.add.text(0,75,"Some more textA");
			cutSceneTracker = true;
			acceptScene = false;
			men += 10;
		}
		//quest 10 shouldn't have a cutscene since the game will end.
		if(cutSceneTracker == false && questCounter == 10){
			game.add.text(0,75,"You really shouldn't be here. Something went wrong if you're here");
			cutSceneTracker = true;
			acceptScene = false;
		}
		// load 'GamePlay' state when user pressed ENTER key
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			game.state.start('GamePlay');
		}
	}
}

//cutscenes for all declines
var CutSceneDecline = function(game){};
CutSceneDecline.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("CutSceneDecline: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("CutSceneDecline: create");
		game.stage.backgroundColor = "#707070";
		game.add.button(590, 520, "btnNext", gotoGame, this);
		//text = game.add.text(0, 75, "Decline cut Scene");
		//text.anchor.set(0.5);
	},

//checks to see which decline cutscene to display depending on the the current questNumber
	update: function(){
		game.sound.stopAll();
		//quest 1's.
		if(cutSceneTracker == false && questCounter == 1){
			game.add.text(0,75,"TextD");
			cutSceneTracker = true;
			declineScene = false;
		}
		//quest 2's.
		if(cutSceneTracker == false && questCounter == 2){
			game.add.text(0,75,"new TextD");
			cutSceneTracker = true;
			declineScene = false;
		}
		//quest 3's.
		if(cutSceneTracker == false && questCounter == 3){
			game.add.text(0,75,"Some more textD");
			cutSceneTracker = true;
			declineScene = false;
		}
		//quest 4's.
		if(cutSceneTracker == false && questCounter == 4){
			game.add.text(0,75,"Some more textD");
			cutSceneTracker = true;
			declineScene = false;
		}
		//quest 5's.
		if(cutSceneTracker == false && questCounter == 5){
			game.add.text(0,75,"Some more textD");
			cutSceneTracker = true;
			declineScene = false;
		}
		//quest 6's.
		if(cutSceneTracker == false && questCounter == 6){
			game.add.text(0,75,"Some more textD");
			cutSceneTracker = true;
			declineScene = false;
		}
		//quest 7's.
		if(cutSceneTracker == false && questCounter == 7){
			game.add.text(0,75,"Some more textD");
			cutSceneTracker = true;
			declineScene = false;
		}
		//quest 8's.
		if(cutSceneTracker == false && questCounter == 8){
			game.add.text(0,75,"Some more textD");
			cutSceneTracker = true;
			declineScene = false;
		} 
		//quest 9's.
		if(cutSceneTracker == false && questCounter == 9){
			game.add.text(0,75,"Some more textD");
			cutSceneTracker = true;
			declineScene = false;
		}
		//quest 10 shouldn't have a cutscene since the game will end.
		if(cutSceneTracker == false && questCounter == 10){
			game.add.text(0,75,"You really shouldn't be here. Something went wrong if you're here");
			cutSceneTracker = true;
			declineScene = false;
		}
		// load 'GamePlay' state when user pressed ENTER key
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			game.state.start('GamePlay');
		}
	}
}

//cutscenes for all kills
var CutSceneKill = function(game){};
CutSceneKill.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("CutSceneKill: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("CutSceneKill: create");
		game.stage.backgroundColor = "#707070";
		game.add.button(590, 520, "btnNext", gotoGame, this);
	},

	//checks to see which kill cutscene to display depending on the the current questNumber
	update: function(){
		game.sound.stopAll();
		//quest 1's.
		if(cutSceneTracker == false && questCounter == 1){
			game.add.text(0,75,"Text");
			cutSceneTracker = true;
			killScene = false;
		}
		//quest 2's.
		if(cutSceneTracker == false && questCounter == 2){
			game.add.text(0,75,"new Text");
			cutSceneTracker = true;
			killScene = false;
		}
		//quest 3's.
		if(cutSceneTracker == false && questCounter == 3){
			game.add.text(0,75,"Some more textK");
			cutSceneTracker = true;
			killScene = false;
		}
		//quest 4's.
		if(cutSceneTracker == false && questCounter == 4){
			game.add.text(0,75,"Some more textK");
			cutSceneTracker = true;
			killScene = false;
		}
		//quest 5's.
		if(cutSceneTracker == false && questCounter == 5){
			game.add.text(0,75,"Some more textK");
			cutSceneTracker = true;
			killScene = false;
		}
		//quest 6's.
		if(cutSceneTracker == false && questCounter == 6){
			game.add.text(0,75,"Some more textK");
			cutSceneTracker = true;
			killScene = false;
		}
		//quest 7's.
		if(cutSceneTracker == false && questCounter == 7){
			game.add.text(0,75,"Some more textK");
			cutSceneTracker = true;
			killScene = false;
		}
		//quest 8's.
		if(cutSceneTracker == false && questCounter == 8){
			game.add.text(0,75,"Some more textK");
			cutSceneTracker = true;
			killScene = false;
		}
		//quest 9's.
		if(cutSceneTracker == false && questCounter == 9){
			game.add.text(0,75,"Some more textK");
			cutSceneTracker = true;
			killScene = false;
		}
		//quest 10 shouldn't have a cutscene since the game will end
		if(cutSceneTracker == false && questCounter == 10){
			game.add.text(0,75,"You really shouldn't be here. Something went wrong if you're here");
			cutSceneTracker = true;
			killScene = false;
		}
		// load 'GamePlay' state when user pressed ENTER key
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER) && cutSceneTracker == true) {
			game.state.start('GamePlay');
		}
	}
}

//gameover state for if you have 100% influence in a faction
var GameOverG = function(game){};
GameOverG.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("GameOverG: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("GameOverG: create");
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(0, 0, "btnPlayAgain", gotoMenu ,this);
		text = game.add.text(0, 75, "You smile sadistically as you hear news of everything slowly\nfalling into chaos. Serves them right for murdering your\nbrother.They deserved this,this slow and painful demise of\nthis kingdom. And nobody will ever know it was your doing.\nYou decide to start packing up to leave soon.\nYou’re work here is done and you’re grown weary\nwith all the hard work your revenge took.\nYou yawn and decide on a nap before packing.\nYou can sleep happily knowing your plan was successful\nand you’ve finally avenged your brother.",{fill: "#ffffff"});
		//text.anchor.set(0.5);
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

//gameover state for if you have not gotten 100% influence with a faction but also have not gotten 100% suspicion or lost all your men
var GameOverN = function(game){};
GameOverN.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("GameOverN: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("GameOverN: create");
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(0, 0, "btnPlayAgain", gotoMenu ,this);
		text = game.add.text(25, 85, "You look at the papers and curse yourself quietly.\nYou’ve done some damage, but not enough.\nThey need to pay, they have to pay.\nBut despite your exhaustive efforts, you haven’t completed\nyour task yet.You crumple up the paper and throw it on the\nground before slumping in your seat tiredly.\nYou miss your home but you must avenge him first.\nYou decide to take a small nap first,\nmaybe some new ideas will come up during it.\n\nClick the retry button to try and fully complete your mission.");
		//text.anchor.set(0.5);
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
//gameover state for if you have gotten 100% suspicion
var GameOverB1 = function(game){};
GameOverB1.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("GameOverB1: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("GameOverB1: create");
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(0, 0, "btnPlayAgain", gotoMenu ,this);
		text = game.add.text(20, 35, "You hear news that people are coming for you.\nThey’ve figured you out.\nThey know you’ve been planning their demise and now\nthey’re coming to arrest and likely kill you.\nYour plan has failed but least you caused some chaos\nbefore it failed. Besides, you’ve grown tired\nwithout your brother around. But now\nyou’ll get to be with him soon enough.\nYou hear pounding on the door and you’re ready for them.\nYou’re done with this life anyways,\nnothing is holding you here anyways.\nThat was taken from you long ago.\n\nClick the retry button to reattempt your mission without getting caught\n this time");
		//text.anchor.set(0.5);
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

//gameover state for if you have run out of men
var GameOverB2 = function(game){};
GameOverB2.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("GameOverB2: preload");
	},

	// place assets ==================================
	create: function(){
		console.log("GameOverB2: create");
		game.stage.backgroundColor = "#707070";
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(0, 0, "btnPlayAgain", gotoMenu ,this);
		text = game.add.text(0, 0, "Bad ending, lost all men.");
		//text.anchor.set(0.5);
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
game.state.add('Prologue',Prologue);
game.state.add("Tutorial", Tutorial);
game.state.add("GamePlay", GamePlay);
game.state.add("Read", Read);
game.state.add("GameOverG", GameOverG);
game.state.add("GameOverN",GameOverN);
game.state.add("GameOverB1",GameOverB1);
game.state.add("GameOverB2",GameOverB2);
game.state.add("CutSceneAccept",CutSceneAccept);
game.state.add("CutSceneDecline",CutSceneDecline);
game.state.add("CutSceneKill",CutSceneKill);
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
	playedKill = false;
	playedDecline = false;
	playedAccept = false;
	cutSceneTracker = true;	
	acceptScene = false;
	declineScene = false;
	killScene = false;
}

function newQuest(){
	questStatus = false;
	// if(questCounter % 2 == 0){

	// }
}

//player choice functions
function acceptQuest(){
	////makes sure the sound effect doesn't repeat 
	if(playedAccept == false){
	acceptMusic.play('', 0, 1, false);
	playedAccept = true;
	}

	//checks to see if you've already done an action, if you haven't, it checks which quest you're on and adds influence for the correct group,adds money and subtracts men for the given quest and displays correct person
	game.add.tween(commoner).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
	game.add.tween(scroll).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true, 1000);
	// add correct values for accepting this quest!
	if (questStatus == false){
		questStatus = true;
		//commoner accept quests
		if(questCounter == 0 || questCounter == 2 || questCounter == 4 || questCounter == 8 ){
		commoner.frameName = "Peasant004";
		//commoner spy accept quests
		if(questCounter == 6){
		comPoints -= commoner.negComPoints;
		}
		comPoints += commoner.comPoints;
		moneyPoints += commoner.moneyPoints;
		men -= commoner.men;	
		}
		//noble accept quests
		if(questCounter == 1 || questCounter == 5 || questCounter == 7 || questCounter == 9){
			noble.frameName = "Noble004";
			//noble spy accept quests
			if(questCounter == 3){
			noblePoints -= noble.negNoblePts;
			}
			noblePoints +=  noble.noblePoints;
			moneyPoints += noble.moneyPoints;
			men -= noble.men
		}
		printCP.text = comPoints;
		printNP.text = noblePoints;
		printMoney.text = moneyPoints;
		printMen.text = men;
		story = commoner.aD;
		//makes sure THE GAME DOESN'T BREAK AFTER READING THE QUEST
		wordIndex = 0;
	lineIndex = 0;
	wordDelay = 140;
	lineDelay = 400;
	//loads in the text to scroll
		text = game.add.text(50, game.world.height - 100, '', {font: "22px Arial", fill: "#19de65"});
		nextLine();
		questCounter++;
		//checks to see if any end conditions have been met, if they have not then the next cutscene will be shown
		if(questCounter != 10 && men != 0 && comPoints != 100 && noblePoints != 100 && suspicion != 100){
			cutSceneTracker = false;
			acceptScene = true;
		}
		//checks to see if any end conditions have been met, if they have, do not show the next cut scene. Go to end game
		if(questCounter == 10 || men <= 0 || comPoints == 100 || noblePoints == 100 || suspicion == 100){
			cutSceneTracker = true;
			acceptScene = false;
		}
	}
}
//holds everything for declining any quest
function declineQuest(){
	//makes sure the sound effect doesn't repeat 
	if(playedDecline == false){
	declineMusic.play('', 0, 1, false);
	playedDecline = true;
	}
//checks to see if you've already done an action, if you haven't, it checks which quest you're on and subtracts influence from the correct group and displays correct person
	game.add.tween(commoner).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
	game.add.tween(scroll).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true, 1000);
	if (questStatus == false){
		questStatus = true;
		//commoner decline
		if(questCounter == 0 || questCounter == 2 || questCounter == 4 || questCounter == 8 ){
		commoner.frameName = "Peasant003";
		comPoints -= commoner.negComPoints;	
		}
		//noble decline
		if(questCounter == 1 || questCounter == 5 || questCounter == 7 || questCounter == 9){
			noble.frameName = "Noble003";
			noblePoints -= noble.negNoblePts;
		}
		printCP.text = comPoints;
		printNP.text = noblePoints;
		story = commoner.dD;
		//makes sure THE GAME DOESN'T BREAK AFTER READING THE QUEST
		wordIndex = 0;
		lineIndex = 0;
		wordDelay = 140;
		lineDelay = 400;
		//loads in the text to scroll
		text = game.add.text(50, game.world.height - 100, '', {font: "22px Arial", fill: "#19de65"});
		nextLine();
		questCounter++;
		if(questCounter != 10 && men != 0 && comPoints != 100 && noblePoints != 100 && suspicion != 100){
			cutSceneTracker = false;
			declineScene = true;
		}
		if(questCounter == 10 || men <= 0 || comPoints == 100 || noblePoints == 100 || suspicion == 100){
			cutSceneTracker = true;
			declineScene = false;
		}
	}
}
//holds everything killing the messenger for any quest
function killMessenger(){
	//makes sure the sound effect doesn't repeat 
	if(playedKill == false){
	killMusic.play('', 0, 1, false);
	playedKill = true;
	}
	game.add.tween(commoner).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
	game.add.tween(scroll).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true, 1000);
	game.time.events.add(6000, moveAssets, this);
//checks to see if you've already done an action, if you haven't, it checks which quest you're on and adds suspicion and displays correct person
	if (questStatus == false){
		questStatus = true;
		game.add.tween(commoner).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
		//commoner kill
		if(questCounter == 0 || questCounter == 2 || questCounter == 4 || questCounter == 8 ){
			commoner.frameName = "Peasant002";
			suspicion += commoner.susp;
			//game.add.tween(commoner).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
		}
		//noble kill
		if(questCounter == 1 || questCounter == 5 || questCounter == 7 || questCounter == 9){
			noble.frameName = "Noble002";
			suspicion += noble.susp;
			//game.add.tween(noble).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
		}
		printSusp.text = suspicion;
		story = commoner.kD;
		//makes sure THE GAME DOESN'T BREAK AFTER READING THE QUEST
		wordIndex = 0;
		lineIndex = 0;
		wordDelay = 140;
		lineDelay = 400;
		//loads in the text to scroll
		text = game.add.text(50, game.world.height - 100, '', {font: "22px Arial", fill: "#19de65"});
		//console.log(text);
		nextLine();	
		questCounter++;
		if(questCounter != 10 && men != 0 && comPoints != 100 && noblePoints != 100 && suspicion != 100){
			cutSceneTracker = false;
			killScene = true;
		}
		if(questCounter == 10 || men <= 0 || comPoints == 100 || noblePoints == 100 || suspicion == 100){
			cutSceneTracker = true;
			killScene = false;
		}
	}
}

//borrowed from https://stackoverflow.com/questions/31849667/how-to-type-word-by-word-or-line-by-line-in-phaser-js
//start
function nextLine(){
	//console.log("entering nextLine() with index:",lineIndex);
	if(lineIndex == story.length){
		return; //we're done.
	}
	//split current line on spaces, so one word per array element
	line = story[lineIndex].split(' ');
	//reset the word index to zero (first word in the line)
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
function gotoGame(){
	game.state.start('GamePlay');
}

function gotoMenu(){
	game.state.start('Menu');
}

function gotoPrologue(){
	game.state.start('Prologue');
}

function gotoTutorial(){
	game.state.start('Tutorial');	
}

function moveAssets(){
	commoner.y = -500;
	noble.y = -500;
//	scroll.y = -500;
}
