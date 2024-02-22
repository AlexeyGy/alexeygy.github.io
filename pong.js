var canvas = document.getElementById("pongCanvas");
var ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;

let leftScore = 0;
let rightScore = 0;

var paddleHeight = 60;
var paddleWidth = 10;
var rightPaddleY = (canvas.height - paddleHeight) / 2;
var leftPaddleY = (canvas.height - paddleHeight) / 2;
var rightPaddleSpeed = 0;
var leftPaddleSpeed = 0;
var paddleSpeed = 4;

var ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "#FFF"
};

function drawPaddle(x, y) {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function collisionDetection() {
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width / 2) ? { x: paddleWidth, y: leftPaddleY } : { x: canvas.width - paddleWidth * 2, y: rightPaddleY };

    if (ball.x - ball.radius < player.x + paddleWidth && ball.x + ball.radius > player.x && ball.y + ball.radius > player.y && ball.y - ball.radius < player.y + paddleHeight) {
        ball.velocityX = -ball.velocityX;
        ball.speed += 0.1;
    }

    if (ball.x - ball.radius < 0) {
        resetGame();
        increaseRightScore();
    } else if (ball.x + ball.radius > canvas.width) {
        resetGame();
        increaseLeftScore();
    }
}

function increaseLeftScore() {
    leftScore++;
    document.getElementById('score').innerText = 'Score: ' + leftScore + ':' + rightScore;

}

function increaseRightScore() {
    rightScore++;
    document.getElementById('score').innerText = 'Score: ' + leftScore + ':' + rightScore;
}


function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 7;
}

function movePaddle() {
    leftPaddleY += leftPaddleSpeed;
    rightPaddleY += rightPaddleSpeed;

    if (leftPaddleY < 0) leftPaddleY = 0;
    else if (leftPaddleY + paddleHeight > canvas.height) leftPaddleY = canvas.height - paddleHeight;

    if (rightPaddleY < 0) rightPaddleY = 0;
    else if (rightPaddleY + paddleHeight > canvas.height) rightPaddleY = canvas.height - paddleHeight;
}

function update() {
    movePaddle();

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    collisionDetection();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(0, leftPaddleY);
    drawPaddle(canvas.width - paddleWidth, rightPaddleY);
    drawBall();
}

function game() {
    update();
    render();
}

setInterval(game, 1000 / 60);

document.addEventListener("keydown", function (evt) {
    switch (evt.keyCode) {
        case 87: // W key
            leftPaddleSpeed = -paddleSpeed;
            break;
        case 83: // S key
            leftPaddleSpeed = paddleSpeed;
            break;
        case 38: // Up arrow
            rightPaddleSpeed = -paddleSpeed;
            break;
        case 40: // Down arrow
            rightPaddleSpeed = paddleSpeed;
            break;
    }
});

