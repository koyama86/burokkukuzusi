'use strict';

export class Block{
    context;
    x;
    y;
    width;
    height;
    status = true;
    static POINT = 10;


    constructor(context,x,y,width,height){
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

    }

        //得点取得
        getPoint(){
            return Block.POINT;
        }


    draw(){
        if(this.status === true){
            // ブロック描画
            this.context.fillStyle = "#a47f61";
            this.context.fillRect(this.x,this.y,this.width,this.height);
        }
    }


}

// Blockを継承
export class HardBlock extends Block{
    // 得点
    static POINT = 50;
    // HP
    hp = 3;
    
    constructor(context,x,y,width,height) {
        super(context,x,y,width,height);        
    }

    //得点取得
    getPoint(){
        return HardBlock.POINT;
    }


    draw(){
        if(this.status === true){
            // ブロック描画
            this.context.fillStyle = "#D2691E";
            this.context.fillRect(this.x,this.y,this.width,this.height);
        }
    }
}