import * as THREE from 'three';

import * as CANNON from 'cannon-es';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { loadModels } from './models.js';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as camera from './camera.js';
import * as player from './player.js';
import groundImg from './textures/avinash-kumar-rEIDzqczN7s-unsplash.jpg';

// Import texture images
import exosystemFtImage from '../img/exosystem/exosystem_ft.jpg';
import exosystemBkImage from '../img/exosystem/exosystem_bk.jpg';
import exosystemUpImage from '../img/exosystem/exosystem_up.jpg';
import exosystemDnImage from '../img/exosystem/exosystem_dn.jpg';
import exosystemRtImage from '../img/exosystem/exosystem_rt.jpg';
import exosystemLfImage from '../img/exosystem/exosystem_lf.jpg';

// DEFINE GLOBAL VARIABLES
// Scene
export const scene = new THREE.Scene();
export let levelAreas = [];

// world - this is for cannon objects
export var world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -30, 0)
});

// TODO: Figure out what this does where its exported and why it is required
export const raycaster = new THREE.Raycaster();

class Wall {

    constructor(position, rotation) {
        // Create Three.js wall
        // const wallGeometry = new THREE.BoxGeometry(blockWidth, 70, 5);
        // const wallMaterial = new THREE.MeshStandardMaterial({
        //     color: "#DEC4B0",
        //     side: THREE.DoubleSide,
        //     wireframe: true,
        // });

        // this.mesh = new THREE.Mesh(wallGeometry, wallMaterial);
        // scene.add(this.mesh);

        // Create Cannon.js wall
        const wallPhysMat = new CANNON.Material()
        const wallShape = new CANNON.Box(new CANNON.Vec3(blockWidth / 2, 35, 2.5));
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
        // this.mesh.position.copy(this.body.position);
        // this.mesh.quaternion.copy(this.body.quaternion);
    }
}

class InnerWall {
    constructor(position, rotation) {
        // Calculate the total width of the inner wall (including the gap)
        const totalWidth = blockWidth;
        const gapWidth = 50;


        // Calculate the width of each part of the inner wall
        const partWidth = (totalWidth - gapWidth) / 2;

        // // Create Three.js inner wall parts and materials
        // const wallGeometry1 = new THREE.BoxGeometry(partWidth, 70, 5);
        // const wallMaterial1 = new THREE.MeshStandardMaterial({
        //     color: "#DEC4B0",
        //     side: THREE.DoubleSide,
        //     wireframe: true,
        // });
        // this.mesh1 = new THREE.Mesh(wallGeometry1, wallMaterial1);

        // const wallGeometry2 = new THREE.BoxGeometry(partWidth, 70, 5);
        // const wallMaterial2 = new THREE.MeshStandardMaterial({
        //     color: "#DEC4B0",
        //     side: THREE.DoubleSide,
        //     wireframe: true,
        // });
        // this.mesh2 = new THREE.Mesh(wallGeometry2, wallMaterial2);

        // scene.add(this.mesh1);
        // scene.add(this.mesh2);

        // Create Cannon.js inner wall
        const wallPhysMat = new CANNON.Material();

        // Create two Cannon.js boxes for each part of the inner wall
        const wallShape1 = new CANNON.Box(new CANNON.Vec3(partWidth / 2, 35, 15));
        const wallShape2 = new CANNON.Box(new CANNON.Vec3(partWidth / 2, 35, 15));

        // Create Cannon.js bodies for each part
        this.body1 = new CANNON.Body({
            mass: 0,
            shape: wallShape1,
            material: wallPhysMat,
        });
        this.body2 = new CANNON.Body({
            mass: 0,
            shape: wallShape2,
            material: wallPhysMat,
        });

        let position1;
        let position2;
        if (rotation.y == (Math.PI / 2)) {
            // Set the initial position for each Cannon.js body
            position1 = new CANNON.Vec3(position.x, position.y, position.z - partWidth / 2 - gapWidth / 2);
            position2 = new CANNON.Vec3(position.x, position.y, position.z + partWidth / 2 + gapWidth / 2);
        }
        else {
            // Set the initial position for each Cannon.js body
            position1 = new CANNON.Vec3(position.x - partWidth / 2 - gapWidth / 2, position.y, position.z);
            position2 = new CANNON.Vec3(position.x + partWidth / 2 + gapWidth / 2, position.y, position.z);
        }



        this.body1.position.copy(position1);
        this.body2.position.copy(position2);

        // Set the same rotation for both Cannon.js bodies
        const initialRotation = new CANNON.Quaternion();
        initialRotation.setFromEuler(rotation.x, rotation.y, rotation.z);
        this.body1.quaternion.copy(initialRotation);
        this.body2.quaternion.copy(initialRotation);

        // Add the Cannon.js bodies to the world
        world.addBody(this.body1);
        world.addBody(this.body2);

        // // Update the Three.js mesh position and rotation based on the Cannon.js bodies
        // this.mesh1.position.copy(position1);
        // this.mesh2.position.copy(position2);

        // this.mesh1.quaternion.copy(initialRotation);
        // this.mesh2.quaternion.copy(initialRotation);
        //const loader = new THREE.GLTFLoader();

    }
}


