'use strict'

class Score {
    Score = 0;
}

export class Bar{
    context;
    #score;

    constructor(context){
        this.context  = context;
        this.#score = new Score();
    }

    addScore(value){
        this.#score.Score += value;
    }

    draw(){
        this.context.fillStyle ="darkgray";
        this.context.fillRect(0,0,this.context.canvas.width,20);

        const ScoreString = this.#score.Score.toString().padStart(5,"9");
        this.context.fillStyle = "black";
        this.context.font = "16px Arial";
        this.context.fillText(`Score ${ScoreString}`,250,10 );
    }
}