var canvas = document.getElementById("pongCanvas");
var ctx = canvas.getContext("2d");

const mediaQuery = window.matchMedia('(max-width: 600px)');
// Function to handle the media query 'change' event
function handleMediaQueryChange(e) {
    if (e.matches) {
        // Execute mobile-specific JavaScript here
        canvas.width = 300;
        canvas.height = 200;
        return;
    }
    // Execute tablet/desktop-specific JavaScript here
    canvas.width = 600;
    canvas.height = 400;
}

// Add listener for changes to the media query state
mediaQuery.addListener(handleMediaQueryChange);

// Call the function initially to set up the correct state from the start
handleMediaQueryChange(mediaQuery);

let leftScore = 0;
let rightScore = 0;

let initialBallSpeed = canvas.width / 200;
let computedBallSpeed = Math.sqrt(initialBallSpeed ** 2 + initialBallSpeed ** 2);

let paddleWidth = canvas.width / 60;
let paddleHeight = canvas.height / 5;

let rightPaddleY = (canvas.height - paddleHeight) / 2;
let leftPaddleY = (canvas.height - paddleHeight) / 2;

let rightPaddleVelocity = 0;
let leftPaddleVelocity = 0;
let paddleSpeed = 6;

// Touch control targets (null means no active touch)
let leftPaddleTargetY = null;
let rightPaddleTargetY = null;

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: canvas.width / 60,
    velocityX: (Math.random() < 0.5 ? 1 : -1) * initialBallSpeed,
    velocityY: (Math.random() < 0.5 ? 1 : -1) * initialBallSpeed,
    color: "#FFF"
};

let numHits = 0;

function drawPaddle(x, y) {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.strokeRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.stroke();
}

function collisionDetection() {
    if (ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
        ball.y = canvas.height - ball.radius; // Snap to edge
    }
    if (ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
        ball.y = ball.radius; // Snap to edge
    }

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
        updateBallSpeed();
        numHits++;
        updateHitCount();
        return; // skip scoring check on paddle hit
    }

    // hit left
    if (ball.x - ball.radius < 0) {
        resetGame();
        increaseRightScore();
    }
    // hit right
    else if (ball.x + ball.radius > canvas.width) {
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

/**
 * Updates the displayed ball speed.
 */
function updateBallSpeed() {
    const currentSpeed = Math.sqrt(ball.velocityX ** 2 + ball.velocityY ** 2);
    const speedPercentage = (currentSpeed / computedBallSpeed) * 100;
    document.getElementById('ball_speed').innerText = speedPercentage.toFixed(0) + '%';
}

/**
 * Updates the displayed hit count.
 */
function updateHitCount() {
    document.getElementById('hit_count').innerText = numHits;
}

function resetGame() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    var direction = 1;
    if (Math.random() < 0.5) {
        direction *= -1;
    }

    ball.velocityX = initialBallSpeed * direction;
    ball.velocityY = initialBallSpeed * direction;

    numHits = 0;
    updateBallSpeed();
}

function movePaddle() {
    // --- Touch Control Logic ---
    if (leftPaddleTargetY !== null) {
        let dy = leftPaddleTargetY - (leftPaddleY + paddleHeight / 2);
        if (Math.abs(dy) > paddleSpeed) {
            leftPaddleVelocity = Math.sign(dy) * paddleSpeed;
        } else {
            leftPaddleVelocity = 0;
            // Optional: Snap to exact position if close enough to avoid jitter
            // leftPaddleY = leftPaddleTargetY - paddleHeight / 2; 
        }
    }

    if (rightPaddleTargetY !== null && !isAiActive) {
        let dy = rightPaddleTargetY - (rightPaddleY + paddleHeight / 2);
        if (Math.abs(dy) > paddleSpeed) {
            rightPaddleVelocity = Math.sign(dy) * paddleSpeed;
        } else {
            rightPaddleVelocity = 0;
        }
    }
    // ---------------------------

    leftPaddleY += leftPaddleVelocity;
    rightPaddleY += rightPaddleVelocity;

    if (leftPaddleY < 0) leftPaddleY = 0;
    else if (leftPaddleY + paddleHeight > canvas.height) leftPaddleY = canvas.height - paddleHeight;

    if (rightPaddleY < 0) rightPaddleY = 0;
    else if (rightPaddleY + paddleHeight > canvas.height) rightPaddleY = canvas.height - paddleHeight;
}

