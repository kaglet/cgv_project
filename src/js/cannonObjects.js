// This is to add any objects to the world that have pysics (other than the player)
// i.e gravity, collisions ect



import * as THREE from 'three'
import * as CANNON from 'cannon-es';

export const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-9.81,0)
  });
  
  
 export const groundBody = new CANNON.Body({
    shape: new CANNON.Plane(),
    //mass: 10
    // shape: new CANNON.Box(new CANNON.Vec3(15, 15, 0.1)),
     type: CANNON.Body.STATIC,
    // material: groundPhysMat
  });
  world.addBody(groundBody);
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  groundBody.position.y -= 30;
  
 export const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(1, 20, 0),
  //  material: boxPhysMat
  });
  world.addBody(boxBody);