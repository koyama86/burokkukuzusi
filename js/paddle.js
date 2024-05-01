'use strict'

export class Paddle{
    context;
    /**x座標 */
    x;
    /**y座標 */
    y;
    /**幅 */
    width;
    /**高 */
    height;
    /**x軸の移動速度 */
    // +で右、-で左
    dx = 0;
    /**移動速度  */
    speed;

    constructor(context,x,y,width,height,speed) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        

    }    
    /**移動する */
    move() {
        this.x += this.dx;
    }
    /**描画 */
    draw(){
        this.context.beginPath();
        this.context.rect(this.x,this.y,this.width,this.height);
        this.context.fillStyle = "green";
        this.context.fill();
        this.context.closePath();
    }
}