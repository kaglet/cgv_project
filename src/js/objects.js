import * as THREE from 'three'
import * as CANNON from 'cannon-es';

import woodTextureImage from '../img/woodenfloor.jpg'; // Make sure the path to your wood texture image is correct
import walltextureImage from '../img/wall.jpg'; // Make sure the path to your wood texture image is correct
import ceilingtextureImage from '../img/Ceiling.jpg';
import * as camera from './camera.js';

// Scene
export const scene = new THREE.Scene();

// world - this is for cannon objects
export var world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0)
  });

const axesHelper = new THREE.AxesHelper(50); //so we can see the axes for debugging
scene.add(axesHelper);

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
  //  material: boxPhysMat
  });
  world.addBody(boxBody);


//Creating the ground
const groundGeo = new THREE.PlaneGeometry(70, 80);
const groundMat = new THREE.MeshBasicMaterial({ 
	color: 0xffffff,
	side: THREE.DoubleSide,
	wireframe: true 
 });
export const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);


const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    //mass: 10
    // shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
     type: CANNON.Body.STATIC,
    // material: groundPhysMat
  });

  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  groundBody.position.y -= 30;
  world.addBody(groundBody);


// Create a floor tile
const tileGeometry = new THREE.BoxGeometry(5, 5,1.3)
const tileMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    opacity: 0.5, // Adjust the opacity value (0.0 to 1.0)
    transparent: true, // Enable transparency
})
// Define tile size and gap size
const tileSize = 5 // Adjust the size of each tile
const gapSize = 0.2 // Adjust the size of the gap

const floorContainer = new THREE.Group()

const textureLoader = new THREE.TextureLoader()
const woodTexture = textureLoader.load(woodTextureImage)
//const walltexture = textureLoader.load(walltextureImage)


//const tileMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })
// Duplicate tiles to create the floor with gaps

//creates grid like tile path 
const numRows = 9
const numCols = 9
const tiles = []

for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
        const isMissingTile = (i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1);
        if (!isMissingTile || i % 4 === 0 || (i - 2) % 4 === 0) {
            const tileClone = new THREE.Mesh(tileGeometry, tileMaterial.clone());
            const xOffset = (i - numRows / 2) * (tileSize + gapSize);
            const yOffset = (j - numCols / 2) * (tileSize + gapSize);
            tileClone.position.set(xOffset, yOffset, 0);

            // Enable shadows for the tile
            tileClone.castShadow = true;
            tileClone.receiveShadow = true;

            // Add click event listener to each tile
            tileClone.addEventListener('click', () => {
            changeTileColorOnClick(tileClone);
            });

            floorContainer.add(tileClone);
            tiles.push(tileClone);
        }
    }
}


//scales map path
floorContainer.scale.set(1.3, 1.3, 1.3);

function changeTileColorOnClick(tile) {
    // const randomColor = new THREE.Color(0, 0, 255);
    // tile.material.color.copy(randomColor);
    // tile.material.emissive = randomColor; // Use the same color as the tile color for emissive
    // tile.material.emissiveIntensity = 100.0;
    // const tileLight = new THREE.PointLight(randomColor, 1.0, 10.0, 5.0); 
    // tileLight.power = 6.0;
    // tileLight.position.copy(tile.position); // Position the light at the tile's position
    // scene.add(tileLight);
    const randomColor = new THREE.Color(0, 0, 255);
    tile.material.color.copy(randomColor);
    tileMaterial.castShadow = true;
tileMaterial.receiveShadow = true;
tileMaterial.transparent = true;
    const tileLight = new THREE.PointLight(randomColor, 1, 20, 5);
    tileLight.position.copy(tile.position); 
    scene.add(tileLight);
}

// clicking the tiles?
//export const raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
export const raycaster=new THREE.Raycaster();
const mouse = new THREE.Vector2(0,0);

document.addEventListener('click', (event) => {
    // Calculate mouse coordinates in normalized device coordinates (NDC)
    mouse.x =0;
    mouse.y = 0;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera.currentCamera);

    // Get a list of objects intersected by the raycaster
    const intersects = raycaster.intersectObjects(tiles);

    // If there are intersections, trigger the click event on the first object (tile) in the list
    if (intersects.length > 0) {
        intersects[0].object.dispatchEvent({ type: 'click' });
    }
});

tileMaterial.castShadow = true;
tileMaterial.receiveShadow = true;
// Start changing tile color and emitting light every 5 seconds

const rotationAngle = Math.PI / 2;
floorContainer.rotation.set(-rotationAngle, 0, 0);


const translationVector = new THREE.Vector3(0, -29.9, -10);
floorContainer.position.copy(translationVector);
scene.add(floorContainer);

// Create room walls
//const roomGeometry = new THREE.BoxGeometry(70, 60, 80)
//const roomMaterial = new THREE.MeshStandardMaterial({ map: walltexture, side: THREE.BackSide }) // Gray color for the room
//const room = new THREE.Mesh(roomGeometry, roomMaterial)

//scene.add(room)


// Add ceiling texture (inside the room cube)
//const ceilingTexture = textureLoader.load(ceilingtextureImage); // Load your ceiling texture image
//const ceilingMaterial = new THREE.MeshStandardMaterial({ map: ceilingTexture });
//const ceilingGeometry = new THREE.PlaneGeometry(70, 79.9);
//const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
//ceiling.position.set(0,29.99 , 0); // Adjust the position to be above the room cube
//ceiling.rotation.x = Math.PI / 2; // Rotate 90 degrees along the X-axis
//scene.add(ceiling);


//const ceilingTexture = textureLoader.load(ceilingtextureImage); // Load your ceiling texture image
//const ceilingMaterial = new THREE.MeshBasicMaterial({ map: ceilingTexture });
//const ceilingGeometry = new THREE.PlaneGeometry(12, 12);
const floorWidth = numRows * (tileSize + gapSize);
const floorHeight = numCols * (tileSize + gapSize);
const floorGeometry = new THREE.PlaneGeometry(70, 79.9);
const floorMaterial = new THREE.MeshStandardMaterial({ map: woodTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Rotate the floor to be horizontal
floor.position.set(0, -29.99, 0); // Set the floor position to be just below the tiles
scene.add(floor);

const target = new THREE.Object3D();
target.position.copy(floorContainer.position); // Adjust the target's position as needed


export function animated_objects(){
    boxMesh.position.copy(boxBody.position);
    boxMesh.quaternion.copy(boxBody.quaternion);

    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

}









