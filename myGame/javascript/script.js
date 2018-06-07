var game = new Phaser.Game(800, 600, Phaser.AUTO);
//status variables
var text; men = 10, moneyPoints = 50, suspicion = 0, comPoints = 0, noblePoints = 0, questCounter = 0;
var commoner, noble;
var playedKill = true;
var playedDecline = true;
var playedAccept = true;
var cutSceneTracker = true;
var acceptScene = false;
var declineScene = false;
var killScene = false;
var questCheck = false;
//====Below is a series of arrays holding input values for NPC object creation====
var menArg = [5,4,5,5,4,6,7,6,5,5]; //balance. maybe earn less in the cut scenes and increase these slightly
var suspArg = [7,10,12,10,12,14,20,25,15,50]; 
var comPtsArg = [10,0,0,0,15,0,0,0,30,0]; //increase these. they never make it to 100. even accepting all but the spies.
var nobPtsArg = [0,10,20,0,0,20,0,25,0,35]; //increase these. they never make it to 100. even accepting all but the spies. 
var negNobPtsArg = [0,3,0,4,0,20,20,30,0,40]; 
var negComPtsArg = [5,0,10,10,5,0,3,0,7,0]; 
var moneyArg = [20,30,20,0,15,35,0,70,30,85];
//================================
var story = []; //empty array variable, will later be used to temporarily store scrolling texts

//This will be very long since it'll hold all the narrative for the game. 
var storyBase = [
["Hello,",
"I’m from Heaton and I have a request for you.",
"Our town is on the coast with a thriving port.",
"But recently we’re having trouble with pirates.",
"For months they’ve been coming in and stealing",
"from us. If anyone tries to stop them, they'll get",
"kidnapped or killed. These pirates have been",
"here too long and it has to end. Since nobody in",
"our town can do it, we'd  be so relieved if you'd",
"come help. We can pay a fair amount as well as some",
"men in return."], 
["quest 2"],
["quest 3"],
["Hello,",
"I’m from Baystone and I have a simple request.",
"An important package was stolen from me by some",
"commoner swine. You shouldn’t concern yourself",
"with the squabble between the nobles and the commoners.",
"This package is very important for me to get back.",
"I can pay generously for your time! Oh and as for",
"what’s in the package...You don’t need to know",
"what’s in it. But if your reputation does you",
"justice, it should be easy for you to get it back",
"from these thieving maggots."],
["Hello,",
"I’m from Bebluff and I have a request for you.",
"We’re having a bit of chimera problem currently.",
"We’ve never dealt with it before because it was",
"always peaceful. But recently it seems someone has",
"stolen it’s baby and well...it’s not happy. It’s now",
"destroying the town and killing any citizens that dare",
"go near! It’s killed most of our army and nobody can",
"Seem to calm it's rage! So please, we ask you to help",
"calm it down. We’ll pay you all we can in return."],
["quest 6"],
["Hello,",
"I’m from Weebury and I have a wee favor to ask.",
"These damn merchants have become such a problem lately.",
"We’d love for someone of such great skill and reputation",
"to come and help us out! For what they did...You don't",
"need to know what they’ve done to us. They’ve gone too",
"far this time and we’re sick of it! We would be ever so",
"pleased if you could come rough up these merchants a bit",
"to help make our lives easier! We’ll pay generously! Please",
"come help our poor little town...We've grown desperate."],
["quest 8"],
["Hello,",
"I’m from Befeld and our town is in great need of help.",
"We’ve recently found out that our kingdom wants to",
"use us as fodder to lower one of the enemy town’s",
"defenses! We will not go along with this plan. Please,",
"we really need you to go and raid this city for us and",
"weaken it so we don’t end up as live fodder for them.",
"We’ve raised a good amount of money to ask this of",
"you! Please...We’re good people and we don’t want",
"to die being live fodder. Please help us…."],
["quest 10"],
["You're done. Please leave the scroll and await the transition to the end screen."]
]; //an array of strings for quest description
var aD = [
["Oh thank you so much! I don’t really care if you kill them", 
"or scare them off. Just make sure they don’t come back!"],
["quest 2"],
["quest 3"],
["Excellent!",
"I greatly look forward to your success.",
"Thank you so very much for dealing with these commoners"],
["“Oh thanks so much!",
"This means so much that you’ll help us calm it down."],
["quest 6"],
["Oh thank you so much!",
"These pesky merchants will finally get what they deserve"],
["quest 8"],
["Oh-Oh thank you kind sir!",
"I knew your reputation wouldn’t fail us!",
"Thank you so much!"],
["quest 10"]
]; //accept dialogue array of array of strings :D
var dD = [
["Oh. I’m sorry to have bothered you then. I was just really hoping for help.",
"We really need these pirates gone before they destroy our town.",
"Guess I’ll keep looking."],
["quest 2"],
["quest 3"],
["Decline will you? I see... Well a piece of parting advice.", 
"Watch your back in Baystone"],
["“Y-You don’t want to help us?",
"I-I really thought the leader of the mercenary guild would care.",
"Guess I was wrong...Sorry I bothered you with this then"],
["quest 6"],
["Y-You don’t wanna help me? B-But why?"],
["quest 8"],
["You don’t want to help us…You do realize we’ll be turned into",
"basically live ammunition right? We’ll just be sacrifices to this war...",
"and you still don’t wanna help us...I’m sorry to even have asked"],
["quest 10"]
]; //decline dialogue
var kD = [
["I should’ve just stayed home… "], 
["quest 2"],
["quest 3"],
["You’re the worst."],
["I’m sorry to have even asked"],
["quest 6"],
["I hate you."],
["quest 8"],
["You’re no better than the nobles."],
["quest 10"]
]; //kill dialogue

