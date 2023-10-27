import * as THREE from 'three';
import * as script from './script.js'

let glass=false;

const listener = new THREE.AudioListener();
//camera.add( listener );
export let moveSound = new THREE.Audio(listener);
const moveSoundLoader = new THREE.AudioLoader();
function loadSound() {
  if (glass) {
    moveSoundLoader.load('Audio/glassWalking.mp3', function (buffer) {
      moveSound.setBuffer(buffer);
      moveSound.setLoop(true);
      moveSound.setVolume(0.5);
    });
  } else {
    moveSoundLoader.load('Audio/footsteps-dirt-gravel-6823.mp3', function (buffer) {
      moveSound.setBuffer(buffer);
      moveSound.setLoop(true);
      moveSound.setVolume(1);
    });
  }
}
loadSound();
function setGlass(value) {
  glass = value;
  loadSound(); // Reload sound based on the new value of 'glass'
}

export { glass, setGlass };