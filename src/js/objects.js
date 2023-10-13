import * as THREE from 'three';

import * as CANNON from 'cannon-es';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModels } from './models.js';
import * as camera from './camera.js';

// DEFINE GLOBAL VARIABLES
// Scene
export const scene = new THREE.Scene();

// world - this is for cannon objects
export var world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -20, 0)
});

// DEFINE FUNCTIONS
// Function to create a unique tile object
function createTile(index) {
    const tile = new THREE.Mesh(tileGeometry, tileMaterial.clone());
    tile.userData.tileNumber = index; // Store the tile number in user data
    tile.castShadow = true;
    tile.receiveShadow = true;
    return tile;
}

function changeTileColor(container, tileNumber, newColor) {
    const tile = container.children.find(tile => tile.userData.tileNumber === tileNumber);
    if (tile) {
        tile.material.color.set(newColor);
    }
}

// Function to add or omit tiles based on tile numbers
function drawGridWithOmissions(container, omittedTiles = []) {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const tileNumber = i * numCols + j + 1;
            if (!omittedTiles.includes(tileNumber)) {
                const isMissingTile = (i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1);
                if (!isMissingTile || i % 4 === 0 || (i - 2) % 4 === 0) {
                    const tile = createTile(tileNumber);
                    const xOffset = (i - numRows / 2) * (tileSize + gapSize);
                    const yOffset = (j - numCols / 2) * (tileSize + gapSize);
                    tile.name = 'tile';
                    tile.litUp = false;
                    tile.position.set(xOffset, yOffset, 0);
                    tile.updateWorldMatrix(true, false);
                    container.add(tile); // Add the tile to the specified container
                }
            }
        }
    }
}

function changeTileColorOnClick(tile) {
    const randomColor = new THREE.Color(0, 0, 255);
    tile.material.color.copy(randomColor);
    tileMaterial.castShadow = true;
    tileMaterial.receiveShadow = true;
    tileMaterial.transparent = true;
    const tileLight = new THREE.PointLight(randomColor, 1, 20, 5);
    tileLight.position.copy(tile.position);
    scene.add(tileLight);
}

// Create material array
const materialArray = [
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide })
];

// Set material side to backside
materialArray.forEach(material => {
    material.side = THREE.BackSide;
});

// Create skybox
const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
const skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);

const axesHelper = new THREE.AxesHelper(200); //so we can see the axes for debugging
scene.add(axesHelper);

// Create ground
const groundGeo = new THREE.PlaneGeometry(200, 300);
const groundMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: false
});
export const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

//physics ground
const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC,
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

//Path object
// TODO: Understand or comment what this does
const fbxLoader = new FBXLoader();

fbxLoader.load('./the_way/the_way.FBX', (fbx) => {
    /// You can scale, position, and rotate the model here
    // Example:
    fbx.scale.set(0.1, 0.1, 0.1);
    fbx.position.set(0, 0, 0);

    fbx.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            const material = child.material;
            if (material && material.shininessMap) {
                material.shininessMap = null;
            }
        }
    });

    // Add the loaded model to your scene
    scene.add(fbx);
});

//Path walls
const loader = new GLTFLoader();

loader.load('./ruined_sandstone__wall_ref/scene.gltf', (gltf) => {
    const leftWall = gltf.scene;
    scene.add(leftWall);

    leftWall.position.set(-90, -5, 130); // Adjust the position as needed
    leftWall.scale.set(4, 1.8, 2); // Adjust the scale as needed
    leftWall.rotation.set(0, Math.PI / 2, 0);

    const rightWall = leftWall.clone();

    // Apply a scale transformation to reflect it across the X-axis
    rightWall.scale.z = -1; // Reflect across the X-axis
    rightWall.position.set(90, -5, 130); // Adjust the position as needed
    scene.add(rightWall);

    // Optionally, you can perform additional operations on the loaded model here.
});

// DEFINE MAZE GRID
// Create a floor tile
const tileGeometry = new THREE.BoxGeometry(5, 5, 1.3);
const tileMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    opacity: 0.5, // Adjust the opacity value (0.0 to 1.0)
    transparent: true, // Enable transparency
});

// Define tile size and gap size
const tileSize = 5; // Adjust the size of each tile
const gapSize = 0.2; // Adjust the size of the gap

const numRows = 9;
const numCols = 9;

const tiles = [];

const rotationAngle = (Math.PI / 2);
export const floorContainer1 = new THREE.Group();
export const floorContainer2 = new THREE.Group();
export const floorContainer3 = new THREE.Group();
scene.add(floorContainer1);
scene.add(floorContainer2);
scene.add(floorContainer3);

// Call the function to draw the first grid with omissions
drawGridWithOmissions(floorContainer1, []);
drawGridWithOmissions(floorContainer2, [30, 38, 78]);
drawGridWithOmissions(floorContainer3, [28, 30, 42, 52, 76]);

floorContainer1.scale.set(2.6, 2.6, 1.3);
floorContainer2.scale.set(2.6, 2.6, 1.3);
floorContainer3.scale.set(2.6, 2.6, 1.3);

floorContainer1.position.set(0, 0, 180);
floorContainer2.position.set(0, 0, 50);
floorContainer3.position.set(0, 0, -100);

floorContainer1.rotation.set(rotationAngle, 0, 0);
floorContainer2.rotation.set(rotationAngle, 0, 0);
floorContainer3.rotation.set(rotationAngle, 0, 0);

// Example: Change the color of tile number 1 to red
changeTileColor(floorContainer2, 1, 0xff0000);

loadModels(loader, scene, world);

// TODO: Figure out what this does where its exported and why it is required
export const raycaster = new THREE.Raycaster();

export function animate_objects() {
    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);
}

