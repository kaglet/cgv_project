import * as THREE from 'three';

// Define the first camera (you can customize its parameters)
const firstPersonCamera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    30000
);
firstPersonCamera.position.set(0, -10, 0);

<<<<<<< HEAD
// Define the top-down camera (you can customize its parameters)
const topDownCamera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    30000
);

topDownCamera.position.set(0, 20, 0);
=======
const width = window.innerWidth;
const height = window.innerHeight;

// Define orthographic camera parameters
const zoomFactor = 2; // Adjust this value to zoom in or out
const left = -width / 2 / zoomFactor;
const right = width / 2 / zoomFactor;
const top = height / 2 / zoomFactor;
const bottom = -height / 2 / zoomFactor;
const near = 0.1;
const far = 1000;

// Create an orthographic camera
const topDownCamera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
//const topDownCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
topDownCamera.position.set(0, 100, 0);
>>>>>>> 90949b94d9d8e50005b3a80284d161f41d58ba1c
topDownCamera.lookAt(0, 0, 0);

// Initialize the current camera to be the default camera
let currentCamera = firstPersonCamera;

document.addEventListener('keydown', (event) => {
    if (event.key === 'c') {
        // Switch between cameras
        currentCamera = (currentCamera === firstPersonCamera) ? topDownCamera : firstPersonCamera;
    }
});

export { firstPersonCamera, topDownCamera, currentCamera };
