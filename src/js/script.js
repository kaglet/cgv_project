import '../style.css';
import * as player from './player.js';
import * as objects from './objects.js';
import * as lighting from './lighting.js';
import * as camera from './camera.js';

import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.gammaInput = true;
renderer.gammaOutput = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

let gameIsLoaded = false;

function runGame(steps, tipDisplay) {
  const _mixers = [];
  let _previousRAF = null;

  let frameCounter = 0;

  function _RAF() {
    requestAnimationFrame((t) => {
      if (_previousRAF === null) {
        _previousRAF = t;
      }

      if (!player.paused) { 
        objects.world.step(1 / 60);
        objects.animate_objects();
        player.animate_objects();
        objects.animate_lights();
        renderer.render(objects.scene, camera.currentCamera);
        step(t - _previousRAF);
        // if steps are not emptied out then show tips
        if (steps.length !== 0 && gameIsLoaded === true) {
          tipDisplay.style.display = 'block';
          if (steps[0].text === "Congrats! The door has opened, you completed the puzzle.") {
            console.log(steps);
            // check if they finally won and satisfied steps[0] win condition. If not try again next time in RAF.
            if (objects.path4.every(value => objects.litUpTiles4.includes(value) && objects.litUpTiles4.length === objects.path4.length)) {
              console.log("You won and step array looks like this: ");
              console.log(steps);
              tipDisplay.textContent = "Congrats! The door has opened, you completed the puzzle.";
              steps.shift();
            } 
          } else if (steps[0].checkStepComplete() === true) { // else if a regular step not the last step detected check and pop as normal

            if (steps[0].text === "Use your solution to get to the end, the semi-circular tile.") {
              let pathCorrect = objects.path4.every(value => objects.litUpTiles4.includes(value) && objects.litUpTiles4.length === objects.path4.length);
              if (pathCorrect === true) {
                // take care of win case with timer 
                // display tip on timer
                tipDisplay.textContent = "Congrats! The door has opened, you completed the puzzle.";
                steps.shift();
              } else {
                console.log('Hi from path incorrect!');
                tipDisplay.textContent = "You got the path wrong, try again. Go back and press R to reset puzzle.";
                document.addEventListener('keydown', (e) => {
                  if (e.keyCode === 82) {
                    // console.log('R is clicked');
                    // tipDisplay.style.display = 'none';
                    tipDisplay.textContent = "Find a new solution to help complete the puzzle.";
                  }
                });

              }
            }

            steps.shift();
            // if (steps[0].text === "Use your solution to get to the end, the semi-circular tile.") {
            //   console.log(steps);
            // }

          } else {
            // display text for top most step
            tipDisplay.textContent = steps[0].text;
          }
        } else if (steps.length === 0) {
          // set display back to none once all tips are shown
          setTimeout(() => {
            if (tipDisplay.style.display !== 'none') {
              tipDisplay.style.display = 'none';
            }
          }, 5000);
        }
      }

      _previousRAF = t;
      _RAF();
    });
  }

  function step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;

    if (_mixers) {
      _mixers.forEach(m => m.update(timeElapsedS));
    }

    if (player._controls) {
      player._controls.Update(timeElapsedS);
    }
  }

  _RAF();
  player._LoadAnimatedModel();
}

function hideTitleScreen() {
  let titleScreen = document.querySelector('.start.menu.screen');
  // by default display is block I haven't touched that so will use that in conjuction with positioning to get element to show again
  titleScreen.style.display = 'none';
}

function showLoadingScreen() {
  let loadingScreen = document.querySelector('.loading.screen');
  loadingScreen.style.display = 'flex';
}

function hideLoadingScreen() {
  let loadingScreen = document.querySelector('.loading.screen');
  loadingScreen.style.display = 'none';
  gameIsLoaded = true;
}

function showCrosshair() {
  // TODO: Consider why the crosshairs needs to be appended to document
  const crosshairs = document.getElementById('crosshairs');
  document.body.appendChild(crosshairs);
  crosshairs.style.display = 'block';
}

function resumeGameControls() {
  document.addEventListener('click', function () {
    player.controls.lock();
  });
}

function startGame() {
  hideLoadingScreen();
  showCrosshair();
  resumeGameControls();
}

