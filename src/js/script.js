import '../style.css'
import * as player from './player.js';
import * as objects from './objects.js'
import * as lighting from './lighting.js'
import * as camera from './camera.js'


import * as THREE from 'three'
import * as CANNON from 'cannon-es';
import * as dat from 'dat.gui'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {
      _OnWindowResize();
    }, false);


    const controls = new OrbitControls(
    camera.currentCamera, renderer.domElement);
    controls.target.set(0, 10, 0);
    controls.update();


    var _mixers = [];
    var _previousRAF = null;
   

  function  _OnWindowResize() {
    camera.currentCamera.aspect = window.innerWidth / window.innerHeight;
    camera.currentCamera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  const timeStep = 1/100;
  function animate(t) {
    if (_previousRAF === null) {
        _previousRAF = t;
    }

    _RAF();
    _Step(t - _previousRAF);
    _previousRAF = t;

    objects.world.step(timeStep);

    renderer.render(objects.scene, camera.currentCamera);
    
}

function _RAF() {
    requestAnimationFrame(animate);
}


  function  _Step(timeElapsed) {
    const timeElapsedS = timeElapsed * 0.001;


    
    if (_mixers) {
      _mixers.map(m => m.update(timeElapsedS));
    }

    if (player._controls) {
      player._controls.Update(timeElapsedS);
    }
  }



  
  player._LoadAnimatedModel();
  animate(timeStep);
