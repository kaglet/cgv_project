import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ceilingtextureImage from '../img/lambert1_baseColor.png';

export const modelsToLoad = []


function cloneModel(model, positon, rotation, scale) {
    const clonedModel = model.clone();
    clonedModel.scale.set(scale);
    clonedModel.position.set(position);
    clonedModel.rotation.set(rotation)

    scene.add(clonedModel);
}

function generateRandomNumberForVariation() {
    // Generate a random nubmer between 0.1 and 0.3
    return Math.random() * 0.1 + 0.2;
}





function trees() {
    const numTrees = 2;
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

    const totalModels = 2; // The total number of models to load (2 in this case)

    function generateTreePositions(modelPath, scale, num) {
        const positions = [];

        for (let i = 0; i < numTrees; i++) {
            const randomAngle = seededRandom(num + i) * Math.PI * 2;
            const randomDistance = minDistanceFromCenter + (seededRandom(num - i) * (maxDistanceFromCenter - minDistanceFromCenter));
            const randomYRotation = Math.random() * Math.PI * 2;
            const randomX = center.x + randomDistance * Math.cos(randomAngle);
            const randomZ = center.z + randomDistance * Math.sin(randomAngle);

            positions.push({
                modelPath: modelPath,
                scale: scale,
                position: [randomX, 0, randomZ],
                rotation: randomYRotation,
            });
        }

        return positions;
    }

    const coconutTreePositions = generateTreePositions('./coconut_tree/scene.gltf', 0.1, randomSeed1);
    const bendedCoconutTreePositions = generateTreePositions('./bended_coconut_tree/scene.gltf', 0.1, randomSeed2);

    modelsToLoad.push(...coconutTreePositions, ...bendedCoconutTreePositions);
}


// function plants(loader, scene, world) {
//     const centers = [];
//     const blockWidth = 350;
//     centers.push(new THREE.Vector3(blockWidth / 2, 0, blockWidth / 2 - 9));
//     centers.push(new THREE.Vector3(blockWidth / 2, 0, -blockWidth / 2 + 9));
//     centers.push(new THREE.Vector3(-24.5, 0, -blockWidth));

//     const numPlants = 100;
//     const minDistanceFromCenter = 0;
//     const maxDistanceFromCenter = 350;

//     // Create a seeded random number generator
//     function seededRandom(seed) {
//         let x = Math.sin(seed) * 10000;
//         return x - Math.floor(x);
//     }

//     const modelsToLoad = [
//         './assets/shrub_pack/scene.gltf',
//         './assets/tropical_plant/scene.gltf',
//         './assets/tropical_plant_2/scene.gltf',
//         './assets/tropical_plant_monstera_deliciosa/scene.gltf',
//         './assets/tropical_plant_3/scene.gltf'
//     ];

//     // Load all models first
//     const loadedModels = [];
//     const loadModelPromises = modelsToLoad.map((modelPath) => {
//         return new Promise((resolve) => {
//             loader.load(modelPath, (gltf) => {
//                 const model = gltf.scene;
//                 loadedModels.push(model);
//                 resolve();
//             });
//         });
//     });

//     Promise.all(loadModelPromises).then(() => {
//         // Loop through the loaded models
//         loadedModels.forEach((model, modelIndex) => {
//             const scaleFactors = [1.5, 2, 0.025, 6, 6]; // Modify scale factors accordingly

//             for (let centerIndex = 0; centerIndex < centers.length; centerIndex++) {
//                 for (let i = 0; i < numPlants; i++) {
//                     const plantModel = model.clone();
//                     const randomAngle = seededRandom(100 * (modelIndex + 1) + i) * Math.PI * 2;
//                     const randomDistance = minDistanceFromCenter + (seededRandom(100 * (modelIndex + 1) - i) * (maxDistanceFromCenter - minDistanceFromCenter));
//                     const randomYRotation = Math.random() * Math.PI * 2;
//                     const randomX = centers[centerIndex].x + randomDistance * Math.cos(randomAngle);
//                     const randomZ = centers[centerIndex].z + randomDistance * Math.sin(randomAngle);
//                     const groundHeight = 0.1;

//                     plantModel.scale.set(scaleFactors[modelIndex], scaleFactors[modelIndex], scaleFactors[modelIndex]);
//                     plantModel.position.set(randomX, groundHeight, randomZ);
//                     plantModel.rotation.y = randomYRotation;

