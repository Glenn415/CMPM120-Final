var game = new Phaser.Game(800, 600, Phaser.AUTO);
//status variables
var text; men = 10, moneyPoints = 50, suspicion = 0, comPoints = 0, noblePoints = 0, questCounter = 0;
var commoner, noble, selector;
var playedKill = true;
var playedDecline = true;
var playedAccept = true;
var cutSceneTracker = true;
var acceptScene = false;
var declineScene = false;
var killScene = false;
var questCheck = false;
//====Below is a series of arrays holding input values for NPC object creation====
var menArg = [5,4,5,5,6,6,5,6,7,8];
var suspArg = [10,10,12,10,12,14,20,25,15,50]; 
var comPtsArg = [15,0,20,0,30,0,0,0,40,0]; 
var nobPtsArg = [0,12,0,0,0,25,0,30,0,35]; 
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
["Greetings,",
"I am a nobleman of the town of Loueyville my",
"request for you is simple enough for men of your",
"skills. I bequeathed a small portion of wealth",
"to a commoner as a loan. The person in question has",
"fled to the ghetto home to crime lords and the",
"destitute alike. The officers fear the place and",
"shirk from their duty, refusing my demands. The",
"mercenaries on the other hand aren't easily scared.",
"I need you to bring the commoner in so I can",
"collect on his debt he owes to me.",
],
["Hello",
"I am the mayor from the the town of Heaton", 
"I am in desperate need of your assistance. The pirates which",
"you drove off before, have returned. The pirates didn’t take", 
"you seriously and soon after you left they staged an attack on", 
"the village and… and they captured my daughter… please I need",
"your help, you must save my daughter. They ran off with her",
"demanding a ransom. We just don’t have the kind of money",
"they are asking for. In return for your help the town has agreed",
"that any loot that you plunder from the pirates you keep. Just", 
"return my daughter to me… please",
],
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
["Let’s get down to business,",
"I am a messenger representing the merchants of Belltonia",
"We’ve been having a run in with bandits reeking havoc",
"in the markets. These bandits are a very persistent",
"bunch, their numbers keep growing and now we have",
"need of your assistance. You will be given full",
"compensation for your services. We ask tht you dispose",
"of this nuisance and cleanse the streets of these pests.",
"Use any means necessary make sure you eradicate them",
"swiftly and as efficiently as humanly possible.",
"Just make sure they never return.",
],
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
["I am a messenger from the king himself",
"By his majesties decree the nation is requesting",
"The services of the mercenaries guild to supply",
"much needed troops to bolster the armies numbers",
"In the war. As you reside in this land of his majesty,",
"you are hereby required to provide sufficient",
"reinforcements to the nation's war efforts.The king",
"graciously offers a generous sum for your cooperation.",
"With the additional support of the mercenaries we hope",
"the fresh men supplied will be enough to throw our",
"enemies off guard and shift the war in our favor.",
],
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
 ["Sorry to be so blunt but we have an emergency.",
"The king himself is requesting your expertise in a",
"very important matter. The prince secretly joined the",
"war and has gotten himself captured by the enemy.",
"Since the mercenaries aren’t recognized as part of the,",
"nations army, we believe that you can use this to your",
"advantage and slip undercover into enemy territory and",
"rescue the prince from their clutches. This will most",
"definitely be a very risky and dangerous mission however,",
"the king is ready to throw in quite a fortune upon the safe",
"return of his son the prince.",
],
["You're done. Please leave the scroll and await the transition to the end screen."]
]; //an array of strings for quest description
var aD = [
["Oh thank you so much! I don’t really care if you kill them", 
"or scare them off. Just make sure they don’t come back!"],
["Ah ha, I see my sources were right. It's good to see that I can",
"depend on your services. I will await the news of your success."],
["Oh thank you so much! My daughter means everything to me. I",
"would forever be indebted to you for saving her from the pirates",
"clutches."],
["Excellent!",
"I greatly look forward to your success.",
"Thank you so very much for dealing with these commoners"],
["Oh thanks so much!",
"This means so much that you’ll help us calm it down."],
["Good, we expect to be kept constantly updated on your progress",
"My superiors will be greatly pleased with your professional assistance."],
["Oh thank you so much!",
"These pesky merchants will finally get what they deserve"],
["The king and nation are truly indebted to you for your services."],
["Oh-Oh thank you kind sir!",
"I knew your reputation wouldn’t fail us!",
"Thank you so much!"],
["The king can’t express his gratitude in your help rescuing his",
"reckless son."]
]; //accept dialogue array of array of strings :D
var dD = [
["Oh. I’m sorry to have bothered you then. I was just really hoping",
"for help. We really need these pirates gone before they destroy our",
"town. Guess I’ll keep looking."],
["Well it's your loss really I would have offered a small fortune for the",
"capture of that person. What a waste of time, now I must find someone",
"else."],
["You... You won't help me? You were my only hope, there is nobody",
"else to turn to. Is there anybody in this world who cares about",
"our town?"],
["Decline will you? I see... Well a piece of parting advice.", 
"Watch your back in Baystone"],
["Y-You don’t want to help us?",
"I-I really thought the leader of the mercenary guild would care.",
"Guess I was wrong...Sorry I bothered you with this then"],
["Heh, I see how it is. You guys probably don’t have what it takes to",
"handle the mission anyways. I’ll find someone else who is up for the",
"task."],
["Y-You don’t wanna help me? B-But why?"],
["The king will be very displeased that you have refused him."],
["You don’t want to help us…You do realize we’ll be turned into",
"basically live ammunition right? We’ll just be sacrifices to this war...",
"and you still don’t wanna help us...I’m sorry to even have asked"],
["You have just made yourself an enemy of the king"]
]; //decline dialogue
var kD = [
["I should’ve just stayed home… "], 
["I don't understand... how is this possible?"],
["What... why? I thought... unh."],
["You’re the worst."],
["I’m sorry to have even asked"],
["How dare you... The merchants shall hear of this deed."],
["I hate you."],
["You’ll live to regret this."],
["You’re no better than the nobles."],
["The king will find out about this, and when he does you will wish you were never born"]
]; //kill dialogue

