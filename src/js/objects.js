import * as THREE from 'three';

import * as CANNON from 'cannon-es';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModels } from './models.js';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as camera from './camera.js';
import * as sound from './sound.js';
import * as player from './player.js';
import * as effects from './effect.js';
import * as sky from './sky.js';
import * as walls from './walls.js';
import * as models from './models.js';
import groundImg from './textures/avinash-kumar-rEIDzqczN7s-unsplash.jpg';

// DEFINE GLOBAL VARIABLES
// Scene
export const scene = new THREE.Scene();
export let levelAreas = [];


// world - this is for cannon objects
export var world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -20, 0)
});

const customMaterial = new CANNON.Material(); // Create a custom material // Adjust this value to control friction (0 to 1)

// Set the friction properties for the custom material
customMaterial.friction = 1;
customMaterial.restitution = 0;

// Set the default contact material for the world
world.defaultContactMaterial = new CANNON.ContactMaterial(
    customMaterial, // First material (can be the same as the second material)
    customMaterial, // Second material (can be the same as the first material)
    {
        friction: 1, // Set the friction property for the contact material
        restitution: 0, // Set the friction property for the contact material
    }
);



// TODO: Figure out what this does where its exported and why it is required
export const raycaster = new THREE.Raycaster();

class floorContBody {
    constructor(container, num) {
        let size = 95;
        if (num == 4) {
            size = 73;
        }

        //    // Create floors bodies
        //     const floorContGeo = new THREE.PlaneGeometry(2*size, 2*size);
        //     const floorContMat = new THREE.MeshStandardMaterial({
        //         color: 0x78BE21,
        //         side: THREE.DoubleSide,
        //         wireframe: true
        //     });


        //     this.mesh = new THREE.Mesh(floorContGeo, floorContMat);
        //     scene.add(this.mesh);


        // Physics floor
        const floorContPhysMat = new CANNON.Material();
        const floorContShape = new CANNON.Box(new CANNON.Vec3(size, size, 10)); // Half of your desired dimensions
        this.body = new CANNON.Body({
            shape: floorContShape,
            type: CANNON.Body.STATIC,
            material: floorContPhysMat,

        });
        this.body.collisionFilterGroup = 2;  // or any other number
        this.body.collisionFilterMask = -1;
        this.body.position.copy(new CANNON.Vec3(container.position.x - 10, container.position.y - 4, container.position.z - 10));
        this.body.quaternion.setFromEuler(rotationAngle, 0, 0);
        world.addBody(this.body);

        //  this.mesh.position.copy(this.body.position);
        //  this.mesh.quaternion.copy(this.body.quaternion);
    }
}

function puzzComplete(puzz) {
    if (puzz == 'Yellow') {
        walls.lobbyGate.opengate((Math.PI / 2), 3);
        // Close the current tab or window
        models.loadLevel1Models(assetLoader, scene, world);
        Level1Primitives();
    }
    else if (puzz == 'Blue') {

        walls.puzz1Gate.opengate((Math.PI / 2), 3);
        models.loadLevel2Models(assetLoader, scene, world);
        Level2Primitives();

    }
    else if (puzz == 'Red') {
        walls.puzz2Gate.opengate((Math.PI / 2), 2);
        models.loadLevel3Models(assetLoader, scene, world);
        Level3Primitives();


    }
    else if (puzz == 'Green'){
        //Win screen
    }


}




