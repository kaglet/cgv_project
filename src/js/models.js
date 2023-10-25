import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ceilingtextureImage from '../img/lambert1_baseColor.png';

const modelsToLoad = []


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
    const numTrees = 100;
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

    const numPlants = 100;
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
            model.scale.set(scale, scale, scale);
            model.position.set(...position);

            const boundingBox = new THREE.Box3().setFromObject(model);
            const width = boundingBox.max.x - boundingBox.min.x;
            const height = boundingBox.max.y - boundingBox.min.y;
            const depth = boundingBox.max.z - boundingBox.min.z;

            const shape = new CANNON.Box(new CANNON.Vec3(width / 2, height / 2, depth / 2));
            const body = new CANNON.Body({
                mass: 0,
                position: new CANNON.Vec3(...position)
            });
            body.addShape(shape);
            world.addBody(body);

            model.rotation.y = rotation;
            scene.add(model);
        }, undefined, function (error) {
            console.error(error);
        });
    });
}


function lobby(loader, scene, world) {
    modelsToLoad.push({ modelPath: 'open3.glb', scale: 1, position: [200, 0,2], rotation:0 });
    // modelsToLoad.push({ modelPath: '/dungeon.glb', scale: 15, position: [106, 17, 487], rotation: Math.PI / 2 });
    // modelsToLoad.push({ modelPath: '/dungeon.glb', scale: 15, position: [245, 17, 487], rotation: Math.PI / 2 });
    // modelsToLoad.push({ modelPath: '/watch_tower.glb', scale: 0.2, position: [18, 2, 507], rotation: Math.PI / 2 });
    // modelsToLoad.push({ modelPath: '/bench.glb', scale: 14, position: [172, 3.5, 435], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/barrels.glb', scale: 4, position: [334, 0, 427], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/bush.glb', scale: 8, position: [50, 1.2, 258], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/coconut_palm.glb', scale: 14, position: [300, 0, 200], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/coconut.glb', scale: 2, position: [285, 2.5, 205], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/small_trees.glb', scale: 12, position: [40, 0, 320], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/bird_bath.glb', scale: 12, position: [40, 0, 370], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/fern.glb', scale: 1.6, position: [46, 0, 376], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/well.glb', scale: 15, position: [-205, 15, -380], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/boer_war_statue.glb', scale: 1.5, position: [-205, -10, -300], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/wooden_crate.glb', scale: 10, position: [336, 0, 413], rotation: Math.PI / 2 });
    // modelsToLoad.push({ modelPath: '/tree_1.glb', scale: 360, position: [320, 0, 290], rotation: Math.PI });
    // modelsToLoad.push({ modelPath: '/tree_2.glb', scale: 360, position: [320, 0, 345], rotation: Math.PI });
    // modelsToLoad.push({ modelPath: '/rocks.glb', scale: 0.3, position: [315, 0, 345], rotation: Math.PI });
    // modelsToLoad.push({ modelPath: '/purple_plant.glb', scale: 35, position: [317, 0, 295], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/purple_plant.glb', scale: 35, position: [314, 0, 290], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/purple_plant.glb', scale: 35, position: [317, 0, 285], rotation: 0 });
    // modelsToLoad.push({ modelPath: '/wall_ruins.glb', scale: 30, position: [-6, 0, 416], rotation: Math.PI / 2 });
    // modelsToLoad.push({ modelPath: '/wall_ruins.glb', scale: 30, position: [278, 0, 416], rotation: Math.PI / 2 });
    // modelsToLoad.push({ modelPath: '/wall_ruins.glb', scale: 30, position: [135, 0, 416], rotation: Math.PI / 2 });


}




