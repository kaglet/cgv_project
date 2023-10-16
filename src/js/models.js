import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function generateRandomNumberForVariation(){
    // Generate a random nubmer between 0.1 and 0.3
    return Math.random() * 0.1 + 0.2;
}

function trees(loader, scene, world) {
    const numTrees = 20;
    const minDistanceFromCenter = 600;
    const maxDistanceFromCenter = 700;
    const center = new THREE.Vector3(-100, 0, 0); // New center position
    const randomSeed1 = 3; // Your chosen random seed
    const randomSeed2 = 50; // Your chosen random seed

    // Create a seeded random number generator
    function seededRandom(seed) {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    for (let i = 0; i < numTrees; i++) {
        loader.load('./coconut_tree/scene.gltf', function (gltf) {
            const coconutTreeModel = gltf.scene;
            coconutTreeModel.scale.set(0.1, 0.1, 0.1);

            // Use the seeded random function to generate consistent random positions
            const randomAngle = seededRandom(randomSeed1 + i) * Math.PI * 2;
            const randomDistance = minDistanceFromCenter + (seededRandom(randomSeed1 - i) * (maxDistanceFromCenter - minDistanceFromCenter));
            const randomYRotation = Math.random() * Math.PI * 2; // Random Y-axis rotation

            // Calculate the X and Z coordinates based on the polar coordinates
            const randomX = center.x + randomDistance * Math.cos(randomAngle);
            const randomZ = center.z + randomDistance * Math.sin(randomAngle);

            // Ensure the tree is above the ground (adjust the height as needed)
            const groundHeight = 0.1;

            coconutTreeModel.position.set(randomX, 0, randomZ);
            coconutTreeModel.rotation.y = randomYRotation;

            scene.add(coconutTreeModel);
        });

        loader.load('./bended_coconut_tree/scene.gltf', function (gltf) {
            const bendedCoconutTreeModel = gltf.scene;
            bendedCoconutTreeModel.scale.set(0.1, 0.1, 0.1);

            // Use the seeded random function to generate consistent random positions
            const randomAngle = seededRandom(randomSeed2 + i) * Math.PI * 2;
            const randomDistance = minDistanceFromCenter + (seededRandom(randomSeed2 - i) * (maxDistanceFromCenter - minDistanceFromCenter));
            const randomYRotation = Math.random() * Math.PI * 2; // Random Y-axis rotation

            // Calculate the X and Z coordinates based on the polar coordinates
            const randomX = center.x + randomDistance * Math.cos(randomAngle);
            const randomZ = center.z + randomDistance * Math.sin(randomAngle);

            // Ensure the tree is above the ground (adjust the height as needed)
            const groundHeight = 0.1;

            bendedCoconutTreeModel.position.set(randomX, 0, randomZ);
            bendedCoconutTreeModel.rotation.y = randomYRotation;

            scene.add(bendedCoconutTreeModel);
        });
    }
}

export function loadModels(loader, scene, world, blockWidth){

    trees(loader, scene, world);




    loader.load('/ground_material.glb', function (gltf) {
        gltf.scene.rotation.y = Math.PI / 2;
        gltf.scene.scale.set(1, 1, 1);
        gltf.scene.position.y = -1;
        gltf.scene.position.x = 0;
        gltf.scene.position.z = 0;
        scene.add(gltf.scene);

    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/luffy.glb', function (gltf) {
        const luffyModel = gltf.scene;
        luffyModel.rotation.y = -Math.PI / 2;
        luffyModel.scale.set(0.15, 0.15, 0.15);
        luffyModel.position.set(60, 35, 0);

        // Calculate dimensions of the Luffy model
        const boundingBox = new THREE.Box3().setFromObject(luffyModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;

        // Create Cannon.js body shape for Luffy model
        // const luffyShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        //
        // // Create Cannon.js body for Luffy model
        // const luffyBody = new CANNON.Body({
        //     mass: 0, // Adjust mass as needed
        //     position: new CANNON.Vec3(0, -2, -40) // Initial position of the model
        // });
        // luffyBody.addShape(luffyShape);
        // world.addBody(luffyBody);

        scene.add(luffyModel);

        // Print the size of the Luffy model
        console.log('Luffy Model Size - Width:', width, 'Height:', height, 'Depth:', depth);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(0, 10, -40);

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/lion_statue.glb', function (gltf) {
        const lionStatueModel = gltf.scene;
        lionStatueModel.scale.set(20, 20, 20);
        lionStatueModel.position.set(-40, -5, 0);
        console.log("Lion Statue Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        //    }

        // Calculate dimensions of the lion statue model
        const boundingBox = new THREE.Box3().setFromObject(lionStatueModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Lion Statue model
        const lionStatueShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const lionStatueBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(-40, -5, 0) // Initial position of the model
        });
        lionStatueBody.addShape(lionStatueShape);
        world.addBody(lionStatueBody);

        scene.add(lionStatueModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(-40, 8, 0);

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    // Load Dragon Ball Z - Guko Character model
    loader.load('/dragon_ball_z_-_guko_character.glb', function (gltf) {
        const gukoModel = gltf.scene;
        gukoModel.rotation.y = -Math.PI / 2;
        gukoModel.scale.set(1, 1, 1);
        gukoModel.position.set(40, 35, 0);

        // Calculate dimensions of the Goku model
        const boundingBox = new THREE.Box3().setFromObject(gukoModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Create Cannon.js body shape for Goku model
        const gukoShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));

        // Create Cannon.js body for Goku model
        const gukoBody = new CANNON.Body({
            mass: 0, // Adjust mass as needed based on your scene's requirements
            position: new CANNON.Vec3(40, 35, 0) // Initial position of the model
        });

        // Add the shape to the body
        gukoBody.addShape(gukoShape);

        // Add the body to the world
        world.addBody(gukoBody);

        // Add the model to the scene
        scene.add(gukoModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 2, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(27, 12, 0);

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

        // TODO: For variation adjust scaling in z, y, x for narrower/extended walls or taller/shotter walls
    // Based off that you can also adjust the adjustment length to shift by before pasting the next model but that's a bit too advanced
    // I think I will choose a uniform adjustment for all and work only with scaling, and have same number of pieces too just vary length and heights and ensure they reach end
    // Plan for minimum in scale each time for max i in iterations
    let pathToWall = 'assets/mossy_stone_wall/scene.gltf';
    let baselineShift = 25;
    let offsetCurvedEdgesShift = 27;
    // for wall spawn right
    let adjustment1 = 0;
    for (let i = 0; i < 13; i++) {
        loader.load(pathToWall , (gltf) => {
            const model = gltf.scene;
            // add to scene and position like any other object
            scene.add(model);
            model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
            model.position.set(blockWidth, 0, blockWidth + offsetCurvedEdgesShift + adjustment1);
            adjustment1 -= 67.5;
            model.rotateY(-Math.PI / 2);
            // model.position.set(-10, 0, -100);
        }, undefined, (error) => {
            console.log(error);
        });
    }

    // // for wall spawn back
    let adjustment2 = 0;
    for (let i = 0; i < 3; i++) {
        loader.load(pathToWall, (gltf) => {
            const model = gltf.scene;
            // add to scene and position like any other object
            scene.add(model);

            model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
            model.position.set(blockWidth / 2 + 25 + adjustment2, 0, blockWidth * 1.5 + baselineShift);
            adjustment2 -= 62;
        }, undefined, (error) => {
            console.log(error);
        });
    }
    // // TODO: Merge them differently by setting adjustment to a random number but definitely make sure iteration number allows it to definitely be filled even if minimum value is used
    // // for wall spawn left
    let adjustment3 = 0;
    for (let i = 0; i < 7; i++) {
        loader.load(pathToWall, (gltf) => {
            const model = gltf.scene;
            // add to scene and position like any other object
            scene.add(model);

            model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
            model.position.set(-baselineShift, 0, blockWidth + offsetCurvedEdgesShift + adjustment3);
            adjustment3 -= 75;
            model.rotateY(-Math.PI / 2);
        }, undefined, (error) => {
            console.log(error);
        });
    }

    // // for puzz 2 back
    let adjustment4 = 0;
    for (let i = 0; i < 8; i++) {
        loader.load(pathToWall, (gltf) => {
            const model = gltf.scene;
            // add to scene and position like any other object
            scene.add(model);

            model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
            model.position.set(blockWidth / 2 + offsetCurvedEdgesShift + adjustment4, 0, -blockWidth * 1.5);
            adjustment4 -= 68;
            // model.rotateY(-Math.PI / 2);
        }, undefined, (error) => {
            console.log(error);
        });
    }

    // // for puzz 3 left
    let adjustment6 = 0;
    for (let i = 0; i < 3; i++) {
        loader.load(pathToWall, (gltf) => {
            const model = gltf.scene;
            // add to scene and position like any other object
            scene.add(model);

            model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
            model.position.set(-blockWidth / 2 + adjustment6, 0, -blockWidth / 2 + baselineShift);
            adjustment6 -= 50;
            // model.rotateY(-Math.PI / 2);
        }, undefined, (error) => {
            console.log(error);
        });
    }

    // // for puzz 3 back
    let adjustment7 = 0;
    for (let i = 0; i < 2; i++) {
        loader.load(pathToWall, (gltf) => {
            const model = gltf.scene;
            // add to scene and position like any other object
            scene.add(model);

            model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
            model.position.set(-blockWidth - baselineShift, 0, -blockWidth + offsetCurvedEdgesShift + adjustment7);
            adjustment7 -= 120;
            model.rotateY(-Math.PI / 2);
        }, undefined, (error) => {
            console.log(error);
        });
    }
}




// export function loadModels(loader, scene, world, blockWidth) {
//     // loader.load('/ground_material.glb', function (gltf) {
//     //     gltf.scene.rotation.y = Math.PI / 2;
//     //     gltf.scene.scale.set(1, 1, 1);
//     //     gltf.scene.position.y = -1;
//     //     gltf.scene.position.x = 0;
//     //     gltf.scene.position.z = 0;
//     //     scene.add(gltf.scene);

//     // }, undefined, function (error) {
//     //     console.error(error);
//     // });



//     // TODO: Return a model from constructor that loads the same model for repetitions
//     // Check how to repeat a model, or clone it. 
//     // TODO: Make wall transparent so I can see other walls I put in and repeat just by increasing size in for loop while returning it from constructor along a side
//     // Repetetive work can be done in loop
//     // That gets me walls not high enough and not fully wrapped in 3D texture which doesn't have a topping, it has a strange top
//     // Goal is to obscure outside with high walls
//     // TODO: Check if walls can be cut out

//     // loader.load('assets/damaged_wall/scene.gltf', (gltf) => {
//     //     const model = gltf.scene;
//     //     // add to scene and position like any other object
//     //     scene.add(model);
//     //     model.scale.set(0.1, 0.1, 0.1);
//     //     model.position.set(200, 0, 300);
//     //     // model.position.set(-10, 0, -100);
//     // }, undefined, (error) => {
//     //     console.log(error);
//     // });

//     // loader.load('assets/stone_wall/scene.gltf', (gltf) => {
//     //     const model = gltf.scene;
//     //     // add to scene and position like any other object
//     //     scene.add(model);
//     //     model.scale.set(0.1, 0.1, 0.1);
//     //     model.position.set(50, 0, 200);
//     //     // model.position.set(-10, 0, -100);
//     // }, undefined, (error) => {
//     //     console.log(error);
//     // });

//     // loader.load('/luffy.glb', function (gltf) {
//     //     const luffyModel = gltf.scene;
//     //     luffyModel.rotation.y = -Math.PI / 2;
//     //     luffyModel.scale.set(0.15, 0.15, 0.15);
//     //     luffyModel.position.set(0, -2, -40);

//     //     // Calculate dimensions of the Luffy model
//     //     const boundingBox = new THREE.Box3().setFromObject(luffyModel);
//     //     const width = boundingBox.max.x - boundingBox.min.x;
//     //     const height = boundingBox.max.y - boundingBox.min.y;
//     //     const depth = boundingBox.max.z - boundingBox.min.z;

//     //     // Create Cannon.js body shape for Luffy model
//     //     const luffyShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));

//     //     // Create Cannon.js body for Luffy model
//     //     const luffyBody = new CANNON.Body({
//     //         mass: 0, // Adjust mass as needed
//     //         position: new CANNON.Vec3(0, -2, -40) // Initial position of the model
//     //     });
//     //     luffyBody.addShape(luffyShape);
//     //     world.addBody(luffyBody);

//     //     scene.add(luffyModel);

//     //     // Print the size of the Luffy model
//     //     console.log('Luffy Model Size - Width:', width, 'Height:', height, 'Depth:', depth);

//     //     // Create wireframe mesh for visualization
//     //     const wireframeGeometry = new THREE.BoxGeometry(width, height, depth);
//     //     const wireframeMaterial = new THREE.MeshBasicMaterial({
//     //         color: 0x00ff00,
//     //         wireframe: true
//     //     });
//     //     const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

//     //     // Position the wireframe mesh at the same position as the model
//     //     wireframeMesh.position.set(0, 10, -40);

//     //     // Add the wireframe mesh to the scene
//     //     scene.add(wireframeMesh);
//     // }, undefined, function (error) {
//     //     console.error(error);
//     // });

//     // loader.load('/lion_statue.glb', function (gltf) {
//     //     const lionStatueModel = gltf.scene;
//     //     lionStatueModel.scale.set(20, 20, 20);
//     //     lionStatueModel.position.set(-40, -5, 0);
//     //     console.log("Lion Statue Properties:");
//     //     //    for (const property in lionStatueModel) {
//     //     //        console.log(`${property}:`, lionStatueModel[property]);
//     //     //    }

//     //     // Calculate dimensions of the lion statue model
//     //     const boundingBox = new THREE.Box3().setFromObject(lionStatueModel);
//     //     const width = boundingBox.max.x - boundingBox.min.x;
//     //     const height = boundingBox.max.y - boundingBox.min.y;
//     //     const depth = boundingBox.max.z - boundingBox.min.z;
//     //     console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

//     //     // Add Cannon.js body for Lion Statue model
//     //     const lionStatueShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
//     //     const lionStatueBody = new CANNON.Body({
//     //         mass: 0, // Static object, so mass is 0
//     //         position: new CANNON.Vec3(-40, -5, 0) // Initial position of the model
//     //     });
//     //     lionStatueBody.addShape(lionStatueShape);
//     //     world.addBody(lionStatueBody);

//     //     scene.add(lionStatueModel);

//     //     // Create wireframe mesh for visualization
//     //     const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
//     //     const wireframeMaterial = new THREE.MeshBasicMaterial({
//     //         color: 0x00ff00,
//     //         wireframe: true
//     //     });
//     //     const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

//     //     // Position the wireframe mesh at the same position as the model
//     //     wireframeMesh.position.set(-40, 8, 0);

//     //     // Add the wireframe mesh to the scene
//     //     scene.add(wireframeMesh);
//     // }, undefined, function (error) {
//     //     console.error(error);
//     // });

//     // // Load Dragon Ball Z - Guko Character model
//     // loader.load('/dragon_ball_z_-_guko_character.glb', function (gltf) {
//     //     const gukoModel = gltf.scene;
//     //     gukoModel.rotation.y = -Math.PI / 2;
//     //     gukoModel.scale.set(1, 1, 1);
//     //     gukoModel.position.set(40, 35, 0);

//     //     // Calculate dimensions of the Goku model
//     //     const boundingBox = new THREE.Box3().setFromObject(gukoModel);
//     //     const width = boundingBox.max.x - boundingBox.min.x;
//     //     const height = boundingBox.max.y - boundingBox.min.y;
//     //     const depth = boundingBox.max.z - boundingBox.min.z;
//     //     console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

//     //     // Create Cannon.js body shape for Goku model
//     //     const gukoShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));

//     //     // Create Cannon.js body for Goku model
//     //     const gukoBody = new CANNON.Body({
//     //         mass: 0, // Adjust mass as needed based on your scene's requirements
//     //         position: new CANNON.Vec3(40, 35, 0) // Initial position of the model
//     //     });

//     //     // Add the shape to the body
//     //     gukoBody.addShape(gukoShape);

//     //     // Add the body to the world
//     //     world.addBody(gukoBody);

//     //     // Add the model to the scene
//     //     scene.add(gukoModel);

//     //     // Create wireframe mesh for visualization
//     //     const wireframeGeometry = new THREE.BoxGeometry(width, height - 2, depth);
//     //     const wireframeMaterial = new THREE.MeshBasicMaterial({
//     //         color: 0x00ff00,
//     //         wireframe: true
//     //     });
//     //     const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

//     //     // Position the wireframe mesh at the same position as the model
//     //     wireframeMesh.position.set(27, 12, 0);

//     //     // Add the wireframe mesh to the scene
//     //     scene.add(wireframeMesh);
//     // }, undefined, function (error) {
//     //     console.error(error);
//     // });
// }