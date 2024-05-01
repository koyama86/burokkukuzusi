'use strict';
import { MainView } from "./mainView.js";
import { GameView } from "./GameVIew.js";
import { ResultView } from "./resultView.js";



export class BlocksGame {
    #canvas;
    #context;
    /**現在表示するビューの名前 */
    #viewname = "";
    /**メイン画面 */
    #mainView = null;
    /** ゲーム画面*/
    #gameView = null;
    /** 結果画面*/
    #resultView = null;
    /**インターバルID */
    #intervalId = null;
    /**インターバル時間 */
    #INTERVAL_TIME_MS = 1000 / 60;



    constructor(canvasId) {
        this.#canvas = document.getElementById(canvasId);
        if (this.#canvas === null) {
            /**例外処理（throw）を行うと、例外が発生したとき下の一行を実行し、ifから下の処理は実行されない */
            throw new Error("canvasが見つかりません");
        }
        this.#context = this.#canvas.getContext("2d");
        this.#mainView = new MainView(this.#context);
        this.#gameView = new GameView(this.#context);
        this.#resultView = new ResultView(this.#context);

        // this.#resultView.draw();
        this.#viewname = "MainView";

        this.#start();
    }
    /**インターバル開始 */
    #start() {
        this.#intervalId = setInterval(() => {
            this.#run();
        }, this.#INTERVAL_TIME_MS);
    }
    /**インターバル終了 */
    #stop() {
        clearInterval(this.#intervalId);
        this.#intervalId = null;
    }

    #run() {
        switch (this.#viewname) {
            case "MainView":
                this.#gameView.draw();
                this.#mainView.draw();
                // メインのフラグによって処理変更
                if (this.#mainView.isVisible === false) {
                    this.#viewname = "GameView";
                }
                break;
            case "GameView":
                this.#context.clearRect(0, 0, this.#canvas.clientWidth, this.#canvas.height);
                this.#gameView.update();
                this.#gameView.draw();
                if (this.#gameView.isVisible === false) {
                    
                    this.#viewname = "ResultView";
                }

                break;

            case "ResultView":
                this.#resultView.draw(this.#gameView.resultMessage);
                // タイマーをとめる
                this.#stop();
                break;



        }
    }


    setKeydownKey(key) {
        switch (this.#viewname) {
            case "MainView":
                this.#mainView.executePlayerAction({ [key]: true });
                break;
            case "GameView":
                this.#gameView.executePlayerAction({ [key]: true });
                break;
            case "ResultView":
                break;
        }
    }

    setKeyupKey(key) {
        switch (this.#viewname) {
            case "MainView":
                this.#mainView.executePlayerAction({ [key]: true });
                break;
            case "GameView":
                this.#gameView.executePlayerAction({ [key]: false });
                break;
            case "ResultView":
                break;
        }
    }

}