export function loadModels(loader, scene, world, blockWidth) {

    // trees();
    // //plants();
    //
    // modelsToLoad.push({ modelPath: '/ground_material.glb', scale: 1, position: [0, -1, 0], rotation: Math.PI / 2 });
    // modelsToLoad.push({ modelPath: '/lion_statue.glb', scale: 30, position: [103, -5, 50], rotation: 0 });

    // lobby(loader, scene, world);
    // Create a new loader instance
    //const loader = new THREE.GLTFLoader();

// Path to your GLB/GLTF model file
    const modelPath = '/open3(48.5mb).glb';
    const modelPath2 = '/openlvl2(48.5mb).glb';
    const modelPath3 = '/openlevel3(46mb).glb';
    const modelPath4 = '/tut1(49.4mb).glb';

// Function to be called when the model is loaded successfully
    function onLoad(gltf, position, scale) {
        // Your logic when the model is loaded
        gltf.scene.position.set(position.x, position.y, position.z);
        gltf.scene.scale.set(scale.x, scale.y, scale.z);
        scene.add(gltf.scene);
        console.log('Model Loaded Successfully:', gltf);
    }

    function onProgress(xhr) {
        // Calculate the loading progress in percentage
        if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            console.log(`Model Loading: ${percentComplete.toFixed(2)}% loaded`);
        } else {
            console.log('Model Loading: Progress information not available');
        }
    }

    function onError(error) {
        console.error('Error loading the model', error);
    }

    loader.load(modelPath, (gltf) => onLoad(gltf, { x: 203, y: 2, z: 10 }, { x: 1.1, y: 1.1, z: 1.1000 }), onProgress, onError);
    loader.load(modelPath2, (gltf) => onLoad(gltf, { x: 217, y: 2, z: -358 }, { x: 1.05, y: 1.05, z: 1.05 }), onProgress, onError);
    loader.load(modelPath3, (gltf) => onLoad(gltf, { x: -200, y: 0, z: -345 }, { x: 1.1, y: 1.1, z: 1.1 }), onProgress, onError);
    loader.load(modelPath4, (gltf) => onLoad(gltf, { x: 195, y: 0, z: 340 }, { x: 0.95, y: 0.95, z: 0.95 }), onProgress, onError);

