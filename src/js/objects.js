import * as THREE from 'three';

import * as CANNON from 'cannon-es';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModels } from './models.js';
import * as camera from './camera.js';
import * as player from './player.js';

// Import texture images
import meadowFtImage from '../img/meadow/meadow_ft.jpg';
import meadowBkImage from '../img/meadow/meadow_bk.jpg';
import meadowUpImage from '../img/meadow/meadow_up.jpg';
import meadowDnImage from '../img/meadow/meadow_dn.jpg';
import meadowRtImage from '../img/meadow/meadow_rt.jpg';
import meadowLfImage from '../img/meadow/meadow_lf.jpg';

// DEFINE GLOBAL VARIABLES
// Scene
export const scene = new THREE.Scene();

// world - this is for cannon objects
export var world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -20, 0)
});

class Wall {
    constructor(scene, world, position, rotation) {
        // Create Three.js wall
        const wallGeometry = new THREE.BoxGeometry(blockWidth, 70, 5);
        const wallMaterial = new THREE.MeshStandardMaterial({
            color: "#DEC4B0",
            side: THREE.DoubleSide,
            wireframe: false,
        });

        this.mesh = new THREE.Mesh(wallGeometry, wallMaterial);
        scene.add(this.mesh);

        // Create Cannon.js wall
        const wallPhysMat = new CANNON.Material()
        const wallShape = new CANNON.Box(new CANNON.Vec3(blockWidth/2, 35, 2.5));
        this.body = new CANNON.Body({
            mass: 0,
            shape: wallShape,
            material: wallPhysMat,
        });

        // Set the initial position and rotation for the Cannon.js body
        this.body.position.copy(position);
        this.body.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);

        // Add the Cannon.js body to the world
        world.addBody(this.body);

        // Update the Three.js mesh position and rotation based on the Cannon.js body
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    }
}

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

// const materialArray = [
//     new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
//     new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
//     new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
//     new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
//     new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
//     new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide })
// ];

// // Set material side to backside
// materialArray.forEach(material => {
//     material.side = THREE.BackSide;
// });

// Create texture objects
const texture_ft = new THREE.TextureLoader().load(meadowFtImage);
const texture_bk = new THREE.TextureLoader().load(meadowBkImage);
const texture_up = new THREE.TextureLoader().load(meadowUpImage);
const texture_dn = new THREE.TextureLoader().load(meadowDnImage);
const texture_rt = new THREE.TextureLoader().load(meadowRtImage);
const texture_lf = new THREE.TextureLoader().load(meadowLfImage);

// Create material array
const materialArray = [
  new THREE.MeshBasicMaterial({ map: texture_ft }),
  new THREE.MeshBasicMaterial({ map: texture_bk }),
  new THREE.MeshBasicMaterial({ map: texture_up }),
  new THREE.MeshBasicMaterial({ map: texture_dn }),
  new THREE.MeshBasicMaterial({ map: texture_rt }),
  new THREE.MeshBasicMaterial({ map: texture_lf })
];

// Set material side to backside
materialArray.forEach((material) => {
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
groundMesh.position.copy(groundBody.position);
groundMesh.quaternion.copy(groundBody.quaternion);


// const groundPlayerContactMat = new CANNON.ContactMaterial(
//     groundPhysMat,
//     player.playerPhysMat,
//     {friction: 0.40}
// );

//white and gray squares (will be removed later)
const gridSizeX = 2;
const gridSizeZ = 3;
const blockWidth = 350;
const blockDepth = 350;

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
floorContainer1.scale.set(4, 4, 1);
floorContainer2.scale.set(4, 4, 1);
floorContainer3.scale.set(4, 4, 1);

floorContainer1.position.set(-blockWidth/2,5,- blockWidth);
floorContainer2.position.set( blockWidth/2,5,- blockWidth);
floorContainer3.position.set( blockWidth/2,5,0);


floorContainer1.rotation.set(rotationAngle, 0, 0);
floorContainer2.rotation.set(rotationAngle, 0, 0);
floorContainer3.rotation.set(rotationAngle, 0, 0);

// Example: Change the color of tile number 1 to red
changeTileColor(floorContainer2, 1, 0xff0000);

const wallSpawnRight = new Wall(scene, world, new CANNON.Vec3(blockWidth, 0, blockWidth), new CANNON.Vec3(0, rotationAngle, 0));
const wallSpawnLeft = new Wall(scene, world, new CANNON.Vec3(0, 0, blockWidth), new CANNON.Vec3(0, rotationAngle, 0));
const wallSpawnBack = new Wall(scene, world, new CANNON.Vec3(blockWidth/2, 0, blockWidth*1.5), new CANNON.Vec3(0, (Math.PI / 1), 0));

const wallPuzz1Right = new Wall(scene, world, new CANNON.Vec3(blockWidth, 0, 0), new CANNON.Vec3(0, rotationAngle, 0));
const wallPuzz1Left  = new Wall(scene, world, new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(0, rotationAngle, 0));

const wallPuzz2Back = new Wall(scene, world, new CANNON.Vec3(blockWidth/2, 0, -blockWidth*1.5), new CANNON.Vec3(0, (Math.PI / 1), 0));
const wallPuzz2Right  = new Wall(scene, world, new CANNON.Vec3(blockWidth, 0, -blockWidth), new CANNON.Vec3(0, rotationAngle, 0));

const wallPuzz3Right = new Wall(scene, world, new CANNON.Vec3(-blockWidth/2, 0, -blockWidth*1.5), new CANNON.Vec3(0, (Math.PI / 1), 0));
const wallPuzz3Left = new Wall(scene, world, new CANNON.Vec3(-blockWidth/2, 0, -blockWidth/2), new CANNON.Vec3(0, (Math.PI / 1), 0));
const wallPuzz3back  = new Wall(scene, world, new CANNON.Vec3(-blockWidth, 0, -blockWidth), new CANNON.Vec3(0, rotationAngle, 0));



// TODO: Figure out what this does where its exported and why it is required
export const raycaster = new THREE.Raycaster();

export function animate_objects() {
    // groundMesh.position.copy(groundBody.position);
    // groundMesh.quaternion.copy(groundBody.quaternion);

}
