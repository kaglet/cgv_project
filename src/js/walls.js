import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export let lobbyGate;
export let puzz1Gate;
export let puzz2Gate;

let blockWidth;
let assetLoader;


class Wall {

    constructor(scene,world, position, rotation) {
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
    constructor(scene,world,position, rotation) {
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
    constructor(scene,world,position, rotation) {
        this.open = false;
        this.currentAngle = rotation.y;       // Current angle of the door
        this.targetAngle = rotation.y;        // Target angle for the door
        this.isAnimating = false;    // Flag to track if the door is currently animating

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

        if (this.model && (!this.open)) {
            // Set the hinge point (pivot) at the left vertical edge of the door
            let hingePoint = new THREE.Vector3(-20, 0, 0); // Adjust the values as needed
            if (gateNum == 2) {
                hingePoint = new THREE.Vector3(0, 0, -18); // Adjust the values as needed
            }

            // Calculate the rotation in radians (assuming angle is in degrees)
            const rotationAngle = angle;

            // Step 1: Translate the door to the hinge point
            this.inverseHingePoint = hingePoint.clone().negate();


            // this.model.rotation.set(0, rotationAngle, 0); // Update the Three.js rotation
            this.startOpeningAnimation(rotationAngle);
            this.model.position.add(this.inverseHingePoint);

            this.body.quaternion.setFromEuler(0, rotationAngle, 0);
            this.body.position.copy(this.model.position);

            // Step 3: Translate the door back to its original position
            //  this.model.position.sub(this.inverseHingePoint);
        }
    }

    // New method to start the opening animation
    startOpeningAnimation(angle) {
        if (this.isAnimating) {
            // If an animation is already in progress, ignore the request
            return;
        }

        this.targetAngle += angle;
        this.animateOpen();
    }

    // Animation loop to gradually open the door
    animateOpen() {
        this.isAnimating = true;

        // Calculate the rotation increment per frame
        const increment = (this.targetAngle - this.currentAngle) * 0.015;  // Adjust the speed as needed

        if (Math.abs(increment) > 0.0025) {
            // Continue opening the door
            this.currentAngle += increment;

            // Rotate the Cannon.js body

            // Set the position of the model's pivot point
            // this.model.position.copy(this.body.position);
            // this.model.quaternion.copy(this.body.quaternion);
            this.model.rotation.set(0, this.currentAngle, 0); //

            // Request the next frame
            requestAnimationFrame(() => this.animateOpen());
        } else {
            this.isAnimating = false;
        }
    }

}


export function addWalls(assetLoader1, scene,world, blockWidth1, rotationAngle) {
    blockWidth = blockWidth1;
    assetLoader = assetLoader1;

    const wallSpawnRight = new Wall(scene,world,new CANNON.Vec3(blockWidth, 0, blockWidth), new CANNON.Vec3(0, rotationAngle, 0));
    const wallSpawnLeft = new Wall(scene,world,new CANNON.Vec3(0, 0, blockWidth), new CANNON.Vec3(0, rotationAngle, 0));
    const wallSpawnBack = new Wall(scene,world,new CANNON.Vec3(blockWidth / 2, 0, blockWidth * 1.5), new CANNON.Vec3(0, (Math.PI / 1), 0));

    const wallPuzz1Right = new Wall(scene,world,new CANNON.Vec3(blockWidth, 0, 0), new CANNON.Vec3(0, rotationAngle, 0));
    const wallPuzz1Left = new Wall(scene,world,new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(0, rotationAngle, 0));

    const wallPuzz2Back = new Wall(scene,world,new CANNON.Vec3(blockWidth / 2, 0, -blockWidth * 1.5), new CANNON.Vec3(0, (Math.PI / 1), 0));
    const wallPuzz2Right = new Wall(scene,world,new CANNON.Vec3(blockWidth, 0, -blockWidth), new CANNON.Vec3(0, rotationAngle, 0));

    const wallPuzz3Right = new Wall(scene,world,new CANNON.Vec3(-blockWidth / 2, 0, -blockWidth * 1.5), new CANNON.Vec3(0, (Math.PI / 1), 0));
    const wallPuzz3Left = new Wall(scene,world,new CANNON.Vec3(-blockWidth / 2, 0, -blockWidth / 2), new CANNON.Vec3(0, (Math.PI / 1), 0));
    const wallPuzz3back = new Wall(scene,world,new CANNON.Vec3(-blockWidth, 0, -blockWidth), new CANNON.Vec3(0, rotationAngle, 0));

    const lobbyExit = new InnerWall(scene,world,new CANNON.Vec3(blockWidth / 2, 0, blockWidth / 2 - 9), new CANNON.Vec3(0, (Math.PI / 1), 0));
    const puzz1Exit = new InnerWall(scene,world,new CANNON.Vec3(blockWidth / 2, 0, -blockWidth / 2 + 9), new CANNON.Vec3(0, (Math.PI / 1), 0));
    const puzz2Exit = new InnerWall(scene,world,new CANNON.Vec3(-24.5, 0, -blockWidth), new CANNON.Vec3(0, (Math.PI / 2), 0));


    lobbyGate = new Gate(scene,world,new CANNON.Vec3(blockWidth / 2, 0, blockWidth / 2 ), new CANNON.Vec3(0, 0, 0));
    puzz1Gate = new Gate(scene,world,new CANNON.Vec3(blockWidth / 2, 0, -blockWidth / 2 + 20), new CANNON.Vec3(0, 0, 0));
    puzz2Gate = new Gate(scene,world,new CANNON.Vec3(-10, 0, -blockWidth + 10), new CANNON.Vec3(0, (Math.PI / 2), 0));

}