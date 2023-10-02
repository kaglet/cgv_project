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
export let levelAreas = [];

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

const correctPath1=[0, 1, 2, 10, 16, 24, 30, 38, 44, 52, 58, 59, 60, 61, 62, 54, 48, 40, 34, 33, 32, 25, 18, 19, 20, 21, 22, 27, 36, 41, 50, 55, 64];
const correctPath2=[61, 53, 48, 47, 46, 45, 44, 51, 58, 57, 56, 55, 54, 49, 40, 41, 42, 36, 28, 29, 30, 31, 32, 33, 34, 26, 22, 21, 20, 19, 18, 11, 4];
const correctPath3=[14, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 13, 22, 25, 33, 32, 31, 24, 20, 19, 18, 23, 30, 29, 28, 27, 26, 34, 38, 47, 52, 53, 54, 48, 40, 41, 42, 49, 55, 56, 57, 58, 59];

let litUpTiles1=[];
let litUpTiles2=[];
let litUpTiles3=[];


const materialArray = [
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide })
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
    receiveShadow: true,
    castShadow: true,
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
        blockMesh.updateWorldMatrix(true, false);
        
        scene.add(blockMesh);
        let boundingBox = new THREE.Box3().setFromObject(blockMesh);
        let size = new THREE.Vector3();
        boundingBox.getSize(size);
        blockMesh.sizeFromBoundingBox = size;
        levelAreas.push(blockMesh);
    }
}

const loader = new GLTFLoader();
loadModels(loader, scene, world);

// DEFINE MAZE GRID
// Create a floor tile
const tileGeometry = new THREE.BoxGeometry(5, 5, 1.3);
const tileMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    opacity: 0.5,
    transparent: true,
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
//PiP
export const PiP1 = floorContainer1.clone();
export const PiP2 = floorContainer2.clone();
export const PiP3 = floorContainer3.clone();

// Iterate through all objects in PiP3
// PiP3.children.forEach((tile) => {
//     //tile.material = tile.material.clone();
//     tile.material.transparent = false;
//     tile.material.opacity = 1;
// });

// const shearMatrix = new THREE.Matrix4();
// shearMatrix.set(
//   1, 0.5, 0, 0, // Shearing along the x-axis
//   0.5, 1, 0, 0, // Shearing along the y-axis
//   0, 0, 1, 0,
//   0, 0, 0, 1
// );

//PiP3 Creation
PiP3.scale.set(0.12,0.12,0.12);
PiP3.position.set(blockWidth/2 + 0.5,20,141);
PiP3.rotation.set(Math.PI,0,0);
//PiP3 Pole
const poleGeometry = new THREE.CylinderGeometry(0.75, 0.75, 35, 50);
const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const pole3 = new THREE.Mesh(poleGeometry, poleMaterial);
scene.add(pole3);
pole3.position.set(175,0,140);
//PiP3 Sign
const signwallgeometry = new THREE.BoxGeometry(10, 10, 1.5);
const signmaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const signwall3 = new THREE.Mesh(signwallgeometry,signmaterial);
scene.add(signwall3)
signwall3.position.set(175,20,140);

//PiP1 Creation
PiP1.scale.set(0.12,0.12,0.12);
PiP1.position.set(-blockWidth/2 + 142.5 ,20,- blockWidth + 0.6);
PiP1.rotation.set(-Math.PI/2,-Math.PI/2,-Math.PI);
//PiP1 Pole
const pole1 = new THREE.Mesh(poleGeometry, poleMaterial);
scene.add(pole1);
pole1.position.set(-blockWidth/2 + 141 ,0,- blockWidth + 0.5);
//PiP1 Sign
const signwall1 = new THREE.Mesh(signwallgeometry,signmaterial);
scene.add(signwall1);
signwall1.position.set(-blockWidth/2 + 141 ,20,- blockWidth + 0.8);
signwall1.rotation.set(0,Math.PI/2,0);


//PiP2 Creation
PiP2.scale.set(0.12,0.12,0.12);
PiP2.position.set(blockWidth/2 + 0.65,20, -218);
PiP2.rotation.set(Math.PI,0,0);
//PiP2 Pole
const pole2 = new THREE.Mesh(poleGeometry, poleMaterial);
scene.add(pole2);
pole2.position.set(blockWidth/2 + 0.5,0,-220);
//PiP2 Sign
const signwall2 = new THREE.Mesh(signwallgeometry, signmaterial);
scene.add(signwall2);
signwall2.position.set(blockWidth/2 + 0.5,20,-220);

scene.add(PiP1);
scene.add(PiP2);
scene.add(PiP3);




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