class Gate {
    constructor(position, rotation) {

        //  Create Cannon.js wall
        const gatePhysMat = new CANNON.Material()
        const gateShape = new CANNON.Box(new CANNON.Vec3(25 / 2, 35, 1));
        this.body = new CANNON.Body({
            mass: 0,
            shape: gateShape,
            material: gatePhysMat,
        });

        // Set the initial position and rotation for the Cannon.js body
        this.body.position.copy(position);
        this.body.quaternion.setFromEuler(rotation.x, rotation.y, rotation.z);

        // Add the Cannon.js body to the world
        world.addBody(this.body);

        // Return a promise that resolves when the model is loaded
        this.loadModelPromise = new Promise((resolve) => {
            assetLoader.load('./assets/medieval_arched_wooden_door/scene.gltf', (gltf) => {
                this.model = gltf.scene.clone();
                this.model.scale.set(0.6, 0.25, 0.25);

                // Set the initial position and rotation of the model
                this.model.position.copy(position);
                this.model.rotation.set(rotation.x, rotation.y, rotation.z);

                // Update the Three.js model position and rotation based on the Cannon.js body
                this.model.position.copy(this.body.position);
                this.model.quaternion.copy(this.body.quaternion);

                // Add the gate model to the scene
                scene.add(this.model);

                resolve(); // Resolve the promise when the model is loaded
            });
        });
    }

    async opengate(angle, gateNum) {
        // Wait for the model to be loaded before performing any operations on it
        await this.loadModelPromise;

        if (this.model) {
            // Set the hinge point (pivot) at the left vertical edge of the door
            let hingePoint = new THREE.Vector3(-20, 0, 0); // Adjust the values as needed
            if (gateNum == 2){
                hingePoint = new THREE.Vector3(0, 0, -18); // Adjust the values as needed
            }
    
            // Calculate the rotation in radians (assuming angle is in degrees)
            const rotationAngle = (Math.PI / 180) * angle;
    
            // Step 1: Translate the door to the hinge point
            const inverseHingePoint = hingePoint.clone().negate();
            this.model.position.add(inverseHingePoint);
           
    
            // Step 2: Rotate the door
            this.body.quaternion.setFromEuler(0, rotationAngle, 0);
            this.model.rotation.set(0, rotationAngle, 0); // Update the Three.js rotation
            this.body.position.copy(this.model.position);
    
            // Step 3: Translate the door back to its original position
          //  this.model.position.sub(inverseHingePoint);
        }
    }

}



class floorContBody {
    constructor(container) {
        // Create floors bodies
        // const floorContGeo = new THREE.PlaneGeometry(190, 190);
        // const floorContMat = new THREE.MeshStandardMaterial({
        //     color: 0x78BE21,
        //     side: THREE.DoubleSide,
        //     wireframe: false
        // });


        // this.mesh = new THREE.Mesh(floorContGeo, floorContMat);
        // scene.add(this.mesh);

        // Physics floor
        const floorContPhysMat = new CANNON.Material();
        const floorContShape = new CANNON.Box(new CANNON.Vec3(95, 95, 1)); // Half of your desired dimensions
        this.body = new CANNON.Body({
            shape: floorContShape,
            type: CANNON.Body.STATIC,
            material: floorContPhysMat,

        });
        this.body.collisionFilterGroup = 2;  // or any other number
        this.body.collisionFilterMask = -1;
        this.body.position.copy(new CANNON.Vec3(container.position.x - 10, container.position.y - 1, container.position.z - 10));
        this.body.quaternion.setFromEuler(rotationAngle, 0, 0);
        world.addBody(this.body);

        // this.mesh.position.copy(this.body.position);
        // this.mesh.quaternion.copy(this.body.quaternion);
    }
}

