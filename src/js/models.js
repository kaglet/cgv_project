import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function generateRandomNumberForVariation() {
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

export function loadModels(loader, scene, world, blockWidth) {

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


    //DUNGEON CELLS
    loader.load('/dungeon.glb', function (gltf) {
        const dungeonModel = gltf.scene;
        dungeonModel.scale.set(15, 15, 15);
        dungeonModel.position.set(105, 17, 487);
        //console.log("Dungeon Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the dungeon model
        const boundingBox = new THREE.Box3().setFromObject(dungeonModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        // console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Dungeon model
        const dungeonModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const dungeonModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(105, 17, 487) // Initial position of the model
        });
        dungeonModelBody.addShape(dungeonModelShape);
        world.addBody(dungeonModelBody);

        dungeonModel.rotation.y = Math.PI / 2;
        scene.add(dungeonModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(105, 17, 487);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/dungeon.glb', function (gltf) {
        const dungeonModel = gltf.scene;
        dungeonModel.scale.set(15, 15, 15);
        dungeonModel.position.set(245, 17, 487);
        // console.log("Dungeon Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the dungeon model
        const boundingBox = new THREE.Box3().setFromObject(dungeonModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        // console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Dungeon model
        const dungeonModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const dungeonModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(245, 17, 487) // Initial position of the model
        });
        dungeonModelBody.addShape(dungeonModelShape);
        world.addBody(dungeonModelBody);

        dungeonModel.rotation.y = Math.PI / 2;
        scene.add(dungeonModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(245, 17, 487);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });




    //STONE WALL
    loader.load('/wall_ruins.glb', function (gltf) {
        const stoneWallModel = gltf.scene;
        stoneWallModel.scale.set(30, 30, 30);
        stoneWallModel.position.set(265, 0, 490);
        //  console.log("Stone Wall Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the stone wall model
        const boundingBox = new THREE.Box3().setFromObject(stoneWallModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Stone Wall model
        const stoneWallModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const stoneWallModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(265, 0, 490) // Initial position of the model
        });
        stoneWallModelBody.addShape(stoneWallModelShape);
        world.addBody(stoneWallModelBody);

        stoneWallModel.rotation.y = Math.PI / 2;
        scene.add(stoneWallModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(265, 0, 490);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });


    loader.load('/wall_ruins.glb', function (gltf) {
        const stoneWallModel = gltf.scene;
        stoneWallModel.scale.set(30, 30, 30);
        stoneWallModel.position.set(215, 0, 490);
        //  console.log("Stone Wall Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the stone wall model
        const boundingBox = new THREE.Box3().setFromObject(stoneWallModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        // console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Stone Wall model
        const stoneWallModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const stoneWallModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(215, 0, 490) // Initial position of the model
        });
        stoneWallModelBody.addShape(stoneWallModelShape);
        world.addBody(stoneWallModelBody);

        stoneWallModel.rotation.y = Math.PI / 2;
        scene.add(stoneWallModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(215, 0, 490);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/wall_ruins.glb', function (gltf) {
        const stoneWallModel = gltf.scene;
        stoneWallModel.scale.set(30, 30, 30);
        stoneWallModel.position.set(165, 0, 490);
        // console.log("Stone Wall Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the stone wall model
        const boundingBox = new THREE.Box3().setFromObject(stoneWallModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        // console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Stone Wall model
        const stoneWallModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const stoneWallModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(165, 0, 490) // Initial position of the model
        });
        stoneWallModelBody.addShape(stoneWallModelShape);
        world.addBody(stoneWallModelBody);

        stoneWallModel.rotation.y = Math.PI / 2;
        scene.add(stoneWallModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(165, 0, 490);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/wall_ruins.glb', function (gltf) {
        const stoneWallModel = gltf.scene;
        stoneWallModel.scale.set(30, 30, 30);
        stoneWallModel.position.set(115, 0, 490);
        // console.log("Stone Wall Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the stone wall model
        const boundingBox = new THREE.Box3().setFromObject(stoneWallModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Stone Wall model
        const stoneWallModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const stoneWallModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(115, 0, 490) // Initial position of the model
        });
        stoneWallModelBody.addShape(stoneWallModelShape);
        world.addBody(stoneWallModelBody);

        stoneWallModel.rotation.y = Math.PI / 2;
        scene.add(stoneWallModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(115, 0, 490);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/wall_ruins.glb', function (gltf) {
        const stoneWallModel = gltf.scene;
        stoneWallModel.scale.set(30, 30, 30);
        stoneWallModel.position.set(65, 0, 490);
        //  console.log("Stone Wall Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the stone wall model
        const boundingBox = new THREE.Box3().setFromObject(stoneWallModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Stone Wall model
        const stoneWallModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const stoneWallModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(65, 0, 490) // Initial position of the model
        });
        stoneWallModelBody.addShape(stoneWallModelShape);
        world.addBody(stoneWallModelBody);

        stoneWallModel.rotation.y = Math.PI / 2;
        scene.add(stoneWallModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(65, 0, 490);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/wall_ruins.glb', function (gltf) {
        const stoneWallModel = gltf.scene;
        stoneWallModel.scale.set(30, 30, 30);
        stoneWallModel.position.set(15, 0, 490);
        //  console.log("Stone Wall Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the stone wall model
        const boundingBox = new THREE.Box3().setFromObject(stoneWallModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Stone Wall model
        const stoneWallModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const stoneWallModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(15, 0, 490) // Initial position of the model
        });
        stoneWallModelBody.addShape(stoneWallModelShape);
        world.addBody(stoneWallModelBody);

        stoneWallModel.rotation.y = Math.PI / 2;
        scene.add(stoneWallModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(15, 0, 490);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/wall_ruins.glb', function (gltf) {
        const stoneWallModel = gltf.scene;
        stoneWallModel.scale.set(30, 30, 30);
        stoneWallModel.position.set(-6, 0, 416);
        //   console.log("Stone Wall Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the stone wall model
        const boundingBox = new THREE.Box3().setFromObject(stoneWallModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //   console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Stone Wall model
        const stoneWallModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const stoneWallModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(-6, 0, 416) // Initial position of the model
        });
        stoneWallModelBody.addShape(stoneWallModelShape);
        world.addBody(stoneWallModelBody);

        stoneWallModel.rotation.y = Math.PI / 2;
        scene.add(stoneWallModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(-6, 0, 416);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/wall_ruins.glb', function (gltf) {
        const stoneWallModel = gltf.scene;
        stoneWallModel.scale.set(30, 30, 30);
        stoneWallModel.position.set(278, 0, 416);
        //   console.log("Stone Wall Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the stone wall model
        const boundingBox = new THREE.Box3().setFromObject(stoneWallModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        // console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Stone Wall model
        const stoneWallModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const stoneWallModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(278, 0, 416) // Initial position of the model
        });
        stoneWallModelBody.addShape(stoneWallModelShape);
        world.addBody(stoneWallModelBody);

        stoneWallModel.rotation.y = Math.PI / 2;
        scene.add(stoneWallModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(278, 0, 416);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/wall_ruins.glb', function (gltf) {
        const stoneWallModel = gltf.scene;
        stoneWallModel.scale.set(30, 30, 30);
        stoneWallModel.position.set(135, 0, 416);
        //   console.log("Stone Wall Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the stone wall model
        const boundingBox = new THREE.Box3().setFromObject(stoneWallModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        // console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Stone Wall model
        const stoneWallModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const stoneWallModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(135, 0, 416) // Initial position of the model
        });
        stoneWallModelBody.addShape(stoneWallModelShape);
        world.addBody(stoneWallModelBody);

        stoneWallModel.rotation.y = Math.PI / 2;
        scene.add(stoneWallModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(135, 0, 416);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });



    //WATCH TOWER
    loader.load('/watch_tower.glb', function (gltf) {
        const watchTowerModel = gltf.scene;
        watchTowerModel.scale.set(0.2, 0.2, 0.2);
        watchTowerModel.position.set(18, 2, 507);
        //   console.log("Watch Tower Model Properties:");

        // Calculate dimensions of the watch tower model
        const boundingBox = new THREE.Box3().setFromObject(watchTowerModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Watch Tower model
        const watchTowerModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const watchTowerModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(18, 2, 507) // Initial position of the model
        });
        watchTowerModelBody.addShape(watchTowerModelShape);
        world.addBody(watchTowerModelBody);

        // watchTowerModel.rotation.y = Math.PI;
        scene.add(watchTowerModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(18, 2, 507);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });


    //BENCH
    loader.load('/bench.glb', function (gltf) {
        const chairModel = gltf.scene; // Changed variable name to chair
        chairModel.scale.set(14, 14, 14);
        chairModel.position.set(172, 3.5, 435);
        //  console.log("Chair Model Properties:");

        // Calculate dimensions of the chair model
        const boundingBox = new THREE.Box3().setFromObject(chairModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Chair model
        const chairModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const chairModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(172, 3.5, 435) // Initial position of the model
        });
        chairModelBody.addShape(chairModelShape);
        world.addBody(chairModelBody);

        chairModel.rotation.y = Math.PI;
        scene.add(chairModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(172, 3.5, 435);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });



    //BARRELS
    loader.load('/barrels.glb', function (gltf) {
        const barrelsModel = gltf.scene;
        barrelsModel.scale.set(4, 4, 4);
        barrelsModel.position.set(334, 0, 427);
        //  console.log("Barrels Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        // }

        // Calculate dimensions of the barrels model
        const boundingBox = new THREE.Box3().setFromObject(barrelsModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        // console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Barrels model
        const barrelsModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const barrelsModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(334, 0, 427) // Initial position of the model
        });
        barrelsModelBody.addShape(barrelsModelShape);
        world.addBody(barrelsModelBody);

        // Uncomment and fix the rotation if needed
        // barrelsModel.rotation.y = Math.PI;

        scene.add(barrelsModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(334, 0, 427);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });


    //FREEDOM STATUE
    loader.load('/freedom_statue.glb', function (gltf) {
        const freedomStatueModel = gltf.scene;
        freedomStatueModel.scale.set(0.9, 0.9, 0.9);
        freedomStatueModel.position.set(38, 17, 235);
        //  console.log("Freedom Statue Model Properties:");
        // for (const property in freedomStatueModel) {
        //     console.log(`${property}:`, freedomStatueModel[property]);
        // }

        // Calculate dimensions of the freedom statue model
        const boundingBox = new THREE.Box3().setFromObject(freedomStatueModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Freedom Statue model
        const freedomStatueModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const freedomStatueModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(38, 17, 235)// Initial position of the model
        });
        freedomStatueModelBody.addShape(freedomStatueModelShape);
        world.addBody(freedomStatueModelBody);

        freedomStatueModel.rotation.y = Math.PI / 2;
        scene.add(freedomStatueModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(38, 17, 235);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });


    //BUSH
    loader.load('/bush.glb', function (gltf) {
        const bushModel = gltf.scene;
        bushModel.scale.set(8, 8, 8);
        bushModel.position.set(50, 1.2, 258);
        //  console.log("Bush Model Properties:");

        // Calculate dimensions of the bush model
        const boundingBox = new THREE.Box3().setFromObject(bushModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //   console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Bush model
        const bushModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const bushModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(50, 1.2, 258) // Initial position of the model
        });
        bushModelBody.addShape(bushModelShape);
        world.addBody(bushModelBody);

        //bushModel.rotation.y = Math.PI;
        scene.add(bushModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(50, 1.2, 258);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });



    //COCONUT TREE
    loader.load('/coconut_palm.glb', function (gltf) {
        const coconutPalmModel = gltf.scene;
        coconutPalmModel.scale.set(14, 14, 14);
        coconutPalmModel.position.set(300, 0, 200);
        //  console.log("Coconut Palm Model Properties:");
        //    for (const property in lionStatueModel) {
        //        console.log(`${property}:`, lionStatueModel[property]);
        //    }

        // Calculate dimensions of the lion statue model
        const boundingBox = new THREE.Box3().setFromObject(coconutPalmModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Lion Statue model
        const coconutPalmModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const coconutPalmModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(300, 0, 200)// Initial position of the model
        });
        coconutPalmModelBody.addShape(coconutPalmModelShape);
        world.addBody(coconutPalmModelBody);

        //coconutPalmModel.rotation.y = Math.PI;
        scene.add(coconutPalmModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(300, 0, 200);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    //COCONUT
    loader.load('/coconut.glb', function (gltf) {
        const coconutModel = gltf.scene;
        coconutModel.scale.set(2, 2, 2);
        coconutModel.position.set(285, 2.5, 205);
        //  console.log("Coconut Model Properties:");

        // Calculate dimensions of the coconut model
        const boundingBox = new THREE.Box3().setFromObject(coconutModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Coconut model
        const coconutModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const coconutModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(283, 2.5, 205)// Initial position of the model
        });
        coconutModelBody.addShape(coconutModelShape);
        world.addBody(coconutModelBody);

        //coconutModel.rotation.y = Math.PI;
        scene.add(coconutModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(285, 2.5, 205);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });


    //TREES NEAR WATCH TOWER
    loader.load('/small_trees.glb', function (gltf) {
        const smallTreesModel = gltf.scene;
        smallTreesModel.scale.set(12, 12, 12);
        smallTreesModel.position.set(40, 0, 320);
        //  console.log("Small Trees Model Properties:");

        // Calculate dimensions of the small trees model
        const boundingBox = new THREE.Box3().setFromObject(smallTreesModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //    console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Small Trees model
        const smallTreesModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const smallTreesModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(40, 0, 320) // Initial position of the model
        });
        smallTreesModelBody.addShape(smallTreesModelShape);
        world.addBody(smallTreesModelBody);

        smallTreesModel.rotation.y = Math.PI;
        scene.add(smallTreesModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(40, 0, 320);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });


    //BIRD BATH
    loader.load('/bird_bath.glb', function (gltf) {
        const birdBathModel = gltf.scene;
        birdBathModel.scale.set(12, 12, 12);
        birdBathModel.position.set(40, 0, 370);
        // console.log("Bird Bath Model Properties:");
        // for (const property in birdBathModel) {
        //     console.log(`${property}:`, birdBathModel[property]);
        // }

        // Calculate dimensions of the bird bath model
        const boundingBox = new THREE.Box3().setFromObject(birdBathModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Bird Bath model
        const birdBathModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const birdBathModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(40, 0, 370)// Initial position of the model
        });
        birdBathModelBody.addShape(birdBathModelShape);
        world.addBody(birdBathModelBody);

        //birdBathModel.rotation.y = Math.PI;
        scene.add(birdBathModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(40, 0, 370);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });


    //FERN 
    loader.load('/fern.glb', function (gltf) {
        const fernModel = gltf.scene;
        fernModel.scale.set(1.6, 1.6, 1.6);
        fernModel.position.set(46, 0, 376);
        //  console.log("Fern Model Properties:");

        // Calculate dimensions of the fern model
        const boundingBox = new THREE.Box3().setFromObject(fernModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //   console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Fern model
        const fernModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const fernModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(46, 0, 376) // Initial position of the model
        });
        fernModelBody.addShape(fernModelShape);
        world.addBody(fernModelBody);

        //fernModel.rotation.y = Math.PI;
        scene.add(fernModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(46, 0, 376);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });



    //WELL
    loader.load('/well.glb', function (gltf) {
        const wellModel = gltf.scene;
        wellModel.scale.set(20, 20, 20);
        wellModel.position.set(315, 19, 220);
        //  console.log("Well Model Properties:");

        // Calculate dimensions of the well model
        const boundingBox = new THREE.Box3().setFromObject(wellModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Well model
        const wellModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const wellModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(315, 19, 220) // Initial position of the model
        });
        wellModelBody.addShape(wellModelShape);
        world.addBody(wellModelBody);

        wellModel.rotation.y = -Math.PI / 4;
        scene.add(wellModel);

        // Create a wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(315, 19, 220);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });


    //WOODEN CRATE
    loader.load('/wooden_crate.glb', function (gltf) {
        const woodenCrateModel = gltf.scene; // Change the variable name
        woodenCrateModel.scale.set(10, 10, 10);
        woodenCrateModel.position.set(336, 0, 413);
        //  console.log("Wooden Crate Model Properties:"); // Update the log message
        // for (const property in woodenCrateModel) {
        //     console.log(`${property}:`, woodenCrateModel[property]);
        // }

        // Calculate dimensions of the wooden crate model
        const boundingBox = new THREE.Box3().setFromObject(woodenCrateModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        // console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Wooden Crate model
        const woodenCrateModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const woodenCrateModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(336, 0, 413) // Initial position of the model
        });
        woodenCrateModelBody.addShape(woodenCrateModelShape);
        world.addBody(woodenCrateModelBody);

        //woodenCrateModel.rotation.y = Math.PI; // You can apply rotation if needed
        scene.add(woodenCrateModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(336, 0, 413);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });



    //TREES NEAR WELL
    loader.load('/tree_1.glb', function (gltf) {
        const TreesModel = gltf.scene;
        TreesModel.scale.set(360, 360, 360);
        TreesModel.position.set(320, 0, 290);
        //  console.log("Trees Model Properties:");

        // Calculate dimensions of the Trees model
        const boundingBox = new THREE.Box3().setFromObject(TreesModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //  console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Trees model
        const TreesModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const TreesModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(320, 0, 290) // Initial position of the model
        });
        TreesModelBody.addShape(TreesModelShape);
        world.addBody(TreesModelBody);

        // TreesModel.rotation.y = Math.PI;
        scene.add(TreesModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(320, 0, 290);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/tree_2.glb', function (gltf) {
        const TreesModel = gltf.scene;
        TreesModel.scale.set(360, 360, 360);
        TreesModel.position.set(320, 0, 345);
        //   console.log("Trees Model Properties:");

        // Calculate dimensions of the Trees model
        const boundingBox = new THREE.Box3().setFromObject(TreesModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //   console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Trees model
        const TreesModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const TreesModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(320, 0, 345) // Initial position of the model
        });
        TreesModelBody.addShape(TreesModelShape);
        world.addBody(TreesModelBody);

        // TreesModel.rotation.y = Math.PI;
        scene.add(TreesModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(320, 0, 345);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    //ROCKS
    loader.load('/rocks.glb', function (gltf) {
        const rocksModel = gltf.scene;
        rocksModel.scale.set(0.3, 0.3, 0.3);
        rocksModel.position.set(315, 0, 345);
        //  console.log("Rocks Model Properties:");

        // Calculate dimensions of the rocks model
        const boundingBox = new THREE.Box3().setFromObject(rocksModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //   console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Rocks model
        const rocksModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const rocksModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(315, 0, 345) // Initial position of the model
        });
        rocksModelBody.addShape(rocksModelShape);
        world.addBody(rocksModelBody);

        // rocksModel.rotation.y = Math.PI;
        scene.add(rocksModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(315, 0, 345);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });


    //PURPLE PLANT
    loader.load('/purple_plant.glb', function (gltf) {
        const purplePlantModel = gltf.scene;
        purplePlantModel.scale.set(35, 35, 35);
        purplePlantModel.position.set(317, 0, 295);
        //    console.log("Purple Plant Model Properties:");
        // for (const property in purplePlantModel) {
        //     console.log(`${property}:`, purplePlantModel[property]);
        // }

        // Calculate dimensions of the purple plant model
        const boundingBox = new THREE.Box3().setFromObject(purplePlantModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //    console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Purple Plant model
        const purplePlantModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const purplePlantModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(317, 0, 295)// Initial position of the model
        });
        purplePlantModelBody.addShape(purplePlantModelShape);
        world.addBody(purplePlantModelBody);

        //purplePlantModel.rotation.y = Math.PI;
        scene.add(purplePlantModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(317, 0, 295);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/purple_plant.glb', function (gltf) {
        const purplePlantModel = gltf.scene;
        purplePlantModel.scale.set(35, 35, 35);
        purplePlantModel.position.set(314, 0, 290);
        //   console.log("Purple Plant Model Properties:");
        // for (const property in purplePlantModel) {
        //     console.log(`${property}:`, purplePlantModel[property]);
        // }

        // Calculate dimensions of the purple plant model
        const boundingBox = new THREE.Box3().setFromObject(purplePlantModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //    console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Purple Plant model
        const purplePlantModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const purplePlantModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(314, 0, 290) // Initial position of the model
        });
        purplePlantModelBody.addShape(purplePlantModelShape);
        world.addBody(purplePlantModelBody);

        //purplePlantModel.rotation.y = Math.PI;
        scene.add(purplePlantModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(314, 0, 290);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('/purple_plant.glb', function (gltf) {
        const purplePlantModel = gltf.scene;
        purplePlantModel.scale.set(35, 35, 35);
        purplePlantModel.position.set(317, 0, 285);
        //   console.log("Purple Plant Model Properties:");
        // for (const property in purplePlantModel) {
        //     console.log(`${property}:`, purplePlantModel[property]);
        // }

        // Calculate dimensions of the purple plant model
        const boundingBox = new THREE.Box3().setFromObject(purplePlantModel);
        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        //   console.log(`Box Dimensions: Width: ${width}, Height: ${height}, Depth: ${depth}`);

        // Add Cannon.js body for Purple Plant model
        const purplePlantModelShape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
        const purplePlantModelBody = new CANNON.Body({
            mass: 0, // Static object, so mass is 0
            position: new CANNON.Vec3(317, 0, 285) // Initial position of the model
        });
        purplePlantModelBody.addShape(purplePlantModelShape);
        world.addBody(purplePlantModelBody);

        //purplePlantModel.rotation.y = Math.PI;
        scene.add(purplePlantModel);

        // Create wireframe mesh for visualization
        const wireframeGeometry = new THREE.BoxGeometry(width, height - 3, depth);
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true
        });
        const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

        // Position the wireframe mesh at the same position as the model
        wireframeMesh.position.set(317, 0, 285);
        wireframeMesh.visible = false;

        // Add the wireframe mesh to the scene
        scene.add(wireframeMesh);
    }, undefined, function (error) {
        console.error(error);
    });

    
    addWallModels(loader, scene, world, blockWidth);

    let adjustmentInY = 0;
    let adjustmentInX = 2;
    let adjustmentInZ = 0;
    let startX = 0;
    let startY = 0;
    let startZ = blockWidth * 1.5;
    addGrassPatches(loader, scene, world, blockWidth, adjustmentInX, adjustmentInY, adjustmentInZ, startX, startY, startZ);

    adjustmentInY = 0;
    adjustmentInX = 2;
    adjustmentInZ = 0;
    startX = 0;
    startY = 0;
    startZ = blockWidth;
    addGrassPatches(loader, scene, world, blockWidth, adjustmentInX, adjustmentInY, adjustmentInZ, startX, startY, startZ);

    adjustmentInY = 0;
    adjustmentInX = 2;
    adjustmentInZ = 0;
    startX = -blockWidth;
    startY = 0;
    startZ = -blockWidth * 1.5;  
    addGrassPatches(loader, scene, world, blockWidth, adjustmentInX, adjustmentInY, adjustmentInZ, startX, startY, startZ);
}

function clonePatchesInRoom(model, posInX, posInY, posInZ) {
    let clone = model.clone();
    clone.position.set(posInX, posInY, posInZ);
}

function addGrassPatches(loader, scene, world, blockWidth, adjustmentInX, adjustmentInY, adjustmentInZ, startX, startY, startZ) {
    let pathToGrassPatch = 'assets/grass_patches_02/scene.gltf';

    loader.load(pathToGrassPatch, (gltf) => {
        const model = gltf.scene;

        model.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });

        scene.add(model);

        model.scale.set(10, 15, 10);
        model.position.set(startX, startY, startZ);

        let posInX = startX + adjustmentInX;
        let posInY = startY + adjustmentInY;
        let posInZ = startZ + adjustmentInZ; 
        for (let j = 0; j < 10; j++) {
            clonePatchesInRoom(model, posInX, posInY, posInZ);
            posInX += adjustmentInX;
            posInY += adjustmentInY;
            posInZ += adjustmentInZ;
        }

    }, undefined, (error) => {
        console.log(error);
    });
}

function addWallModels(loader, scene, world, blockWidth) {
    // For variation adjust scaling in z, y, x for narrower/extended walls or taller/shotter walls
    let pathToWall = 'assets/mossy_stone_wall/scene.gltf';
    let baselineShift = 25;
    let offsetCurvedEdgesShift = 27;
    // for wall spawn right
    let adjustment1 = 0;
    // Calculate the total width of the inner wall (including the gap)
    const totalWidth = blockWidth;
    const gapWidth = 50;

    // Calculate the width of each part of the inner wall
    const partWidth = (totalWidth - gapWidth) / 2;

    for (let i = 0; i < 13; i++) {
        loader.load(pathToWall, (gltf) => {
            const model = gltf.scene;
            model.traverse(function (node) {
                if (node.isMesh) { node.castShadow = true; }
            });
            // add to scene and position like any other object
            scene.add(model);
            model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
            model.position.set(blockWidth, 0, blockWidth + offsetCurvedEdgesShift + adjustment1);
            adjustment1 -= 67.5;
            model.rotateY(-Math.PI / 2);
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
            model.traverse(function (node) {
                if (node.isMesh) { node.castShadow = true; }
            });
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
            model.traverse(function (node) {
                if (node.isMesh) { node.castShadow = true; }
            });
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
            model.traverse(function (node) {
                if (node.isMesh) { node.castShadow = true; }
            });
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
            model.traverse(function (node) {
                if (node.isMesh) { node.castShadow = true; }
            });
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
            model.traverse(function (node) {
                if (node.isMesh) { node.castShadow = true; }
            });
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

    // lobby exit
    let adjustment8 = 0;
    for (let i = 0; i < 2; i++) {
        loader.load(pathToWall, (gltf) => {
            const modelLeft = gltf.scene;
            const modelRight = modelLeft.clone();

            modelLeft.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                }
            });
            modelRight.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                }
            });

            scene.add(modelLeft);
            scene.add(modelRight);
            // I must position two models at the same place in one coordinate so maybe add model twice or just different variables
            // try work on one side for now before other side
            let height = generateRandomNumberForVariation();
            let depth = generateRandomNumberForVariation();
            let positionX = blockWidth / 2;
            let positionY = 0;
            let positionZ = blockWidth / 2;
            modelLeft.scale.set(0.2, height, depth);
            modelLeft.position.set((positionX - partWidth / 2 - gapWidth / 2) - offsetCurvedEdgesShift - 35 - adjustment8, positionY, positionZ);

            modelRight.scale.set(0.2, height, depth);
            modelRight.position.set((positionX - partWidth / 2 + gapWidth / 2) + offsetCurvedEdgesShift + 139 + adjustment8, positionY, positionZ);

            adjustment8 -= 18.7;
            // model.rotateY(-Math.PI / 2);
        }, undefined, (error) => {
            console.log(error);
        });
    }
    // puzzle 1 exit
    let adjustment9 = 0;
    for (let i = 0; i < 2; i++) {
        loader.load(pathToWall, (gltf) => {
            const modelLeft = gltf.scene;
            const modelRight = modelLeft.clone();
            modelLeft.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                }
            });
            modelRight.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                }
            });
            scene.add(modelLeft);
            scene.add(modelRight);
            // I must position two models at the same place in one coordinate so maybe add model twice or just different variables
            // try work on one side for now before other side
            let height = generateRandomNumberForVariation();
            let depth = generateRandomNumberForVariation();
            let positionX = blockWidth / 2;
            let positionY = 0;
            let positionZ = - blockWidth / 2;
            modelLeft.scale.set(0.2, height, depth);
            modelLeft.position.set((positionX - partWidth / 2 - gapWidth / 2) - offsetCurvedEdgesShift - 35 - adjustment9, positionY, positionZ + 20);

            modelRight.scale.set(0.2, height, depth);
            modelRight.position.set((positionX - partWidth / 2 + gapWidth / 2) + offsetCurvedEdgesShift + 139 + adjustment9, positionY, positionZ + 20);

            adjustment9 -= 18.7;
        }, undefined, (error) => {
            console.log(error);
        });
    }
    // puzzle 2 exit
    let adjustment10 = 0;
    for (let i = 0; i < 2; i++) {
        loader.load(pathToWall, (gltf) => {
            const modelLeft = gltf.scene;
            const modelRight = modelLeft.clone();

            modelLeft.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                }
            });
            modelRight.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                }
            });

            scene.add(modelLeft);
            scene.add(modelRight);
            // I must position two models at the same place in one coordinate so maybe add model twice or just different variables
            // try work on one side for now before other side
            let height = generateRandomNumberForVariation();
            let depth = generateRandomNumberForVariation();
            let positionX = 0;
            let positionY = 0;
            let positionZ = - blockWidth;
            modelLeft.scale.set(0.2, height, depth);
            modelLeft.position.set(positionX - 33.5, positionY, positionZ - offsetCurvedEdgesShift - partWidth / 2 - gapWidth / 2);

            modelRight.scale.set(0.2, height, depth);
            modelRight.position.set(positionX - 33.5, positionY, positionZ + partWidth / 2 + gapWidth / 2);

            adjustment10 -= 18.7;

            modelLeft.rotateY(-Math.PI / 2);
            modelRight.rotateY(-Math.PI / 2);
        }, undefined, (error) => {
            console.log(error);
        });
    }
}