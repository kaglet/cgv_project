import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import * as CANNON from 'cannon-es';

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 10) // Adjust camera position

// Create a renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

//Physics

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0,-9.81,0)
});

const timeStep = 1/60;

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
const boxMat = new THREE.MeshBasicMaterial({
	color: 0x00ff00,
	wireframe: true
});
const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);





//Creating the ground
const groundGeo = new THREE.PlaneGeometry(70, 80);
const groundMat = new THREE.MeshBasicMaterial({ 
	color: 0xffffff,
	side: THREE.DoubleSide,
	wireframe: true 
 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);


const groundBody = new CANNON.Body({
  shape: new CANNON.Plane(),
  //mass: 10
  // shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
   type: CANNON.Body.STATIC,
  // material: groundPhysMat
});
world.addBody(groundBody);
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
groundBody.position.y -= 30;

const boxBody = new CANNON.Body({
  mass: 1,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
  position: new CANNON.Vec3(1, 20, 0),
//  material: boxPhysMat
});
world.addBody(boxBody);



// Create a floor tile
const tileGeometry = new THREE.PlaneGeometry(5, 5) // 1x1 square
const tileMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }) // Default white color

// Define tile size and gap size
const tileSize = 5 // Adjust the size of each tile
const gapSize = 0.2 // Adjust the size of the gap

const floorContainer = new THREE.Group();

// Duplicate tiles to create the floor with gaps
const numRows = 10;
const numCols = 10;
const tiles = [];

for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
        const tileClone = new THREE.Mesh(tileGeometry, tileMaterial.clone());
        const xOffset = (i - numRows / 2) * (tileSize + gapSize);
        const yOffset = (j - numCols / 2) * (tileSize + gapSize);
        tileClone.position.set(xOffset, yOffset, 0);

        // Add click event listener to each tile
        tileClone.addEventListener('click', () => {
            changeTileColorOnClick(tileClone);
        });

        floorContainer.add(tileClone);
        tiles.push(tileClone);
    }
}

function changeTileColorOnClick(tile) {
    const randomColor = new THREE.Color(0, 0, 255);
    tile.material.color.copy(randomColor);
    const tileLight = new THREE.PointLight(randomColor, 1, 2) // Create a point light with tile color
    tileLight.position.copy(tile.position) // Position the light at the tile's position
    scene.add(tileLight)
}

// Start changing tile color and emitting light every 5 seconds

const rotationAngle = Math.PI / 2;
floorContainer.rotation.set(-rotationAngle, 0, 0);

const translationVector = new THREE.Vector3(0, -29.9, -10);
floorContainer.position.copy(translationVector);
scene.add(floorContainer);

// Create room walls
const roomGeometry = new THREE.BoxGeometry(70, 60, 80)
const roomMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: THREE.BackSide }) // Gray color for the room
const room = new THREE.Mesh(roomGeometry, roomMaterial)
scene.add(room)

// Add lighting (point light)
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(0, 5, 0) // Adjust the position as needed
scene.add(pointLight)



const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

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


const playerShape = new CANNON.Sphere(1); // Adjust the player's shape
const playerBody = new CANNON.Body({
  mass: 5, // Adjust the mass as needed
  shape: playerShape,
});
world.addBody(playerBody);
playerBody.linearDamping = 0.8;

// Player position and movement speed
const player = new THREE.Object3D();
player.position.copy(camera.position);
scene.add(player);

const movementSpeed = 0.1;


// Set the initial position of the player (same as the camera)
playerBody.position.copy(new CANNON.Vec3(camera.position.x, camera.position.y, camera.position.z));

// Add variables to track the previous mouse position
let prevMouseX = 0;
let prevMouseY = 0;

// Listen for mousemove events to handle camera panning
document.addEventListener('mousemove', (event) => {
    const mouseDeltaX = event.clientX - prevMouseX;
    const mouseDeltaY = event.clientY - prevMouseY;

    // Adjust the camera position based on the mouse movement
    const sensitivity = 0.001; // Adjust the sensitivity as needed
    camera.rotation.y -= mouseDeltaX * sensitivity;
    camera.rotation.x -= mouseDeltaY * sensitivity;

    // Limit the vertical rotation to prevent camera flipping
    const maxVerticalAngle = Math.PI / 8; // Adjust as needed
    camera.rotation.x = Math.max(-maxVerticalAngle, Math.min(maxVerticalAngle, camera.rotation.x));

    // Update the previous mouse position
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
});


// Render loop
const animate = () => {
   // Update the player's position based on the Cannon.js body
  camera.position.set(playerBody.position.x, playerBody.position.y, playerBody.position.z);

  // Handle player movement
  if (keyboardState['w']) {
    // Move forward
    const forwardVector = new CANNON.Vec3(0, 0, -movementSpeed);
    playerBody.velocity.vadd(forwardVector, playerBody.velocity);
  }
  if (keyboardState['s']) {
    // Move backward
    const backwardVector = new CANNON.Vec3(0, 0, movementSpeed);
    playerBody.velocity.vadd(backwardVector, playerBody.velocity);
  }
  if (keyboardState['a']) {
    // Move left
    const leftVector = new CANNON.Vec3(-movementSpeed, 0, 0);
    playerBody.velocity.vadd(leftVector, playerBody.velocity);
  }
  if (keyboardState['d']) {
    // Move right
    const rightVector = new CANNON.Vec3(movementSpeed, 0, 0);
    playerBody.velocity.vadd(rightVector, playerBody.velocity);
  }

    requestAnimationFrame(animate);

    world.step(timeStep);
    
    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);


    renderer.render(scene, camera);
};




document.addEventListener('keydown', (event) => {
    keyboardState[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keyboardState[event.key] = false;
});

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('click', (event) => {
    // Calculate mouse coordinates in normalized device coordinates (NDC)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Get a list of objects intersected by the raycaster
    const intersects = raycaster.intersectObjects(tiles);

    // If there are intersections, trigger the click event on the first object (tile) in the list
    if (intersects.length > 0) {
        intersects[0].object.dispatchEvent({ type: 'click' });
    }
});



animate();