//borrowed from https://stackoverflow.com/questions/31849667/how-to-type-word-by-word-or-line-by-line-in-phaser-js
//start
var line = [];
var wordIndex = 0;
var lineIndex = 0;
var wordDelay = 140;
var lineDelay = 400;
//end
var questStatus = true;
var haveRead = false;

// Main State ==================================================
var Menu = function(game){};
Menu.prototype = {
	// preload assets ================================
	preload: function(){
		//console.log("Menu: preload");

		// Loading art as atlases and images
		game.load.path = "../myGame/assets/img/";
		game.load.atlas("obj", "objects.png", "objects.json");
		game.load.atlas("npc", "npc_atlas.png", "npc_atlas.json");
		game.load.atlas("background", "background.png", "background.json");
		game.load.image("btnPlay", "btnPlay.png");
		game.load.image("btnTutorial", "btnTutorial.png");
		game.load.image("btnPlayAgain", "btnPlayAgain.png");
		game.load.image("btnNext", "btnNext.png");
		game.load.image("btnBack", "btnBack.png");
		game.load.image("btnHire", "btnHire.png");
		game.load.image("btnCredits", "btnCredits.png");

		// Loading all audio files
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
		//console.log("Menu: create");
		// Reset values and add background
		newGame();
		game.add.sprite(0, 0, "background", "GameTitle");
		// Button options
		game.add.button(150, 400, "btnPlay", gotoPrologue, this);
		game.add.button(450, 400, "btnTutorial", gotoTutorial, this);
		game.add.button(308, 500, "btnCredits", gotoCredits, this);
		// Start the music
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
		//console.log("Prologue: preload");
	},

	// place assets ==================================
	create: function(){
		//console.log("Prologue: create");
		game.add.sprite(0, 0, "background", "GameOver");
		text = game.add.text(5, 0, "Prologue:\n\nYou sigh and slump onto the bloodied chair.\nYou killed the current leader of the mercenary guild,\nleaving a bloody mess in your wake. You’ve gotten into this\nkingdom unnoticed and now you’ll become valuable to them.\nYou can’t wait for it all to come crumbling down.\nFor this kingdom has kidnapped and killed your brother,\nand you want revenge. So naturally you’ve decided to\ninfiltrate the kingdom, gain the people’s trust and then\ndestroy the entire kingdom from the inside out.\nEveryone here, no matter how indirectly, was involved.\nThis is the only way to avenge your brother that will satisfy you.\nYou'll bathe in their blood if that's what it takes.",{font: "28px Fira Sans", fill: "#eed7a1"});
		game.add.button(590, 520, "btnNext", gotoGame, this);
	},                                                                

	// update, run the game loop =====================
	update: function(){
		// load 'GamePlay' state when user pressed ENTER key
		if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
			game.state.start('Tutorial');
		}
	}
}

var Credits = function(game){};
Credits.prototype = {
	preload: function(){
		//console.log("Credits: preload");
	},
	create: function(){
		//console.log("Credits: create");
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(590, 520, "btnNext", gotoMenu, this);
		game.add.text(50,10,"Contributors to the game:\n\nSummer Gadsby: Programmer, Writer\nLisa Moua: Sound\nMuhammad Al-Suwaidi: Writer, Artist\nRoberto G Ortiz: Programmer, Artist\nZuola Guoerluoti: Programmer\nFound the Gameplay music: 'medieval introductions' by\n'Tristan_Lohengrin', on Freesound.org.\nAnd all other music we used from freesound.org and\nopengameart.org",{fill: "#eed7a1"});
	},
	update: function(){}
}