function createTile(index, round, container) {
    let tile;
    if (index != 81) {

        tile = new THREE.Mesh(tileGeometry, tileMaterial.clone());
        tile.material.shadowSide = THREE.FrontSide;
        tile.receiveShadow=true;
        // tile.castShadow=true;
        // Add cylinders at each corner of the tile
        const cornerCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 32); // Adjusted size
        const cornerCylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x505050 });

        // Add cubes on top of each cylinder
        const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // Cube dimensions
        const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x505050 });

        const tilePosition = tile.position.clone();
        const tileCorners = [
            tilePosition.clone().add(new THREE.Vector3(-tileSize / 2, -tileSize / 2, 0)),
            tilePosition.clone().add(new THREE.Vector3(tileSize / 2, -tileSize / 2, 0)),
            tilePosition.clone().add(new THREE.Vector3(-tileSize / 2, tileSize / 2, 0)),
            tilePosition.clone().add(new THREE.Vector3(tileSize / 2, tileSize / 2, 0)),
        ];

        if (index == 1 && container == floorContainerGreen) {
            // Create a mesh using the semicircle geometry
            const semicircleMesh1 = new THREE.Mesh(semicircleGeometry, tileMaterial.clone());
            semicircleMesh1.litUp = false;
            semicircleMesh1.playerWithinBounds = false;

            semicircleMesh1.position.set(0, -2.5, 0);
            semicircleMesh1.rotation.x = Math.PI;
            // Add the semicircle to your scene
            tile.add(semicircleMesh1);

            tile.semicircleMesh1 = semicircleMesh1;
        }
        if (index == 5 && container == floorContainerRed) {
            // Create a mesh using the semicircle geometry
            const semicircleMesh = new THREE.Mesh(semicircleGeometry, tileMaterial.clone());
            semicircleMesh.litUp = false;
            semicircleMesh.playerWithinBounds = false;

            semicircleMesh.position.set(-2.5, 0, 0);
            semicircleMesh.rotation.z = Math.PI / 2;
            // Add the semicircle to your scene
            tile.add(semicircleMesh);
            tile.semicircleMesh = semicircleMesh;
        }
        if (index == 19 && container == floorContainerBlue) {
            // Create a mesh using the semicircle geometry
            const semicircleMesh3 = new THREE.Mesh(semicircleGeometry, tileMaterial.clone());
            semicircleMesh3.litUp = false;
            semicircleMesh3.playerWithinBounds = false;

            semicircleMesh3.position.set(0, -2.5, 0);
            semicircleMesh3.rotation.x = Math.PI;
            // Add the semicircle to your scene
            tile.add(semicircleMesh3);
            tile.semicircleMesh3 = semicircleMesh3;
        }
        if (index == 1 && container == floorContainerYellow) {
            // Create a mesh using the semicircle geometry
            const semicircleMesh4 = new THREE.Mesh(semicircleGeometry, tileMaterial.clone());
            semicircleMesh4.litUp = false;

            semicircleMesh4.position.set(0, -2.5, 0);
            semicircleMesh4.rotation.x = Math.PI;
            // Add the semicircle to your scene
            tile.add(semicircleMesh4);
            tile.semicircleMesh4 = semicircleMesh4;
        }

        const halfCylinderHeight = 5 / 2; // Half of the cylinder's height

        tileCorners.forEach((corner) => {
            // Create the corner cylinder
            const cornerCylinder = new THREE.Mesh(cornerCylinderGeometry, cornerCylinderMaterial);
            cornerCylinder.castShadow=true;
            cornerCylinder.receiveShadow=true;
            cornerCylinder.position.copy(corner).add(new THREE.Vector3(0, 0, halfCylinderHeight));
            cornerCylinder.rotation.x = Math.PI / 2; // Rotate 90 degrees around the x-axis
            tile.add(cornerCylinder); // Add the cylinder as a child of the tile

            // Create the cube on top of the cylinder
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow=true;
            cube.receiveShadow=true;
            cube.position.copy(corner).add(new THREE.Vector3(0, 0, -halfCylinderHeight + 2)); // Adjusted position
            tile.add(cube); // Add the cube as a child of the tile
        });
    } else {
        tile = new THREE.Mesh(tileGeoRound, tileMaterial.clone());
        tile.rotation.x = Math.PI / 2;
    }
    tile.userData.tileNumber = index; // Store the tile number in user data
    // tile.castShadow = true;
    //  tile.receiveShadow = true;
    tile.userData.tileVisits = 0;
    tile.userData.PlayerOnTile = false;


    return tile;
}

