import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import cosmos from './cosmos.jpg';

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(6, 8, 14);
orbit.update();

// Sets a 12 by 12 gird helper
const gridHelper = new THREE.GridHelper(12, 12);
scene.add(gridHelper);

// Sets the x, y, and z axes with each having a length of 4
const axesHelper = new THREE.AxesHelper(4);
scene.add(axesHelper);

// variables passed from the js side to the shader program
const uniforms = {
  u_time: {type: 'f', value: 0.0},
  u_resolution: {type: 'vec2', value: new THREE.Vector2(window.innerWidth, window.innerHeight).multiplyScalar(window.devicePixelRatio)},
  u_mouse: {type: 'vec2', value: new THREE.Vector2(0.0, 0.0)},
  image: {type: 't', value: new THREE.TextureLoader().load(cosmos)}
};

window.addEventListener('mousemove', (e) => {
  uniforms.u_mouse.value.set(e.screenX / window.innerWidth, 1 - e.screenY / window.innerHeight);
});

const planeGeometry = new THREE.PlaneGeometry(10, 10, 30, 30);
const planeMaterial = new THREE.ShaderMaterial({
  vertexShader: document.getElementById('vertexShader').textContent,
  fragmentShader: document.getElementById('fragmentShader').textContent,
  wireframe: false,
  uniforms,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

const clock = new THREE.Clock();
function animate() {
    uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});