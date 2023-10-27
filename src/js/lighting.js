import * as THREE from 'three'
import * as objects from './objects.js'
import * as sky from './sky.js';


export function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // Add lighting (directional light)
    const spotLight = new THREE.SpotLight(0xFFFFFF, 1.2);

    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 100;
    spotLight.shadow.camera.far = 4000;
    scene.add(spotLight);


    // Adjust the position of the light
    const targetObject = new THREE.Object3D();
    targetObject.position.set(50, 0, 0);
    scene.add(targetObject);
    spotLight.position.set(100, 800, 700);

    spotLight.target = targetObject;

    spotLight.angle = 0.5;
    // Configure the shadow map size and camera near/far
    const lighHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(lighHelper);
    var helper = new THREE.CameraHelper(spotLight.shadow.camera);
    scene.add(helper);

 //   sky.moonOrbitGroup.add(spotLight);

}



// sky.moonOrbitGroup.add(spotLight);