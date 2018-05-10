var game = new Phaser.Game(500, 500, Phaser.CANVAS, 'dialog', {create: create});

var story = ["fuck you motherfucker", "and fuck you too", "eat shit"]; //an array of strings
var line = [];

var wordIndex = 0;
var lineIndex = 0;

var wordDelay = 140;
var lineDelay = 400;

function create(){
	text = game.add.text(32, 32, '', {font: "15px Arial", fill: "#19de65"});
	nextLine();
}

function nextLine(){
	if(lineIndex === story.length){
		return; //we're done.
	}
	//split current line on spaces, so one word per array element
	line = story[lineIndex].split(' ');

	//reseet the word index to zero (first word in the line)
	wordIndex = 0;

	//call the nextWord function once for each word in the line (line.length)
	game.time.events.repeat(wordDelay, line.length, nextWord, this);

	lineIndex++;
}

function nextWord(){
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