function createPiPTile(index, PiP) {
    let tile;
    if (index != 81) {
        tile = new THREE.Mesh(tileGeometry, tileMaterial.clone());
    } else {
        tile = new THREE.Mesh(tileGeoRound, tileMaterial.clone());
        tile.rotation.x = Math.PI / 2;
    }

    tile.userData.tileNumber = index; // Store the tile number in user data
    // tile.castShadow = true;
    // tile.receiveShadow = true;

    // Add cylinders at each corner of the tile
    const cornerCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 32); // Adjusted size
    const cornerCylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

    // Add cubes on top of each cylinder
    const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // Cube dimensions
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

    if (PiP == 1) {
        //Draw 4 squares
        if (index == 65) {
            const squareGeometry = new THREE.BoxGeometry(0.5, 0.5, 5); // Adjust the size and depth
            const squareMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow color

            // Create and add four consecutive yellow squares on the tile
            for (let i = 0; i < 4; i++) {
                const square = new THREE.Mesh(squareGeometry, squareMaterial);

                square.position.set(0, i - 1.8, 0); // Adjusted positions
                tile.add(square);
            }
            tile.rotation.set(0, 0, Math.PI / 2);

        }

        //Draw L
        if (index == 53) {
            const squareGeometry = new THREE.BoxGeometry(0.5, 0.5, 5); // Adjust the size and depth
            const squareMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 }); // Yellow color

            const square1 = new THREE.Mesh(squareGeometry, squareMaterial);
            square1.position.set(-1, 0.6, 0); // Adjusted positions
            tile.add(square1);

            // Create and add four consecutive yellow squares on the tile
            for (let i = 0; i < 3; i++) {
                const square = new THREE.Mesh(squareGeometry, squareMaterial);
                square.position.set(0, i - 1.4, 0); // Adjusted positions
                tile.add(square);
            }
            tile.rotation.set(0, 0, Math.PI / 2);

        }

        if (index == 1) {
            const semicircleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
            const semicircleMesh1 = new THREE.Mesh(semicircleGeometry, semicircleMaterial);
            semicircleMesh1.litUp = false;

            semicircleMesh1.position.set(-2.6, 0, 0);
            semicircleMesh1.rotation.x = Math.PI;
            // Add the semicircle to your scene
            tile.add(semicircleMesh1);
            tile.semicircleMesh1 = semicircleMesh1;
            semicircleMesh1.rotation.z = Math.PI / 2;

        }
    }

    if (PiP == 2) {
        if ([17, 15, 69, 71].includes(index)) {
            // Create a rounded square
            const squareGeometry = new THREE.BoxGeometry(1.5, 1.5, 5); // Adjust the size and depth
            const squareMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const square = new THREE.Mesh(squareGeometry, squareMaterial);
            tile.add(square);
        }

        if ([11, 13, 65, 67].includes(index)) {
            // Create a rounded square
            const squareGeometry = new THREE.BoxGeometry(1.5, 1.5, 5); // Adjust the size and depth
            const squareMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
            const square = new THREE.Mesh(squareGeometry, squareMaterial);
            tile.add(square);
        }

        if (index == 6) {
            const semicircleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
            const semicircleMesh1 = new THREE.Mesh(semicircleGeometry, semicircleMaterial);
            semicircleMesh1.litUp = false;

            semicircleMesh1.position.set(-2.8, -4, 0);
            semicircleMesh1.rotation.x = Math.PI;
            // Add the semicircle to your scene
            tile.add(semicircleMesh1);
            tile.semicircleMesh1 = semicircleMesh1;
            semicircleMesh1.rotation.z = Math.PI / 2;

        }
    }

    if (PiP == 3) {
        //Draw Square Up
        if ([29, 31, 53].includes(index)) {
            const squareGeometry = new THREE.BoxGeometry(1.5, 5.6, 2); // Adjust the size and depth
            const squareMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
            const square = new THREE.Mesh(squareGeometry, squareMaterial);
            square.position.set(0, -5.1, 0);
            tile.add(square);

        }

        //Draw Square right
        if ([67, 33].includes(index)) {
            const squareGeometry = new THREE.BoxGeometry(5.6, 1.5, 2); // Adjust the size and depth
            const squareMaterial = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
            const square = new THREE.Mesh(squareGeometry, squareMaterial);
            square.position.set(5.1, 0, 0);
            tile.add(square);


        }

        //Draw Circle
        if ([66, 34].includes(index)) {
            const circleGeometry = new THREE.CylinderGeometry(2.5, 1, 2, 32);
            const circleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
            const circle = new THREE.Mesh(circleGeometry, circleMaterial);
            circle.rotation.set(Math.PI / 2, Math.PI / 2, 0);
            //circle.position.set(0,0,1);
            tile.add(circle);


        }

        if (index == 19) {
            const semicircleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
            const semicircleMesh1 = new THREE.Mesh(semicircleGeometry, semicircleMaterial);
            semicircleMesh1.litUp = false;

            semicircleMesh1.position.set(2.5, -2.2, 0);
            semicircleMesh1.rotation.x = Math.PI;
            // Add the semicircle to your scene
            tile.add(semicircleMesh1);
            tile.semicircleMesh1 = semicircleMesh1;
            //semicircleMesh1.rotation.z = Math.PI/2;

        }
    }
    if (PiP == 4) {
        if ([1, 10, 19, 28, 37, 46, 55, 64, 73, 74, 75, 76, 77, 78, 79, 80].includes(index)) {
            // Create a rounded square
            const squareGeometry = new THREE.BoxGeometry(1.5, 1.5, 5); // Adjust the size and depth
            const squareMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
            const square = new THREE.Mesh(squareGeometry, squareMaterial);
            tile.add(square);
        }

        if (index == 1) {
            const semicircleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
            const semicircleMesh1 = new THREE.Mesh(semicircleGeometry, semicircleMaterial);
            semicircleMesh1.litUp = false;

            semicircleMesh1.position.set(-0.2, -2.5, 0);
            semicircleMesh1.rotation.x = Math.PI;
            // Add the semicircle to your scene
            tile.add(semicircleMesh1);
            tile.semicircleMesh1 = semicircleMesh1;
            //semicircleMesh1.rotation.z = Math.PI / 2;

        }
    }

    const tilePosition = tile.position.clone();
    const tileCorners = [
        tilePosition.clone().add(new THREE.Vector3(-tileSize / 2, -tileSize / 2, 0)),
        tilePosition.clone().add(new THREE.Vector3(tileSize / 2, -tileSize / 2, 0)),
        tilePosition.clone().add(new THREE.Vector3(-tileSize / 2, tileSize / 2, 0)),
        tilePosition.clone().add(new THREE.Vector3(tileSize / 2, tileSize / 2, 0)),
    ];

    const halfCylinderHeight = 5 / 2; // Half of the cylinder's height

    tileCorners.forEach((corner) => {
        // Create the corner cylinder
        const cornerCylinder = new THREE.Mesh(cornerCylinderGeometry, cornerCylinderMaterial);
        cornerCylinder.position.copy(corner).add(new THREE.Vector3(0, 0, halfCylinderHeight));
        cornerCylinder.rotation.x = Math.PI / 2; // Rotate 90 degrees around the x-axis
        tile.add(cornerCylinder); // Add the cylinder as a child of the tile

        // Create the cube on top of the cylinder
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.copy(corner).add(new THREE.Vector3(0, 0, -halfCylinderHeight + 2)); // Adjusted position
        tile.add(cube); // Add the cube as a child of the tile
    });

    return tile;
}

