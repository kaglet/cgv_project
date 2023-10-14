import '../style.css';
import * as player from './player.js';
import * as objects from './objects.js';
import * as lighting from './lighting.js';
import * as camera from './camera.js';
import * as THREE from 'three';

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

function showStartButton() {
  const startButton = document.getElementById('start-button');
  startButton.style.display = 'block';
}

function _OnWindowResize() {
  camera.currentCamera.aspect = window.innerWidth / window.innerHeight;
  camera.currentCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


// Add an event listener to execute the function after everything has loaded
window.onload = showStartButton;

function startGame() {
  
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  window.addEventListener('resize', _OnWindowResize, false);

  const _mixers = [];
  let _previousRAF = null;

  const crosshairs = document.getElementById('crosshairs');
  document.body.appendChild(crosshairs);
  crosshairs.style.display = 'block';

  function _RAF() {
    requestAnimationFrame((t) => {
      if (_previousRAF === null) {
        _previousRAF = t;
      }

      _RAF();

      objects.world.step(1 / 60);
      objects.animate_objects();
      player.animate_objects();
      lighting.animate_lights();


      renderer.render(objects.scene, camera.currentCamera);
      step(t - _previousRAF);
      _previousRAF = t;
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

  function hideTitleScreen() {
    const titleScreen = document.getElementById('title-screen');
    titleScreen.style.display = 'none';

    // Start your game here (e.g., initializing the game components)

    _RAF();
  }

  // Add a click event listener to the start button
  const startButton = document.getElementById('start-button');
  startButton.addEventListener('click', hideTitleScreen);

  _RAF();
  player._LoadAnimatedModel();
}

window.addEventListener('load', startGame);