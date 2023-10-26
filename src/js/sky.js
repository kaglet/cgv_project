import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as models from './models.js';


// Import texture images
import spaceFtImage from '../img/space/space_ft.png';
import spaceBkImage from '../img/space/space_bk.png';
import spaceUpImage from '../img/space/space_up.png';
import spaceDnImage from '../img/space/space_dn.png';
import spaceRtImage from '../img/space/space_rt.png';
import spaceLfImage from '../img/space/space_lf.png';

export let space;
let moonMesh;
export let moonOrbitGroup =new THREE.Object3D();;


export function setSky(scene) {


    // Create texture objects
    const texture_ft = new THREE.TextureLoader().load(spaceFtImage);
    const texture_bk = new THREE.TextureLoader().load(spaceBkImage);
    const texture_up = new THREE.TextureLoader().load(spaceUpImage);
    const texture_dn = new THREE.TextureLoader().load(spaceDnImage);
    const texture_rt = new THREE.TextureLoader().load(spaceRtImage);
    const texture_lf = new THREE.TextureLoader().load(spaceLfImage);

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
    skybox.position.set(0, 0, 0);
    scene.add(skybox);


    // Particles
    const particlesGeometry = new THREE.BufferGeometry(); // Geometry for the space
    const particlesCount = 15000; // number of particles to be created
    const minDistance = 1000; // minimum distance from the origin (0,0,0)
    
    const vertices = new Float32Array(particlesCount * 3); // Three values for each vertex (x, y, z)
    
    for (let i = 0; i < particlesCount; i++) {
        let x, y, z;
        let distance;
    
        do {
            x = (Math.random() - 0.5) * 6000;
            y = (Math.random() - 0.5) * 6000;
            z = (Math.random() - 0.5) * 6000;
    
            // Calculate the distance from the origin
            distance = Math.sqrt(x * x + y * y + z * z);
        } while (distance < minDistance);
    
        vertices[i * 3] = x;
        vertices[i * 3 + 1] = y;
        vertices[i * 3 + 2] = z;
    }
    

    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(vertices, 3) // 3 values for each vertex (x, y, z)
        // Check the documentation for more info about this.
    );

    // Texture
    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('/particles/star.png'); // Add a texture to the particles

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        map: particleTexture, // Texture
        size: Math.random() * 0.5 + 5, // Size of the particles
        sizeAttenuation: true, // size of the particle will be smaller as it gets further away from the camera, and if it's closer to the camera, it will be bigger
    });

    space = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(space);

//Moon

const gltfLoader = new GLTFLoader();
// modelsToLoad.push({ modelPath: '/openlvl2(48.5mb).glb', scale: 1.05, position: [217, 2, -358], rotation:0 });

gltfLoader.load('./assets/moon/scene.gltf', (gltf) => {
    moonMesh = gltf.scene;
    moonMesh.scale.set(1.5, 1.5, 1.5); // Adjust the scale as needed

    // Create a group for the moon to orbit around the world center
    
    moonOrbitGroup.position.set(0, 0, 0); // World center position (0,0,0)

    // Set the moon's initial position relative to the world center
    moonMesh.position.set(-4000, 4000,0); // Adjust the initial position

    // Add the moon mesh as a child of the orbit group
    moonOrbitGroup.add(moonMesh);

    // Add the moon orbit group to the scene
    scene.add(moonOrbitGroup);
});


}

