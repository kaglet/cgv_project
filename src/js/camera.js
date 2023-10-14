import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Define the first camera (you can customize its parameters)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 30000);
camera.position.set(0, -10, 0);

const width = window.innerWidth;
const height = window.innerHeight;

// Define orthographic camera parameters
const zoomFactor = 5; // Adjust this value to zoom in or out
const left = -width / 2 / zoomFactor;
const right = width / 2 / zoomFactor;
const top = height / 2 / zoomFactor;
const bottom = -height / 2 / zoomFactor;
const near = 0.1;
const far = 1000;

// Create an orthographic camera
const topDownCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
//const topDownCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
topDownCamera.position.set(-180, 1000, -360);
topDownCamera.lookAt(-180, 0, -360);

// Initialize the current camera to be the default camera
let currentCamera = camera;

document.addEventListener('keydown', (event) => {
    if (event.key === 'c') {
        // Switch between cameras
        if (currentCamera === camera) {
            currentCamera = topDownCamera;
        } else {
            currentCamera = camera;
        }
    }
});

export { camera, topDownCamera, currentCamera };