function puzzComplete(puzz) {
    if (puzz == 'Blue') {

        puzz1Gate.opengate(90,3);

    }
    else if (puzz == 'Red') {
        puzz2Gate.opengate(0, 2);
    }


}


function createTile(index, round, container) {
    let tile;
    if (index != 81) {

        tile = new THREE.Mesh(tileGeometry, tileMaterial.clone());
        // Add cylinders at each corner of the tile
        const cornerCylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 32); // Adjusted size
        const cornerCylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

        // Add cubes on top of each cylinder
        const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5); // Cube dimensions
        const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

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
    } else {
        tile = new THREE.Mesh(tileGeoRound, tileMaterial.clone());
        tile.rotation.x = Math.PI / 2;
    }
    tile.userData.tileNumber = index; // Store the tile number in user data
    tile.castShadow = true;
    tile.receiveShadow = true;


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
    tile.castShadow = true;
    tile.receiveShadow = true;

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

function addWalls() {

    const wallSpawnRight = new Wall(new CANNON.Vec3(blockWidth, 0, blockWidth), new CANNON.Vec3(0, rotationAngle, 0));
    const wallSpawnLeft = new Wall(new CANNON.Vec3(0, 0, blockWidth), new CANNON.Vec3(0, rotationAngle, 0));
    const wallSpawnBack = new Wall(scene, world, new CANNON.Vec3(blockWidth / 2, 0, blockWidth * 1.5), new CANNON.Vec3(0, (Math.PI / 1), 0));

    const wallPuzz1Right = new Wall(new CANNON.Vec3(blockWidth, 0, 0), new CANNON.Vec3(0, rotationAngle, 0));
    const wallPuzz1Left = new Wall(new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(0, rotationAngle, 0));

    const wallPuzz2Back = new Wall(new CANNON.Vec3(blockWidth / 2, 0, -blockWidth * 1.5), new CANNON.Vec3(0, (Math.PI / 1), 0));
    const wallPuzz2Right = new Wall(new CANNON.Vec3(blockWidth, 0, -blockWidth), new CANNON.Vec3(0, rotationAngle, 0));

    const wallPuzz3Right = new Wall(new CANNON.Vec3(-blockWidth / 2, 0, -blockWidth * 1.5), new CANNON.Vec3(0, (Math.PI / 1), 0));
    const wallPuzz3Left = new Wall(new CANNON.Vec3(-blockWidth / 2, 0, -blockWidth / 2), new CANNON.Vec3(0, (Math.PI / 1), 0));
    const wallPuzz3back = new Wall(new CANNON.Vec3(-blockWidth, 0, -blockWidth), new CANNON.Vec3(0, rotationAngle, 0));

    const lobbyExit = new InnerWall(new CANNON.Vec3(blockWidth / 2, 0, blockWidth / 2 - 9), new CANNON.Vec3(0, (Math.PI / 1), 0));
    const puzz1Exit = new InnerWall(new CANNON.Vec3(blockWidth / 2, 0, -blockWidth / 2 + 9), new CANNON.Vec3(0, (Math.PI / 1), 0));
    const puzz2Exit = new InnerWall(new CANNON.Vec3(-24.5, 0, -blockWidth), new CANNON.Vec3(0, (Math.PI / 2), 0));

   
    lobbyGate = new Gate(new CANNON.Vec3(blockWidth / 2, 0, blockWidth / 2 + 10), new CANNON.Vec3(0, (Math.PI / 1), 0));
    lobbyGate.opengate(90, 0);

    puzz1Gate = new Gate(new CANNON.Vec3(blockWidth / 2, 0, -blockWidth / 2 + 20), new CANNON.Vec3(0, (Math.PI / 1), 0));
    puzz1Gate.opengate(90, 3);

    puzz2Gate = new Gate(new CANNON.Vec3(-10, 0, -blockWidth + 10), new CANNON.Vec3(0, (Math.PI / 2), 0));
    puzz2Gate.opengate(0, 2);

}


