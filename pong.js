var canvas = document.getElementById("pongCanvas");
var ctx = canvas.getContext("2d");

const mediaQuery = window.matchMedia('(max-width: 600px)');
// Function to handle the media query 'change' event
function handleMediaQueryChange(e) {
    if (e.matches) {
        // Execute mobile-specific JavaScript here
        canvas.width = 300;
        canvas.height = 200;

    } else {
        // Execute tablet/desktop-specific JavaScript here
        canvas.width = 600;
        canvas.height = 400;
    }
}

// Add listener for changes to the media query state
mediaQuery.addListener(handleMediaQueryChange);

// Call the function initially to set up the correct state from the start
handleMediaQueryChange(mediaQuery);

let leftScore = 0;
let rightScore = 0;

const INITIAL_BALL_SPEED = 3;

var paddleWidth = canvas.width / 60;
var paddleHeight = canvas.height / 5;

var rightPaddleY = (canvas.height - paddleHeight) / 2;
var leftPaddleY = (canvas.height - paddleHeight) / 2;

var rightPaddleVelocity = 0;
var leftPaddleVelocity = 0;
const PADDLE_SPEED = 6;

var ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: canvas.width / 60,
    velocityX: INITIAL_BALL_SPEED,
    velocityY: INITIAL_BALL_SPEED,
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
    // hit top/bottom wall
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x < canvas.width / 2) ? { x: paddleWidth, y: leftPaddleY } : { x: canvas.width - paddleWidth * 2, y: rightPaddleY };

    // hit paddle
    if (ball.x - ball.radius < player.x + paddleWidth && ball.x + ball.radius > player.x && ball.y + ball.radius > player.y && ball.y - ball.radius < player.y + paddleHeight) {
        ball.velocityX = -ball.velocityX;
        ball.velocityX *= 1.1;
        ball.velocityY *= 1.1;
    }

    // scores
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

    var direction = 1;
    if (Math.random() < 0.5) {
        direction *= -1;
    }

    ball.velocityX = INITIAL_BALL_SPEED * direction;
    ball.velocityY = INITIAL_BALL_SPEED * direction;
}

function movePaddle() {
    leftPaddleY += leftPaddleVelocity;
    rightPaddleY += rightPaddleVelocity;

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

// 60 FPS.
setInterval(game, 1000 / 60);

document.addEventListener("keydown", function (evt) {
    switch (evt.keyCode) {
        case 87: // W key
            leftPaddleVelocity = -PADDLE_SPEED;
            break;
        case 83: // S key
            leftPaddleVelocity = PADDLE_SPEED;
            break;
        case 38: // Up arrow
            rightPaddleVelocity = -PADDLE_SPEED;
            break;
        case 40: // Down arrow
            rightPaddleVelocity = PADDLE_SPEED;
            break;
    }
});
document.addEventListener("keyup", function (evt) {
    switch (evt.keyCode) {
        case 87: // W key
            leftPaddleVelocity = 0;
            break;
        case 83: // S key
            leftPaddleVelocity = 0;
            break;
        case 38: // Up arrow
            rightPaddleVelocity = 0;
            break;
        case 40: // Down arrow
            rightPaddleVelocity = 0;
            break;
    }
});

