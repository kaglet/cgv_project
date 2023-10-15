import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModels(loader, scene, world){
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
}