//                     scene.add(plantModel);
//                 }
//             }
//         });
//     });
// }

function plants(modelsToLoad) {
    const centers = [];
    const blockWidth = 350;
    centers.push(new THREE.Vector3(blockWidth / 2, 0, blockWidth / 2 - 9));
    centers.push(new THREE.Vector3(blockWidth / 2, 0, -blockWidth / 2 + 9));
    centers.push(new THREE.Vector3(-24.5, 0, -blockWidth));

    const numPlants = 2;
    const minDistanceFromCenter = 0;
    const maxDistanceFromCenter = 350;

    // Create a seeded random number generator
    function seededRandom(seed) {
        let x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    const models = [
        { modelPath: './assets/shrub_pack/scene.gltf', scale: 1.5 },
        { modelPath: './assets/tropical_plant/scene.gltf', scale: 2 },
        { modelPath: './assets/tropical_plant_2/scene.gltf', scale: 0.025 },
        { modelPath: './assets/tropical_plant_monstera_deliciosa/scene.gltf', scale: 6 },
        { modelPath: './assets/tropical_plant_3/scene.gltf', scale: 6 }
    ];

    // Loop through the models to load
    models.forEach((modelDescription, modelIndex) => {
        const modelPath = modelDescription.modelPath;
        const scale = modelDescription.scale;

        for (let centerIndex = 0; centerIndex < centers.length; centerIndex++) {
            for (let i = 0; i < numPlants; i++) {
                const randomAngle = seededRandom(100 * (modelIndex + 1) + i) * Math.PI * 2;
                const randomDistance = minDistanceFromCenter + (seededRandom(100 * (modelIndex + 1) - i) * (maxDistanceFromCenter - minDistanceFromCenter));
                const randomYRotation = Math.random() * Math.PI * 2;
                const randomX = centers[centerIndex].x + randomDistance * Math.cos(randomAngle);
                const randomZ = centers[centerIndex].z + randomDistance * Math.sin(randomAngle);

                // Push the position data to modelsToLoad
                modelsToLoad.push({
                    modelPath: modelPath,
                    scale: scale,
                    position: [randomX, 0.1, randomZ],
                    rotation: randomYRotation,
                });
            }
        }
    });
}


function loadAndSetupModels(loader, scene, world, models) {
    models.forEach(modelDescription => {
        const { modelPath, scale, position, rotation } = modelDescription;

        loader.load(modelPath, function (gltf) {
            const model = gltf.scene;
            model.traverse(function (node) {
                if (node.isMesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                }
            });
            model.scale.set(scale, scale, scale);
            model.position.set(...position);

            // const boundingBox = new THREE.Box3().setFromObject(model);
            // const width = boundingBox.max.x - boundingBox.min.x;
            // const height = boundingBox.max.y - boundingBox.min.y;
            // const depth = boundingBox.max.z - boundingBox.min.z;

            // const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
            // const body = new CANNON.Body({
            //     mass: 0,
            //     position: new CANNON.Vec3(...position)
            // });
            // body.addShape(shape);
            // world.addBody(body);

            model.rotation.y = rotation;
            scene.add(model);
        }, undefined, function (error) {
            console.error(error);
        });
    });
}


function lobby(loader, scene, world) {
    //  modelsToLoad.push({ modelPath: 'open3.glb', scale: 1, position: [200, 0,2], rotation:0 });
    modelsToLoad.push({ modelPath: '/dungeon.glb', scale: 15, position: [106, 17, 487], rotation: Math.PI / 2 });
    modelsToLoad.push({ modelPath: '/dungeon.glb', scale: 15, position: [245, 17, 487], rotation: Math.PI / 2 });
    modelsToLoad.push({ modelPath: '/watch_tower.glb', scale: 0.2, position: [18, 2, 507], rotation: Math.PI / 2 });
    modelsToLoad.push({ modelPath: '/bench.glb', scale: 14, position: [172, 3.5, 435], rotation: 0 });
    modelsToLoad.push({ modelPath: '/barrels.glb', scale: 4, position: [334, 0, 427], rotation: 0 });
    modelsToLoad.push({ modelPath: '/bush.glb', scale: 8, position: [50, 1.2, 258], rotation: 0 });
    modelsToLoad.push({ modelPath: '/coconut_palm.glb', scale: 14, position: [300, 0, 200], rotation: 0 });
    modelsToLoad.push({ modelPath: '/coconut.glb', scale: 2, position: [285, 2.5, 205], rotation: 0 });
    modelsToLoad.push({ modelPath: '/small_trees.glb', scale: 12, position: [40, 0, 320], rotation: 0 });
    modelsToLoad.push({ modelPath: '/bird_bath.glb', scale: 12, position: [40, 0, 370], rotation: 0 });
    modelsToLoad.push({ modelPath: '/fern.glb', scale: 1.6, position: [46, 0, 376], rotation: 0 });
    modelsToLoad.push({ modelPath: '/well.glb', scale: 15, position: [-205, 15, -380], rotation: 0 });
    modelsToLoad.push({ modelPath: '/boer_war_statue.glb', scale: 1.5, position: [-205, -10, -300], rotation: 0 });
    modelsToLoad.push({ modelPath: '/wooden_crate.glb', scale: 10, position: [336, 0, 413], rotation: Math.PI / 2 });
    modelsToLoad.push({ modelPath: '/tree_1.glb', scale: 360, position: [320, 0, 290], rotation: Math.PI });
    modelsToLoad.push({ modelPath: '/tree_2.glb', scale: 360, position: [320, 0, 345], rotation: Math.PI });
    modelsToLoad.push({ modelPath: '/rocks.glb', scale: 0.3, position: [315, 0, 345], rotation: Math.PI });
    modelsToLoad.push({ modelPath: '/purple_plant.glb', scale: 35, position: [317, 0, 295], rotation: 0 });
    modelsToLoad.push({ modelPath: '/purple_plant.glb', scale: 35, position: [314, 0, 290], rotation: 0 });
    modelsToLoad.push({ modelPath: '/purple_plant.glb', scale: 35, position: [317, 0, 285], rotation: 0 });
    modelsToLoad.push({ modelPath: '/wall_ruins.glb', scale: 30, position: [-6, 0, 416], rotation: Math.PI / 2 });
    modelsToLoad.push({ modelPath: '/wall_ruins.glb', scale: 30, position: [278, 0, 416], rotation: Math.PI / 2 });
    modelsToLoad.push({ modelPath: '/wall_ruins.glb', scale: 30, position: [135, 0, 416], rotation: Math.PI / 2 });


}

function loadLevel4Models() {
    modelsToLoad.push({ modelPath: '/tut1(12).glb', scale: 0.95, position: [195, 0, 350], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/openlvl3(3).glb', scale: 1.1, position: [-200, 0, -350], rotation: 0 });
    //  modelsToLoad.push({ modelPath: '/openlvl2(3).glb', scale: 1.1, position: [230, 0, -348], rotation:0 });
}

export function loadLevel1Models(loader, scene, world) {
    modelsToLoad.length = 0;
    modelsToLoad.push({ modelPath: '/open(32).glb', scale: 1.05, position: [203, 2, 10], rotation: 0 });
    loadAndSetupModels(loader, scene, world, modelsToLoad);
}



export function loadLevel2Models(loader, scene, world) {
    modelsToLoad.length = 0;
    //modelsToLoad.push({ modelPath: '/openlvl2(3).glb', scale: 1.05, position: [200, 2, -353], rotation:0 });
    modelsToLoad.push({ modelPath: '/openlvl2(3).glb', scale: 1.1, position: [235, 0, -340], rotation: 0 });
    loadAndSetupModels(loader, scene, world, modelsToLoad);
}


export function loadLevel3Models(loader, scene, world) {
    modelsToLoad.length = 0;
    // modelsToLoad.push({ modelPath: '/openlvl3(3).glb', scale: 1.1, position: [-200, 0, -350], rotation: 0 });
    modelsToLoad.push({ modelPath: '/openlvl3(3).glb', scale: 1.1, position: [-210, 0, -350], rotation: 0 });
    loadAndSetupModels(loader, scene, world, modelsToLoad);
}



function generateGrassPatches(loader, scene, world, blockWidth, adjustmentInX, adjustmentInY, adjustmentInZ, startX, startY, startZ) {
    let pathToGrassPatch = 'assets/grass_patches_02/scene.gltf';

    loader.load(pathToGrassPatch, (gltf) => {
        const model = gltf.scene;


        model.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
            }
        });

        scene.add(model);

        model.scale.set(5, 7, 5);
        model.position.set(startX, startY, startZ);

        let posInX = startX + adjustmentInX;
        let posInY = startY + adjustmentInY;
        let posInZ = startZ + adjustmentInZ;

        const numClones = 10;

        // Create a seeded random number generator
        function seededRandom(seed) {
            let x = Math.sin(seed) * 10000;
            return x - Math.floor(x);
        }

        for (let j = 0; j < numClones; j++) {
            const clonedModel = model.clone();

            // Use the seeded random function to generate consistent random positions
            const randomSeed = j * 10; // Adjust as needed
            const randomAdjustmentX = seededRandom(randomSeed) * adjustmentInX;
            const randomAdjustmentY = seededRandom(randomSeed) * adjustmentInY;
            const randomAdjustmentZ = seededRandom(randomSeed) * adjustmentInZ;

            clonedModel.position.set(posInX + randomAdjustmentX, posInY + randomAdjustmentY, posInZ + randomAdjustmentZ);
            scene.add(clonedModel);

            posInX += adjustmentInX;
            posInY += adjustmentInY;
            posInZ += adjustmentInZ;
        }
    }, undefined, (error) => {
        console.log(error);
    });
}

