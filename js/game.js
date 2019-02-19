'use strict';

class Game {
  constructor(canvas){
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ball;
    this.blocks = [];
    this.blocks2 = [];
    this.enemies = [];
    this.posY = 0;
    this.cont = 0;
    this.gameIsOver = false;
    this.level = 2;
    this.levelNum = 1;
    this.levelBool = false;
    //this.isLevelMax = false;
    this.switchBlocks = true;
    this.contEnemies = 0;
    this.lives = 3;
    this.body = document.querySelector("body");
  };


  startLoop(){
    this.ball = new Ball(this.canvas,1);
    const loop = () => {

      this.updateDom();
      this.createBlocks();
      this.randomEnemies();
      this.checkAllCollisions();
      this.updateCanvas();
      this.clearCanvas();
      this.drawCanvas();
      this.destroyBlocks();
      this.updateScore();
      if(!this.gameIsOver){
        window.requestAnimationFrame(loop);
      }
    }
    window.requestAnimationFrame(loop);
  }

  createBlocks(){
    if(this.cont>250|| this.cont===0){
      if(this.ball2){
        if(this.switchBlocks){
          this.cont=0;
          const xFinal = Math.random()*this.canvas.width-80;
          let block1 = new Block(0,xFinal,'red',0,this.canvas);
          let iniciBlock2 = xFinal+80;
          if (iniciBlock2 < 80) {
          iniciBlock2 = 80;
          }
          let block2 = new Block(iniciBlock2,this.canvas.width,'red',0,this.canvas);
          this.blocks.push(block1);
          this.blocks.push(block2);
          this.switchBlocks = false;
        }else{
          this.cont=0;
          const xFinal = Math.random()*this.canvas.width-80;
          let block1 = new Block(0,xFinal,'green',0,this.canvas);
          let iniciBlock2 = xFinal+80;
          if (iniciBlock2 < 80) {
          iniciBlock2 = 80;
          }
          let block2 = new Block(iniciBlock2,this.canvas.width,'green',0,this.canvas);
          this.blocks2.push(block1);
          this.blocks2.push(block2);
          this.switchBlocks = true;
        }
      }else{
        this.cont=0;
        const xFinal = Math.random()*this.canvas.width-80;
        let block1 = new Block(0,xFinal,'red',0,this.canvas);
        let iniciBlock2 = xFinal+80;
        if (iniciBlock2 < 80) {
         iniciBlock2 = 80;
        }
        let block2 = new Block(iniciBlock2,this.canvas.width,'red',0,this.canvas);
        this.blocks.push(block1);
        this.blocks.push(block2);
      }
    }
  }

  randomEnemies() {
    if(this.contEnemies%600===0 && this.contEnemies != 0){
      let posXEnemie = Math.random()*this.canvas.width-40;
      let enemie = new Enemie(posXEnemie,0,this.canvas);
      this.enemies.push(enemie);
    }

    if(this.contEnemies%1000===0 && this.contEnemies != 0){
      this.rotateCanvas();
    }

    if(this.contEnemies%1900===0 && this.contEnemies != 0){
      this.initialRotate();
    }

    if(this.contEnemies%800===0 && !this.ball2 && this.contEnemies != 0){
      this.ball2 = new Ball(this.canvas,2);
    }
  }

  rotateCanvas() {
    this.body.setAttribute("style", `
          @media (min-width: 600px) {
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg); 
            -o-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            transform: rotate(360deg);
            transition-duration: 10s;
          }
        `);
  }

  initialRotate() {
    this.body.removeAttribute("style");
  }

  updateCanvas(){
    this.ball.update();
    if(this.ball2){
      this.ball2.update();
    }
    this.blocks.forEach((block) => {
      block.update(this.level);
    })
    if(this.ball2){
      this.blocks2.forEach((block) => {
        block.update(this.level);
      })
    }
    if(this.enemies.length>0){
      this.enemies.forEach((enemie) => {
        enemie.update();
      })
    }
    this.cont = this.cont + this.level;
    this.posY = this.posY + this.level;
    this.contEnemies++;
  }

  updateScore(){
    if (this.ball.puntuation%6===0 && this.level<3.75){
      if(this.levelBool){
        console.log(this.levelBool);
        console.log(this.level);
        this.level = this.level+0.25;
        this.levelNum++;
        this.levelBool = false;
      }
    }
    if(this.levelNum>=3){
      this.ball.speed === 7;
      this.ball2.speed === 7;
    }

  }

  clearCanvas(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  }

  drawCanvas(){
    this.ball.draw();
    if(this.ball2){
      this.ball2.draw();
    }
    this.blocks.forEach((block) => {
      block.draw();
    })
    if(this.ball2){
      this.blocks2.forEach((block) => {
        block.draw();
      })
    }
    if(this.enemies.length>0){
      this.enemies.forEach((enemie) => {
        enemie.draw();
      })
    }
  }

  destroyBlocks(){
    this.blocks.forEach((block,index) => {
      if(block.posY >= this.canvas.height){
        this.blocks.splice(index,1);
        console.log('Destrooy!');
        this.levelBool = true;
        this.ball.gainPoints(1);
      }
    })
  }

  checkAllCollisions(){
    this.ball.checkScreen();
    if(this.ball2){
      this.ball2.checkScreen();
      this.blocks.forEach((block) => {
        if(this.ball.checkCollisionBlocks(block)){
          console.log('You lose');
          this.isLevelMax = false;
          this.cont = 0;
          this.posY = 0;
          this.lose(this.ball.puntuation);
          this.gameIsOver = true;
        }
      })
      this.blocks2.forEach((block) =>{
        if(this.ball2){
          if(this.ball2.checkCollisionBlocks(block)){
            console.log('You lose');
            this.isLevelMax = false;
            this.cont = 0;
            this.posY = 0;
            this.lose(this.ball.puntuation);
            this.gameIsOver = true;
          }
        }
      })
    }
    this.blocks.forEach((block) => {
      if(this.ball.checkCollisionBlocks(block)){
        console.log('You lose');
        this.isLevelMax = false;
        this.cont = 0;
        this.posY = 0;
        this.lose(this.ball.puntuation);
        this.gameIsOver = true;
      }
    })
    this.enemies.forEach((enemie,index) => {
      if(this.ball.checkCollisionKnife(enemie)){
        this.enemies.splice(index,1);
        this.lives--;
        if(this.lives===0){
          this.isLevelMax = false;
          this.cont = 0;
          this.posY = 0;
          this.lose(this.ball.puntuation);
          this.gameIsOver = true;
        }
        console.log('Knife damn');
      }
    })
  }

  updateDom(callback){
    this.updateDom = callback
  }

  gameOverCallback(callback){

    this.lose = callback;
  }


}