function doAiAction() {
    // Controls the right paddle to follow the ball if the AI is active.    
    if (ball.y < rightPaddleY + paddleHeight) {
        rightPaddleVelocity = -paddleSpeed / 2; // AI moves at half speed.
    } else {
        rightPaddleVelocity = paddleSpeed / 2;
    }
}

function update() {
    if (isAiActive) {
        doAiAction();
    }
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


function setupPaddleControls() {
    // controls
    document.addEventListener("keydown", function (evt) {
        switch (evt.key) {
            case "w": // W key
                leftPaddleVelocity = -paddleSpeed;
                break;
            case "s": // S key
                leftPaddleVelocity = paddleSpeed;
                break;
            case "ArrowUp": // Up arrow
                rightPaddleVelocity = -paddleSpeed;
                break;
            case "ArrowDown": // Down arrow
                rightPaddleVelocity = paddleSpeed;
                break;
        }
    });
    document.addEventListener("keyup", function (evt) {
        switch (evt.key) {
            case "w": // W key
                leftPaddleVelocity = 0;
                break;
            case "s": // S key
                leftPaddleVelocity = 0;
                break;
            case "ArrowUp": // Up arrow
                rightPaddleVelocity = 0;
                break;
            case "ArrowDown": // Down arrow
                rightPaddleVelocity = 0;
                break;
        }
    });
}

function setupTouchControls() {
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouch, { passive: false });
    canvas.addEventListener('touchend', handleTouch, { passive: false });
    canvas.addEventListener('touchcancel', handleTouch, { passive: false });
}

function handleTouch(e) {
    e.preventDefault(); // Prevent scrolling while playing

    // Reset targets
    let newLeftTarget = null;
    let newRightTarget = null;

    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    const scaleX = canvas.width / rect.width;

    // Iterate through all active touches
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const touchX = (touch.clientX - rect.left) * scaleX;
        const touchY = (touch.clientY - rect.top) * scaleY;

        if (touchX < canvas.width / 2) {
            newLeftTarget = touchY;
        } else {
            newRightTarget = touchY;
        }
    }

    leftPaddleTargetY = newLeftTarget;
    rightPaddleTargetY = newRightTarget;

    // If touch ends, stop the paddle immediately
    if (leftPaddleTargetY === null && leftPaddleVelocity !== 0) {
        leftPaddleVelocity = 0;
    }
    if (rightPaddleTargetY === null && rightPaddleVelocity !== 0 && !isAiActive) {
        rightPaddleVelocity = 0;
    }
}

// Game start logic
let gameInterval;
let isGameRunning = false;
let isAiActive = false;

function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}


function startGame() {
    if (isGameRunning) return;
    isGameRunning = true;
    document.getElementById('playButtonContainer').style.display = 'none';

    // 60 FPS.
    gameInterval = setInterval(game, 1000 / 60);
}

document.getElementById('playButton2P').addEventListener('click', () => {
    isAiActive = false;
    startGame();
});
document.getElementById('playButton1P').addEventListener('click', () => {
    isAiActive = true;
    startGame();
});


setupPaddleControls();
setupTouchControls();
setupMouseControls();

let isMouseDown = false;

function setupMouseControls() {
    canvas.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        handleMouse(e);
    });
    canvas.addEventListener('mousemove', (e) => {
        if (isMouseDown) {
            handleMouse(e);
        }
    });
    canvas.addEventListener('mouseup', () => {
        isMouseDown = false;
        leftPaddleTargetY = null;
        rightPaddleTargetY = null;
    });
    canvas.addEventListener('mouseleave', () => {
        isMouseDown = false;
        leftPaddleTargetY = null;
        rightPaddleTargetY = null;
    });
}

function handleMouse(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    const scaleX = canvas.width / rect.width;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    if (mouseX < canvas.width / 2) {
        leftPaddleTargetY = mouseY;
        rightPaddleTargetY = null;
    } else {
        rightPaddleTargetY = mouseY;
        leftPaddleTargetY = null;
    }
}

