import * as THREE from 'three'
import * as objects from './objects.js'
import * as player from './player.js';

// Add lighting (point light)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
objects.scene.add(directionalLight);
directionalLight.castShadow = true;
directionalLight.position.set(-30, 50, 0);
// You can adjust the edges of the shadow camera to capture a wider area where shadows are rendered
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
objects.scene.add(directionalLightHelper);

// The object that casts a shadow has an implicit shadow camera setup
// Different light types have different camera types
const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
objects.scene.add(directionalLightShadowHelper);

export function animate_lights() {

    if (player.characterModel) {

    objects.floorContainer1.children.forEach((tile, index) => {
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
          console.log(`I am a lit tile ${index}\n with world coordinates: ${tileWorldPosition.x} in x and ${tileWorldPosition.y} in y and ${tileWorldPosition.z} in z\n and local coordinates: ${tile.position.x} in x and ${tile.position.y} in y and ${tile.position.z} in z`);
          console.log(`When lit the player coordinates are: ${player.characterModel.position.x} in x and ${player.characterModel.position.y} in y and ${player.characterModel.position.z} in z`);
          const tileColor = new THREE.Color(255, 255, 0);
          // TODO: Change color of all faces of cube to blue currently only default front face is changed 
          tile.material.color.copy(tileColor);
          tile.litUp = true;
          // TODO: Make tiles sink also upon intersection, just shift slightly in the z
          // How do I position the tiles, is it within the floor container, using current position -= 1 for z for example or do I do a local transformation in floor?
          // TODO: Elevate tiles a bit from the ground they are on or simply shift the whole floor container
        }
      });

    

      objects.floorContainer2.children.forEach((tile, index) => {
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
          console.log(`I am a lit tile ${index}\n with world coordinates: ${tileWorldPosition.x} in x and ${tileWorldPosition.y} in y and ${tileWorldPosition.z} in z\n and local coordinates: ${tile.position.x} in x and ${tile.position.y} in y and ${tile.position.z} in z`);
          console.log(`When lit the player coordinates are: ${player.characterModel.position.x} in x and ${player.characterModel.position.y} in y and ${player.characterModel.position.z} in z`);
          const tileColor = new THREE.Color(255, 255, 0);
          // TODO: Change color of all faces of cube to blue currently only default front face is changed 
          tile.material.color.copy(tileColor);
          tile.litUp = true;
          // TODO: Make tiles sink also upon intersection, just shift slightly in the z
          // How do I position the tiles, is it within the floor container, using current position -= 1 for z for example or do I do a local transformation in floor?
          // TODO: Elevate tiles a bit from the ground they are on or simply shift the whole floor container
        }
      });

      objects.floorContainer3.children.forEach((tile, index) => {
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
          console.log(`I am a lit tile ${index}\n with world coordinates: ${tileWorldPosition.x} in x and ${tileWorldPosition.y} in y and ${tileWorldPosition.z} in z\n and local coordinates: ${tile.position.x} in x and ${tile.position.y} in y and ${tile.position.z} in z`);
          console.log(`When lit the player coordinates are: ${player.characterModel.position.x} in x and ${player.characterModel.position.y} in y and ${player.characterModel.position.z} in z`);
          const tileColor = new THREE.Color(255, 255, 0);
          // TODO: Change color of all faces of cube to blue currently only default front face is changed 
          tile.material.color.copy(tileColor);
          tile.litUp = true;
          // TODO: Make tiles sink also upon intersection, just shift slightly in the z
          // How do I position the tiles, is it within the floor container, using current position -= 1 for z for example or do I do a local transformation in floor?
          // TODO: Elevate tiles a bit from the ground they are on or simply shift the whole floor container
        }
      });
    }
}