// Function to add or omit tiles based on tile numbers
function drawGridWithOmissions(container, omittedTiles = [], round) {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const tileNumber = i * numCols + j + 1;
            if (!omittedTiles.includes(tileNumber)) {
                const isMissingTile = (i % 2 === 0 && j % 2 === 0) || (i % 2 === 1 && j % 2 === 1);
                if (!isMissingTile || i % 4 === 0 || (i - 2) % 4 === 0) {
                    const tile = createTile(tileNumber, round, container);

                    const xOffset = (i - numRows / 2) * (tileSize + gapSize);
                    const yOffset = (j - numCols / 2) * (tileSize + gapSize);
                    tile.name = 'tile';
                    tile.litUp = false;
                    const tileColor = new THREE.Color(0, 0, 0, 0);
                    if(tileNumber !=81){
                          tile.material.color.copy(tileColor);
                    }
                    tile.playerWithinBounds = false;
                    tile.position.set(xOffset, yOffset, 0);
                    tile.updateWorldMatrix(true, false);
                    container.add(tile);                    // Add the tile to the specified container
                }
            }
        }
    }
}

//Function to draw PiP
function drawPiP(container, omittedTiles = [], PiP) {
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const tileNumber = i * numCols + j + 1;
            const tile = createPiPTile(tileNumber, PiP);
            const xOffset = (i - numRows / 2) * (tileSize);
            const yOffset = (j - numCols / 2) * (tileSize);
            tile.name = 'tile';
            tile.litUp = false;
            tile.position.set(xOffset, yOffset, 0);
            tile.updateWorldMatrix(true, false);
            tile.material.color.set(0x444444);
            container.add(tile); // Add the tile to the specified container

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



function helperSquares() {

    //white and gray squares (will be removed later)


    const planeGeometry = new THREE.PlaneGeometry(gridSizeX * blockWidth, gridSizeZ * blockDepth);
    const planeMaterial = new THREE.MeshBasicMaterial(); // White color

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate it to be horizontal
    plane.position.set(0, -30, 0); // Position it on the X-Z plane

    scene.add(plane);

    // Create alternating grey and white blocks
    for (let i = 0; i < gridSizeX; i++) {
        for (let j = 0; j < gridSizeZ; j++) {
            const blockMaterial = new THREE.MeshBasicMaterial();
            const blockGeometry = new THREE.BoxGeometry(blockWidth, 1, blockDepth);
            const blockMesh = new THREE.Mesh(blockGeometry, blockMaterial);
            blockMesh.position.set((i - gridSizeX / 2 + 0.5) * blockWidth, -30, (j - gridSizeZ / 2 + 0.5) * blockDepth);
            blockMesh.updateWorldMatrix(true, false);

            scene.add(blockMesh);
            let boundingBox = new THREE.Box3().setFromObject(blockMesh);
            let size = new THREE.Vector3();
            boundingBox.getSize(size);
            blockMesh.sizeFromBoundingBox = size;
            levelAreas.push(blockMesh);
        }
    }


}




function ground() {
    let groundTexture = new THREE.TextureLoader().load(groundImg);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(-25, -25);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    // Create ground
    const groundGeo = new THREE.PlaneGeometry(1500, 1500);
    const groundMat = new THREE.MeshStandardMaterial({
        castShadow: true,
        receiveShadow: true,
        map: groundTexture,
        side: THREE.DoubleSide,
    });

    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    const groundPhysMat = new CANNON.Material();
    // physics ground
    const groundBody = new CANNON.Body({
        shape: new CANNON.Plane(),
        type: CANNON.Body.STATIC,
        material: groundPhysMat
    });

    // Transform ground body by rotation
    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);
    groundMesh.position.copy(groundBody.position);
    groundMesh.quaternion.copy(groundBody.quaternion);

}

function Level1Primitives() {
    //Loading all Level 1 primitives
    scene.add(floorContainerBlue);
    drawGridWithOmissions(floorContainerBlue, [28, 30, 42, 52, 76], 19);

    //Creating PiP
    drawPiP(PiP3, [], 3);
    changePathColor(PiP3, pathPiP2AND3, 0xFFA500);

    //Scaling Map
    floorContainerBlue.scale.set(4, 4, 1);
    floorContainerBlue.position.set(blockWidth / 2, 5, 0);
    floorContainerBlue.rotation.set(rotationAngle, 0, 0);

    //Drawing PiP
    PiP3.children.forEach((tile) => {
        tile.material = tile.material.clone();
        tile.material.transparent = false;
        tile.material.opacity = 1;
    });

    //PiP3 Creation
    PiP3.scale.set(0.12, 0.12, 0.12);
    PiP3.position.set(blockWidth / 2 + 0.5 + 110, 20, 91);
    PiP3.rotation.set(Math.PI, 0, 0);
    //PiP3 Pole
    const pole3 = new THREE.Mesh(poleGeometry, poleMaterial);
    pole3.castShadow = true;
    pole3.receiveShadow = true;
    scene.add(pole3);
    pole3.position.set(175 + 110, 0, 90);
    //PiP3 Sign
    const signwall3 = new THREE.Mesh(signwallgeometry, signmaterial);
    signwall3.castShadow = true;
    signwall3.receiveShadow = true;
    scene.add(signwall3)
    signwall3.position.set(175 + 110, 20, 90);
    //PiP3 base
    const PiPBase3 = new THREE.Mesh(PiPBaseGeometry, PiPBaseMaterial3);
    scene.add(PiPBase3);
    PiPBase3.position.set(175 + 110, 20, 90.5);
    scene.add(PiP3);
    const floorBody3 = new floorContBody(floorContainerBlue, 1);
}

