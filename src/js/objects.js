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
    new THREE.MeshBasicMaterial({ map: texture_ft, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: texture_bk, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: texture_up, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: texture_dn, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: texture_rt, side: THREE.BackSide }),
    new THREE.MeshBasicMaterial({ map: texture_lf, side: THREE.BackSide })
];

// const skyboxGeo = new THREE.BoxGeometry(10000, 10000, 10000);
// const skybox = new THREE.Mesh(skyboxGeo, materialArray);
// scene.add(skybox);

// Create helpers
const axesHelper = new THREE.AxesHelper(200); 
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(200, 200);
scene.add(gridHelper);

// Create box to test physics on
const boxGeo = new THREE.BoxGeometry(5, 5, 5);
const boxMat = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
});

const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(5, 5, 5)),
    position: new CANNON.Vec3(30, 30, 0),
});
world.addBody(boxBody);

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

const floorContainer = new THREE.Group();
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load(woodTextureImage);

//creates grid like tile path 
const numRows = 9;
const numCols = 9;
const tiles = [];

let changeTileColorOnClick = function(tile) {
    const tileColor = new THREE.Color(0, 0, 255);
    tile.material.color.copy(tileColor);
    tileMaterial.castShadow = true;
    tileMaterial.receiveShadow = true;
    tileMaterial.transparent = true;
    const tileLight = new THREE.PointLight(tileColor, 1, 20, 5);
    tileLight.position.copy(tile.position);
    scene.add(tileLight);
}

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

            singleTile.addEventListener('click', () => {
                changeTileColorOnClick(singleTile);
            });

            singleTile.name = 'tile';

            floorContainer.add(singleTile);
            tiles.push(singleTile);
        }
    }
}

//scales map path
// floorContainer.scale.set(1.3, 1.3, 1.3);
const mousePosition = new THREE.Vector2(0, 0);
groundMesh.name = 'ground';
export const raycaster = new THREE.Raycaster();

window.addEventListener('click', (e) => {
    // Get normalized values of x and y of cursor (NDC)
    mousePosition.x = 0;
    mousePosition.y = 0;

    // Set two ends of the ray which are the camera and normalized mouse position
    raycaster.setFromCamera(mousePosition, camera.currentCamera);

    // Method returns an object that contains all elements from the tiles that intersects with the ray
    const intersects = raycaster.intersectObjects(floorContainer.children, true);
    intersects.forEach(intersect => {
        if (intersect.object.name === 'tile') {
            intersect.object.dispatchEvent({ type: 'click' });
        }
    });
});
// Start changing tile color and emitting light every 5 seconds

const rotationAngle = -(Math.PI / 2);

floorContainer.rotation.set(rotationAngle, 0, 0);
scene.add(floorContainer);

// TODO: Rename function so its job/action is clear
export function animated_objects() {
    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);
}

/* TODO: Check this will work with actual normalized coordinate
 positions and that is not what is somehow ruining things */

 // Sets the position of the mesh from its origin