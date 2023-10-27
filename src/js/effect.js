import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as objects from './objects.js';

//This const variable is a OpenGL Shading Language (GLSL) used to generate procedural noise that will simulate Mist and fog.
//I implemented Perlin noise because of its smooth, continuous and random patterns which gives a natural foggy effect.
const _NOISE_GLSL = `
            //mod289 is a utility function that ensures all values fall within the range [0,289] which makes results of calculations manageable
            vec3 mod289(vec3 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec4 mod289(vec4 x) {
            return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            //permute is another utility function that reorders values in a way to introduce pseudo-randomness. 
            //It takes a vec4 and applies some mathematical operations to shuffle its components.
            vec4 permute(vec4 x) {
                return mod289(((x*34.0)+1.0)*x);
            }

            //taylorInvSqrt calculates an approximation of the inverse square root of a vec4 using the Taylor series expansion.
            //It's an optimization for fast square root calculations in the noise generation process.
            vec4 taylorInvSqrt(vec4 r)
            {
            return 1.79284291400159 - 0.85373472095314 * r;
            }

            //Simplex Noise function
            //It takes 3D vector (vec3 v) as input and uses various mathematical operations and gradients to produce a noise value.
            //It calculates noise at a specific 3D position in space. The constants C and D are used to determine the shape of the noise pattern.
            float snoise(vec3 v)
            {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

            // First corner
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 =   v - i + dot(i, C.xxx) ;

            // Other corners
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );

            
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
            vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

            // Permutations
            i = mod289(i);
            vec4 p = permute( permute( permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

            // Gradients: 7x7 points over a square, mapped onto an octahedron.
            // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
            float n_ = 0.142857142857; // 1.0/7.0
            vec3  ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );

            //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
            //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);

            //Normalise gradients
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

            // Mix final noise value
            vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                            dot(p2,x2), dot(p3,x3) ) );
            }

            //Fractal Brownian Motion
            //The idea is to combine multiple layers of noise to create complex fractal patterns.
            //It calls snoise iteratively at different scales and combines the results with varying amplitudes to create a final noise value.
            float FBM(vec3 p) {
            float value = 0.0;
            float amplitude = 0.5;
            float frequency = 0.0;
            for (int i = 0; i < 6; ++i) {
                value += amplitude * snoise(p);
                p *= 2.0;
                amplitude *= 0.8;
            }
            return value;
            }
    `;

  //The idea is to moidfy the predefined GLSL fog code chunks and use them as a building block in order to achieve
  //a more realistic and natural fog effect that even wraps around objects like walls and trees.
THREE.ShaderChunk.fog_fragment = `
    //This if statement is a preprocessor directive that checks if fog is enabled within the scene
    #ifdef USE_FOG
      //The fog origin take the value of the camera position in the 3D worlsd as we need a reference point for the fog.
      vec3 fogOrigin = cameraPosition;
      vec3 fogDirection = normalize(vWorldPosition - fogOrigin);

      //Euclidean distance computation that represents how far the fragment is from the camera.
      float fogDepth = distance(vWorldPosition, fogOrigin);

      //The noiseSampleCoord is calculated as a combination of vWorldPosition and fogTime, which provides an evolving noise pattern over time.
      vec3 noiseSampleCoord = vWorldPosition * 0.00025 + vec3(
          0.0, 0.0, fogTime * 0.00025);
      
      //The noise sample is calculated using the Fractal Brownian Motion function. We are computing the intensity of the fog at the current fragment.
      float noiseSample = FBM(noiseSampleCoord * 2.0 + FBM(noiseSampleCoord)) * 0.9 + 0.9;
      fogDepth *= mix(noiseSample, 1.0, saturate((fogDepth - 5000.0) / 5000.0));
      fogDepth *= fogDepth;

      float heightFactor = 0.03;
      //This calculation is used to modulate the fog colour in the final rendering
      float fogFactor = heightFactor * exp(-fogOrigin.y * fogDensity) * (
          1.0 - exp(-fogDepth * fogDirection.y * fogDensity)) / fogDirection.y;
      fogFactor = saturate((fogFactor) * 0.9);

      gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
    #endif`;
    
    //The .fog_pars_fragment ensures that the code chunk will be included in the fragment shader of a material.
    //The NOISE_GLSL is included for the noise generation
    THREE.ShaderChunk.fog_pars_fragment = _NOISE_GLSL + `
    #ifdef USE_FOG
      uniform float fogTime;
      uniform vec3 fogColor;
      varying vec3 vWorldPosition;
      //This if statement checks if the exponential fog has been enabled/added to the scene. Which uses the aformentioned calculation techniques to generate the fog.
      #ifdef FOG_EXP2
        //This controls how quickly fog thickens as we move away from the camera
        uniform float fogDensity;
      #else
      //If linear fog is used, they represent the near and far fog distances
        uniform float fogNear;
        uniform float fogFar;
      #endif
    #endif`;
    
    //The next 2 shader chunks handle the processing of vertex positions in the presence of fog.
    // If fog is enabled (USE_FOG is defined), they calculate the world position of vertices in the vertex shader and pass this information to the fragment shader through the varying variable vWorldPosition. 
    //The fragment shader can then use vWorldPosition to calculate fog effects based on the position of each fragment in the world.
    THREE.ShaderChunk.fog_vertex = `
    #ifdef USE_FOG
      vWorldPosition = worldPosition.xyz;
    #endif`;
    
    THREE.ShaderChunk.fog_pars_vertex = `
    #ifdef USE_FOG
      varying vec3 vWorldPosition;
    #endif`;

    
  //Exporting the fog so that it is available on all other pages 
  export const fog = new THREE.FogExp2(0x9cacd4,  0.0001);