// Tutorial State ==============================================
var Tutorial = function(game){};
Tutorial.prototype = {
	// preload assets ================================
	preload: function(){
		//console.log("Tutorial: preload");
	},

	// place assets ==================================
	create: function(){
		//console.log("Tutorial: create");
		game.add.sprite(0, 0, "background", "GameOver");
		text = game.add.text(5, 0, "Tutorial:\n\nThere are several interactable objects within the game:\n\nThe quest scroll: This is the first thing that should be clicked on each quest\nIt’ll explain the problem and what the person asks of you.\n\nThe stamp: Allows you to accept the given quest. Players click and\ndrag it onto the scroll to see how it affected them.\n\nThe candle: Allows you to deny the given quest. Players click and\ndrag it onto the scroll to see how it affected them.\n\nThe knife: Allows you to kill the messenger. Players click and\ndrag it onto the person to see how it affected them.\n\nPlayers may buy 1 mercenary at a time for 50 gold.",{font: "23px",fill: "#eed7a1"});
		game.add.button(590, 520, "btnNext",gotoPrologue, this);
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
		//console.log("GamePlay: create");
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
		scroll = game.add.sprite(355,400,'obj','scroll');
		scroll.scale.set( 1.4, 1.4);
		scroll.alpha = 0;
		game.physics.enable(scroll);
		scroll.inputEnabled = true;
		scroll.enableBody = true;
		scroll.body.collideWorldBounds = false;
		

		//create npc depending on questNumber
		newNPC();

		if(questCounter == 0 || questCounter == 2 || questCounter == 4 || questCounter == 6 || questCounter == 8){
			if (haveRead == false){
				character = game.add.tween(commoner).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2000);
				scrollAnimation = game.add.tween(scroll).to({y: 450, alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2000);
				character.chain(scrollAnimation);
			}else{
				commoner.alpha = 1;
				scroll.alpha = 1;
				scroll.y = 450;
			}
		}else{
			if (haveRead == false){
				character = game.add.tween(noble).to({alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2000);
				scrollAnimation = game.add.tween(scroll).to({y: 450, alpha: 1}, 1000, Phaser.Easing.Linear.None, true, 2000);
				character.chain(scrollAnimation);	
			}else{
				noble.alpha = 1;
				scroll.alpha = 1;
				scroll.y = 450;
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

		// Button for buying a mercenary
		game.add.button(580, 250, "btnHire", buyMercenary, this);

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
		//end
		
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
		//game.debug.body(scroll);
		//game.debug.text("Over: " + scroll.input.pointerOver(), 32, 32);
		//game.debug.body(stamp);
		//game.debug.body(knife);
		//game.debug.body(candle);
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
		//console.log("Read: preload");
	},

	// place assets ==================================
	create: function(){
	//	console.log("Read: create");
		haveRead = true;
		//set story content;
		story = storyBase[questCounter];
		//	Place ReadScroll
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
		//console.log("CutSceneAccept: preload");
	},

	// place assets ==================================
	create: function(){
		//console.log("CutSceneAccept: create");
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(590, 520, "btnNext", gotoGameC, this);
		cutSceneMusic = game.add.audio('cutSceneMusic');
		cutSceneMusic.play('', 0, 0.5, true);
	},

	//checks to see which accept cutscene to display depending on the the current questNumber
	update: function(){
		//quest 1's
		if(cutSceneTracker == false && questCounter == 1){
			game.add.text(30,50,"He smiles brightly at you as he leaves. You think about\nthe times you were that happy and you realize all of\nthem were from when your brother was alive. You sigh\nheavily and leave to find your men.\n----\nMost come back as well as few more. They were so excited\nthat you helped them that they came to join you. It’s still\nearly so you’ll need all the men you can get. So they join\nand pay you a pitiful amount in reward but it doesn’t matter.\nYou don’t need it anyways.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			acceptScene = false;
			men += 7;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 2's.
		if(cutSceneTracker == false && questCounter == 2){
			game.add.text(30,50,"The man smirks in delight as he reaches over to shake hands\nwith you concluding the meeting. You can’t help but notice a\nsheen in his eyes... similar to your own, eyes hungry for revenge.\nYou can’t hope but think maybe there is more to the story than\nthe man is letting on. As the man exits the room you lean back\nin your chair, your resolve strengthened, whatever the noble’s\nquarrel with the commoner is merely a trifle next to yours. \n-----\nYou find out later in a report that the commoner was\nsuccessfully detained. Unable to pay off his debts\nthe man was sentenced to life enslavement as a labor worker\nfor the noble who hired you.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
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
			game.add.text(30,50,"The mayors red rimmed eyes glow with hope, it seems that the\nman has gone through a lot of hardships in quick succession.\nIn fact he’d probably be tearing up with joy if he had any tears\nleft from all the sorrow and despair he has endured. You decide\nto give into helping him since he has already suffered so much,\nno point in distressing him any further. The man leaves the room\nfull of hope that he has found help amongst the mercenaries.\n------\nWith the success of the mission you gained a lot of trust\nfrom the town of Heaton and more people came back your with\nmen wanting to join up with and become part of the\nmercenaries guild.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			acceptScene = false;
			men += 6;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 4's.
		if(cutSceneTracker == false && questCounter == 4){
			game.add.text(30,50,"The guy smiles a bit too suspiciously for your taste\nbut you already accepted. No backing out now.\nStrangely enough the guy refuses to meet your eyes.\n ----\nYou later find out that the quest was a failure.\nDamn, you should've seen the signs. The lack of eye contact,\nthe secrecy in their explanation...You believe they were\nlikely a spy. You lost all the men you sent out and\nthe compensation was a lie. Some commoners are now\nalso angry with you for taking the package too. Apparently\nit never belonged to the damn spy in the first place.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
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
			game.add.text(30,50,"You see them smile happily as they leave. You sigh a bit\nin your seat and get ready to tell your men about this\nquest for them to do.\n-----\nMost of your men come back as well as some more.They\ntell you that they were so thankful that you got rid of their\nchimera problem that they came to join you. They also\n hand you a bag with some money. It was a pitiful amount\nbut you guess you shouldn’t expect much more from a\ngroup of commoners. Least you got more men into your\nguild. Easier to plot revenge with more men to send out.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			acceptScene = false;
			men += 8;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 6's.
		if(cutSceneTracker == false && questCounter == 6){
			game.add.text(30,50,"The man smiles before leaving. You sigh exhausted and rest\nyour eyes for a minute. You’re really tired of having to be nice to\nthese people but you’re stuck with them till you fulfill your plan.\nSo you suck it up and leave to go tell your men about the quest.\n----\nMost of your men come back, and surprisingly a few nobles as\nwell. They tell you they were sick of their lives and wanted\nsomething new to do. So they decided to come join the guild.\nYou accept them after taking the reward because you still need\nmore men to help your revenge plans. You can’t wait till you’re\nall done and can leave this place in ruins.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
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
			game.add.text(30,50,"The man grinned a bit too widely for your liking. You realize\nthe more you stare at them, the more that something seems\noff about them. You don’t know why but something is\ndefinitely off. But maybe you’re looking too much into it.\n-----\nYou later find out that the quest was a horrible failure.\nRemember when you thought something was off about\nthem? You were right to think that but you realize it too late\nTurns out they were a spy and all they wanted was to cause some\nchaos and ruin your reputation. Well it worked.The nobles are\nnow pissed at you for messing with their stuff. All the men\nyou sent out all got arrested. And remember that reward they\npromised? Well that was a lie too.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
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
			game.add.text(30,50,"The king's messenger breaths a huge sigh of relief, seems that\nhe had doubts as to if the king's summons would go so smoothly.\nExcusing himself, he rushes off to report back to the king.\nMusing to yourself, wars are very chaotic messy things.\nIf you were to play your cards right, you could use this war to\nyour advantage. A plan is starting to hatch in your mind, this war\ncould be very useful in achieving your goals indeed. ",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			acceptScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
			men += 3;
		} 
		//quest 9's.
		if(cutSceneTracker == false && questCounter == 9){
			game.add.text(30,50,"The man smiles widely and looked about ready to\nhug you but, luckily for you,he doesn’t actually do it.\n---\nSome of your men come back but several others also come\nback. You’re told that they’re so thankful to not be cannon\nfodder that they’re hoping to join the guild. You could\nalways use some more men to help continue your plan. So\nyou let them join. They also paid you a decent amount for\nwhat commoners could pay. That’s always nice.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			acceptScene = false;
			men += 8;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 10 shouldn't have a cutscene since the game will end.
		if(cutSceneTracker == false && questCounter == 10){
			game.add.text(30,50,"You really shouldn't be here. Something went wrong if you're here",{font: "25px Comic Sans MS", fill: "#eed7a1"});
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
		//console.log("CutSceneDecline: preload");
	},

	// place assets ==================================
	create: function(){
		//console.log("CutSceneDecline: create");
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(590, 520, "btnNext", gotoGameC, this);
		cutSceneMusic = game.add.audio('cutSceneMusic');
		cutSceneMusic.play('', 0, 0.5, true);
	},

//checks to see which decline cutscene to display depending on the the current questNumber
	update: function(){
		//quest 1's.
		if(cutSceneTracker == false && questCounter == 1){
			game.add.text(30,50,"They shuffle a bit sadly out of the place and you shrug.\nWho said you had to help everyone? Besides, when you\nwere younger, your brother used to joke about the two of\nyou being pirates together. You sit in your chair and silently\nreminisce about the past.\n----\nYou find out that he eventually got some help. The town\nwas a bit destroyed but hey, it was fixed in the end. Some\nof the commoners were a bit miffed with you for not\nhelping but oh well. It’s still early.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 2's.
		if(cutSceneTracker == false && questCounter == 2){
			game.add.text(30,50,"The man frowns in disappointment, \“It would seem that the\nmercenaries aren’t as formidable as my sources would have me\nthink. To shirk away from a simple task... all I want is a simple\ncapture of a single person. Is that too much to ask?\” He retorts \nfuriously. Well good day to you sir he hrmphs, and rushes out\n and slams the door shut behind him. You glare at the space he\nwas at a moment ago, thinking to yourself of what a prat\nthe man was. So you were only too glad to see him leave.\n----\n You later find out that the noble still hasn’t found someone\nwilling to go after his man. You can’t help but take satisfaction\nin the nobles frustrations at his failed attempts to find someone\nfor his mission.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			declineScene = false;
		}
		//quest 3's.
		if(cutSceneTracker == false && questCounter == 3){
			game.add.text(30,50,"The man looks rather heartbroken at you as he turns away to\nleave. You feel no need to go help. You already considered\nhelping with pirates once. That was enough.\n----\nYou eventually find out that the man did get his daughter back.\nCost the city a fortune but they did it. The commoners there\nare a bit miffed with you but oh well. You have time to regain\ntheir trust. Besides, it’s almost a bit of petty revenge for not\nhelping. They lost someone important to them but unlike you,\nleast they got them back.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 4's.
		if(cutSceneTracker == false && questCounter == 4){
			game.add.text(30,50,"The guy storms out of the place and you shrug.\nSomething seemed fishy about him.\nMaybe it was the fidgetiness or maybe it was\nthe fact that they never looked you in the eye.\nYou’ll get more requests later anyways.\n-----\nYou find out later that some trouble was going on in\na nearby town to the one the noble came from...You suspect\nthe noble probably hired someone else to do the task.\nLooks like you’ll probably be cleaning up that mess.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 5's.
		if(cutSceneTracker == false && questCounter == 5){
			game.add.text(30,50,"You see them look away and slowly slink away. You feel\na slight twinge of pity for them before shrugging it\noff. You don’t have to fix every problem that comes to you.\n-------\nYou later find out the town’s people eventually got their\nproblem fixed. Their town is in shambles now because it took\nso long. You feel a bit guilty for saying no but hey, a\nchimera is not your problem to deal with. Besides,it ended\nwell anyways. So what if some commoners hold a bit of a\ngrudge against you right now. You’ll gladly watch their\nworld crumble later when you finish your mission.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 6's.
		if(cutSceneTracker == false && questCounter == 6){
			game.add.text(30,50,"You lunge forwards towards him, frightening the living daylights\nout of the nobleman. The man stumbles from leaning too far back\nand falls to the ground. Picking himself up, he quickly brushes\ndown his clothes before dashing out through the door. Heh,\nserves him right, the impertinent fool. You think you yourself,\nNobles are so easily spooked when they think their lives are\nendangered. All that they are useful for is their wealth and\nnot much else. Having to deal with them is such a bother. You\nsigh to yourself, but you have to do everything you can on your\nroad to revenge. Even if it means associating with snobby\nnoblemen who are so full of themselves.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 7's.
		if(cutSceneTracker == false && questCounter == 7){
			game.add.text(30,50,"The man looked rather pitifully at you but you feel no\nremorse for them. You don’t have to take it if you don’t want\nto. Besides… Something seems off about him. You don’t\nlike it so you send them on their way.\n----\nYou find out later that same commoner is now dead.\nApparently they were a spy and when he tried to do the task\nhimself,a merchant had killed him. A couple commoners\nbeing unhappy with you for letting him die is nothing\ncompared to the trouble accepting the quest would\nhave brought.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 8's.
		if(cutSceneTracker == false && questCounter == 8){
			game.add.text(30,50,"The man glares at you as he leaves. You roll your eyes at him\nonce he's gone. So what if the king is mad at you for this?\nYou're also mad at him for kidnapping and killing your brother.\nYou have no sympathy for him. Your sympathy is reserved for\npeople who didn’t murder your only family.\n----\nYou find out later that they eventually got enough men for\nwhat they wanted. They had to take more of the town’s people\nto do it but, you have no sympathy for anyone involved. They’re\nall silently involved with your brother’s murder. Only fair that\nthey get dragged into the war. Plus, you despise the king for\nmurdering your brother.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		} 
		//quest 9's.
		if(cutSceneTracker == false && questCounter == 9){
			game.add.text(30,50,"The man looks incredibly pitiful at you before leaving. You\nfeel slightly bad afterwards but...war always demands\nsacrifice. In one way or another, it’ll always take it.\n----\nYou find out later that most of those commoners are now\ndead or severely injured. The commoners are rather angry\nwith you for allowing this to happen. In times like these, you\nthink about your brother and how he ended up in a similar\nposition. You miss him greatly...",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			declineScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 10 shouldn't have a cutscene since the game will end.
		if(cutSceneTracker == false && questCounter == 10){
			game.add.text(30,50,"You really shouldn't be here. Something went wrong if you're here",{font: "25px Comic Sans MS", fill: "#eed7a1"});
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
		//console.log("CutSceneKill: preload");
	},

	// place assets ==================================
	create: function(){
		//console.log("CutSceneKill: create");
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(590, 520, "btnNext", gotoGameC, this);
		cutSceneMusic = game.add.audio('cutSceneMusic');
		cutSceneMusic.play('', 0, 0.5, true);
	},

	//checks to see which kill cutscene to display depending on the the current questNumber
	update: function(){;
		//quest 1's.
		if(cutSceneTracker == false && questCounter == 1){
			game.add.text(30,50,"As the person dies, you wonder how you’ll clean up all\nthis mess. You sigh and set the knife down. You’ll have\nto clean this all up later. But first, disposing of the body.\nAs you leave to get rid of the body, some people take\nnote of the blood on your clothes and the bloody bag\nyou’re carrying with you. Some whisper about not\ngetting close as they heard a loud scream come from\ninside your guild recently. People are slightly suspicious\nof something going on but are far too afraid to say\nanything about it.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 2's.
		if(cutSceneTracker == false && questCounter == 2){
			game.add.text(30,50,"Well since he asked you decided to oblige him the answer.\n\"Simple. you annoy me, and I couldn’t stand to hear you anymore.\nSo you’ve been silenced, that's one less winny noble in this\nworld\" You lean over him as he gasped his last breaths. \"Oh\ndon’t worry you won’t be missed. There are plenty more\njust like you to come\". Studying the man you realize that you\ndidn’t even feel anything for his death, you just killed a man in\ncold blood and you weren’t even fazed. Deciding that you didn’t\nwant to deal with the mess you send for someone to come\nclean it up. When they arrive they stop at the door stunned by\nthe sight of the man, blood pooling around his crumpled body.\nNoticing you, they just nod their heads and discreetly get\nto work.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 3's.
		if(cutSceneTracker == false && questCounter == 3){
			game.add.text(30,50,"Taking a man’s life is much easier than going through all the\ntrouble accepting and following through on peoples quests and\nmissions you muse. Poking the dead body with your foot, yeah\nthis one was saved from the hardships of life for the sweet\nrelief of death that you bestowed upon him. You think to\nyourself that you can’t afford any kind of relief until you have\nfulfilled your quest for revenge, only then would you feel ready\nto accept and move on. Yeah you definitely can’t afford to lose\nsight of your goals just yet. These are the things going around\nin your head while taking yet another body out to be\ndisposed of.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 4's.
		if(cutSceneTracker == false && questCounter == 4){
			game.add.text(30,50,"You watch them die and realize you may have enjoyed that\na bit too much. Oh well. They were a noble, part of the\nreason you came into this kingdom. They indirectly had a\nhand inkidnapping and killing your brother. So they\nprobably deserved it. But god…the blood was getting\neverywhere. You’ll have to deal with that later. You dig\naround his pockets to find a piece of paper that seemed\nto have a plan scrawled on it. “So they were a spy after all”\nYou mutter. You’re even more thankful you killed them.\nAs for the blood…You do have men who could take care\nof the dead body. You’ll make them do it.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 5's.
		if(cutSceneTracker == false && questCounter == 5){
			game.add.text(30,50,"You stare at the dead body before you. Unfortunately for\nyou,blood is now everywhere and that’s always just a pain\nto clean up. You’ll have to come up with a better way to kill\npeople.The knife is effective but messy and something\ncleaner might be nicer. As you dispose of the body, some\npeople wonder what that loud scream was coming from\nyour place.They seem to notice the blood you're covered in.\nMost are smart enough not to confront you about this\nas the leader of the mercenaries and nobody wants them\non their bad sides.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 6's.
		if(cutSceneTracker == false && questCounter == 6){
			game.add.text(30,50,"You laugh loudly and smirk. “The merchants can’t hear about it if\nyou’re dead.” The man dies in in front of you and you shrug.\nYou have no feelings towards them as die in front of you. How\nfunny that the guy thought the merchants would hear about his\ndeath. Too late now. You notice you got blood all over you as\nyou killed him and you sigh. Now you’re going to have to change\ninto new clothes while you make your men deal with the dead\nbody. Should you feel something about the death? Probably.\nDo you? Nope. They’re unimportant in your mind. Who cares if a\nfew people have to die along the way. Vengeance for your\nbrother is worth it all.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 7's.
		if(cutSceneTracker == false && questCounter == 7){
			game.add.text(30,50,"You watch them squirm a bit with the blood pouring out. It\namuses you slightly to watch them like this. You realize\nthis probably makes you a sadist but honestly,\nyou really don’t care. Everyone here silently,inadvertently\nhad a hand in kidnapping and killing of your brother.\nYou don’t care for these people. So watching them squirm\nwhen they die is a bit fun to you. Once they’re dead,\nyou tell your men to clean up the blood and go to get rid\nof the body. Some people look at you suspiciously\nas the bag you’re carrying is a bit blood soaked but nobody\napproaches you. You leave to finish getting rid of\nthis annoyance. You find out later that they were a spy.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 8's.
		if(cutSceneTracker == false && questCounter == 8){
			game.add.text(30,50,"Right now your only regret is not being able to bring him back to\nlife to kill him again. Anyway, you don’t have time for regrets.\nYou're starting to get restless the longer it takes to achieve\nyour goal. That said, staging an unrest that would throw the\nnation into chaos doesn't happen overnight. Admittedly, killing\nthe kings messenger was an open act of treachery, but you don’t\ncare at the moment. In a sudden fit of rage you let out all your\npent up anger slashing away at the corpse until it was no longer\neven recognizable. As you cooled down a bit, you can’t but help\nthink that it wasn’t such a bad idea after all. Now the king\nprobably won’t even know what happened to the guy. You shrug\nand decide to take care of the bloody mess yourself,\nlest one of your men were to snitch on you.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 9's.
		if(cutSceneTracker == false && questCounter == 9){
			game.add.text(30,50,"As he said this, you felt a rush of rage come over you. How\ndare he say that. Those same nobles killed your brother\nand pushed you to become who you are now. You remind\nyourself that they are, however indirectly, related to what\nhappened to him and now you’re feeling quite indifferent,\nand maybe a little sadistic, about this group of commoners\nabout to be used as live fodder. Oh well. They’re going to\ndie anyways in one way or another. You look down at the\nmess you made and leave the room to have your men go\nand clean the mess up.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
			cutSceneTracker = true;
			killScene = false;
			questCheck = false;
			playedAccept = true;
			playedKill = true;
			playedDecline = true;
		}
		//quest 10 shouldn't have a cutscene since the game will end
		if(cutSceneTracker == false && questCounter == 10){
			game.add.text(30,50,"You really shouldn't be here. Something went wrong if you're here",{font: "25px Comic Sans MS", fill: "#eed7a1"});
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
		//console.log("GameOverG: preload");
	},

	// place assets ==================================
	create: function(){
		//console.log("GameOverG: create");
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(0, 0, "btnPlayAgain", gotoMenu ,this);
		goodEndingMusic.play('', 0, 0.5, true);
		text = game.add.text(25,85, "You smile sadistically as you hear news of everything slowly\nfalling into chaos. Serves them right for murdering your\nbrother.They deserved this,this slow and painful demise of\nthis kingdom. And nobody will ever know it was your doing.\nYou decide to start packing up to leave soon.\nYou’re work here is done and you’re grown weary\nwith all the hard work your revenge took.\nYou yawn and decide on a nap before packing.\nYou can sleep happily knowing your plan was successful\nand you’ve finally avenged your brother.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
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
		//console.log("GameOverN: preload");
	},

	// place assets ==================================
	create: function(){
		//console.log("GameOverN: create");
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(0, 0, "btnPlayAgain", gotoMenu ,this);
		neutralEndingMusic.play('', 0, 0.5, true);
		text = game.add.text(25, 85, "You look at the papers and curse yourself quietly.\nYou’ve done some damage, but not enough.\nThey need to pay, they have to pay.\nBut despite your exhaustive efforts, you haven’t completed\nyour task yet.You crumple up the paper and throw it on the\nground before slumping in your seat tiredly.\nYou miss your home but you must avenge him first.\nYou decide to take a small nap first,\nmaybe some new ideas will come up during it.\n\nClick the play again button to try and fully complete\nyour mission.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
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
		//console.log("GameOverB1: preload");
	},

	// place assets ==================================
	create: function(){
		//console.log("GameOverB1: create");
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(0, 0, "btnPlayAgain", gotoMenu ,this);
		badEndingMusic.play('', 0, 0.5, true);
		text = game.add.text(25, 85, "You hear news that people are coming for you.\nThey’ve figured you out. They know you’ve been planning\ntheir demise and now they’re coming to arrest and\nlikely kill you. Your plan has failed but least you caused\nsome chaos before it failed. Besides, you’ve grown tired\nwithout your brother around. But now you’ll get to be with\nhim soon enough. You hear pounding on the door and\nyou’re ready for them. You’re done with this life anyways,\nnothing is holding you here anyways. That was taken\nfrom you long ago.\n\nClick the play again button to reattempt your mission",{font: "25px Comic Sans MS", fill: "#eed7a1"});
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
		//console.log("GameOverB2: preload");
	},

	// place assets ==================================
	create: function(){
		//console.log("GameOverB2: create");
		game.stage.backgroundColor = "#707070";
		game.add.sprite(0, 0, "background", "GameOver");
		game.add.button(0, 0, "btnPlayAgain", gotoMenu ,this);
		badEndingMusic.play('', 0, 0.75, true);
		text = game.add.text(25, 85, "You look around the guild and sigh heavily. All your men\nhave either been killed or arrested. You slump exhaustively \nin your chair. You did cause a little bit of chaos before you\nran out of men. But it wasn’t nearly enough to be satisfied\nwith. You wanted to avenge your brother but now you have\nnobody left. You’re completely and utterly alone. And you\nhate that. You’ve never liked being alone. You close your\neyes and fall asleep. You need some sleep before recruiting\nmore men so you can finish your plan.\n\nClick the play again button to reattempt your mission.",{font: "25px Comic Sans MS", fill: "#eed7a1"});
	},

	// update, run the game loop =====================
	update: function(){
		
	}
}

// Add the states to the StateManager and start in Menu
game.state.add("Menu", Menu);
game.state.add("Credits", Credits);
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

	if (haveRead == false){
		randomNumber();
		//console.log(selector);
	} 
	if(questCounter%2 == 0){
		moveComIn();
		moveNobleOut();
		// Pick a commer NPC
		if (selector <= .33) {
			commoner.frameName = "Peasant001";
			//console.log(commoner.frameName);
		} else if (selector <= .66) {
			commoner.frameName = "Peasant005";
			//console.log(commoner.frameName);
		} else {
			commoner.frameName = "Peasant009";
			//console.log(commoner.frameName);
		}

	} else {
		moveNobleIn();
		moveComOut();
		// Pick a noble NPC
		if (selector <= .33) {
			noble.frameName = "Noble001";
			//console.log("noble 1");
		} else if (selector <= .66) {
			noble.frameName = "Noble005";
			//console.log("noble 2");
		} else {
			noble.frameName = "Noble009";
			//console.log("noble 3");
		}
	}

	if (haveRead == true) {
		if(questCounter%2 == 0){
			moveComIn();
			moveNobleOut();
			// Pick a commer NPC
			if (selector <= .33) {
				commoner.frameName = "Peasant001";
				//console.log(commoner.frameName);
			} else if (selector <= .66) {
				commoner.frameName = "Peasant005";
				//console.log(commoner.frameName);
			} else {
				commoner.frameName = "Peasant009";
				//console.log(commoner.frameName);
			}

		} else {
			moveNobleIn();
			moveComOut();
			// Pick a noble NPC
			if (selector <= .33) {
				noble.frameName = "Noble001";
				//console.log("noble 1");
			} else if (selector <= .66) {
				noble.frameName = "Noble005";
				//console.log("noble 2");
			} else {
				noble.frameName = "Noble009";
				//console.log("noble 3");
			}
		}		
	}
}

//
function randomNumber(){
	selector = Math.random();
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
		//console.log(questCheck);
	game.add.text(93,game.world.height-100,"don't forget to read the quest first.",{font: "23px Fira Sans", fill: "#eed7a1"});
	}else{
		//console.log(questCheck);
		game.add.text(0,0,' ');
	}
	
	//checks to see if you've already done an action, if you haven't, it checks which quest you're on and adds influence for the correct group,adds money and subtracts men for the given quest and displays correct person
	if (questStatus == false){
		questStatus = true;

		//commoner accept quests
		if (questCounter == 0 || questCounter == 2 || questCounter == 4 || questCounter == 6 || questCounter == 8 ){
			if (commoner.frameName == "Peasant001"){
				commoner.frameName = "Peasant004";
				//console.log("should be com 1");
			} else if (commoner.frameName == "Peasant005"){
				commoner.frameName = "Peasant008";
				//console.log("should be com 2");
			} else {
				commoner.frameName = "Peasant012";
				//console.log("should be com 3");
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
				//console.log("should be com 1");
			} else if (noble.frameName == "Noble005"){
				noble.frameName = "Noble008";
				//console.log("should be com 2");
			} else {
				noble.frameName = "Noble012";
				//console.log("should be com 3");
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
		text = game.add.text(93, game.world.height - 100, '', {font: "23px Fira Sans", fill: "#eed7a1"});
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
		//console.log(questCheck);
	game.add.text(93,game.world.height-100,"don't forget to read the quest first.",{font: "23px Fira Sans", fill: "#eed7a1"});
	}else{
		//console.log(questCheck);
		game.add.text(0,0,' ');
	}
//checks to see if you've already done an action, if you haven't, it checks which quest you're on and subtracts influence from the correct group and displays correct person
	if (questStatus == false){
		questStatus = true;

		//commoner decline
		if(questCounter == 0 || questCounter == 2 || questCounter == 4 || questCounter == 6 || questCounter == 8 ){
			if (commoner.frameName == "Peasant001"){
				commoner.frameName = "Peasant003";
				//console.log("should be com 1");
			} else if (commoner.frameName == "Peasant005"){
				commoner.frameName = "Peasant007";
				//console.log("should be com 2");
			} else {
				commoner.frameName = "Peasant011";
				//console.log("should be com 3");
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
				//console.log("should be com 1");
			} else if (noble.frameName == "Noble005"){
				noble.frameName = "Noble007";
				//console.log("should be com 2");
			} else {
				noble.frameName = "Noble011";
				//console.log("should be com 3");
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
		text = game.add.text(93, game.world.height - 100, '', {font: "23px Fira Sans", fill: "#eed7a1"});
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
		//console.log(questCheck);
	game.add.text(93,game.world.height-100,"don't forget to read the quest first.",{font: "23px Fira Sans", fill: "#eed7a1"});
	}else{
		//console.log(questCheck);
		game.add.text(0,0,' ');
	}
//checks to see if you've already done an action, if you haven't, it checks which quest you're on and adds suspicion and displays correct person
	if (questStatus == false){
		questStatus = true;

		//commoner kill
		if(questCounter == 0 || questCounter == 2 || questCounter == 4 || questCounter == 6 || questCounter == 8 ){
			if (commoner.frameName == "Peasant001"){
				commoner.frameName = "Peasant002";
				//console.log("should be com 1");
			} else if (commoner.frameName == "Peasant005"){
				commoner.frameName = "Peasant006";
				//console.log("should be com 2");
			} else {
				commoner.frameName = "Peasant010";
				//console.log("should be com 3");
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
				//console.log("should be com 1");
			} else if (noble.frameName == "Noble005"){
				noble.frameName = "Noble006";
				//console.log("should be com 2");
			} else {
				noble.frameName = "Noble010";
				//console.log("should be com 3");
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
		text = game.add.text(93, game.world.height - 100, '', {font: "23px Fira Sans", fill: "#eed7a1"});
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
	titleMusic.stop();
	game.state.start('Tutorial');	
}

// Helper function for game button to go to Credits state
function gotoCredits(){
	titleMusic.stop();
	game.state.start('Credits');	
}

// Helper function for game button to add more mercenaries
function buyMercenary(){
	if(moneyPoints >= 50){
		men += 1;
		moneyPoints -=50;
		printMen.text = men;
		printMoney.text = moneyPoints;
		//console.log("mercenaries");
	}
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