//borrowed from https://stackoverflow.com/questions/31849667/how-to-type-word-by-word-or-line-by-line-in-phaser-js
//start
var line = [];
var wordIndex = 0;
var lineIndex = 0;
var wordDelay = 140;
var lineDelay = 400;
var questStatus = true;
var haveRead = false;

// Main State ==================================================
var Menu = function(game){};
Menu.prototype = {
	// preload assets ================================
	preload: function(){
		console.log("Menu: preload");

		game.load.path = "../myGame/assets/img/";
		game.load.atlas("obj", "objects.png", "objects.json");
		game.load.atlas("npc", "npc_atlas.png", "npc_atlas.json");
		game.load.atlas("background", "background.png", "background.json");
		game.load.image("btnPlay", "btnPlay.png");
		game.load.image("btnTutorial", "btnTutorial.png");
		game.load.image("btnPlayAgain", "btnPlayAgain.png");
		game.load.image("btnNext", "btnNext.png");
		game.load.image("btnBack", "btnBack.png");
		
		game.load.path = 'assets/audio/';
		game.load.audio('bgMusic', ['bgmusic.wav']);
		game.load.audio('acceptMusic', ['stamp.wav']);
		game.load.audio('declineMusic', ['candle.wav']);
		game.load.audio('killMusic', ['knife.wav']);
		game.load.audio('titleMusic', ['titleMusic.wav']);
		game.load.audio('cutSceneMusic', ['cutsceneMusic.wav']);
		game.load.audio('goodEndingMusic', ['goodEnding.wav']);
		game.load.audio('neutralEndingMusic', ['neutralEnding.wav']);
		game.load.audio('badEndingMusic', ['badEnding.wav']);
	},

	// place assets =========================================
	create: function(){
		console.log("Menu: create");
		newGame();
		game.add.sprite(0, 0, "background", "GameTitle");
		game.add.button(150, 400, "btnPlay", gotoGame, this);
		game.add.button(450, 400, "btnTutorial", gotoPrologue, this);
		goodEndingMusic = game.add.audio('goodEndingMusic');
		neutralEndingMusic = game.add.audio('neutralEndingMusic');
		badEndingMusic = game.add.audio('badEndingMusic');
		titleMusic = game.add.audio('titleMusic');
		titleMusic.play('', 0, 0.5, true);
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
		text = game.add.text(0, 0, "Prologue:\n\nYou sigh and sit exhaustively on the bloodied chair.\nYou killed the current leader of the mercenary guild,\nwhile the floor is covered in blood. You’ve gotten into this\nkingdom unnoticed and now you’ll become valuable to them.\nYou can’t wait for it all to come crumbling down.\nFor this kingdom has kidnapped and killed your brother,\nand you want revenge. So naturally you’ve decided to\ninfiltrate the kingdom, gain the people’s trust and then\ndestroy the entire kingdom from the inside out.\nYou’ve grown a bit sadistic since your brother’s death\nbut everyone here, no matter how indirectly, was involved.\nBut this is the only way to avenge your brother and you’ll do\nwhatever it takes.\nHit the next button to go to the tutorial.");
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
		text = game.add.text(0, 0, "Tutorial:\nThere are several interactable objects within the game:\n\nThe quest scroll: This is the first thing that should be clicked on \neach quest iteration. It’ll explain the problem and what\n the person asks of you.\n\nThe stamp: Allows you to accept the given quest.\nPlayers click and drag it onto the scroll to see\nhow it affected them.\n\nThe candle: Allows you to deny the given quest.\nPlayers click and drag it onto the scroll to see\nhow it affected them.\n\nThe knife: Allows you to kill the messenger.\nPlayers click and drag it onto the person to see how\nit affected them.\nHit the next button to go to the tutorial.",{font: "23px"});
		game.add.button(590, 520, "btnNext", gotoGame, this);
	},                                                                

	// update, run the game loop =====================
	update: function(){
		
	}
}

