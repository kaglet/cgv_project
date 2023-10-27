import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import groundImg from './textures/avinash-kumar-rEIDzqczN7s-unsplash.jpg';

export function setGround(scene, world) {
    let groundTexture = new THREE.TextureLoader().load(groundImg);
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(-25, -25);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    // Create ground
    const groundGeo = new THREE.PlaneGeometry(1500, 1500);
    const groundMat = new THREE.MeshStandardMaterial({
        castShadow: true,
        receiveShadow: true,
        map: groundTexture,
        side: THREE.DoubleSide,
    });

    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
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
