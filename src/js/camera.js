import * as THREE from 'three';

// Define the first camera (you can customize its parameters)
const firstPersonCamera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    30000
);
firstPersonCamera.position.set(0, -10, 0);

// Define the top-down camera (you can customize its parameters)
const topDownCamera = new THREE.PerspectiveCamera(
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    30000
);

topDownCamera.position.set(0, 20, 0);
topDownCamera.lookAt(0, 0, 0);

// Initialize the current camera to be the default camera
let currentCamera = firstPersonCamera;

document.addEventListener('keydown', (event) => {
    if (event.key === 'c') {
        // Switch between cameras
        currentCamera = (currentCamera === firstPersonCamera) ? topDownCamera : firstPersonCamera;
    }
});

export { firstPersonCamera as camera, topDownCamera, currentCamera };
