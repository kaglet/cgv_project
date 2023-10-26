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

function runGame() {
  const _mixers = [];
  let _previousRAF = null;

  let frameCounter = 0;

  function _RAF() {
    requestAnimationFrame((t) => {
      if (_previousRAF === null) {
        _previousRAF = t;
      }

      if (!player.paused) {
        objects.world.step(1/60);
        objects.animate_objects();
        player.animate_objects();
        objects.animate_lights();
        renderer.render(objects.scene, camera.currentCamera);
        step(t - _previousRAF);
      }

      if (frameCounter % 50 === 0) {
        const playerPosition = new THREE.Vector3(player.playerBody.position.x, player.playerBody.position.y, player.playerBody.position.z);
        const targetCoordinates = new THREE.Vector3(207, 4, 408); // Replace with your target coordinates

        // Define the maximum range (e.g., 5 units)
        const maxRange = 10;

        // Calculate the distance between the player and the target coordinates
        const distance = playerPosition.distanceTo(targetCoordinates);

        // Check if the player is within the specified range
        if (distance <= maxRange) {
          console.log('Player in front of sign');
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

window.addEventListener('load', () => {
  runGame();
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

document.querySelector('.pause.container resume-button')

