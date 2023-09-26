import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Define the first camera (you can customize its parameters)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, -10, 0);

// Define the top-down camera (you can customize its parameters)
const topDownCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
topDownCamera.position.set(0, 20, 0);
topDownCamera.lookAt(0, 0, 0);

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
