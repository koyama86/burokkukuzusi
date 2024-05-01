'use strict';
import {View} from "./view.js";

export class ResultView extends View{
    constructor(context){
        super(context);
    }

    /**drawは画面に描画する際に使う名前 */
    draw(resultMessage){
        // 結果を描画する
        this.context.textAlign = "center";
        this.context.textBaseline = "middle";
        this.context.fillStyle = "white";
        this.context.font = "24px Arial";

        this.context.fillText(
            resultMessage,
            this.context.canvas.width / 2,
            this.context.canvas.height / 2

        )
    }
}