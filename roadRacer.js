//road
let road;
let roadWidth = 707; // original width of the background
let roadHeight = 650;
let context;

//green car
let greenCarWidth = 135; // original pixel of the car is 60 * 45
let greenCarHeight = 113.5;
let greenCarX = 290;
let greenCarY = 535;
let greenCarImg;

let greenCar = {
  x: greenCarX,
  y: greenCarY,
  width: greenCarWidth,
  height: greenCarHeight,
};

//red car
let redLeftCarArray = [];
let redRightCarArray = [];
let redCarWidth = 135;
let redCarHeight = 113.5;
let redCarY = -113.5;

let leftRedCarImg;
let rightRedCarImg;

//physics

let velocityEnemyY = 4; // coming speed of enemy car
let velocityCarY = 0; // up going speed of player car
let velocityCarX = 0; // just to keep the track if the car is changing lane or not
let isCarMoving = false; // flag to track car movement
let gameOver = false;

window.onload = function () {
  road = document.getElementById("road");
  road.height = roadHeight;
  road.width = roadWidth;
  context = road.getContext("2d"); //used for drawing on the board

  greenCarImg = new Image();
  greenCarImg.src = "./greencar.png";
  greenCarImg.onload = function () {
    context.drawImage(
      greenCarImg,
      greenCar.x,
      greenCar.y,
      greenCar.width,
      greenCar.height
    );
  };

  leftRedCarImg = new Image();
  leftRedCarImg.src = "./redcar.png";

  rightRedCarImg = new Image();
  rightRedCarImg.src = "./redcar.png";

  requestAnimationFrame(update);
  setInterval(placeRedCar, 1150); //every 1.15 seconds

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
      isCarMoving = false;
      moveCarLeft();
    }
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
      isCarMoving = false;
      moveCarRight();
    }
  });
  document.addEventListener("keyup", function (event) {
    if (
      (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") &&
      velocityCarX < 0
    ) {
      stopCar();
    }

    if (
      (event.key === "ArrowRight" || event.key === "d" || event.key === "D") &&
      velocityCarX > 0
    ) {
      stopCar();
    }
    if (
      (event.key === "ArrowUp" || event.key === "w" || event.key === "W") &&
      (velocityCarX < 0 || velocityCarX > 0)
    ) {
      stopCar();
    }
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "w" || event.key === "W" || event.key === "ArrowUp") {
      isCarMoving = false;
      moveGreenCarForward();
    }
  });
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
  return;
  }
  context.clearRect(0, 0, road.width, road.height);

  //green car
  greenCar.x = Math.max(Math.min(greenCar.x, 417), 163); // switching lanes
  greenCar.y = Math.max(Math.min(greenCar.y - velocityCarY, 535), 0); // applying up moving speed
  context.drawImage(
    greenCarImg,
    greenCar.x,
    greenCar.y,
    greenCar.width,
    greenCar.height
  );

  //left red car
  for (let i = 0; i < redLeftCarArray.length; i++) {
    let leftRedCar = redLeftCarArray[i];
    leftRedCar.y += velocityEnemyY;
    context.drawImage(
      leftRedCar.img,
      leftRedCar.x,
      leftRedCar.y,
      leftRedCar.width,
      leftRedCar.height
    );

    // Check for collision with green car
    if (detectCollision(leftRedCar, greenCar)) {
      gameOver = true;
      handleGameOver();
      return;
    }
  }

  // right red car
  for (let i = 0; i < redRightCarArray.length; i++) {
    let rightRedCar = redRightCarArray[i];
    rightRedCar.y += velocityEnemyY;
    context.drawImage(
      rightRedCar.img,
      rightRedCar.x,
      rightRedCar.y,
      rightRedCar.width,
      rightRedCar.height
    );

    // Check for collision with green car
    if (detectCollision(rightRedCar, greenCar)) {
      gameOver = true;
      handleGameOver();
      return;
    }
  }

  //clear array
    while (redLeftCarArray.length > 0 && redLeftCarArray[0].x < -roadHeight) {
        redLeftCarArray.shift(); //removes first element from the array
    }
     while (redRightCarArray.length > 0 && redRightCarArray[0].x < -roadHeight) {
        redRightCarArray.shift(); //removes first element from the array
    }
}

function placeRedCar() {
  if (gameOver) {
    return;
  }
  //randomizing left red car: position -> left or middle
  let randomLeftRedCarX = Math.random() < 0.5 ? 155 : 281.5;

  let leftRedCar = {
    img: leftRedCarImg,
    x: randomLeftRedCarX,
    y: redCarY,
    width: redCarWidth,
    height: redCarHeight,
    passed: false,
  };
  redLeftCarArray.push(leftRedCar);

  // randomizing right red car: position -> if left car is is in left then middle or right
  // randomizing right red car: position -> if left car is is in middle then left or right
  if (randomLeftRedCarX === 155) {
    var randomRightRedCarX = Math.random() < 0.5 ? 281.5 : 407.5;
  } else if (randomLeftRedCarX === 281.5) {
    var randomRightRedCarX = Math.random() < 0.5 ? 155 : 407.5;
  }

  let rightRedCar = {
    img: rightRedCarImg,
    x: randomRightRedCarX,
    y: redCarY,
    width: redCarWidth,
    height: redCarHeight,
    passed: false,
  };
  redRightCarArray.push(rightRedCar);
}

function moveCarLeft() {
  if (!isCarMoving) {
    greenCar.x = greenCar.x - 126;
    velocityCarX = -126;
    isCarMoving = true;
  }
}

function moveCarRight() {
  if (!isCarMoving) {
    greenCar.x = greenCar.x + 126;
    velocityCarX = 126;
    isCarMoving = true;
  }
}

function stopCar() {
  velocityCarX = 0;
  isCarMoving= false;
}

function moveGreenCarForward() {
  if (!isCarMoving) {
    velocityCarY = 6;
    isCarMoving = true;
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function handleGameOver() {
  // Handle game over logic here
  console.log("Game Over");
}