function Level2Primitives() {
    scene.add(floorContainerRed);
    drawGridWithOmissions(floorContainerRed, [30, 38, 78], 5);
    drawPiP(PiP2, [], 2);
    changePathColor(PiP2, pathPiP2AND3, 0xff00ff);
    floorContainerRed.scale.set(4, 4, 1);
    floorContainerRed.position.set(blockWidth / 2, 5, - blockWidth);
    floorContainerRed.rotation.set(rotationAngle, 0, 0);

    // Iterate through all objects in PiP2
    PiP2.children.forEach((tile) => {
        tile.material = tile.material.clone();
        tile.material.transparent = false;
        tile.material.opacity = 1;
    });

    //PiP2 Creation
    PiP2.scale.set(0.12, 0.12, 0.12);
    PiP2.position.set(blockWidth / 2 + 0.65 + 110, 20, -258);
    PiP2.rotation.set(Math.PI, 0, 0);
    //PiP2 Pole
    const pole2 = new THREE.Mesh(poleGeometry, poleMaterial);
    pole2.castShadow = true;
    pole2.receiveShadow = true;
    scene.add(pole2);
    pole2.position.set(blockWidth / 2 + 0.5 + 110, 0, -260);
    //PiP2 Sign
    const signwall2 = new THREE.Mesh(signwallgeometry, signmaterial);
    signwall2.castShadow = true;
    signwall2.receiveShadow = true;
    scene.add(signwall2);
    signwall2.position.set(blockWidth / 2 + 0.5 + 110, 20, -260);
    //PiP Base 2
    const PiPBaseMaterial2 = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const PiPBase2 = new THREE.Mesh(PiPBaseGeometry, PiPBaseMaterial2);
    scene.add(PiPBase2);
    PiPBase2.position.set(blockWidth / 2 + 0.3 + 110, 20.2, -259);
    scene.add(PiPBase2);
    scene.add(PiP2);
    const floorBody2 = new floorContBody(floorContainerRed, 2);


}

function Level3Primitives() {
    scene.add(floorContainerGreen);
    drawGridWithOmissions(floorContainerGreen, [], 1);

    //Draw PiPs
    drawPiP(PiP1, [], 1);
    changePathColor(PiP1, pathPiP2AND3, 0x006400);
    floorContainerGreen.scale.set(4, 4, 1);
    floorContainerGreen.position.set(-blockWidth / 2, 5, - blockWidth);
    floorContainerGreen.rotation.set(rotationAngle, 0, 0);

    // Iterate through all objects in PiP1
    PiP1.children.forEach((tile) => {
        tile.material = tile.material.clone();
        tile.material.transparent = false;
        tile.material.opacity = 1;
    });

    //PiP1 Creation
    PiP1.scale.set(0.12, 0.12, 0.12);
    PiP1.position.set(-blockWidth / 2 + 142.5 - 50, 20, - blockWidth + 0.6 + 110);
    PiP1.rotation.set(-Math.PI / 2, -Math.PI / 2, -Math.PI);
    //PiP1 Pole
    const pole1 = new THREE.Mesh(poleGeometry, poleMaterial);
    pole1.castShadow = true;
    pole1.receiveShadow = true;
    scene.add(pole1);
    pole1.position.set(-blockWidth / 2 + 141 - 50, 0, - blockWidth + 0.5 + 110);
    //PiP1 Sign
    const signwall1 = new THREE.Mesh(signwallgeometry, signmaterial);
    signwall1.castShadow = true;
    signwall1.receiveShadow = true;
    scene.add(signwall1);
    signwall1.position.set(-blockWidth / 2 + 141 - 50, 20, - blockWidth + 0.8 + 110);
    signwall1.rotation.set(0, Math.PI / 2, 0);
    //PiP Base 1
    const PiPBaseMaterial1 = new THREE.MeshStandardMaterial({ color: 0x006400 });
    const PiPBase1 = new THREE.Mesh(PiPBaseGeometry, PiPBaseMaterial1);
    scene.add(PiPBase1);
    PiPBase1.position.set(-blockWidth / 2 + 142 - 50, 20.3, - blockWidth + 0.8 - 0.4 + 110);
    PiPBase1.rotation.set(0, Math.PI / 2, 0);
    scene.add(PiPBase1);

    scene.add(PiP1);
    const floorBody1 = new floorContBody(floorContainerGreen, 3);

}

