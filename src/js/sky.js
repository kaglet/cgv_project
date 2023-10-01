// import * as THREE from 'three'
// import * as objects from './objects.js'



// let materialArray = [];
//         let texture_ft = new THREE.TextureLoader().load( '../img/arid/arid_ft.jpg');
//         let texture_bk = new THREE.TextureLoader().load( '../img/arid/arid_bk.jpg');
//         let texture_up = new THREE.TextureLoader().load( '../img/arid/arid_up.jpg');
//         let texture_dn = new THREE.TextureLoader().load( '../img/arid/arid_dn.jpg');
//         let texture_rt = new THREE.TextureLoader().load( '../img/arid/arid_rt.jpg');
//         let texture_lf = new THREE.TextureLoader().load( '../img/arid/arid_lf.jpg');
          
//         materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
//         materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
//         materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
//         materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
//         materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
//         materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
   
//         for (let i = 0; i < 6; i++)
//            materialArray[i].side = THREE.BackSide;
//         let skyboxGeo = new THREE.BoxGeometry( 10000, 10000, 10000);
//         let skybox = new THREE.Mesh( skyboxGeo, materialArray );
//         objects.scene.add( skybox );  