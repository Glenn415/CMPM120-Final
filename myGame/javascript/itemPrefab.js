
function Item(game, x, y, key, frame){
	//call to phaser.sprite
	Phaser.Sprite.call(this, game, x, y, key, frame);

	//add properties
	this.anchor.set(.5);

	//add physics
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.inputEnabled = true;
	this.input.enableDrag(); //enable click and drag
	this.enableBody = true;
}

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

Item.prototype.update = function(){}