function addFloorBodies() {

    const floorBody1 = new floorContBody(floorContainerGreen);
    const floorBody2 = new floorContBody(floorContainerRed);
    const floorBody3 = new floorContBody(floorContainerBlue);



}

function helperSquares() {

    //white and gray squares (will be removed later)


    const planeGeometry = new THREE.PlaneGeometry(gridSizeX * blockWidth, gridSizeZ * blockDepth);
    const planeMaterial = new THREE.MeshBasicMaterial({ opacity: 0.0, transparent: true }); // White color

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate it to be horizontal
    plane.position.set(0, -30, 0); // Position it on the X-Z plane

    scene.add(plane);

    // Create alternating grey and white blocks
    for (let i = 0; i < gridSizeX; i++) {
        for (let j = 0; j < gridSizeZ; j++) {
            const color = (i + j) % 2 === 0 ? 0x808080 : 0xffffff; // Alternating grey and white
            const blockMaterial = new THREE.MeshBasicMaterial({ color });
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

function PiP() {

    // Iterate through all objects in PiP2
    PiP1.children.forEach((tile) => {
        tile.material = tile.material.clone();
        tile.material.transparent = false;
        tile.material.opacity = 1;
    });


    // Iterate through all objects in PiP2
    PiP2.children.forEach((tile) => {
        tile.material = tile.material.clone();
        tile.material.transparent = false;
        tile.material.opacity = 1;
    });

    // Iterate through all objects in PiP2
    PiP3.children.forEach((tile) => {
        tile.material = tile.material.clone();
        tile.material.transparent = false;
        tile.material.opacity = 1;
    });



    //PiP3 Creation
    PiP3.scale.set(0.12, 0.12, 0.12);
    PiP3.position.set(blockWidth / 2 + 0.5 + 30, 20, 111);
    PiP3.rotation.set(Math.PI, 0, 0);
    //PiP3 Pole
    const poleGeometry = new THREE.CylinderGeometry(0.75, 0.75, 35, 50);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const pole3 = new THREE.Mesh(poleGeometry, poleMaterial);
    scene.add(pole3);
    pole3.position.set(175 + 30, 0, 110);
    //PiP3 Sign
    const signwallgeometry = new THREE.BoxGeometry(10, 10, 1.4);
    const signmaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const signwall3 = new THREE.Mesh(signwallgeometry, signmaterial);
    scene.add(signwall3)
    signwall3.position.set(175 + 30, 20, 110);
    //PiP3 base
    const PiPBaseGeometry = new THREE.BoxGeometry(7, 7, 0.5);
    const PiPBaseMaterial3 = new THREE.MeshStandardMaterial({ color: 0xFFA500 });
    const PiPBase3 = new THREE.Mesh(PiPBaseGeometry, PiPBaseMaterial3);
    scene.add(PiPBase3);
    PiPBase3.position.set(175 + 30, 20, 110.5);


    //PiP1 Creation
    PiP1.scale.set(0.12, 0.12, 0.12);
    PiP1.position.set(-blockWidth / 2 + 142.5 - 30, 20, - blockWidth + 0.6 + 7);
    PiP1.rotation.set(0, -Math.PI / 2, -Math.PI);
    //PiP1 Pole
    const pole1 = new THREE.Mesh(poleGeometry, poleMaterial);
    scene.add(pole1);
    pole1.position.set(-blockWidth / 2 + 141 - 30, 0, - blockWidth + 0.5 + 7);
    //PiP1 Sign
    const signwall1 = new THREE.Mesh(signwallgeometry, signmaterial);
    scene.add(signwall1);
    signwall1.position.set(-blockWidth / 2 + 141 - 30, 20, - blockWidth + 0.8 + 7);
    signwall1.rotation.set(0, Math.PI / 2, 0);
    //PiP Base 1
    const PiPBaseMaterial1 = new THREE.MeshStandardMaterial({ color: 0x006400 });
    const PiPBase1 = new THREE.Mesh(PiPBaseGeometry, PiPBaseMaterial1);
    scene.add(PiPBase1);
    PiPBase1.position.set(-blockWidth / 2 + 142 - 30, 20.3, - blockWidth + 0.8 - 0.4 + 7.5);
    PiPBase1.rotation.set(0, Math.PI / 2, 0);
    scene.add(PiPBase1);


    //PiP2 Creation
    PiP2.scale.set(0.12, 0.12, 0.12);
    PiP2.position.set(blockWidth / 2 + 0.65 + 30, 20, -218);
    PiP2.rotation.set(Math.PI, 0, 0);
    //PiP2 Pole
    const pole2 = new THREE.Mesh(poleGeometry, poleMaterial);
    scene.add(pole2);
    pole2.position.set(blockWidth / 2 + 0.5 + 30, 0, -220);
    //PiP2 Sign
    const signwall2 = new THREE.Mesh(signwallgeometry, signmaterial);
    scene.add(signwall2);
    signwall2.position.set(blockWidth / 2 + 0.5 + 30, 20, -220);
    //PiP Base 2
    const PiPBaseMaterial2 = new THREE.MeshStandardMaterial({ color: 0xff00ff });
    const PiPBase2 = new THREE.Mesh(PiPBaseGeometry, PiPBaseMaterial2);
    scene.add(PiPBase2);
    PiPBase2.position.set(blockWidth / 2 + 0.3 + 30, 20.2, -219);
    scene.add(PiPBase2);

    scene.add(PiP1);
    scene.add(PiP2);
    scene.add(PiP3);


}

function sky() {


    // Create texture objects
    const texture_ft = new THREE.TextureLoader().load(exosystemFtImage);
    const texture_bk = new THREE.TextureLoader().load(exosystemBkImage);
    const texture_up = new THREE.TextureLoader().load(exosystemUpImage);
    const texture_dn = new THREE.TextureLoader().load(exosystemDnImage);
    const texture_rt = new THREE.TextureLoader().load(exosystemRtImage);
    const texture_lf = new THREE.TextureLoader().load(exosystemLfImage);

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
    skybox.position.set(0, 200, 0);
    scene.add(skybox);

}


function ground() {
    let groundTexture = new THREE.TextureLoader().load(groundImg);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(-250, -250);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    // Create ground
    const groundGeo = new THREE.PlaneGeometry(10000, 10000);
    const groundMat = new THREE.MeshStandardMaterial({
        receiveShadow: true,
        map: groundTexture,
        side: THREE.DoubleSide,
    });

    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
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

function makeMazes() {


    scene.add(floorContainerGreen);
    scene.add(floorContainerRed);
    scene.add(floorContainerBlue);


    // Call the function to draw the first grid with omissions
    drawGridWithOmissions(floorContainerGreen, [], 1);
    drawGridWithOmissions(floorContainerRed, [30, 38, 78], 5);
    drawGridWithOmissions(floorContainerBlue, [28, 30, 42, 52, 76], 19);

    changePathColor(floorContainerGreen, path1, 0x00ff00); // Green
    changePathColor(floorContainerRed, path2, 0xff0000); // Red
    changePathColor(floorContainerBlue, path3, 0x0000FF);//blue

    //Draw PiPs
    drawPiP(PiP1, [], 1);
    changePathColor(PiP1, pathPiP2AND3, 0x006400);

    drawPiP(PiP2, [], 2);
    changePathColor(PiP2, pathPiP2AND3, 0xff00ff);

    drawPiP(PiP3, [], 3);
    changePathColor(PiP3, pathPiP2AND3, 0xFFA500);




    //scales map path
    floorContainerGreen.scale.set(4, 4, 1);
    floorContainerRed.scale.set(4, 4, 1);
    floorContainerBlue.scale.set(4, 4, 1);

    floorContainerGreen.position.set(-blockWidth / 2, 5, - blockWidth - 22);
    floorContainerRed.position.set(blockWidth / 2, 5, - blockWidth);
    floorContainerBlue.position.set(blockWidth / 2, 5, 0);



    floorContainerGreen.rotation.set(rotationAngle, 0, -Math.PI / 2);

    floorContainerRed.rotation.set(rotationAngle, 0, 0);
    floorContainerBlue.rotation.set(rotationAngle, 0, 0);

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

            if (tile.litUp === false && inXBounds && inZBounds && Math.abs(player.characterModel.position.y - tileWorldPosition.y) < epsilon) {
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

            if (tile.litUp === false && inXBounds && inZBounds && Math.abs(player.characterModel.position.y - tileWorldPosition.y) < epsilon) {
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
        });

        floorContainerBlue.children.forEach((tile, index) => {
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

            // on encounter of tile light or unlight
            if (inXBounds && inZBounds && Math.abs(player.characterModel.position.y - tileWorldPosition.y) < epsilon) {
                if (tile.litUp === true && tile.playerWithinBounds === false) {
                    const tileColor = new THREE.Color(0, 0, 0, 0);
                    // TODO: Change color of all faces of cube to blue currently only default front face is changed
                    tile.material.color.copy(tileColor);
                    tile.litUp === false;
                } else if (tile.litUp === false && tile.playerWithinBounds === false) {
                    const tileColor = new THREE.Color(0, 0, 255);
                    // TODO: Change color of all faces of cube to blue currently only default front face is changed
                    tile.material.color.copy(tileColor);
                    tile.litUp = true;
                }
                tile.playerWithinBounds = true;

                if (tile.userData.tileNumber == 19) {
                    tile.semicircleMesh3.litUp = true;
                    tile.semicircleMesh3.material.color.copy(tileColor);
                }
                litUpTiles3.push(tile.userData.tileNumber);

                // TODO: This might be causing more lag for double loop per tile
                const haveSameValues = path3.every(value => litUpTiles3.includes(value) && litUpTiles3.length === path3.length);
                if (haveSameValues) {
                    console.log("Path 3 correct.");
                    puzzComplete("Blue");
                }
                // TODO: Make tiles sink also upon intersection, just shift slightly in the z
                // How do I position the tiles, is it within the floor container, using current position -= 1 for z for example or do I do a local transformation in floor?
                // TODO: Elevate tiles a bit from the ground they are on or simply shift the whole floor container
                const whiteTile = new THREE.Color(255, 255, 255);
                PiP3.children[tile.userData.tileNumber - 1].material.color.copy(whiteTile);

            } else {
                tile.playerWithinBounds = false;
            }
        });
    }

}



// Create material array

const path1 = [1, 2, 3, 12, 21, 30, 39, 48, 57, 66, 75, 76, 77, 78, 79, 70, 61, 52, 43, 42, 41, 32, 23, 24, 25, 26, 27, 36, 45, 54, 63, 72, 81];
const path2 = [5, 14, 23, 24, 25, 26, 27, 36, 45, 44, 43, 42, 41, 40, 39, 48, 57, 56, 55, 64, 73, 74, 75, 76, 77, 68, 59, 60, 61, 62, 63, 72, 81];
const path3 = [19, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 18, 27, 36, 45, 44, 43, 34, 25, 24, 23, 32, 41, 40, 39, 38, 37, 46, 55, 64, 73, 74, 75, 66, 57, 58, 59, 68, 77, 78, 79, 80, 81];


let litUpTiles1 = [];
let litUpTiles2 = [];
let litUpTiles3 = [];

const pathPiP2AND3 = [11, 13, 15, 17, 29, 31, 33, 35, 47, 49, 51, 53, 65, 67, 69, 71]

//helper squares
const gridSizeX = 2;
const gridSizeZ = 3;
const blockWidth = 350;
const blockDepth = 350;

let assetLoader = new GLTFLoader();
loadModels(assetLoader, scene, world, blockWidth);


sky();




ground();


helperSquares();



// DEFINE MAZE GRID
// Define tile size and gap size
const tileSize = 5; // Adjust the size of each tile
const gapSize = 0.2; // Adjust the size of the gap

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
export const PiP2 = new THREE.Group();
export const PiP1 = new THREE.Group();
export const PiP3 = new THREE.Group();
makeMazes();


addFloorBodies();


PiP();


let lobbyGate;
let puzz1Gate;
let puzz2Gate;
addWalls();

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
            }
        });
    }
});





export function animate_objects() {
    // groundMesh.position.copy(groundBody.position);
    // groundMesh.quaternion.copy(groundBody.quaternion);

}

export function animate_lights() {

    tileLights();


}

// create instance of GLTF loader and call load on it
//

// load takes three arguments, path to file, and a callback function, another function that tells about the progress of the loading process (don't need it so set to undefined), foruth parameter is a function we can use to tell if an error occurs
// use asset loader to load .gltf from path
// model is stored as property of gltf object whose key is scene