function _OnWindowResize() {
  camera.currentCamera.aspect = window.innerWidth / window.innerHeight;
  camera.currentCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function Step(text, checkStepComplete) {
  this.text = text;
  this.checkStepComplete = checkStepComplete;
}

function createTutorialSteps() {
  let step1Text = "Press W, A, S, D to walk.";
  let step2Text = "Walk to the front of the panel.";
  let step3Text = "Use visual clues to find path to solve the puzzle.";
  let step4Text = "Walk to start of puzzle: the circular tile.";
  let step5Text = "Jump onto the start tile with spacebar.";
  let step6Text = "Use your solution to get to the end, the semi-circular tile.";
  let step7Text = "Congrats! The door has opened, you completed the puzzle.";

  // when called it run setTimeout repeatedly which will run anonymous function until 10 seconds have elapsed. 
  // assume function can be unbundled for spontaneous variables
  // spontaneous variables can be handled same as any other variable within function like this. anything
  let checkStep1Complete = function () {

    if (this.wPressed === undefined) {
      this.wPressed = false;
      this.aPressed = false;
      this.sPressed = true;
      this.dPressed = false;
      this.allKeysPressed = false;
    }

    document.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case 87: // w
          // console.log('W was pressed');
          this.wPressed = true;
          // console.log(this.wPressed);
          break;
        case 65: // a
          // console.log('A was pressed');
          this.aPressed = true;
          // console.log(this.wPressed);
          break;
        case 83: // s
          // console.log('S was pressed');
          this.sPressed = true;
          // console.log(this.wPressed);
          break;
        case 68: // d
          // console.log('D was pressed');
          this.dPressed = true;
          // console.log(this.wPressed);
          break;
      }

      this.allKeysPressed = this.wPressed && this.aPressed && this.sPressed && this.dPressed;
    });


    //console.log(this.allKeysPressed);

    return this.allKeysPressed;
  };

  let checkStep2Complete = function () {
    this.playerPosition = new THREE.Vector3(player.playerBody.position.x, player.playerBody.position.y, player.playerBody.position.z);
    this.targetCoordinates = new THREE.Vector3(207, 4, 408); // Replace with your target coordinates

    // Define the maximum range (e.g., 5 units)
    this.maxRange = 10;

    // Calculate the distance between the player and the target coordinates
    this.distance = this.playerPosition.distanceTo(this.targetCoordinates);

    // Check if the player is within the specified range
    if (this.distance <= this.maxRange) {
      return true;
    }

    return false;
  };

  let checkStep3Complete = function () {
    if (this.startTime === undefined) {
      this.startTime = new Date().getTime();
    }

    // console.log(new Date().getTime());

    this.endTime = new Date().getTime();

    if ((this.endTime - this.startTime) / 1000 >= 2) {
      return true;
    }
  };

  let checkStep4Complete = function () {
    this.playerPosition = new THREE.Vector3(player.playerBody.position.x, player.playerBody.position.y, player.playerBody.position.z);
    this.targetCoordinates = new THREE.Vector3(235, 4, 388); // Replace with your target coordinates

    // Define the maximum range (e.g., 5 units)
    this.maxRange = 10;

    // Calculate the distance between the player and the target coordinates
    this.distance = this.playerPosition.distanceTo(this.targetCoordinates);

    // Check if the player is within the specified range
    if (this.distance <= this.maxRange) {
      return true;
    }

    return false;
  };

  let checkStep5Complete = function () {
    return objects.floorContainerYellow.children[64].litUp;
  };

  let checkStep6Complete = function () {
    return objects.floorContainerYellow.children[0].litUp;
  };

  let checkStep7Complete = function() {
    if (this.startTime === undefined) {
      this.startTime = new Date().getTime();
    }

    // console.log(new Date().getTime());

    this.endTime = new Date().getTime();

    if (objects.path4.every(value => objects.litUpTiles4.includes(value) && objects.litUpTiles4.length === objects.path4.length)) {
      this.pathCorrect = true;
    }

    // while condition not satisfied it must show and if satisfied it must go off stack
    if ((this.endTime - this.startTime) / 1000 >= 5 && this.pathCorrect === true) {
      return true;
    }

    return false;
  };

  // check this.start and this.end for step1 as they are updated. They are initialized on construction and checked on loop run.
  // start is filled and never filled again, end is refilled, their difference is checked.
  let step1 = new Step(step1Text, checkStep1Complete);
  let step2 = new Step(step2Text, checkStep2Complete);
  let step3 = new Step(step3Text, checkStep3Complete);
  let step4 = new Step(step4Text, checkStep4Complete);
  let step5 = new Step(step5Text, checkStep5Complete);
  let step6 = new Step(step6Text, checkStep6Complete);
  let step7 =  new Step(step7Text, checkStep7Complete);

  let steps = [
    step1,
    step2,
    step3,
    step4,
    step5,
    step6,
    step7,
  ];
  console.log(steps);
  return steps;
}

let steps = createTutorialSteps();
let tipDisplay = document.querySelector('.tip');

window.addEventListener('load', () => {
  runGame(steps, tipDisplay);
  // once loading is done show start button
  const startButton = document.querySelector('.start-button');
  startButton.addEventListener('click', () => {
    hideTitleScreen();
    showLoadingScreen();
    setTimeout(startGame, 5000);
  });
});

window.addEventListener('resize', _OnWindowResize, false);

const listener = new THREE.AudioListener();
const sound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('/Audio/BetterBackground.mp3', function (buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);
  sound.play();
});

document.querySelector('.pause.container resume-button');

