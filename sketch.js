var rains = [];
var fishs = [];
var yoff = 0.0;
var riverHeight = 2*height/5;
var cloudMove;
var RainDrop = 0;
var Ball = 1;
var start = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(217,112,143);
  strokeWeight(random(0.005,0.03));
  stroke(255);
  for (var i = 0; i<width;++i){
    line(1*i+random(0,6),random(10,height/3),1*i+random(0,6),random(3*height/4,height-10));
  }
  
      
  //river
  beginShape();
  noStroke();
  var xoff = 0; 
  for (var x = 0; x <= width; x += 10) {
    var y = map(noise(xoff, yoff), 0, 1, riverHeight,riverHeight+100);
    fill(47,206,226);
    vertex(x, y); 
    xoff += 0.05;
  }
  riverHeight -= rains.length/100 - fishs.length/100;
  yoff += 0.01;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  
  //Default scence
  if (!start) {
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text("Drizzly Day", width/2+random(0,3), height/3+random(-1,1));
    textSize(16);
    text("touch cloud to start", width/2, height/2);
    mouseCloud(2/3*width,height/10);
    mouseFish(width/10,height*4/5);
    mouseFish(7/10*width,height*9/10);
  }
  else{
    //mouse distance
    cloudMove = touchX - ptouchX;
    
    //river height display
    push();
    textSize(28);
    fill(255);
    text(floor(height-riverHeight),20,riverHeight,50,28);
    line(0,riverHeight,50,riverHeight);
    pop();

    shake();
    
    //rains display
    for (var i = rains.length - 1; i >= 0; --i) {
      if (rains[i].death()) {
        rains.splice(i, 1);
      } 
      else {
        rains[i].display();
        rains[i].move();
        rains[i].bounce();
        rains[i].collisionDetect();
      }
    }
    //fishs display
    for (var i = fishs.length - 1; i >= 0; --i){
      if(fishs[i].death()){
        fishs.splice(i,1);
      }
      else {
        fishs[i].display();
        fishs[i].move();
      }
    }
    
    //draw the touch in different height
    if(touchY<riverHeight){
      mouseCloud(touchX,touchY);
    }
    else{
      mouseFish(touchX,touchY);
    }
  }
}


function Rain(tempX, tempY,tempSX,tempSY,tempD,tempSize,tempM){
  this.x = tempX;
  this.y = tempY;
  this.size=tempSize;
  this.dx=tempSX;
  this.dy=tempSY;
  this.direction=tempD;
  this.mode = RainDrop
  this.m = tempM
  
  this.display = function(){
      if (this.mode == RainDrop) {
        stroke(255,20);
        fill(255,this.m);
        triangle(this.x - this.size/2, this.y, this.x + this.size/2, this.y, this.x, this.y - (this.size + this.size/2));
        ellipse(this.x, this.y, this.size, this.size);
        fill(0);
        ellipse(this.x-this.size/4,this.y+this.size/15,this.size/10,this.size/10);
        ellipse(this.x+this.size/4,this.y+this.size/15,this.size/10,this.size/10);
        ellipse(this.x,this.y+this.size-17,this.size/5,this.size/5);
      } 
      else if (this.mode == Ball) {
        this.size=this.size/1.01;
        this.m--;
        stroke(0, 20);
        fill(random(180,255),this.m);
        ellipse(this.x, this.y, this.size, this.size);
        fill(0);
        ellipse(this.x-this.size/4,this.y+this.size/15,this.size/10,this.size/10);
        ellipse(this.x+this.size/4,this.y+this.size/15,this.size/10,this.size/10);
        ellipse(this.x,this.y+this.size-15,this.size/5,this.size/5);
      }
    }
  

  this.move = function() {
    this.y = this.y + this.dy;
    this.x=this.x-this.dx*this.direction;
    this.dy=this.dy+1;
  };

  this.bounce = function() {
    if (this.y > riverHeight+50) {
      this.dy=-this.dy/2;
    }
  }
    
  this.collisionDetect = function() {
    if (this.mode == RainDrop && this.y > (riverHeight-30)&& this.y < (riverHeight+30)) {
      this.mode = Ball;
    }
  }
  this.death = function(){
    if(this.x<0 || this.x>width || this.y > riverHeight +60){
      return true;
    }else{
      return false;
    }
  }

}

function shake(){
  if((cloudMove<=-50||cloudMove>=50) && touchY< riverHeight){
   rains.push(new Rain(touchX, touchY,random(3,7),random(5,8),random1(),random(15,25),255));
  }
  
  else if((cloudMove<=-20||cloudMove>=20)&&touchY< riverHeight){
   rains.push(new Rain(touchX, touchY,random(3,7),random(5,8),random1(),random(10,15),255));
  }
  
  else if ((cloudMove<=-50||cloudMove>=50) && touchY> riverHeight){
    fishs.push(new Fish(touchX, touchY,random(3,7),random(5,8),random1(),random(15,25),255));
  }
  else if ((cloudMove<=-20||cloudMove>=20) && touchY> riverHeight){
    fishs.push(new Fish(touchX, touchY,random(3,7),random(5,8),random1(),random(10,15),255));
  }
}

function random1() {
  var ran = round(random(1, 2));
  return (ran - 1.5) / abs(ran - 1.5);
}

function Fish(tempX, tempY,tempSX,tempSY,tempD,tempSize,tempM){
  this.x = tempX;
  this.y = tempY;
  this.size=tempSize;
  this.dx=tempSX;
  this.dy=tempSY;
  this.direction=tempD;
  this.mode = RainDrop;
  this.m = tempM;
  
  this.display = function(){
    if(this.y > riverHeight+30){
      this.size=this.size/1.01;
      this.m--; 
      fill(random(180,255),this.m);
      triangle(this.x-this.size/4,this.y,this.x+this.size*2,this.y+this.size*3/2,this.x+this.size*2,this.y-this.size*3/2);
      triangle(this.x+this.size/2,this.y,this.x+this.size*5/2,this.y-this.size/4,this.x+this.size*5/2,this.y+this.size/4);
      fill(0);
      noStroke();
      ellipse(this.x+10,this.y,2,2);
    }
  }
  this.move = function(){
    this.y = this.y + this.dy;
    this.x=this.x-this.dx*this.direction;
    this.dy=this.dy-0.5;
    if (this.y < riverHeight+105) {
      this.dy=-this.dy/3;
    }
  }
  this.death = function(){
    if(this.x<0 || this.x>width || this.y < riverHeight+100 || this.y > height){
      return true;
    }else{
      return false;
    }
  }
}

function mouseFish(x,y){
  this.x = x;
  this.y = y;
  
  stroke(255);
  strokeWeight(4);
  fill(255);
  push();
  translate(this.x,this.y);
  triangle(-5,0,40,30,40,-30);
  triangle(5,0,49,-5,49,5);
  fill(0);
  noStroke();
  ellipse(10,0,3,3);
  pop();
}

function mouseCloud(x,y){
  this.x = x;
  this.y = y;
  
  push();
  translate(this.x,this.y);
  stroke(255);    
  strokeWeight(4);
  fill(255);
  beginShape();
  vertex(-100,-20);
  bezierVertex(-100,-50,-70,-80,-18,-50);
  bezierVertex(0,-85,60,-65,50,-40);
  bezierVertex(120,-25,80,35,20,20);
  bezierVertex(20,50,-70,55,-80,20);
  bezierVertex(-130,40,-125,-30,-100,-20);  
  endShape();
  pop();
}

function touchEnded() {
  start = true;
  // riverHeight = 2*height/5;
}
