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
const groundGeo = new THREE.PlaneGeometry(200, 300);
const groundMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    wireframe: false
});

const boxMesh = new THREE.Mesh(boxGeo, boxMat);
scene.add(boxMesh);

const boxPhysMat = new CANNON.Material();
const boxBody = new CANNON.Body({
    mass: 100,
    shape: new CANNON.Box(new CANNON.Vec3(5, 5, 5)),
    position: new CANNON.Vec3(10, 2, 20),
  //  material: boxPhysMat
  });
  world.addBody(boxBody);


const groundPhysMat = new CANNON.Material();
//physics ground
const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    //mass: 10
    // shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
     type: CANNON.Body.STATIC,
     material: groundPhysMat
  });

  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(groundBody);


  boxBody.angularVelocity.set(0, 10, 0);
boxBody.angularDamping = 0.5;

const groundBoxContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    boxPhysMat,
    {friction: 0.40}
);


//Path object

// const fbxLoader = new FBXLoader();

// fbxLoader.load('./the_way/the_way.FBX', (fbx) => {
//     /// You can scale, position, and rotate the model here
//     // Example:
//     fbx.scale.set(0.1, 0.1, 0.1);
//     fbx.position.set(0, -10, 0);

//     fbx.traverse((child) => {
//         if (child instanceof THREE.Mesh) {
//             const material = child.material;
//             if (material && material.shininessMap) {
//                 material.shininessMap = null;
//             }
//         }
//     });

//     // Add the loaded model to your scene
//  //   scene.add(fbx);
//   });

// //Path walls

// const loader = new GLTFLoader();

// loader.load('./ruined_sandstone__wall_ref/scene.gltf', (gltf) => {
//   const wall1 = gltf.scene;
//   scene.add(wall1);

//   wall1.position.set(-90, -5, 130); // Adjust the position as needed
//   wall1.scale.set(4, 1.8, 2); // Adjust the scale as needed
//   wall1.rotation.set(0, Math.PI / 2, 0);


//   const wall2 = wall1.clone();

//   // Apply a scale transformation to reflect it across the X-axis
//   wall2.scale.z = -1; // Reflect across the X-axis
//   wall2.position.set(90, -5, 130); // Adjust the position as needed
//   scene.add(wall2);
  
//       // Calculate dimensions of the Luffy model
//       const boundingBox = new THREE.Box3().setFromObject(wall1);
//       const width = boundingBox.max.x - boundingBox.min.x;
//       const height = boundingBox.max.y - boundingBox.min.y;
//       const depth = boundingBox.max.z - boundingBox.min.z;
  
//       // Create Cannon.js body shape for Luffy model
//       const pathwallShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
  
//       // Create Cannon.js body for Luffy model
//       const pathwallBody  = new CANNON.Body({
//           mass: 0, // Adjust mass as needed
//           position: wall1.position,
//       });
//       pathwallBody.addShape(pathwallShape );
//       world.addBody(pathwallBody);
  
// });



// const pathwallBody = new CANNON.Body({
//     //mass: 10
//      shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
//      type: CANNON.Body.STATIC,
//   });


//   pathwallBody.position.copy( new THREE.Vector3(0, 1, 200));
//  // pathwallBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

//   world.addBody(pathwallBody);






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
floorContainer1.scale.set(2.6, 2.6, 1.3);
floorContainer2.scale.set(2.6, 2.6, 1.3);
floorContainer3.scale.set(2.6, 2.6, 1.3);

floorContainer1.position.set(-125,0,-250);
floorContainer2.position.set(125,0,-250);
floorContainer3.position.set(125,0,0);

floorContainer1.rotation.set(Math.PI/2,0,0);
floorContainer2.rotation.set(Math.PI/2,0,0);
floorContainer3.rotation.set(Math.PI/2,0,0);

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



// Define the dimensions of the floorContainer
const floorContainerWidth = numRows * (tileSize + gapSize) * 1.3; // Adjusted for scaling
const floorContainerHeight = numCols * (tileSize + gapSize) * 1.3; // Adjusted for scaling
const floorContainerDepth = 1.3; // Depth of the floor container (same as the tile)

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




// Create a box shape for the floorContainer
//const floorContainerShape = new CANNON.Box(
//    new CANNON.Vec3(
//        floorContainerWidth / 2,
//        floorContainerHeight / 2,
//        floorContainerDepth / 2
//    )
//);
//
//// Create a Cannon.js body for the floorContainer
//const floorContainerBody = new CANNON.Body({
//    type: CANNON.Body.STATIC,
//    shape: floorContainerShape,
//    position: new CANNON.Vec3(0, 0, -floorContainerDepth / 2) // Adjust the position as needed
//});
//
//const translationVector = new THREE.Vector3(0, 1, 200);
//floorContainerBody.position.copy(translationVector);
//floorContainerBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
//
//// Add the floorContainerBody to the world
//world.addBody(floorContainerBody);

// const loader = new GLTFLoader();
// loader.load('/ground_material.glb', function (gltf) {
//     gltf.scene.rotation.y=Math.PI/2;
//     gltf.scene.scale.set(5,1,5);
//     gltf.scene.position.y=-1;
//     gltf.scene.position.x=0;
//     gltf.scene.position.z=0;
//     scene.add(gltf.scene);

// }, undefined, function (error) {
//     console.error(error);
// });

// loader.load('/luffy.glb', function (gltf) {
//     const luffyModel = gltf.scene;
//     luffyModel.rotation.y = -Math.PI / 2;
//     luffyModel.scale.set(0.15, 0.15, 0.15);
//     luffyModel.position.set(0, -2, -40);

