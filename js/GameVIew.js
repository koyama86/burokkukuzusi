'use strict';
import { View } from "./view.js";
import { Ball } from "./ball.js";
import { Paddle } from "./paddle.js";
import { Block, HardBlock } from "./block.js";
import { Bar } from "./bar.js";
import { Sound } from "./sound.js";

export class GameView extends View {
    #ball = null;
    #paddle = null;
    #blocks = [];
    #bar = null;

    resultMessage = "";

    // パドルぶつかり時の音
    #paddleBallSound;
    // こっちはブロック
    #blockBallSound;


    constructor(context) {
        super(context);

        this.#ball = new Ball(context, 20, 440, 5, 2, 2);
        this.#paddle = new Paddle(context, 30, 460, 40, 4, 5);
        this.#blocks = [
            new Block(context, 10, 40, 52, 20),
            new Block(context, 72, 40, 52, 20),
            new HardBlock(context, 196, 40, 52, 20),
            new HardBlock(context, 260, 40, 52, 20),
        ];
        this.#bar = new Bar(context);

        this.#paddleBallSound = new Sound("./sounds/laks_01.mp3");
        this.#blockBallSound = new Sound("./sounFds/決定ボタンを押す38.mp3");

    }

    executePlayerAction(key) {
        if (key["ArrowLeft"] || key["Left"]) {
            this.#paddle.dx = -this.#paddle.speed;
        } else if (key["ArrowRight"] || key["Right"]) {
            this.#paddle.dx = this.#paddle.speed;
        } else {
            this.#paddle.dx = 0;
        }
    }
    #isGameClear() {
        const _siGameClear = this.#blocks.every((block) => block.status === false);
        if (_siGameClear) {
            this.resultMessage = "ゲームクリア"
        }
        return _siGameClear;

    }

    // gameover処理
    #isGameOver() {
        const bally = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDy = this.#ball.dy;

        //下にぶつかったかと 結果設定
        const _isGameOver =
            this.context.canvas.height - ballRadius < bally + ballDy;
        if (_isGameOver) {
            this.resultMessage = "ゲームオーバー";
        }
        return _isGameOver;
    }

    // ボールと壁の衝突をかくにんする
    #checkCollisionBallAndWall() {
        const canvasWidth = this.context.canvas.width;
        const canvasHeight = this.context.canvas.height;
        const ballx = this.#ball.x;
        const bally = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;

        if (
            ballx + ballDx < ballRadius ||
            canvasWidth - ballRadius < ballx + ballDx
        ) {
            this.#ball.dx *= -1;
            return;
        }
        //上の壁に当たったら
        if (bally + ballDy < ballRadius + 20) {
            this.#ball.dy *= -1;
            return;
        }
        // 下の壁にぶつかったら
        // if (canvasHeight - ballRadius < bally + ballDy) {
        //     this.#ball.dy *= -1;
        //     return;
        // }
    }

    #checkCollisionPaddleAndWall() {
        const canvasWidth = this.context.canvas.width;
        const paddlewidth = this.#paddle.width;
        const paddlex = this.#paddle.x;
        const paddleDx = this.#paddle.dx;

        // 左
        if (paddlex + paddleDx < 0) {
            this.#paddle.dx = 0;
            this.#paddle.x = 0;
            return;
        }
        // 右
        if (canvasWidth - paddlewidth < paddlex + paddleDx) {
            this.#paddle.dx = 0;
            this.#paddle.x = canvasWidth - paddlewidth;
            return;
        }

    }



    #checkCollisionBallAndPaddle() {
        const ballx = this.#ball.x;
        const bally = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;
        const paddlex = this.#paddle.x;
        const paddley = this.#paddle.y;
        const paddlewidth = this.#paddle.width;
        const paddleheight = this.#paddle.height;

        if (paddlex - ballRadius < ballx + ballDx &&
            ballx + ballDx < paddlex + paddlewidth + ballRadius &&
            paddley - ballRadius < bally + ballDy &&
            bally + ballDy < paddley + paddleheight + ballRadius) {
            this.#ball.dy *= -1;

            this.#paddleBallSound.play();
        }


    }

    #checkCollisionBallAndblock() {
        const ballX = this.#ball.x;
        const ballY = this.#ball.y;
        const ballRadius = this.#ball.radius;
        const ballDx = this.#ball.dx;
        const ballDy = this.#ball.dy;

        this.#blocks.forEach((block) => {
            if (block.status === true) {
                const blockX = block.x;
                const blockY = block.y;
                const blockWidth = block.width;
                const blockHeight = block.height;

                if (blockX - ballRadius < ballX + ballDx &&
                    ballX + ballDx < blockX + blockWidth + ballRadius &&
                    blockY - ballRadius < ballY + ballDy &&
                    ballY + ballDy < blockY + blockHeight + ballRadius) {

                    // ボールを反射する
                    this.#ball.dy *= -1;
                    if (block instanceof HardBlock) {
                        block.hp--;

                        if (block.hp === 0) {
                            // ブロックを非表示にする
                            block.status = false;
                            this.#bar.addScore(block.getPoint());
                        } 
                    }else {
                        // ブロックを非表示にする
                        block.status = false;
                        this.#bar.addScore(block.getPoint());
                    }




                    this.#blockBallSound.play();
                }
            }
        });
    }

    /** 更新する */
    update() {
        //衝突確認
        this.#checkCollisionBallAndWall();
        this.#checkCollisionBallAndPaddle();
        this.#checkCollisionPaddleAndWall();
        this.#checkCollisionBallAndblock();

        // gameover check
        if (this.#isGameOver()) {
            // visibleせってい
            this.isVisible = false;
        }

        if (this.#isGameOver() || this.#isGameClear()) {
            this.isVisible = false;
        }

        //移動
        this.#ball.move();
        this.#paddle.move();

    }
    /**drawは画面に描画する際に使う名前 */
    draw() {
        this.#ball.draw();
        this.#paddle.draw();
        this.#blocks.forEach((block) => block.draw());
        this.#bar.draw();
    }
}