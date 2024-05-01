'use strict';
export class View{
    context = null;
    // 表示フラグ,trueかfalseかで表示/非表示を決定する
    isVisible = true;

    constructor(context){
        this.context = context;
    }
}