function Level4Primitives() {

    scene.add(floorContainerYellow);
    drawGridWithOmissions(floorContainerYellow, [], 1);

    drawPiP(PiP4, [], 4);
    changePathColor(PiP4, pathPiP2AND3, 0x00FFFF);

    floorContainerYellow.scale.set(3, 3, 1);
    floorContainerYellow.position.set(blockWidth / 2, 6, blockWidth - 40);
    floorContainerYellow.rotation.set(rotationAngle, 0, 0);


    PiP4.children.forEach((tile) => {
        tile.material = tile.material.clone();
        tile.material.transparent = false;
        tile.material.opacity = 1;
    });

    //PiP4 Creation
    PiP4.scale.set(0.12, 0.12, 0.12);
    PiP4.position.set(blockWidth / 2 + 0.65 + 30, 20, 390);
    PiP4.rotation.set(Math.PI, 0, 0);
    //PiP4 Pole
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x6E260E });
    const pole4 = new THREE.Mesh(poleGeometry, poleMaterial);
    scene.add(pole4);
    pole4.position.set(blockWidth / 2 + 0.5 + 30, 0, 388);
    //PiP4 Sign
    const signmaterial = new THREE.MeshStandardMaterial({ color: 0x6E260E });
    const signwall4 = new THREE.Mesh(signwallgeometry, signmaterial);
    scene.add(signwall4);
    signwall4.position.set(blockWidth / 2 + 0.5 + 30, 20, 388);
    //signwall4.rotation.set(0, Math.PI / 2, 0);
    //PiP Base 4
    const PiPBaseMaterial4 = new THREE.MeshStandardMaterial({ color: 0x00FFFF });
    const PiPBase4 = new THREE.Mesh(PiPBaseGeometry, PiPBaseMaterial4);
    scene.add(PiPBase4);

    PiPBase4.position.set(blockWidth / 2 + 0.3 + 30, 20.2, 389);
    scene.add(PiPBase4);

    scene.add(PiP4);

    const floorBody4 = new floorContBody(floorContainerYellow, 4);

}



function tileLights() {

    if (player.characterModel) {

        floorContainerGreen.children.forEach((tile, index) => {
            tile.playerWithinBounds = false;

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

            if ( inXBounds && inZBounds) {
            sound.setGlass(true);
            if(tile.litUp === false){
                const tileColor = new THREE.Color(0, 255, 0);
                // TODO: Change color of all faces of cube to blue currently only default front face is changed
                tile.material.color.copy(tileColor);
                tile.litUp = true;
                tile.playerWithinBounds = true;
                if (tile.userData.tileNumber == 1) {
                    tile.semicircleMesh1.litUp = true;
                    tile.semicircleMesh1.material.color.copy(tileColor);
                }
                litUpTiles1.push(tile.userData.tileNumber);
                const haveSameValues = path1.every(value => litUpTiles1.includes(value) && litUpTiles1.length === path1.length);
                if (haveSameValues) {
                    console.log("Path 1 correct.");
                    puzzComplete("Green");
                }
                // TODO: Make tiles sink also upon intersection, just shift slightly in the z
                // How do I position the tiles, is it within the floor container, using current position -= 1 for z for example or do I do a local transformation in floor?
                // TODO: Elevate tiles a bit from the ground they are on or simply shift the whole floor container
                const whiteTile = new THREE.Color(255, 255, 255);
                PiP1.children[tile.userData.tileNumber - 1].material.color.copy(whiteTile);
            }
            }
        });



        floorContainerRed.children.forEach((tile, semicircleMesh, index) => {
            tile.playerWithinBounds = false;
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

          if ( inXBounds && inZBounds) {
                  sound.setGlass(true);
                      if(tile.litUp === false){
                const tileColor = new THREE.Color(255, 0, 0);
                // TODO: Change color of all faces of cube to blue currently only default front face is changed
                tile.material.color.copy(tileColor);
                tile.litUp = true;
                tile.playerWithinBounds = true;
                if (tile.userData.tileNumber == 5) {
                    tile.semicircleMesh.litUp = true;
                    tile.semicircleMesh.material.color.copy(tileColor);
                }
                litUpTiles2.push(tile.userData.tileNumber);

                const haveSameValues = path2.every(value => litUpTiles2.includes(value) && litUpTiles2.length === path2.length);
                if (haveSameValues) {
                    console.log("Path 2 correct.");
                    puzzComplete("Red");
                }
                // TODO: Make tiles sink also upon intersection, just shift slightly in the z
                // How do I position the tiles, is it within the floor container, using current position -= 1 for z for example or do I do a local transformation in floor?
                // TODO: Elevate tiles a bit from the ground they are on or simply shift the whole floor container
                //Light up PiP2 tiles:
                const whiteTile = new THREE.Color(255, 255, 255);
                PiP2.children[tile.userData.tileNumber - 1].material.color.copy(whiteTile);


                }
            }
        });

        let L3Stack = [];
        let newTile = 0;
        floorContainerBlue.children.forEach((tile, index) => {
            const epsilon = 3; // Small epsilon value to handle floating point errors
            const tileWorldPosition = new THREE.Vector3();
            tile.getWorldPosition(tileWorldPosition);

            //    let aTile = false;
            //     let prevTile = undefined;
            //     if (L3Stack.length != 0){
            //         prevTile = L3Stack.pop();
            //         if(prevTile != tile.userData.tileNumber && prevTile!= undefined){
            //             aTile = true;
            //         }else{
            //             aTile = false;
            //         }
            //     }else{
            //         aTile = true;
            //     }



            let boundingBox = new THREE.Box3().setFromObject(tile);
            let size = new THREE.Vector3();
            boundingBox.getSize(size);

            let rangeInX = size.x / 2;
            let rangeInZ = size.z / 2;

            let inXBounds = tileWorldPosition.x - rangeInX <= player.characterModel.position.x && player.characterModel.position.x <= tileWorldPosition.x + rangeInX;
            let inZBounds = tileWorldPosition.z - rangeInZ <= player.characterModel.position.z && player.characterModel.position.z <= tileWorldPosition.z + rangeInZ;




            newTile = litUpTiles3[litUpTiles3.length - 1];
            if ( inXBounds && inZBounds) {
            sound.setGlass(true);
            if(tile.litUp === false){

                const tileColor = new THREE.Color(0, 0, 255);
                tile.material.color.copy(tileColor);
                L3Stack.push(tile.userData.tileNumber);
                tile.litUp = true;
                if (tile.userData.tileNumber == 19) {
                    tile.semicircleMesh3.litUp = true;
                    tile.semicircleMesh3.material.color.copy(tileColor);
                }
                litUpTiles3.push(tile.userData.tileNumber);
                const haveSameValues = path3.every(value => litUpTiles3.includes(value) && litUpTiles3.length === path3.length);
                if (haveSameValues) {
                    console.log("Path 3 correct.");
                    puzzComplete("Blue");
                }
                const whiteTile = new THREE.Color(255, 255, 255);
                PiP3.children[tile.userData.tileNumber - 1].material.color.copy(whiteTile);
                }
            }/*else if(tile.userData.tileVisits % 2 != 0 && newTile != tile.userData.tileNumber && tile.litUp == true && inXBounds && inZBounds && Math.abs(player.characterModel.position.y - tileWorldPosition.y) < 3){
                tile.material.copy(tileMaterial);

                //litUpTiles3 = litUpTiles3.filter(item => item !== tile.userData.tileNumber);
                tile.litUp =  false;
                PiP3.children[tile.userData.tileNumber - 1].material.color.set(0x444444);
            }*/


        });


        floorContainerYellow.children.forEach((tile, index) => {
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

            if ( inXBounds && inZBounds) {
            sound.setGlass(true);
                        if(tile.litUp === false){
                const tileColor = new THREE.Color(1, 1, 0);
                // TODO: Change color of all faces of cube to blue currently only default front face is changed
                tile.material.color.copy(tileColor);

                tile.litUp = true;
                if (tile.userData.tileNumber == 1) {
                    tile.semicircleMesh4.litUp = true;
                    tile.semicircleMesh4.material.color.copy(tileColor);
                }
                litUpTiles4.push(tile.userData.tileNumber);
                const haveSameValues = path4.every(value => litUpTiles4.includes(value) && litUpTiles4.length === path4.length);
                if (haveSameValues) {
                    console.log("Path 4 correct.");
                    puzzComplete("Yellow");
                }
                // TODO: Make tiles sink also upon intersection, just shift slightly in the z
                // How do I position the tiles, is it within the floor container, using current position -= 1 for z for example or do I do a local transformation in floor?
                // TODO: Elevate tiles a bit from the ground they are on or simply shift the whole floor container
                const whiteTile = new THREE.Color(255, 255, 255);
                PiP4.children[tile.userData.tileNumber - 1].material.color.copy(whiteTile);

            }
            }

        });
    }

}


