import '../style.css'
import * as cannonObjects from './cannonObjects.js';
import * as player from './player.js';
import * as threeObjects from './threeObjects.js'
import * as lighting from './lighting'
import * as camera from './camera.js'


import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import * as dat from 'dat.gui'


// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);


const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


const timeStep = 1/100;

function animate() {
  player.move(); //wasd and camera movement

  requestAnimationFrame(animate);

  cannonObjects.world.step(timeStep);

  threeObjects.boxMesh.position.copy(cannonObjects.boxBody.position);
  threeObjects.boxMesh.quaternion.copy(cannonObjects.boxBody.quaternion);

  threeObjects.groundMesh.position.copy(cannonObjects.groundBody.position);
  threeObjects.groundMesh.quaternion.copy(cannonObjects.groundBody.quaternion);

  renderer.render(threeObjects.scene, camera.camera);
}



renderer.setAnimationLoop(animate);
