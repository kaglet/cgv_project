import '../style.css';
import * as player from './player.js';
import * as objects from './objects.js';
import * as lighting from './lighting.js';
import * as camera from './camera.js';
import * as THREE from 'three';

// DECLARE GLOBAL VARIABLES
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

// DECLARE FUNCTIONS
// TODO: Refactor function for clarity and maintainability
function raf() {
  requestAnimationFrame((t) => {
    if (previousRAF === null) {
      previousRAF = t;
    }

    raf();

    objects.world.step(1 / 60);
    objects.animated_objects();
    player.animated_objects();

    renderer.render(objects.scene, camera.currentCamera);
    step(t - previousRAF);
    previousRAF = t;
  });
}

function step(timeElapsed) {
  const timeElapsedS = timeElapsed * 0.001;

  if (mixers) {
    mixers.map(m => m.update(timeElapsedS));
  }

  if (player._controls) {
    player._controls.Update(timeElapsedS);
  }
}

// PROGRAM LOGIC
let mixers = [];
let previousRAF = null;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const crosshairs = document.getElementById('crosshairs');
document.body.appendChild(crosshairs);
crosshairs.style.display = 'block';

player._LoadAnimatedModel();
raf();

window.addEventListener('resize', () => {
  camera.currentCamera.aspect = window.innerWidth / window.innerHeight;
  camera.currentCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});