function statues(loader, scene, world) {

    const modelsData = [
        { path: '/luffy.glb', position: new THREE.Vector3(225, -2, -385), scale: new THREE.Vector3(0.15, 0.15, 0.15) },
        { path: '/zeus_statue.glb', position: new THREE.Vector3(145, -2, -400), scale: new THREE.Vector3(1, 1, 1) },
        { path: '/lion_statue.glb', position: new THREE.Vector3(103, -5, 50), scale: new THREE.Vector3(30, 30, 30) },
        { path: '/batman.glb', position: new THREE.Vector3(227, 0, -71), scale: new THREE.Vector3(15, 15, 15) }
    ];

    const modelPromises = [];

    modelsData.forEach(modelInfo => {
        const promise = new Promise((resolve, reject) => {
            loader.load(modelInfo.path, function (gltf) {
                const model = gltf.scene;
                model.position.copy(modelInfo.position);
                model.scale.copy(modelInfo.scale);

                const textureLoader = new THREE.TextureLoader();
                const texture = textureLoader.load(ceilingtextureImage); // Load your respective texture image here

                const pngMaterial = new THREE.MeshLambertMaterial({ map: texture });
                model.traverse(function (child) {
                    if (child.isMesh) {
                        child.material = pngMaterial;
                    }
                });

                const boundingBox = new THREE.Box3().setFromObject(model);
                const width = boundingBox.max.x - boundingBox.min.x;
                const height = boundingBox.max.y - boundingBox.min.y;
                const depth = boundingBox.max.z - boundingBox.min.z;

                const shape = new CANNON.Box(new CANNON.Vec3(width / 1.5, height / 1.5, depth / 1.5));
                const body = new CANNON.Body({
                    mass: 0, // Static object, so mass is 0
                    position: new CANNON.Vec3(modelInfo.position.x, modelInfo.position.y, modelInfo.position.z) // Initial position of the model
                });
                body.addShape(shape);
                world.addBody(body);

                scene.add(model);
                resolve();
            }, undefined, function (error) {
                reject(error);
            });
        });
        modelPromises.push(promise);
    });

    // Wait for all models to be loaded, textures applied, and physics bodies to be added
    Promise.all(modelPromises)
        .then(() => {
            console.log('All models loaded successfully.');
            // Your code to execute after all models are loaded.
        })
        .catch(error => {
            console.error('Error loading models:', error);
        });



}


export function loadModels(loader, scene, world, blockWidth) {

    // trees();
    // //plants();
    //
    // modelsToLoad.push({ modelPath: '/ground_material.glb', scale: 1, position: [0, -1, 0], rotation: Math.PI / 2 });
    // modelsToLoad.push({ modelPath: '/lion_statue.glb', scale: 30, position: [103, -5, 50], rotation: 0 });

    lobby(loader, scene, world);
    loadLevel4Models();
    loadAndSetupModels(loader, scene, world, modelsToLoad);

    statues(loader, scene, world);

    generateGrassPatches(loader, scene, world, blockWidth, 100, 0, 100, 100, 0, blockWidth);
    generateGrassPatches(loader, scene, world, blockWidth, 100, 0, 100, 100, 0, 0);
    generateGrassPatches(loader, scene, world, blockWidth, 100, 0, 100, -blockWidth, 0, -blockWidth);
    generateGrassPatches(loader, scene, world, blockWidth, 100, 0, 100, 0, 0, -blockWidth);



}