//     // Calculate dimensions of the Luffy model
//     const boundingBox = new THREE.Box3().setFromObject(luffyModel);
//     const width = boundingBox.max.x - boundingBox.min.x;
//     const height = boundingBox.max.y - boundingBox.min.y;
//     const depth = boundingBox.max.z - boundingBox.min.z;

//     // Create Cannon.js body shape for Luffy model
//     const luffyShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));

//     // Create Cannon.js body for Luffy model
//     const luffyBody = new CANNON.Body({
//         mass: 0, // Adjust mass as needed
//         position: new CANNON.Vec3(0, -2, -40) // Initial position of the model
//     });
//     luffyBody.addShape(luffyShape);
//     world.addBody(luffyBody);

//     scene.add(luffyModel);

//     // Print the size of the Luffy model
//     console.log('Luffy Model Size - Width:', width, 'Height:', height, 'Depth:', depth);

//     // Create wireframe mesh for visualization
//     const wireframeGeometry = new THREE.BoxGeometry(width, height, depth);
//     const wireframeMaterial = new THREE.MeshBasicMaterial({
//         color: 0x00ff00,
//         wireframe: true
//     });
//     const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

//     // Position the wireframe mesh at the same position as the model
//     wireframeMesh.position.set(0, 10, -40);

//     // Add the wireframe mesh to the scene
//     scene.add(wireframeMesh);
// }, undefined, function (error) {
//     console.error(error);
// });
// loader.load('/lion_statue.glb', function (gltf) {
//     const lionStatueModel = gltf.scene;
//     lionStatueModel.scale.set(20, 20, 20);
//     lionStatueModel.position.set(-40, -5, 0);
//     console.log("Lion Statue Properties:");
// //    for (const property in lionStatueModel) {
// //        console.log(`${property}:`, lionStatueModel[property]);
// //    }

//     // Calculate dimensions of the lion statue model
//     const boundingBox = new THREE.Box3().setFromObject(lionStatueModel);
//     const width = boundingBox.max.x - boundingBox.min.x;
//     const height = boundingBox.max.y - boundingBox.min.y;
//     const depth = boundingBox.max.z - boundingBox.min.z;
//     console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

//     // Add Cannon.js body for Lion Statue model
//     const lionStatueShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
//     const lionStatueBody = new CANNON.Body({
//         mass: 0, // Static object, so mass is 0
//         position: new CANNON.Vec3(-40, -5, 0) // Initial position of the model
//     });
//     lionStatueBody.addShape(lionStatueShape);
//     world.addBody(lionStatueBody);

//     scene.add(lionStatueModel);

//     // Create wireframe mesh for visualization
//     const wireframeGeometry = new THREE.BoxGeometry(width, height-3, depth);
//     const wireframeMaterial = new THREE.MeshBasicMaterial({
//         color: 0x00ff00,
//         wireframe: true
//     });
//     const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

//     // Position the wireframe mesh at the same position as the model
//     wireframeMesh.position.set(-40, 8, 0);

//     // Add the wireframe mesh to the scene
//     scene.add(wireframeMesh);
// }, undefined, function (error) {
//     console.error(error);
// });

// // Load Dragon Ball Z - Guko Character model
// loader.load('/dragon_ball_z_-_guko_character.glb', function (gltf) {
//     const gukoModel = gltf.scene;
//     gukoModel.rotation.y = -Math.PI / 2;
//     gukoModel.scale.set(1, 1, 1);
//     gukoModel.position.set(40, 35, 0);

//     // Calculate dimensions of the Goku model
//     const boundingBox = new THREE.Box3().setFromObject(gukoModel);
//     const width = boundingBox.max.x - boundingBox.min.x;
//     const height = boundingBox.max.y - boundingBox.min.y;
//     const depth = boundingBox.max.z - boundingBox.min.z;
//     console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

//     // Create Cannon.js body shape for Goku model
//     const gukoShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));

//     // Create Cannon.js body for Goku model
//     const gukoBody = new CANNON.Body({
//         mass: 0, // Adjust mass as needed based on your scene's requirements
//         position: new CANNON.Vec3(40, 35, 0) // Initial position of the model
//     });

//     // Add the shape to the body
//     gukoBody.addShape(gukoShape);

//     // Add the body to the world
//     world.addBody(gukoBody);

//     // Add the model to the scene
//     scene.add(gukoModel);

//     // Create wireframe mesh for visualization
//     const wireframeGeometry = new THREE.BoxGeometry(width, height-2, depth);
//     const wireframeMaterial = new THREE.MeshBasicMaterial({
//         color: 0x00ff00,
//         wireframe: true
//     });
//     const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

//     // Position the wireframe mesh at the same position as the model
//     wireframeMesh.position.set(27, 12, 0);

//     // Add the wireframe mesh to the scene
//     scene.add(wireframeMesh);
// }, undefined, function (error) {
//     console.error(error);
// });

// // const target = new THREE.Object3D();
// // target.position.copy(floorContainer.position); // Adjust the target's position as needed


export function animated_objects(){
    boxMesh.position.copy(boxBody.position);
    boxMesh.position.y-=2;
    boxMesh.quaternion.copy(boxBody.quaternion);

//    floorContainer1.position.copy(floorContainerBody.position);
//    floorContainer1.quaternion.copy(floorContainerBody.quaternion);


    // groundMesh.position.copy(groundBody.position);
    // groundMesh.quaternion.copy(groundBody.quaternion);



    // if (groundModel && groundBody) {
    //     groundModel.position.copy(groundBody.position);
    //   }

