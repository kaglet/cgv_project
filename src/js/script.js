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


let i = 0;

// DECLARE FUNCTIONS
// TODO: Refactor function for clarity and maintainability
function raf() {
  requestAnimationFrame((t) => {
    if (previousRAF === null) {
      previousRAF = t;
    }

    raf();

    objects.world.step(1 / 60);
    objects.animate_objects();
    player.animate_objects();
    if (i == 0) {
      console.log(objects.floorContainer.children);
    }

    objects.floorContainer.children.forEach((tile, index) => {
      // TODO: Can make epsilon values for each coordinate x, y, z separately to see which have smaller vs larger errors to allow
      // The above is for finessing because right now the tile will light up when the least error from all coordinates happens, so around the center of the tile
      // All 3 must match so less chance for a mistake
      // y error is fine can be large since only one tile is near in y alone but others matter too
      const epsilon = 3; // Small epsilon value to handle floating point errors
      const worldPosition = new THREE.Vector3();
      tile.getWorldPosition(worldPosition); // Get the world position of the tile
      // console.log(`I am tile ${index}\t with world coordinates: ${worldPosition.x} in x and ${worldPosition.y} in y and ${worldPosition.z} in z\t and local coordinates: ${tile.position.x} in x and ${tile.position.y} in y and ${tile.position.z}`);

      if (tile.litUp === false && Math.abs(player.characterModel.position.x - worldPosition.x) < epsilon && Math.abs(player.characterModel.position.z - worldPosition.z) < epsilon) {
        console.log(`I am a lit tile ${index}\n with world coordinates: ${worldPosition.x} in x and ${worldPosition.y} in y and ${worldPosition.z} in z\n and local coordinates: ${tile.position.x} in x and ${tile.position.y} in y and ${tile.position.z} in z`);
        console.log(`When lit the player coordinates are: ${player.characterModel.position.x} in x and ${player.characterModel.position.y} in y and ${player.characterModel.position.z} in z`);
        const tileColor = new THREE.Color(255, 255, 0);
        // TODO: Change color of all faces of cube to blue currently only default front face is changed 
        tile.material.color.copy(tileColor);
        tile.litUp = true;
        // TODO: Make tiles sink also upon intersection, just shift slightly in the z
        // How do I position the tiles, is it within the floor container, using current position -= 1 for z for example or do I do a local transformation in floor?
        // TODO: Elevate tiles a bit from the ground they are on or simply shift the whole floor container
      }
    });
    i++;

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