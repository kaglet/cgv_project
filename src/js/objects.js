import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import woodTextureImage from '../img/woodenfloor.jpg';
// Import texture images
import meadowFtImage from '../img/meadow/meadow_ft.jpg';
import meadowBkImage from '../img/meadow/meadow_bk.jpg';
import meadowUpImage from '../img/meadow/meadow_up.jpg';
import meadowDnImage from '../img/meadow/meadow_dn.jpg';
import meadowRtImage from '../img/meadow/meadow_rt.jpg';
import meadowLfImage from '../img/meadow/meadow_lf.jpg';
import * as camera from './camera.js';

// Scene
export const scene = new THREE.Scene();

// World - this is for cannon objects
export let world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
});

const texture_ft = new THREE.TextureLoader().load(meadowFtImage);
const texture_bk = new THREE.TextureLoader().load(meadowBkImage);
const texture_up = new THREE.TextureLoader().load(meadowUpImage);
const texture_dn = new THREE.TextureLoader().load(meadowDnImage);
const texture_rt = new THREE.TextureLoader().load(meadowRtImage);
const texture_lf = new THREE.TextureLoader().load(meadowLfImage);

// Creates new materials we can initialize with properties using the configuration objects
const materialArray = [
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide })
];

const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
const skybox = new THREE.Mesh(skyboxGeo, materialArray);
scene.add(skybox);

// Create helpers
const axesHelper = new THREE.AxesHelper(200); 
scene.add(axesHelper);

// const gridHelper = new THREE.GridHelper(200, 200);
// scene.add(gridHelper);

// Create ground
const groundGeo = new THREE.PlaneGeometry(100, 100);
const groundMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: false
});
export const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);

const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    type: CANNON.Body.STATIC,
});

groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Create single floor tile
const tileGeometry = new THREE.BoxGeometry(5, 5, 1.3)
const tileMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    opacity: 0.5, // Adjust the opacity value (0.0 to 1.0)
    transparent: true, // Enable transparency
});

// Create multiple floor tiles
const tileSize = 5; // Adjust the size of each tile
const gapSize = 0.2; // Adjust the size of the gap

export const floorContainer = new THREE.Group();
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load(woodTextureImage);

const rotationAngle = -(Math.PI / 2);

floorContainer.rotation.set(rotationAngle, 0, 0);
// Scaling applies to group hierarchically nested inside
// Local transformations before global one
// Scales floor and anything inside
floorContainer.scale.set(2, 2, 2);
scene.add(floorContainer);
//creates grid like tile path 
const numRows = 9;
const numCols = 9;
const tiles = [];

// TODO: Refactor function for clarity and maintainability, especially boolean expression with hardcoded values
// TODO: Check if floorContainer for grouping and tiles array are not redundant
for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
        const isMissingTile = (i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1);
        if (!isMissingTile || i % 4 === 0 || (i - 2) % 4 === 0) {
            const singleTile = new THREE.Mesh(tileGeometry, tileMaterial.clone());
            const xOffset = (i - numRows / 2) * (tileSize + gapSize);
            const yOffset = (j - numCols / 2) * (tileSize + gapSize);

            singleTile.position.set(xOffset, yOffset, 0);

            singleTile.castShadow = true;
            singleTile.receiveShadow = true;
            singleTile.updateWorldMatrix(true, false); // Update the world matrix of the tile

            singleTile.name = 'tile';
            singleTile.litUp = false;

            // you can add the tile into the floor container somehow, with its coordinates like that
            floorContainer.add(singleTile);
            tiles.push(singleTile);
        }
    }
}

export const raycaster = new THREE.Raycaster();

// TODO: Rename function so its job/action is clear
export function animate_objects() {
    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);
}