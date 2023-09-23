import * as THREE from 'three'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';


export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 0); // Adjust camera position
export default camera;


export const topDownCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
topDownCamera.position.set(0, 20, 0); // Adjust the camera position to be above the scene
topDownCamera.lookAt(0, 0, 0); // Make the camera look at the center of the scene


export let currentCamera = camera; // Start with the default camera

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



// // Add variables to track the previous mouse position
// let prevMouseX = window.innerWidth / 2;
// let prevMouseY = window.innerHeight / 2;

// // Set initial camera rotation angles
// let cameraYaw = 0;
// let cameraPitch = 0;

// // Listen for mousemove events to handle camera movement
// document.addEventListener('mousemove', (event) => {
//     const mouseDeltaX = event.clientX - prevMouseX;
//     const mouseDeltaY = event.clientY - prevMouseY;

//     // Adjust the camera rotation based on the mouse movement
//     const sensitivity = 0.002; // Adjust the sensitivity as needed
//     cameraYaw -= mouseDeltaX * sensitivity;
//     cameraPitch -= mouseDeltaY * sensitivity;

//     // Limit the vertical rotation to prevent camera flipping
//     const maxVerticalAngle = Math.PI / 2; // Adjust as needed
//     cameraPitch = Math.max(-maxVerticalAngle, Math.min(maxVerticalAngle, cameraPitch));

//     // Update the camera rotation
//     camera.rotation.x = cameraPitch;
//     camera.rotation.y = cameraYaw;

//     // Update the previous mouse position
//     prevMouseX = event.clientX;
//     prevMouseY = event.clientY;
// });
