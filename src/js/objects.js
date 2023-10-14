import * as THREE from 'three';

import * as CANNON from 'cannon-es';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModels } from './models.js';
import * as camera from './camera.js';
import * as player from './player.js';

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

function changeTileColor(container, tileNumber, newColor) {
    const tile = container.children.find(tile => tile.userData.tileNumber === tileNumber);
    if (tile) {
        tile.material.color.set(newColor);
    }
}
function changePathColor(container, path, color) {
    path.forEach(tileNumber => {
        changeTileColor(container, tileNumber, color);
    });
}

// Create material array

const path1=[1,2,3,12,21,30,39,48,57,66,75,76,77,78,79,70,61,52,43,42,41,32,23,24,25,26,27,36,45,54,63,72,81];
const path2=[5,14,23,24,25,26,27,36,45,44,43,42,41,40,39,48,57,56,55,64,73,74,75,76,77,68,59,60,61,62,63,72,81];
const path3=[19,10,1,2,3,4,5,6,7,8,9,18,27,36,45,44,43,34,25,24,23,32,41,40,39,38,37,46,55,64,73,74,75,66,57,58,59,68,77,78,79,80,81];

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
const groundGeo = new THREE.PlaneGeometry(10000, 10000);
const groundMat = new THREE.MeshStandardMaterial({
    color: 0x78BE21,
    side: THREE.DoubleSide,
    wireframe: false
});


const groundPhysMat = new CANNON.Material()
export const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

//physics ground
const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC,
    material: groundPhysMat
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// const groundPlayerContactMat = new CANNON.ContactMaterial(
//     groundPhysMat,
//     player.playerPhysMat,
//     {friction: 0.40}
// );

//Path walls
const loader = new GLTFLoader();
loadModels(loader, scene, world);

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

changePathColor(floorContainer1, path1, 0x00ff00); // Green
changePathColor(floorContainer2, path2, 0xff0000); // Red
changePathColor(floorContainer3, path3, 0x0000FF);//blue

//scales map path
floorContainer1.scale.set(3, 3, 1.3);
floorContainer2.scale.set(3, 3, 1.3);
floorContainer3.scale.set(3, 3, 1.3);

floorContainer1.position.set(-125,0,-250);
floorContainer2.position.set(125,0,-250);
floorContainer3.position.set(125,0,0);


floorContainer1.rotation.set(rotationAngle, 0, 0);
floorContainer2.rotation.set(rotationAngle, 0, 0);
floorContainer3.rotation.set(rotationAngle, 0, 0);

// Example: Change the color of tile number 1 to red
changeTileColor(floorContainer2, 1, 0xff0000);




const gridSizeX = 2;
const gridSizeZ = 3;
const blockWidth = 250;
const blockDepth = 250;

const planeGeometry = new THREE.PlaneGeometry(gridSizeX * blockWidth, gridSizeZ * blockDepth);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White color

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate it to be horizontal
plane.position.set(0, 0, 0); // Position it on the X-Z plane

scene.add(plane);

// Create alternating grey and white blocks
for (let i = 0; i < gridSizeX; i++) {
    for (let j = 0; j < gridSizeZ; j++) {
        const color = (i + j) % 2 === 0 ? 0x808080 : 0xffffff; // Alternating grey and white
        const blockMaterial = new THREE.MeshBasicMaterial({ color });
        const blockGeometry = new THREE.BoxGeometry(blockWidth, 1, blockDepth);
        const blockMesh = new THREE.Mesh(blockGeometry, blockMaterial);
        blockMesh.position.set((i - gridSizeX / 2 + 0.5) * blockWidth, 0, (j - gridSizeZ / 2 + 0.5) * blockDepth);
        scene.add(blockMesh);
    }
}

// TODO: Figure out what this does where its exported and why it is required
export const raycaster = new THREE.Raycaster();

export function animate_objects() {
    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

}
