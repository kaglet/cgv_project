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

  // TODO: Consider why the crosshairs needs to be appended to document
  const crosshairs = document.getElementById('crosshairs');
  document.body.appendChild(crosshairs);
  crosshairs.style.display = 'block';

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
  const titleScreen = document.getElementById('start-menu');
  titleScreen.style.display = 'none';
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
  startButton.addEventListener('click', hideTitleScreen);
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

