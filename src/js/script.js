import '../style.css'
import * as player from './player.js';
import * as objects from './objects.js'
import * as lighting from './lighting.js'
import * as camera from './camera.js'


import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import * as dat from 'dat.gui'


// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


const timeStep = 1/100;

function animate() {
  player.move(); //wasd and camera movement

  requestAnimationFrame(animate);

  objects.world.step(timeStep);

  objects.animated_objects(); //objects that are animated

  renderer.render(objects.scene, camera.camera);
}


renderer.setAnimationLoop(animate);
