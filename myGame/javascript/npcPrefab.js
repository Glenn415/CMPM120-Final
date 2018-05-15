
function NPC(game, x, y, key, frame, dialogue, noblePoints, comPoints, men, susp, money){
	//call to phaser.sprite
	Phaser.Sprite.call(this, game, x, y, key, frame);

	//add properties
	this.anchor.set(.5);
	this.noblePoints = noblePoints;
	this.comPoints = comPoints;
	this.men = men;
	this.susp = susp;
	this.money = money;
	this.dialogue = dialogue; //this is an array of Strings

	//add physics
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.inputEnabled = true;
	this.input.enableDrag(); //enable click and drag
	this.enableBody = true;
}

NPC.prototype = Object.create(Phaser.Sprite.prototype);
NPC.prototype.constructor = NPC;