function mazeReset() {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'r') {
            const tileColor = 0xffffff;
            levelAreas.forEach((area, index) => {
                let rangeInX = area.sizeFromBoundingBox.x / 2;
                let rangeInZ = area.sizeFromBoundingBox.z / 2;

                const areaWorldPosition = new THREE.Vector3();
                area.getWorldPosition(areaWorldPosition);

                let inXBounds = areaWorldPosition.x - rangeInX <= player.characterModel.position.x && player.characterModel.position.x <= areaWorldPosition.x + rangeInX;
                let inZBounds = areaWorldPosition.z - rangeInZ <= player.characterModel.position.z && player.characterModel.position.z <= areaWorldPosition.z + rangeInZ;

                if (inXBounds && inZBounds) {
                    if (index == 0) {

                        litUpTiles1 = [];
                        PiP1.children.forEach((tile) => {
                            tile.material.color.set(0x444444);
                        });
                        changePathColor(PiP1, pathPiP2AND3, 0x006400);
                        floorContainerGreen.children.forEach((tile) => {
                            tile.material.color.set(tileColor);
                            tile.litUp = false;
                            if (tile.userData.tileNumber == 1) {
                                tile.semicircleMesh1.litUp = false;
                                tile.semicircleMesh1.material.color.set(tileColor);
                            }
                        });
                    } else if (index == 3) {

                        litUpTiles2 = [];
                        PiP2.children.forEach((tile) => {
                            tile.material.color.set(0x444444);
                        });
                        changePathColor(PiP2, pathPiP2AND3, 0xff00ff);
                        floorContainerRed.children.forEach((tile) => {
                            tile.material.color.set(tileColor);
                            tile.litUp = false;
                            if (tile.userData.tileNumber == 5) {
                                tile.semicircleMesh.litUp = false;
                                tile.semicircleMesh.material.color.set(tileColor);
                            }
                        });
                    } else if (index == 4) {

                        litUpTiles3 = [];
                        PiP3.children.forEach((tile) => {
                            tile.material.color.set(0x444444);
                        });
                        changePathColor(PiP3, pathPiP2AND3, 0xFFA500);
                        floorContainerBlue.children.forEach((tile) => {
                            tile.material.color.set(tileColor);
                            tile.litUp = false;
                            if (tile.userData.tileNumber == 19) {
                                tile.semicircleMesh3.litUp = false;
                                tile.semicircleMesh3.material.color.set(tileColor);
                            }
                        });

                    }
                    else if (index == 5) {

                        litUpTiles4 = [];
                        PiP4.children.forEach((tile) => {
                            tile.material.color.set(0x444444);
                        });
                        changePathColor(PiP4, pathPiP2AND3, 0xFFFF00);
                        floorContainerYellow.children.forEach((tile) => {
                            tile.material.color.set(tileColor);
                            tile.litUp = false;
                            if (tile.userData.tileNumber == 1) {
                                tile.semicircleMesh4.litUp = false;
                                tile.semicircleMesh4.material.color.set(tileColor);
                            }
                        });
                    }
                }
            });
        }
    });

}


