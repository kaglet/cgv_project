import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import nebula from './nebula.jpg';
import stars from './stars.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45, // between 40 and 80 is usually fine
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.BoxGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xf1f35f,
    wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

sphere.position.set(-10, 10, 0);
sphere.castShadow = true;

// const ambientLight = new THREE.AmbientLight(0x333333);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.castShadow = true;
// directionalLight.position.set(-30, 20, 0);
// directionalLight.shadow.camera.bottom = -12;
// directionalLight.shadow.camera.top = 12;

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(directionalLightHelper);

// // The object that casts a shadow has an implicit shadow camera setup
// // Different light types have different camera types
// const directionalLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF, 2);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// scene.fog = new THREE.Fog(0xffffff, 0, 200);
scene.fog = new THREE.FogExp2(0xffffff, 0.01);

// renderer.setClearColor(0x04354f);
// to be 
const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(nebula);


// to use a texture we load it on the cube or scene with a loader
// the scene has a background property but for the cube we add the map property on the material
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    stars, 
    stars, 
    nebula, 
    nebula, 
    nebula, 
    nebula
]);

// create material for each face of mesh, and each should have its own texture
// pass as argument to constructor of mesh with the materials we want
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2MultiMaterial = [
    new THREE.MeshStandardMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshStandardMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshStandardMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshStandardMaterial({map: textureLoader.load(stars)}),
    new THREE.MeshStandardMaterial({map: textureLoader.load(nebula)}),
    new THREE.MeshStandardMaterial({map: textureLoader.load(stars)}),
];

const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
scene.add(box2);
box2.position.set(0, 15, 10);
// update texture by changing the map property of the mesh's material
box2.material.map = textureLoader.load(nebula);

const vShader = `
    void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
const fShader = `
    void main() {
        gl_FragColor = vec4(1.0, 0.1, 0.3, 1.0);
    }
`;

const sphere2Geometry = new THREE.SphereGeometry(4, 50, 50);
const sphere2Material = new THREE.ShaderMaterial({
    vertexShader: vShader,
    fragmentShader: fShader,
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(-20, 10, 7);

const gui = new dat.GUI();

const options = {
    sphereColor: '#f1f35f',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,
};

// specify what must happen everytime we change the color on the interface
// e event variable contains colors code from color palette onChange
// add color palette element to gui passed the default value of the key name and set its on change method
gui.addColor(options, 'sphereColor').onChange((e)=>{
    sphere.material.color.set(e);
});

// add checkbox element to gui
// e contains information about event on the option / true false value of checkbox in this case
gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e;
});

gui.add(options, 'speed', 0, 0.1);
gui.add(options, 'angle', 0, 0.2);
gui.add(options, 'penumbra', 0, 0.1);
gui.add(options, 'intensity', 0, 1);

// get the normalized coordinates of the mouse x, y position
const mousePosition = new THREE.Vector2();

// update mouse position on mouse move
window.addEventListener('mousemove', (e) => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (e.clientY / window.innerHeight) * 2 + 1;
});

const rayCaster = new THREE.Raycaster();

let step = 0;

const sphereId = sphere.id;

box2.name = "theBox";

// the positions of all the points that form the geometry of a mesh are located in an array in this following property
// array is one dimensional and stores sets of 3 coordinates per vertex
// coordinates of first vertex of the geometry (plane) for example are in array[0] then array[1] and array[2] for x, y, z coordinates respectively.
const plane2Geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
const plane2Material = new THREE.MeshStandardMaterial({
    color: 0x00f100, 
    wireframe: true
});
const plane2 = new THREE.Mesh(plane2Geometry, plane2Material);
scene.add(plane2);
plane2.position.set(10, 10, 30);

// FOR LIGHT ON MOVE
// on move get coordinate of sphere bottom, on intersection with tile then light it up


// in animation you can change the coordinates of vertices over time

function animate(time) {
    // value of rotation will get updated 60 times per second
    // we set the update
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    // ranges from 0 to 1 for absolute value of sin so y values will always be positive 
    // remember y = 0 maps to coordinates there
    // so here we update the position using a sinosoidal function
    // position of sphere corresponds to its center

    // options.speed is altered when provided as an argument to that function with those parameters
    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotLight.angle = options.angle;
    spotLight.penumbra = options.penumbra;
    spotLight.intensity = options.intensity;
    // must call this after updating any of the light's properties
    spotLightHelper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);

    intersects.forEach((intersectItem) => {
        if (intersectItem.object.id == sphereId) {
            intersectItem.object.material.color.set(0xff0000);
        }

        if (intersectItem.object.name == "theBox") {
            intersectItem.object.rotation.x = time / 1000;
            intersectItem.object.rotation.y = time / 1000;
        }
    });

    plane2.geometry.attributes.position.array[0] = 10 * Math.random();
    plane2.geometry.attributes.position.array[1] = 10 * Math.random();
    plane2.geometry.attributes.position.array[2] = 10 * Math.random();
    const lastPointZ = plane2.geometry.attributes.position.array.length - 1;
    plane2.geometry.attributes.position.array[lastPointZ] = 10 * Math.random();
    plane2.geometry.attributes.position.needsUpdate = true;

    // console.log(intersects);
    
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});