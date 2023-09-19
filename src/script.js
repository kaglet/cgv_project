import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

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

// Player position and movement speed
const player = new THREE.Object3D();
player.position.copy(camera.position);
scene.add(player);

const movementSpeed = 0.5;



// Render loop
const animate = () => {
    if (keyboardState['w']) {
        camera.translateZ(-0.1);
    }
    if (keyboardState['s']) {
        camera.translateZ(0.1);
    }
    if (keyboardState['a']) {
        camera.translateX(-0.1);
    }
    if (keyboardState['d']) {
        camera.translateX(0.1);
    }

    requestAnimationFrame(animate);
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



animate()