export function animate_lights() {

    if (player.characterModel) {

        floorContainer1.children.forEach((tile, index) => {
        const epsilon = 3; // Small epsilon value to handle floating point errors
        const tileWorldPosition = new THREE.Vector3();
        tile.getWorldPosition(tileWorldPosition); // Get the world position of the tile instead of the position in the local coordinate system of the floor container
        let boundingBox = new THREE.Box3().setFromObject(tile);
        let size = new THREE.Vector3();
        boundingBox.getSize(size);

        let rangeInX = size.x / 2;
        let rangeInZ = size.z / 2;

        let inXBounds = tileWorldPosition.x - rangeInX <= player.characterModel.position.x && player.characterModel.position.x <= tileWorldPosition.x + rangeInX;
        let inZBounds = tileWorldPosition.z - rangeInZ <= player.characterModel.position.z && player.characterModel.position.z <= tileWorldPosition.z + rangeInZ;

        if (tile.litUp === false && inXBounds && inZBounds && Math.abs(player.characterModel.position.y - tileWorldPosition.y) < epsilon) {
         const tileColor = new THREE.Color(255, 255, 0);
          // TODO: Change color of all faces of cube to blue currently only default front face is changed
          tile.material.color.copy(tileColor);
          tile.litUp = true;
          litUpTiles1.push(index);
          const haveSameValues = correctPath1.every(value => litUpTiles1.includes(value) && litUpTiles1.length === correctPath1.length);
                if (haveSameValues) {
                    console.log("Path 1 correct.");
                }
          // TODO: Make tiles sink also upon intersection, just shift slightly in the z
          // How do I position the tiles, is it within the floor container, using current position -= 1 for z for example or do I do a local transformation in floor?
          // TODO: Elevate tiles a bit from the ground they are on or simply shift the whole floor container
        }
      });



        floorContainer2.children.forEach((tile, index) => {
        const epsilon = 3; // Small epsilon value to handle floating point errors
        const tileWorldPosition = new THREE.Vector3();
        tile.getWorldPosition(tileWorldPosition);

        let boundingBox = new THREE.Box3().setFromObject(tile);
        let size = new THREE.Vector3();
        boundingBox.getSize(size);

        let rangeInX = size.x / 2;
        let rangeInZ = size.z / 2;

        let inXBounds = tileWorldPosition.x - rangeInX <= player.characterModel.position.x && player.characterModel.position.x <= tileWorldPosition.x + rangeInX;
        let inZBounds = tileWorldPosition.z - rangeInZ <= player.characterModel.position.z && player.characterModel.position.z <= tileWorldPosition.z + rangeInZ;

        if (tile.litUp === false && inXBounds && inZBounds && Math.abs(player.characterModel.position.y - tileWorldPosition.y) < epsilon) {
          const tileColor = new THREE.Color(255, 255, 0);
          // TODO: Change color of all faces of cube to blue currently only default front face is changed
          tile.material.color.copy(tileColor);
          tile.litUp = true;
          litUpTiles2.push(index);
          const haveSameValues = correctPath2.every(value => litUpTiles2.includes(value) && litUpTiles2.length === correctPath2.length);
                if (haveSameValues) {
                    console.log("Path 2 correct.");
                }
          // TODO: Make tiles sink also upon intersection, just shift slightly in the z
          // How do I position the tiles, is it within the floor container, using current position -= 1 for z for example or do I do a local transformation in floor?
          // TODO: Elevate tiles a bit from the ground they are on or simply shift the whole floor container
        }
      });

        floorContainer3.children.forEach((tile, index) => {
        const epsilon = 3; // Small epsilon value to handle floating point errors
        const tileWorldPosition = new THREE.Vector3();
        tile.getWorldPosition(tileWorldPosition);

        let boundingBox = new THREE.Box3().setFromObject(tile);
        let size = new THREE.Vector3();
        boundingBox.getSize(size);

        let rangeInX = size.x / 2;
        let rangeInZ = size.z / 2;

        let inXBounds = tileWorldPosition.x - rangeInX <= player.characterModel.position.x && player.characterModel.position.x <= tileWorldPosition.x + rangeInX;
        let inZBounds = tileWorldPosition.z - rangeInZ <= player.characterModel.position.z && player.characterModel.position.z <= tileWorldPosition.z + rangeInZ;

        if (tile.litUp === false && inXBounds && inZBounds && Math.abs(player.characterModel.position.y - tileWorldPosition.y) < epsilon) {
          const tileColor = new THREE.Color(255, 255, 0);
          // TODO: Change color of all faces of cube to blue currently only default front face is changed
          tile.material.color.copy(tileColor);
          tile.litUp = true;
          litUpTiles3.push(index);
          const haveSameValues = correctPath3.every(value => litUpTiles3.includes(value) && litUpTiles3.length === correctPath3.length);
          if (haveSameValues) {
              console.log("Path 3 correct.");
          }
          // TODO: Make tiles sink also upon intersection, just shift slightly in the z
          // How do I position the tiles, is it within the floor container, using current position -= 1 for z for example or do I do a local transformation in floor?
          // TODO: Elevate tiles a bit from the ground they are on or simply shift the whole floor container
        }
      });
    }
}