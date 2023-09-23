
import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import * as objects from './objects.js';
import * as camera from './camera.js'


const playerShape = new CANNON.Sphere(4); // Adjust the player's shape
export const playerBody = new CANNON.Body({
  mass: 5, // Adjust the mass as needed
  shape: playerShape,
});
objects.world.addBody(playerBody);
playerBody.linearDamping = 0.8;



// Player position and movement speed
const keyboardState = {
    w: false,
    s: false,
    a: false,
    d: false,
};

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    keyboardState[key] = true;
});

document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    keyboardState[key] = false;
});


document.addEventListener('keydown', (event) => {
    keyboardState[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keyboardState[event.key] = false;
});



const movementSpeed = 0.01;


export function move(){
    camera.camera.position.set(playerBody.position.x, playerBody.position.y, playerBody.position.z);

    // Handle player movement
    const cameraDirection = new THREE.Vector3();
    camera.camera.getWorldDirection(cameraDirection); // Get the camera's forward direction
  


    if (keyboardState['w']) {
        // Move forward relative to the camera's orientation
        const forwardVector = new CANNON.Vec3(cameraDirection.x, 0, cameraDirection.z).scale(movementSpeed);
        playerBody.velocity.vadd(forwardVector, playerBody.velocity);
    }
    if (keyboardState['s']) {
        // Move backward relative to the camera's orientation
        const backwardVector = new CANNON.Vec3(-cameraDirection.x, 0, -cameraDirection.z).scale(movementSpeed);
        playerBody.velocity.vadd(backwardVector, playerBody.velocity);
    }
    if (keyboardState['a']) {
        // Move left relative to the camera's orientation
        const leftVector = new CANNON.Vec3(cameraDirection.z, 0, -cameraDirection.x).scale(movementSpeed);
        playerBody.velocity.vadd(leftVector, playerBody.velocity);
    }
    if (keyboardState['d']) {
        // Move right relative to the camera's orientation
        const rightVector = new CANNON.Vec3(-cameraDirection.z, 0, cameraDirection.x).scale(movementSpeed);
        playerBody.velocity.vadd(rightVector, playerBody.velocity);
    }
  
}




