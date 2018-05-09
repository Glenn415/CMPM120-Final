
function Item(game, x, y, key, frame){
	//call to phaser.sprite
	Phaser.Sprite.call(this, game, x, y, key, frame);

	//add properties
	this.anchor.set(.5);

	//add physics
	game.physics.enable(this);
	this.body.collideWorldBounds = true;
	this.inputEnabled = true;
}

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;
//overRide update function to check for mouse events
Item.prototype.update = function(){
	//click and drag
	if ( this.body.x == game.input.mousePointer.x && this.body.y == game.input.mousePointer.y && game.input.activePointer.isDown){
		this.body.x = game.input.mousePointer.x;
		this.body.y = game.input.mousePointer.y;
	}
}