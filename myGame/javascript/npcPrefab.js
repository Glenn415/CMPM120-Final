
function NPC(game, x, y, key, frame, aD, dD, kD , noblePoints, comPoints, negNoblePoints, negComPoints, men, susp, moneyPoints){
	//call to phaser.sprite
	Phaser.Sprite.call(this, game, x, y, key, frame);

	//add properties
	this.anchor.set(.5);
	this.noblePoints = noblePoints;
	this.comPoints = comPoints;
	this.men = men;
	this.susp = susp;
	this.moneyPoints = moneyPoints;
	this.aD = aD; //this is an array of Strings, accept dialogue
	this.dD = dD; //decline dialogue
	this.kD = kD; //kill dialogue
	this.negNoblePoints = negNoblePoints;
	this.negComPoints = negComPoints;
	//add physics
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.inputEnabled = true;
	this.enableBody = true;
	this.body.immovable = true;
}

NPC.prototype = Object.create(Phaser.Sprite.prototype);
NPC.prototype.constructor = NPC;