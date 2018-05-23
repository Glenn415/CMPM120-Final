function Candle(game, x, y, key, frame){
	//call to phaser.sprite
	Phaser.Sprite.call(this, game, x, y, key, frame);

	//add properties
	this.anchor.set(.5);

	//add physics
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.inputEnabled = true;
}

Candle.prototype = Object.create(Item);
Candle.prototype.constructor = Candle;
//overRide update function to check for mouse events
Candle.prototype.update = function(){
	//if dropped onto NPC.sprite, kill itself and the NPC
}