//   }  addWallModels(loader, scene, world, blockWidth);
//
//
//
//     // First set of grass patches
//     generateGrassPatches(loader, scene, world, blockWidth, 100, 0, 100, 100, 0, blockWidth);
//
//     // Second set of grass patches
//     generateGrassPatches(loader, scene, world, blockWidth, 100, 0, 100, 100, 0, 0);
//
//     // Third set of grass patches
//     generateGrassPatches(loader, scene, world, blockWidth, 100, 0, 100, -blockWidth, 0, -blockWidth);
//
//     const lambertMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Black color
//
//     // Loader to load the texture
//     const textureLoader = new THREE.TextureLoader();
//     const texture = textureLoader.load('../img/lambert1_baseColor'); // Replace with the path to your texture file
//
//     const textureScaleX = 0.1; // Adjust the texture tiling in the X direction
//     const textureScaleY = 0.110; // Adjust the texture tiling in the Y direction
//
//     // Apply texture transformation matrix for tiling
//     texture.matrixAutoUpdate = false; // Prevent Three.js from auto-updating texture matrix
//     texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//
//     // Set texture matrix to control tiling
//     const textureMatrix = new THREE.Matrix4().identity();
//     textureMatrix.scale(new THREE.Vector3(textureScaleX, textureScaleY, 1)); // Scale texture coordinates
//     texture.matrix = textureMatrix;
//     // Apply the texture to the Lambert material
//     lambertMaterial.map = texture;
//
//     loadAndSetupModels(loader, scene, world, modelsToLoad);
//
// }
//
// function clonePatchesInRoom(model, posInX, posInY, posInZ) {
//     let clone = model.clone();
//     clone.position.set(posInX, posInY, posInZ);
// }
//
// function generateGrassPatches(loader, scene, world, blockWidth, adjustmentInX, adjustmentInY, adjustmentInZ, startX, startY, startZ) {
//     let pathToGrassPatch = 'assets/grass_patches_02/scene.gltf';
//
//     loader.load(pathToGrassPatch, (gltf) => {
//         const model = gltf.scene;
//
//
//         model.traverse(function (node) {
//             if (node.isMesh) {
//                 node.castShadow = true;
//             }
//         });
//
//         scene.add(model);
//
//         model.scale.set(5, 7, 5);
//         model.position.set(startX, startY, startZ);
//
//         let posInX = startX + adjustmentInX;
//         let posInY = startY + adjustmentInY;
//         let posInZ = startZ + adjustmentInZ;
//
//         const numClones = 10;
//
//         // Create a seeded random number generator
//         function seededRandom(seed) {
//             let x = Math.sin(seed) * 10000;
//             return x - Math.floor(x);
//         }
//
//         for (let j = 0; j < numClones; j++) {
//             const clonedModel = model.clone();
//
//             // Use the seeded random function to generate consistent random positions
//             const randomSeed = j * 10; // Adjust as needed
//             const randomAdjustmentX = seededRandom(randomSeed) * adjustmentInX;
//             const randomAdjustmentY = seededRandom(randomSeed) * adjustmentInY;
//             const randomAdjustmentZ = seededRandom(randomSeed) * adjustmentInZ;
//
//             clonedModel.position.set(posInX + randomAdjustmentX, posInY + randomAdjustmentY, posInZ + randomAdjustmentZ);
//             scene.add(clonedModel);
//
//             posInX += adjustmentInX;
//             posInY += adjustmentInY;
//             posInZ += adjustmentInZ;
//         }
//     }, undefined, (error) => {
//         console.log(error);
//     });
// }
//
//
// function addWallModels(loader, scene, world, blockWidth) {
//     // For variation adjust scaling in z, y, x for narrower/extended walls or taller/shotter walls
//     let pathToWall = 'assets/mossy_stone_wall/scene.gltf';
//     let baselineShift = 25;
//     let offsetCurvedEdgesShift = 27;
//     // for wall spawn right
//     let adjustment1 = 0;
//     // Calculate the total width of the inner wall (including the gap)
//     const totalWidth = blockWidth;
//     const gapWidth = 50;
//
//     // Calculate the width of each part of the inner wall
//     const partWidth = (totalWidth - gapWidth) / 2;
//
//     for (let i = 0; i < 13; i++) {
//         loader.load(pathToWall, (gltf) => {
//             const model = gltf.scene;
//             // model.traverse(function (node) {
//             //     if (node.isMesh) { node.castShadow = true; }
//             // });
//             // add to scene and position like any other object
//             scene.add(model);
//             model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
//             model.position.set(blockWidth, 0, blockWidth + offsetCurvedEdgesShift + adjustment1);
//             adjustment1 -= 67.5;
//             model.rotateY(-Math.PI / 2);
//         }, undefined, (error) => {
//             console.log(error);
//         });
//     }
//
//
//     // // for wall spawn back
//     let adjustment2 = 0;
//     for (let i = 0; i < 3; i++) {
//         loader.load(pathToWall, (gltf) => {
//             const model = gltf.scene;
//             // add to scene and position like any other object
//             // model.traverse(function (node) {
//             //     if (node.isMesh) { node.castShadow = true; }
//             // });
//             scene.add(model);
//
//             model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
//             model.position.set(blockWidth / 2 + 25 + adjustment2, 0, blockWidth * 1.5 + baselineShift);
//             adjustment2 -= 62;
//         }, undefined, (error) => {
//             console.log(error);
//         });
//     }
//     // // TODO: Merge them differently by setting adjustment to a random number but definitely make sure iteration number allows it to definitely be filled even if minimum value is used
//     // // for wall spawn left
//     let adjustment3 = 0;
//     for (let i = 0; i < 7; i++) {
//         loader.load(pathToWall, (gltf) => {
//             const model = gltf.scene;
//             // model.traverse(function (node) {
//             //     if (node.isMesh) { node.castShadow = true; }
//             // });
//             // add to scene and position like any other object
//             scene.add(model);
//
//             model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
//             model.position.set(-baselineShift, 0, blockWidth + offsetCurvedEdgesShift + adjustment3);
//             adjustment3 -= 75;
//             model.rotateY(-Math.PI / 2);
//         }, undefined, (error) => {
//             console.log(error);
//         });
//     }
//
//     // // for puzz 2 back
//     let adjustment4 = 0;
//     for (let i = 0; i < 8; i++) {
//         loader.load(pathToWall, (gltf) => {
//             const model = gltf.scene;
//             // model.traverse(function (node) {
//             //     if (node.isMesh) { node.castShadow = true; }
//             // });
//             // add to scene and position like any other object
//             scene.add(model);
//
//             model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
//             model.position.set(blockWidth / 2 + offsetCurvedEdgesShift + adjustment4, 0, -blockWidth * 1.5);
//             adjustment4 -= 68;
//             // model.rotateY(-Math.PI / 2);
//         }, undefined, (error) => {
//             console.log(error);
//         });
//     }
//
//     // // for puzz 3 left
//     let adjustment6 = 0;
//     for (let i = 0; i < 3; i++) {
//         loader.load(pathToWall, (gltf) => {
//             const model = gltf.scene;
//             // model.traverse(function (node) {
//             //     if (node.isMesh) { node.castShadow = true; }
//             // });
//             // add to scene and position like any other object
//             scene.add(model);
//
//             model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
//             model.position.set(-blockWidth / 2 + adjustment6, 0, -blockWidth / 2 + baselineShift);
//             adjustment6 -= 50;
//             // model.rotateY(-Math.PI / 2);
//         }, undefined, (error) => {
//             console.log(error);
//         });
//     }
//
//     // // for puzz 3 back
//     let adjustment7 = 0;
//     for (let i = 0; i < 2; i++) {
//         loader.load(pathToWall, (gltf) => {
//             const model = gltf.scene;
//             // model.traverse(function (node) {
//             //     if (node.isMesh) { node.castShadow = true; }
//             // });
//             // add to scene and position like any other object
//             scene.add(model);
//
//             model.scale.set(0.3, generateRandomNumberForVariation(), generateRandomNumberForVariation());
//             model.position.set(-blockWidth - baselineShift, 0, -blockWidth + offsetCurvedEdgesShift + adjustment7);
//             adjustment7 -= 120;
//             model.rotateY(-Math.PI / 2);
//         }, undefined, (error) => {
//             console.log(error);
//         });
//     }
//
//     // lobby exit
//     let adjustment8 = 0;
//     for (let i = 0; i < 2; i++) {
//         loader.load(pathToWall, (gltf) => {
//             const modelLeft = gltf.scene;
//             const modelRight = modelLeft.clone();
//
//             // modelLeft.traverse(function (node) {
//             //     if (node.isMesh) {
//             //         node.castShadow = true;
//             //     }
//             // });
//             // modelRight.traverse(function (node) {
//             //     if (node.isMesh) {
//             //         node.castShadow = true;
//             //     }
//             // });
//
//             scene.add(modelLeft);
//             scene.add(modelRight);
//             // I must position two models at the same place in one coordinate so maybe add model twice or just different variables
//             // try work on one side for now before other side
//             let height = generateRandomNumberForVariation();
//             let depth = generateRandomNumberForVariation();
//             let positionX = blockWidth / 2;
//             let positionY = 0;
//             let positionZ = blockWidth / 2;
//             modelLeft.scale.set(0.2, height, depth);
//             modelLeft.position.set((positionX - partWidth / 2 - gapWidth / 2) - offsetCurvedEdgesShift - 35 - adjustment8, positionY, positionZ);
//
//             modelRight.scale.set(0.2, height, depth);
//             modelRight.position.set((positionX - partWidth / 2 + gapWidth / 2) + offsetCurvedEdgesShift + 139 + adjustment8, positionY, positionZ);
//
//             adjustment8 -= 18.7;
//             // model.rotateY(-Math.PI / 2);
//         }, undefined, (error) => {
//             console.log(error);
//         });
//     }
//     // puzzle 1 exit
//     let adjustment9 = 0;
//     for (let i = 0; i < 2; i++) {
//         loader.load(pathToWall, (gltf) => {
//             const modelLeft = gltf.scene;
//             const modelRight = modelLeft.clone();
//             // modelLeft.traverse(function (node) {
//             //     if (node.isMesh) {
//             //         node.castShadow = true;
//             //     }
//             // });
//             // modelRight.traverse(function (node) {
//             //     if (node.isMesh) {
//             //         node.castShadow = true;
//             //     }
//             // });
//             scene.add(modelLeft);
//             scene.add(modelRight);
//             // I must position two models at the same place in one coordinate so maybe add model twice or just different variables
//             // try work on one side for now before other side
//             let height = generateRandomNumberForVariation();
//             let depth = generateRandomNumberForVariation();
//             let positionX = blockWidth / 2;
//             let positionY = 0;
//             let positionZ = - blockWidth / 2;
//             modelLeft.scale.set(0.2, height, depth);
//             modelLeft.position.set((positionX - partWidth / 2 - gapWidth / 2) - offsetCurvedEdgesShift - 35 - adjustment9, positionY, positionZ + 20);
//
//             modelRight.scale.set(0.2, height, depth);
//             modelRight.position.set((positionX - partWidth / 2 + gapWidth / 2) + offsetCurvedEdgesShift + 139 + adjustment9, positionY, positionZ + 20);
//
//             adjustment9 -= 18.7;
//         }, undefined, (error) => {
//             console.log(error);
//         });
//     }
//     // puzzle 2 exit
//     let adjustment10 = 0;
//     for (let i = 0; i < 2; i++) {
//         loader.load(pathToWall, (gltf) => {
//             const modelLeft = gltf.scene;
//             const modelRight = modelLeft.clone();
//
//             // modelLeft.traverse(function (node) {
//             //     if (node.isMesh) {
//             //         node.castShadow = true;
//             //     }
//             // });
//             // modelRight.traverse(function (node) {
//             //     if (node.isMesh) {
//             //         node.castShadow = true;
//             //     }
//             // });
//
//             scene.add(modelLeft);
//             scene.add(modelRight);
//             // I must position two models at the same place in one coordinate so maybe add model twice or just different variables
//             // try work on one side for now before other side
//             let height = generateRandomNumberForVariation();
//             let depth = generateRandomNumberForVariation();
//             let positionX = 0;
//             let positionY = 0;
//             let positionZ = - blockWidth;
//             modelLeft.scale.set(0.2, height, depth);
//             modelLeft.position.set(positionX - 33.5, positionY, positionZ - offsetCurvedEdgesShift - partWidth / 2 - gapWidth / 2);
//
//
//             modelRight.scale.set(0.2, height, depth);
//             modelRight.position.set(positionX - 33.5, positionY, positionZ + partWidth / 2 + gapWidth / 2);
//
//             adjustment10 -= 18.7;
//
//             // export function loadModels(loader, scene, world, blockWidth) {
//
//             //     // loader.load('/ground_material.glb', function (gltf) {
//             //     //     gltf.scene.rotation.y = Math.PI / 2;
//             //     //     gltf.scene.scale.set(1, 1, 1);
//             //     //     gltf.scene.position.y = -1;
//             //     //     gltf.scene.position.x = 0;
//             //     //     gltf.scene.position.z = 0;
//             //     //     scene.add(gltf.scene);
//
//
//             modelLeft.rotateY(-Math.PI / 2);
//             modelRight.rotateY(-Math.PI / 2);
//         }, undefined, (error) => {
//             console.log(error);
//         });

}