// Gameplay state ==============================================
var GamePlay = function(game){};
GamePlay.prototype = {
	// preload assets ================================
	preload: function(){
		
	},
	preload: function(){},

	// place assets ==================================
	create: function(){
		console.log("GamePlay: create");
		//spin up physics
		game.add.sprite(0, 0, "background", "GamePlay_BG");
		game.physics.startSystem(Phaser.Physics.ARCADE);

		//add sound
		bgMusic = game.add.audio('bgMusic');
		acceptMusic = game.add.audio('acceptMusic');
		declineMusic = game.add.audio('declineMusic');
		killMusic = game.add.audio('killMusic');
		bgMusic.play('', 0, 0.5, true); //loops

		//scroll obj is also quest obj, it acts as a double
		scroll = new Item(game, 370, 400, 'obj', 'scroll');
		game.add.existing(scroll);
		scroll.scale.set( 1.4, 1.4);
		scroll.alpha = 0;
		scroll.body.collideWorldBounds = false;
		

		//create npc depending on questNumber
		newNPC();

		if(questCounter == 0 || questCounter == 2 || questCounter == 4 || questCounter == 6 || questCounter == 8){
			if (haveRead == false){
				character = game.add.tween(commoner).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2000);
				scrollAnimation = game.add.tween(scroll).to({y: 460, alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2000);
				character.chain(scrollAnimation);
			}else{
				commoner.alpha = 1;
				scroll.alpha = 1;
				scroll.y = 460;
			}
		}else{
			if (haveRead == false){
				character = game.add.tween(noble).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2000);
				scrollAnimation = game.add.tween(scroll).to({y: 460, alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2000);
				character.chain(scrollAnimation);	
			}else{
				noble.alpha = 1;
				scroll.alpha = 1;
				scroll.y = 460;
			}
		}

		//create objects
		knife = new Item(game, 200, 530, 'obj', 'knife'); // (680, 530)
		game.add.existing(knife);
		knife.scale.set(1.3);

		stamp = new Item(game, 500, 450, 'obj', 'stamp');
		game.add.existing(stamp);	
		stamp.scale.set(1.3);

		candle = new Item(game, 610, 400, 'obj', 'candle');
		game.add.existing(candle);
		candle.scale.set(1.3);

		// UI score
		printCP = game.add.text(135, 58, comPoints);
		printNP = game.add.text(113, 87, noblePoints);

		// Player UI
		printMoney = game.add.text(665, 78, moneyPoints);
		printMen = game.add.text(700, 110, men);
		printSusp = game.add.text(715, 140, suspicion);

		game.input.mouse.capture = true;
	},

	// update, run the game loop =====================
	update: function(){
		game.physics.arcade.collide(knife, commoner, killMessenger, null, this);
		game.physics.arcade.collide(knife, noble, killMessenger, null, this);
		game.physics.arcade.collide(stamp, scroll, acceptQuest, null, this);
		game.physics.arcade.collide(candle, scroll, declineQuest, null, this);
		
		//taken from  https://phaser.io/examples/v2/input/pointer-over
		//start
		//dimmed color if mouse isn't over it
		if(knife.input.pointerOver()){
			knife.alpha = 1;
		}else{
			knife.alpha = 0.6;
		}

		if(stamp.input.pointerOver()){
			stamp.alpha = 1;
		}else{
			stamp.alpha = 0.6;
		}

		if(candle.input.pointerOver()){
			candle.alpha = 1;
		}else{
			candle.alpha = 0.6;
		}
		//end
		
		//taken from https://phaser.io/examples/v2/input/down-duration
		//start
		//if moused over scroll and click left button, go to READ state
		if(game.input.activePointer.leftButton.isDown && scroll.input.pointerOver()){
			game.state.start('Read');
		}
		
		// Game over conditions
		if(comPoints >= 100 || noblePoints >=100){
			//taken from nathan's paddle parkour example
			//start
			bgMusic.fadeOut(4500);
			game.time.events.add(Phaser.Timer.SECOND * 5, function() { game.state.start('GameOverG')});
		}else if(suspicion >= 100) {
			bgMusic.fadeOut(4500)
			game.time.events.add(Phaser.Timer.SECOND * 5, function() { game.state.start('GameOverB1')});
		}else if(men <= 0){
			bgMusic.fadeOut(4500)
			game.time.events.add(Phaser.Timer.SECOND * 5, function() { game.state.start('GameOverB2')});
		}else if(questCounter == 10){
			bgMusic.fadeOut(4500);
			game.time.events.add(Phaser.Timer.SECOND * 5, function() { game.state.start('GameOverN')});
		//end
		}
		
		//cutscene conditions
		if(acceptScene == true){
			//taken from nathan's paddle parkour example
			//start
			bgMusic.fadeOut(4999)
			game.time.events.add(Phaser.Timer.SECOND * 7, function() { game.state.start('CutSceneAccept')});
		}
		if(declineScene == true){
			bgMusic.fadeOut(4999)
			game.time.events.add(Phaser.Timer.SECOND * 7, function() { game.state.start('CutSceneDecline')});
		}
		if(killScene == true){
			bgMusic.fadeOut(4999)
			game.time.events.add(Phaser.Timer.SECOND * 7, function() { game.state.start('CutSceneKill')});
		//end
		}
	},

	// debugging method ===============================
	render: function(){
	//	game.debug.bodyInfo(scroll, 32, 32);
	//  game.debug.body(scroll);
		game.debug.text("Over: " + scroll.input.pointerOver(), 32, 32);
	//	game.debug.bodyInfo(commoner, 32, 32);
	//	game.debug.body(commoner);
	//  game.debug.bodyInfo(noble, 32, 32);
	//  game.debug.body(noble);
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
		//game.add.sprite(0, 0, 'obj', 'ReadScroll');
		game.add.sprite(0, 0, "background", "ReadScroll");
		if(haveRead == true){
			lineIndex = 0;
			wordIndex = 0;
		}
		text = game.add.text(350,350,"");
		text.anchor.set(0.5);
		game.add.button(590, 520, "btnBack", gotoGame, this);
		text = game.add.text(45,55, '', {font: "28px Papyrus", fill: "#8a3324"});
		nextLine();
		questStatus = false;
		playedKill = false;
		playedDecline = false;
		playedAccept = false;
		questCheck = true;
	},

	// update, run the game loop =====================
	update: function(){
		game.sound.stopAll();
		// load 'GamePlay' state when user pressed DELETE key
		if(game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE)) {
			game.state.start('GamePlay');
		}
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
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(590, 520, "btnNext", gotoGameC, this);
		cutSceneMusic = game.add.audio('cutSceneMusic');
		cutSceneMusic.play('', 0, 0.5, true);
	},

	//checks to see which accept cutscene to display depending on the the current questNumber
	update: function(){
		//quest 1's
		if(cutSceneTracker == false && questCounter == 1){
			game.add.text(30,50," He smile brightly at you as they leave. You think about\nthe times you were that happy and you realize all of\nthem were from when your brother was alive. You sigh\nheavily and leave to find your men.\n----\nMost come back as well as few more. They were so excited\nthat you helped them that they came to join you. It’s still\nearly so you’ll need all the men you can get. So they join\nand pay you a pitiful amount in reward but it doesn’t matter.\nYou don’t need it anyways.");
			cutSceneTracker = true;
			acceptScene = false;
			men += 10;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 2's.
		if(cutSceneTracker == false && questCounter == 2){
			game.add.text(30,50,"new TextA");
			cutSceneTracker = true;
			acceptScene = false;
			men += 0;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 3's.
		if(cutSceneTracker == false && questCounter == 3){
			game.add.text(30,50,"Some more textA");
			cutSceneTracker = true;
			acceptScene = false;
			men += 10;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 4's.
		if(cutSceneTracker == false && questCounter == 4){
			game.add.text(30,50,"The guy smiles a bit too suspiciously for your taste\nbut you already accepted. No backing out now.\nStrangely enough the guy refuses to meet your eyes.\n ----\nYou later find out that the quest was a failure.\nRemember when you thought they seemed a bit\nsuspicious after you accepted their request? Yea, it’s\nbecause they were suspicious.You believe they were\nlikely a spy. You lost all the men you sent out as well,\nthe compensation was a lie and some commoners are now\nalso angry with you for taking the package. Apparently\nit never belonged to the damn spy in the first place.");
			cutSceneTracker = true;
			acceptScene = false;
			//spy. no men are gained
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 5's.
		if(cutSceneTracker == false && questCounter == 5){
			game.add.text(30,50,"You see them smile happily as they leave. You sigh a bit\nin your seat and get ready to tell your men about this\nquest for them to do.\n-----\nMost of your men come back as well as some more.They\ntell you that they were so thankful that you got rid of their\nchimera problem that they came to join you. They also\n hand you a bag with some money. It was a pitiful amount\nbut you guess you shouldn’t expect much more from a\ngroup of commoners. Least you got more men into your\nguild. Easier to plot revenge with more men to send out.");
			cutSceneTracker = true;
			acceptScene = false;
			men += 15;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 6's.
		if(cutSceneTracker == false && questCounter == 6){
			game.add.text(30,50,"Some more textA");
			cutSceneTracker = true;
			acceptScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
			men += 3;
		}
		//quest 7's.
		if(cutSceneTracker == false && questCounter == 7){
			game.add.text(30,50,"The man grinned a bit too widely for your liking. You realize\nthe more you stare at them, the more that something seems\noff about them. You don’t know why but something is\ndefinitely off. But maybe you’re looking too much into it.\n-----\nYou later find out that the quest was a horrible failure.\nRemember when you thought something was off about\nthem? You were right to think that but you realize it too late\nTurns out they were a spy and all they wanted was to\ncause some chaos and ruin your reputation. Well it\nworked.The nobles are now pissed at you for messing\nwith their stuff. All the men you sent out all got arrested.\nAnd remember that reward they promised? Well that\nwas a lie too.");
			cutSceneTracker = true;
			acceptScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
			//spy. no men are gained
		}
		//quest 8's.
		if(cutSceneTracker == false && questCounter == 8){
			game.add.text(30,50,"Some more textA");
			cutSceneTracker = true;
			acceptScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
			men += 5;
		} 
		//quest 9's.
		if(cutSceneTracker == false && questCounter == 9){
			game.add.text(30,50,"The man smiles widely and looked about ready to\nhug you but, luckily for you,he doesn’t actually do it.\n---\nSome of your men come back but several others also come\nback. You’re told that they’re so thankful to not be cannon\nfodder that they’re hoping to join the guild. You could\nalways use some more men to help continue your plan. So\nyou let them join. They also paid you a decent amount for\nwhat commoners could pay. That’s always nice.");
			cutSceneTracker = true;
			acceptScene = false;
			men += 10;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 10 shouldn't have a cutscene since the game will end.
		if(cutSceneTracker == false && questCounter == 10){
			game.add.text(30,50,"You really shouldn't be here. Something went wrong if you're here");
			cutSceneTracker = true;
			acceptScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
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
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(590, 520, "btnNext", gotoGameC, this);
		cutSceneMusic = game.add.audio('cutSceneMusic');
		cutSceneMusic.play('', 0, 0.5, true);
	},

//checks to see which decline cutscene to display depending on the the current questNumber
	update: function(){
		//quest 1's.
		if(cutSceneTracker == false && questCounter == 1){
			game.add.text(30,50,"They shuffle a bit sadly out of the place and you shrug.\nWho said you had to help everyone? Besides, when you\nwere younger, your brother used to joke about the two of\nyou being pirates together. You sit in your chair and silently\nreminisce about the past.\n----\nYou find out that he eventually got some help. The town\nwas a bit destroyed but hey, it was fixed in the end. Some\nof the commoners were a bit miffed with you for not\nhelping but oh well. It’s still early.");
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 2's.
		if(cutSceneTracker == false && questCounter == 2){
			game.add.text(30,50,"new TextD");
			cutSceneTracker = true;
			declineScene = false;
		}
		//quest 3's.
		if(cutSceneTracker == false && questCounter == 3){
			game.add.text(30,50,"Some more textD");
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 4's.
		if(cutSceneTracker == false && questCounter == 4){
			game.add.text(30,50,"The guy storms out of the place and you shrug.\nSomething seemed fishy about him.\nMaybe it was the fidgetiness or maybe it was\nthe fact that they never looked you in the eye.\nYou’ll get more requests later anyways.\n-----\nYou find out later that some trouble was going on in\na nearby town to the one the noble came from...You suspect\nthe noble probably hired someone else to do the task.\nLooks like you’ll probably be cleaning up that mess.");
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 5's.
		if(cutSceneTracker == false && questCounter == 5){
			game.add.text(30,50,"You see them look away and slowly slink away. You feel\na slight twinge of pity for them before shrugging it\noff. You don’t have to fix every problem that comes to you.\n-------\nYou later find out the town’s people eventually got their\nroblem fixed. Their town is in shambles now because it took\nso long. You feel a bit guilty for saying no but hey, a\nchimera is not your problem to deal with. Besides,it ended\nwell anyways. So what if some commoners hold a bit of a\ngrudge against you right now. You’ll gladly watch their\nworld crumble later when you finish your mission.");
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 6's.
		if(cutSceneTracker == false && questCounter == 6){
			game.add.text(30,50,"Some more textD");
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 7's.
		if(cutSceneTracker == false && questCounter == 7){
			game.add.text(30,50,"The man looked rather pitifully at you but you feel no\nremorse for them. You don’t have to take it if you don’t want\nto. Besides… Something seems off about him. You don’t\nlike it so you send them on their way.\n----\nYou find out later that same commoner is now dead.\nApparently they were a spy and when he tried to do the task\nhimself,a merchant had killed him. A couple commoners\nbeing unhappy with you for letting him die is nothing\ncompared to the trouble accepting the quest would\nhave brought.");
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 8's.
		if(cutSceneTracker == false && questCounter == 8){
			game.add.text(30,50,"Some more textD");
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		} 
		//quest 9's.
		if(cutSceneTracker == false && questCounter == 9){
			game.add.text(30,50,"The man looks incredibly pitiful at you before leaving. You\nfeel slightly bad afterwards but...war always demands\nsacrifice. In one way or another, it’ll always take it.\n----\nYou find out later that most of those commoners are now\ndead or severely injured. The commoners are rather angry\nwith you for allowing this to happen. In times like these, you\nthink about your brother and he ended up in a similar\nposition. You miss him greatly...");
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 10 shouldn't have a cutscene since the game will end.
		if(cutSceneTracker == false && questCounter == 10){
			game.add.text(30,50,"You really shouldn't be here. Something went wrong if you're here");
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
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
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(590, 520, "btnNext", gotoGameC, this);
		cutSceneMusic = game.add.audio('cutSceneMusic');
		cutSceneMusic.play('', 0, 0.5, true);
	},

	//checks to see which kill cutscene to display depending on the the current questNumber
	update: function(){;
		//quest 1's.
		if(cutSceneTracker == false && questCounter == 1){
			game.add.text(30,50,"As the person dies, you wonder how you’ll clean up all\nthis mess. You sigh and set the knife down. You’ll have\nto clean this all up later. But first, disposing of the body.\nAs you leave to get rid of the body, some people take\nnote of the blood on your clothes and the bloody bag\nyou’re carrying with you. Some whisper about not\ngetting close as they heard a loud scream come from\ninside your guild recently. People are slightly suspicious\nof something going on but are far too afraid to say\nanything about it.");
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 2's.
		if(cutSceneTracker == false && questCounter == 2){
			game.add.text(30,50,"new Text");
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 3's.
		if(cutSceneTracker == false && questCounter == 3){
			game.add.text(30,50,"Some more textK");
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 4's.
		if(cutSceneTracker == false && questCounter == 4){
			game.add.text(30,50,"You watch them die and realize you may have enjoyed that\na bit too much. Oh well. They were a noble, part of the\nreason you came into this kingdom. They indirectly had a\n hand inkidnapping and killing your brother. So they\nprobably deserved it. But god…the blood was getting\neverywhere. You’ll have to deal with that later. You dig\naround his pockets to find a piece of paper that seemed\nto have a plan scrawled on it. “So they were a spy after all”\nYou mutter. You’re even more thankful you killed them.\nAs for the blood…You do have men who could take care\nof the dead body. You’ll make them do it.");
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 5's.
		if(cutSceneTracker == false && questCounter == 5){
			game.add.text(30,50,"You stare at the dead body before you. Unfortunately for\nyou,blood is now everywhere and that’s always just a pain\nto clean up. You’ll have to come up with a better way to kill\npeople.The knife is effective but messy and something\ncleaner might be nicer. As you dispose of the body, some\npeople wonder what that loud scream was coming from\nyour place.They also notice you covered in what\nsuspiciously looks like blood. Most are smart enough not to confront\nyou about his as you are the leader of the mercenaries\nand nobody wants them on their bad sides. They still can’t\nhelp but be curious though.");
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 6's.
		if(cutSceneTracker == false && questCounter == 6){
			game.add.text(30,50,"Some more textK");
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 7's.
		if(cutSceneTracker == false && questCounter == 7){
			game.add.text(30,50,"You watch them squirm a bit with the blood pouring out. It\namuses you slightly to watch them like this. You realize\nthis probably makes you a sadist but honestly,\nyou really don’t care. Everyone here silently,inadvertently\nhad a hand in kidnapping and killing of your brother.\nYou don’t care for these people. So watching them squirm\nwhen they die is considered a bit fun to you. Once they’re\ndead you tell your men to clean up the blood and go to get\nrid of the body.Some people look at you suspiciously\nas the bag you’re carrying is a bit blood soaked but\nnobody approaches you. You leave to finish getting rid of\nthis pesky body. You find out later that they were a spy.");
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 8's.
		if(cutSceneTracker == false && questCounter == 8){
			game.add.text(30,50,"Some more textK");
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 9's.
		if(cutSceneTracker == false && questCounter == 9){
			game.add.text(30,50,"As he said this, you felt a rush of rage come over you. How\ndare he say that. Those same nobles killed your brother\nand pushed you to become who you are now. You remind\nyourself that they are, however indirectly, related to what\nhappened to him and now you’re feeling quite indifferent,\nand maybe a little sadistic, about this group of commoners\nabout to be used as live fodder. Oh well. They’re going to\ndie anyways in one way or another. You look down at the\nmess you made and leave the room to have your men go\nand clean the mess up.");
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 10 shouldn't have a cutscene since the game will end
		if(cutSceneTracker == false && questCounter == 10){
			game.add.text(30,50,"You really shouldn't be here. Something went wrong if you're here");
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
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
		goodEndingMusic.play('', 0, 0.5, true);
		text = game.add.text(25,85, "You smile sadistically as you hear news of everything slowly\nfalling into chaos. Serves them right for murdering your\nbrother.They deserved this,this slow and painful demise of\nthis kingdom. And nobody will ever know it was your doing.\nYou decide to start packing up to leave soon.\nYou’re work here is done and you’re grown weary\nwith all the hard work your revenge took.\nYou yawn and decide on a nap before packing.\nYou can sleep happily knowing your plan was successful\nand you’ve finally avenged your brother.",{fill: "#ffffff"});
	},

	// update, run the game loop =====================
	update: function(){
		
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
		neutralEndingMusic.play('', 0, 0.5, true);
		text = game.add.text(25, 85, "You look at the papers and curse yourself quietly.\nYou’ve done some damage, but not enough.\nThey need to pay, they have to pay.\nBut despite your exhaustive efforts, you haven’t completed\nyour task yet.You crumple up the paper and throw it on the\nground before slumping in your seat tiredly.\nYou miss your home but you must avenge him first.\nYou decide to take a small nap first,\nmaybe some new ideas will come up during it.\n\nClick the play again button to try and fully complete\nyour mission.");
	},

	// update, run the game loop =====================
	update: function(){
		
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
		badEndingMusic.play('', 0, 0.5, true);
		text = game.add.text(25, 85, "You hear news that people are coming for you.\nThey’ve figured you out. They know you’ve been planning\ntheir demise and now they’re coming to arrest and\nlikely kill you. Your plan has failed but least you caused\nsome chaos before it failed. Besides, you’ve grown tired\nwithout your brother around. But now you’ll get to be with\nhim soon enough. You hear pounding on the door and\nyou’re ready for them. You’re done with this life anyways,\nnothing is holding you here anyways. That was taken\nfrom you long ago.\n\nClick the play again button to reattempt your mission");
	},

	// update, run the game loop =====================
	update: function(){
		
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
		badEndingMusic.play('', 0, 0.5, true);
		text = game.add.text(25, 85, "Bad ending, lost all men.");
	},

	// update, run the game loop =====================
	update: function(){
		
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
	questStatus = true;
	wordIndex = 0;
	lineIndex = 0;
	wordDelay = 140;
	lineDelay = 400;
	questCounter = 0;
	playedKill = true;
	playedDecline = true;
	playedAccept = true;
	cutSceneTracker = true;	
	acceptScene = false;
	declineScene = false;
	killScene = false;
	questCheck = false;
}

function newNPC(){
	//NPC constructor parameters(game, x, y, key, frame, aD, dD, kD, noblePoints, comPoints, negNoblePts, negComPts, men, susp, money);
	// Create commner object
	commoner = new NPC(game, 400, -500,'npc', 19, aD[questCounter], dD[questCounter], kD[questCounter], nobPtsArg[questCounter], comPtsArg[questCounter], negNobPtsArg[questCounter], negComPtsArg[questCounter], menArg[questCounter], suspArg[questCounter], moneyArg[questCounter]);
	game.add.existing(commoner);
	commoner.scale.set(.9);
	commoner.body.setSize(100, 270, 135, 120);
	commoner.alpha = 0;

	// Create noble object
	noble = new NPC(game, 400, -500,'npc', 0, aD[questCounter], dD[questCounter], kD[questCounter], nobPtsArg[questCounter], comPtsArg[questCounter], negNobPtsArg[questCounter], negComPtsArg[questCounter], menArg[questCounter], suspArg[questCounter], moneyArg[questCounter]);
	//game.physics.enable(noble, Phaser.Physics.ARCADE);
	game.add.existing(noble);
	noble.scale.set(.8);
	noble.body.setSize(100, 400, 120, 80);
	noble.alpha = 0;

	if(questCounter%2 == 0){
		moveComIn();
		moveNobleOut();
		// Pick a commer NPC
		if (Math.random() <= .33) {
			commoner.frameName = "Peasant001";
			console.log(commoner.frameName);
		} else if (Math.random() <= .66) {
			commoner.frameName = "Peasant005";
			console.log(commoner.frameName);
		} else {
			commoner.frameName = "Peasant009";
			console.log(commoner.frameName);
		}

	} else {
		moveNobleIn();
		moveComOut();
		// Pick a noble NPC
		if (Math.random() <= .33) {
			noble.frameName = "Noble001";
			console.log("noble 1");
		} else if (Math.random() <= .66) {
			noble.frameName = "Noble005";
			console.log("noble 2");
		} else {
			noble.frameName = "Noble009";
			console.log("noble 3");
		}
	}
}

//player choice functions
function acceptQuest(){
	haveRead = false;
	//makes sure the sound effect doesn't repeat 
	if(playedAccept == false){
	acceptMusic.play('', 0, 1, false);
	playedAccept = true;
	}
	if(questCheck == false){
		console.log(questCheck);
	game.add.text(60,game.world.height-100,"don't forget to read the quest first.",{font: "23px Fira Sans", fill: "#eed7a1"});
	}else{
		console.log(questCheck);
		game.add.text(0,0,' ');
	}
	
	//checks to see if you've already done an action, if you haven't, it checks which quest you're on and adds influence for the correct group,adds money and subtracts men for the given quest and displays correct person
	if (questStatus == false){
		questStatus = true;

		//commoner accept quests
		if (questCounter == 0 || questCounter == 2 || questCounter == 4 || questCounter == 6 || questCounter == 8 ){
			if (commoner.frameName == "Peasant001"){
				commoner.frameName = "Peasant004";
				console.log("should be com 1");
			} else if (commoner.frameName == "Peasant005"){
				commoner.frameName = "Peasant008";
				console.log("should be com 2");
			} else {
				commoner.frameName = "Peasant012";
				console.log("should be com 3");
			}
			//commoner spy accept quests. Noble influence goes down because commoner spy wanted to cause problems for the nobles
			if(questCounter == 6){
				noblePoints -= noble.negNoblePts;
			}
			comPoints += commoner.comPoints;
			moneyPoints += commoner.moneyPoints;
			men -= commoner.men;
			game.add.tween(commoner).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
			game.add.tween(scroll).to({alpha: 0}, 3000, Phaser.Easing.Linear.None, true, 1000);	
			game.time.events.add(5000, moveComOut, this);	
		}

		//noble accept quests
		if(questCounter == 1 || questCounter == 3 || questCounter == 5 || questCounter == 7 || questCounter == 9){
			if (noble.frameName == "Noble001"){
				noble.frameName = "Noble004";
				console.log("should be com 1");
			} else if (noble.frameName == "Noble005"){
				noble.frameName = "Noble008";
				console.log("should be com 2");
			} else {
				noble.frameName = "Noble012";
				console.log("should be com 3");
			}
			//noble spy accept quests. Commoner influence goes down because noble spy wanted to cause problems for the commoners
			if(questCounter == 3){
				comPoints -= commoner.negComPoints;
			}
			noblePoints +=  noble.noblePoints;
			moneyPoints += noble.moneyPoints;
			men -= noble.men
			game.add.tween(noble).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
			game.add.tween(scroll).to({alpha: 0}, 3000, Phaser.Easing.Linear.None, true, 1000);
			game.time.events.add(5000, moveNobleOut, this);
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
		text = game.add.text(50, game.world.height - 100, '', {font: "23px Fira Sans", fill: "#eed7a1"});
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
	haveRead = false;
	//makes sure the sound effect doesn't repeat 
	if(playedDecline == false){
	declineMusic.play('', 0, 1, false);
	playedDecline = true;
	}
	
	if(questCheck == false){
		console.log(questCheck);
	game.add.text(60,game.world.height-100,"don't forget to read the quest first.",{font: "23px Fira Sans", fill: "#eed7a1"});
	}else{
		console.log(questCheck);
		game.add.text(0,0,' ');
	}
//checks to see if you've already done an action, if you haven't, it checks which quest you're on and subtracts influence from the correct group and displays correct person
	if (questStatus == false){
		questStatus = true;

		//commoner decline
		if(questCounter == 0 || questCounter == 2 || questCounter == 4 || questCounter == 6 || questCounter == 8 ){
			if (commoner.frameName == "Peasant001"){
				commoner.frameName = "Peasant003";
				console.log("should be com 1");
			} else if (commoner.frameName == "Peasant005"){
				commoner.frameName = "Peasant007";
				console.log("should be com 2");
			} else {
				commoner.frameName = "Peasant011";
				console.log("should be com 3");
			}
			comPoints -= commoner.negComPoints;	
			game.add.tween(commoner).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
			game.add.tween(scroll).to({alpha: 0}, 3000, Phaser.Easing.Linear.None, true, 1000);	
			game.time.events.add(5000, moveComOut, this);		
		}

		//noble decline
		if(questCounter == 1 || questCounter == 3 || questCounter == 5 || questCounter == 7 || questCounter == 9){
			if (noble.frameName == "Noble001"){
				noble.frameName = "Noble003";
				console.log("should be com 1");
			} else if (noble.frameName == "Noble005"){
				noble.frameName = "Noble007";
				console.log("should be com 2");
			} else {
				noble.frameName = "Noble011";
				console.log("should be com 3");
			}
			noblePoints -= noble.negNoblePts;
			game.add.tween(noble).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
			game.add.tween(scroll).to({alpha: 0}, 3000, Phaser.Easing.Linear.None, true, 1000);	
			game.time.events.add(5000, moveNobleOut, this);			
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
		text = game.add.text(50, game.world.height - 100, '', {font: "23px Fira Sans", fill: "#eed7a1"});
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
	haveRead = false;
	//makes sure the sound effect doesn't repeat 
	if(playedKill == false){
	killMusic.play('', 0, 1, false);
	playedKill = true;
	}
	if(questCheck == false){
		console.log(questCheck);
	game.add.text(60,game.world.height-100,"don't forget to read the quest first.",{font: "23px Fira Sans", fill: "#eed7a1"});
	}else{
		console.log(questCheck);
		game.add.text(0,0,' ');
	}
//checks to see if you've already done an action, if you haven't, it checks which quest you're on and adds suspicion and displays correct person
	if (questStatus == false){
		questStatus = true;

		//commoner kill
		if(questCounter == 0 || questCounter == 2 || questCounter == 4 || questCounter == 6 || questCounter == 8 ){
			if (commoner.frameName == "Peasant001"){
				commoner.frameName = "Peasant002";
				console.log("should be com 1");
			} else if (commoner.frameName == "Peasant005"){
				commoner.frameName = "Peasant006";
				console.log("should be com 2");
			} else {
				commoner.frameName = "Peasant010";
				console.log("should be com 3");
			}
			suspicion += commoner.susp;
			game.add.tween(commoner).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
			game.add.tween(scroll).to({alpha: 0}, 3000, Phaser.Easing.Linear.None, true, 1000);		
			game.time.events.add(5000, moveComOut, this);
		}

		//noble kill
		if(questCounter == 1 || questCounter == 3 || questCounter == 5 || questCounter == 7 || questCounter == 9){
			if (noble.frameName == "Noble001"){
				noble.frameName = "Noble002";
				console.log("should be com 1");
			} else if (noble.frameName == "Noble005"){
				noble.frameName = "Noble006";
				console.log("should be com 2");
			} else {
				noble.frameName = "Noble010";
				console.log("should be com 3");
			}
			suspicion += noble.susp;
			game.add.tween(noble).to({alpha: 0}, 2500, Phaser.Easing.Linear.None, true, 2000);
			game.add.tween(scroll).to({alpha: 0}, 3000, Phaser.Easing.Linear.None, true, 1000);		
			game.time.events.add(5000, moveNobleOut, this);
		}
		printSusp.text = suspicion;
		story = commoner.kD;
		//makes sure THE GAME DOESN'T BREAK AFTER READING THE QUEST
		wordIndex = 0;
		lineIndex = 0;
		wordDelay = 140;
		lineDelay = 400;
		//loads in the text to scroll
		text = game.add.text(55, game.world.height - 100, '', {font: "23px Fira Sans", fill: "#eed7a1"});
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

// Helper function for game button to go to GamePlay state
function gotoGame(){
	titleMusic.stop();
	game.state.start('GamePlay');
}

//goes back to game from cutScenes
function gotoGameC(){
	cutSceneMusic.stop();
	game.state.start('GamePlay');
}

// Helper function for game button to go to Menu state
function gotoMenu(){
	goodEndingMusic.stop();
	neutralEndingMusic.stop();
	badEndingMusic.stop();
	game.state.start('Menu');
}

// Helper function for game button to go to Prologue state
function gotoPrologue(){
	titleMusic.stop();
	game.state.start('Prologue');
}

// Helper function for game button to go to Tutorial state
function gotoTutorial(){
	game.state.start('Tutorial');	
}

// Moves the commoner NPC out of the screen
function moveComOut(){
	commoner.y = -500;
	//scroll.y = -500;
}

// Moves the commoner NPC into of the screen
function moveComIn(){
	commoner.y = 240;
	scroll.y = 400;
}

// Moves the noble NPC out of the screen
function moveNobleOut(){
	noble.y = -500;
	//scroll.y = -500;
}

// Moves the noble NPC into of the screen
function moveNobleIn(){
	noble.y = 240;
	scroll.y = 400;
}


