const showRules=document.getElementById("rule-btn");
const menu=document.getElementById("rules");


const canvas=document.getElementById('canvas');
const ctx=canvas.getContext('2d');
const close=document.getElementById("close-btn");

let score=0;
let rows=9;
let columns=5;
let allBricks=[]

showRules.addEventListener('click',slideItOver)
close.addEventListener('click',slideItOver)

function slideItOver() {
    menu.classList.toggle('active')
}

//creating ball properties
const ball={
    x:canvas.width/2,
    y:canvas.height/2,
    dx:4,
    dy:-4,
    size:10
}

//draw the ball on canvas
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x,ball.y,ball.size,0,2*Math.PI)
    ctx.fillStyle='#0095dd'
    ctx.fill();
    ctx.closePath();
}

//create paddle properties
const paddle={
    x:canvas.width/2 - 40,
    y:canvas.height - 20,
    w:80,
    h:10,
    speed:20,
    dx:0 //why zero?
}

//create bricks properties
const brick={
    w:70,
    h:20,
    visible:true,
    padding:10,
    startingX:45,
    startingY:50
}


//add bricks to the whole array
for (let i=0;i<rows;i++){
    for (let j=0;j<columns;j++){
        var singleBrick={
            w:brick.w,
            h:brick.h,
            x:brick.startingX + (i*80),
            y:brick.startingY + (j*30),
            visible:true,
            padding:10
        }
        allBricks.push(singleBrick)
    }
}

//draw paddle on canvas
function drawPaddle() {

    ctx.beginPath();
    
    ctx.rect(paddle.x,paddle.y,paddle.w,paddle.h);
    ctx.fillStyle='#0095dd';
    ctx.fill();
    
    ctx.closePath();
}

function drawBricks() {
    allBricks.forEach(item=>{
        if (item.visible){
            ctx.beginPath()
            ctx.rect(item.x,item.y,item.w,item.h);
            ctx.fillStyle='#0095dd';
            ctx.fill();
            ctx.closePath()
        }
    })
}

function writeScore() {
    ctx.font='20px Yekan';
    ctx.fillText(`امتیاز: ${ConvertToPersian(score)}`,canvas.width-100,30)
    
}   

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    ball.y<2 ? console.log(ball.y) : false
    //ball bounce when it hits the wall (top/bottom)
    if (ball.y < 0 || ball.y > canvas.height){
        ball.dy = -(ball.dy)
    }

    //ball bounce when it hits the wall (left/right)
    if (ball.x < 0 || ball.x > canvas.width){
        ball.dx = -(ball.dx)
    }
    
    //ball when it hits the paddle
    const ballOnPaddle=ball.x + ball.size<paddle.x + paddle.w && ball.x - ball.size>paddle.x
    && ball.y +ball.size > 480
    if (ballOnPaddle){
        ball.dy = -(ball.dy);
    }

    

    //ball when it hits a brick
    for (let i=0;i<allBricks.length;i++){
        allBricks.forEach(brick=>{
            if (brick.visible){
                if (
                    ball.x - ball.size > brick.x && // left brick side check
                    ball.x + ball.size < brick.x + brick.w && // right brick side check
                    ball.y + ball.size > brick.y && // top brick side check
                    ball.y - ball.size < brick.y + brick.h // bottom brick side check
                ) {
                    score++
                    if (score==rows*columns){
    
                        document.body.innerHTML=`
                        <div id='won' class='won'>
                            <h3>بازی رو بردید</h3>
                            <button onclick="reload()" class="play-again">دوباره</button>
                        </div>
                        `
                        canvas.remove();
                        ball.remove()
                        //ctx.remove();
                    }
    
                    brick.visible=false;
                    ball.dy= -(ball.dy)
                }
            }
        })

    }

    /*allBricks.forEach(brick=>{

    })*/

    //ball when it doesn't hit the paddle (user loses)
    if (ball.size+ball.y > canvas.height){
        document.body.innerHTML=`
        <div id='lost' class='lost'>
            <h3>بازی رو باختید</h3>
            <p>امتیاز شما:${ConvertToPersian(score)} </p>
            <button onclick="reload()" class="play-again">دوباره</button>
        </div>
        `
        score=0;
        ball.remove();  
        canvas.remove();


    }

}

console.log(allBricks)
update();

function update() {

    draw();
    moveBall();

    requestAnimationFrame(update);
}

function draw() {
    //first clear the canvas
    ctx.clearRect(0,0,800,500)

    drawBall();
    drawPaddle();
    writeScore();
    drawBricks();
}

function showAllBricks() {
    for (let i=0;i<rows*columns;i++){
        allBricks[i].visible=true;    
    }
}

//the paddle moves (the speed will be added to coordinate) when right or left key is being pressed
function keydown(e) {
    if(e.keyCode==39){
        if (paddle.x == canvas.width - paddle.w){
            paddle.x=canvas.width - paddle.w;
        } else {
            paddle.x += paddle.speed;
            draw();
        }

    } else if (e.keyCode==37){
        if (paddle.x == 0){
            paddle.x=0;
        } else {
            paddle.x -= paddle.speed;
            draw();
        }
    }    
}


document.addEventListener('keydown',keydown);
//document.addEventListener('keyup',keyup);


//a function to convert english numbers to persian
function ConvertToPersian(number){
    const persian = { 0: '۰', 1: '۱', 2: '۲', 3: '۳', 4: '۴', 5: '۵', 6: '۶', 7: '۷', 8: '۸', 9: '۹' };
    let PersianNumber='';
    
    const numberAsText=number.toString();

    for (let i=0;i<numberAsText.length;i++){
        PersianNumber+=persian[+numberAsText[i]];
    }

    return PersianNumber   
}

/*function showWonMsg() {
    document.body.innerHTML=`
    <div id='won' class='won'>
        <h3>بازی رو بردید</h3>
        <button onclick="reload()" class="play-again">دوباره</button>
    </div>
    `
}
function showLostMsg() {
    document.body.innerHTML=`
    <div id='lost' class='lost'>
        <h3>بازی رو باختید</h3>
        <button onclick="reload()" class="play-again">دوباره</button>
    </div>
    `
}*/

function reload(){
    window.location.reload();
}

draw();