//Pole properties
const poleGeometry = new THREE.CylinderGeometry(0.75, 0.75, 35, 50);
const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const signwallgeometry = new THREE.BoxGeometry(10, 10, 1.4);
const signmaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const PiPBaseGeometry = new THREE.BoxGeometry(7, 7, 0.5);
const PiPBaseMaterial3 = new THREE.MeshStandardMaterial({ color: 0xFFA500 });

const path1 = [1, 2, 3, 12, 21, 30, 39, 48, 57, 66, 75, 76, 77, 78, 79, 70, 61, 52, 43, 42, 41, 32, 23, 24, 25, 26, 27, 36, 45, 54, 63, 72, 81];
const path2 = [5, 14, 23, 24, 25, 26, 27, 36, 45, 44, 43, 42, 41, 40, 39, 48, 57, 56, 55, 64, 73, 74, 75, 76, 77, 68, 59, 60, 61, 62, 63, 72, 81];
const path3 = [19, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 18, 27, 36, 45, 44, 43, 34, 25, 24, 23, 32, 41, 40, 39, 38, 37, 46, 55, 64, 73, 74, 75, 66, 57, 58, 59, 68, 77, 78, 79, 80, 81];
const path4 = [1, 10, 19, 28, 37, 46, 55, 64, 73, 74, 75, 76, 77, 78, 79, 80, 81];

let litUpTiles1 = [];
let litUpTiles2 = [];
let litUpTiles3 = [];
let litUpTiles4 = [];

const pathPiP2AND3 = [11, 13, 15, 17, 29, 31, 33, 35, 47, 49, 51, 53, 65, 67, 69, 71]

//helper squares
const gridSizeX = 2;
const gridSizeZ = 3;
const blockWidth = 350;
const blockDepth = 350;

let assetLoader = new GLTFLoader();
loadModels(assetLoader, scene, world, blockWidth);


sky.setSky(scene);

ground();


helperSquares();


// DEFINE MAZE GRID
// Define tile size and gap size
const tileSize = 5; // Adjust the size of each tile
const gapSize = 0.5; // Adjust the size of the gap

const numRows = 9;
const numCols = 9;


// Create a floor tile
const tileGeometry = new THREE.BoxGeometry(5, 5, 1.3);
const tileGeoRound = new THREE.CylinderGeometry(4, 4, 0.5, 64);
const tileMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    opacity: 0.5,
    transparent: true,

});

const radius = 2.5; // Radius of the semicircle
const height = 0.8; // Height of the semicircle

// Create a 2D shape for the semicircle
const semicircleShape = new THREE.Shape();

semicircleShape.absarc(0, 0, radius, 0, Math.PI, false);

// Extrude the shape to create a 3D geometry
const extrudeSettings = {
    steps: 1, // Number of steps (1 for a flat semicircle)
    depth: height, // Extrusion depth
    bevelEnabled: false, // No bevel
};

const semicircleGeometry = new THREE.ExtrudeGeometry(semicircleShape, extrudeSettings);

const tiles = [];

const rotationAngle = (Math.PI / 2);
export const floorContainerGreen = new THREE.Group();
export const floorContainerRed = new THREE.Group();
export const floorContainerBlue = new THREE.Group();
export const floorContainerYellow = new THREE.Group();
export const PiP2 = new THREE.Group();
export const PiP1 = new THREE.Group();
export const PiP3 = new THREE.Group();
export const PiP4 = new THREE.Group();

//makeMazes();

//Level1Primitives();
// Level2Primitives();
// Level3Primitives();
Level4Primitives();

walls.addWalls(assetLoader, scene, world, blockWidth, rotationAngle);
// walls.lobbyGate.opengate((Math.PI / 2), 3);
// walls.puzz1Gate.opengate((Math.PI / 2), 3);
// walls.puzz2Gate.opengate((Math.PI / 2), 2);

mazeReset();

export function animate_objects() {

    sky.space.rotation.x += -0.00005;
    sky.space.rotation.y += -0.0001;
    sky.space.rotation.z += -0.00005;

    

    sky.moonOrbitGroup.rotation.set( sky.space.rotation.x,sky.space.rotation.y,sky.space.rotation.z);

}

export function animate_lights() {
    tileLights();


}

// create instance of GLTF loader and call load on it
//

// load takes three arguments, path to file, and a callback function, another function that tells about the progress of the loading process (don't need it so set to undefined), foruth parameter is a function we can use to tell if an error occurs
// use asset loader to load .gltf from path
// model is stored as property of gltf object whose key is scene

//Add Fog
scene.fog = effects.fog;





