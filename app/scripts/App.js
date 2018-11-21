// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats
import './controls/OrbitControls'
import vertexShaderTerrain from './vertex.vert'
import fragmentShaderNoise from './noise.frag'

import './shaders/CopyShader'
import './shaders/AfterimageShader'

import './pp/EffectComposer'
import './pp/RenderPass'
import './pp/MaskPass'
import './pp/ShaderPass'
import './pp/AfterimagePass'

import SoundController from './SoundController'
//Assets

import Track1 from '../assets/Soft and Furious - The truth about RW - 01 Morph.mp3'
import Track2 from '../assets/Soft and Furious - The truth about RW - 02 Whats your name again.mp3'
import Track3 from '../assets/Soft and Furious - The truth about RW - 03 S T A F.mp3'
import Track4 from '../assets/Soft and Furious - The truth about RW - 04 Inescapable.mp3'
import Track5 from '../assets/Soft and Furious - The truth about RW - 05 Short temper dove.mp3'
import Track6 from '../assets/Soft and Furious - The truth about RW - 06 Vicious Treat.mp3'
import Track7 from '../assets/Soft and Furious - The truth about RW - 07 Ocean Ending.mp3'


const SrcMusic = [Track1, Track2, Track3, Track4, Track5, Track6, Track7]
const Bpm = [157, 92, 130, 156, 126, 120, 140]

export default class App {

    constructor() {

        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );
        let index = 6
        this.sound = new SoundController(SrcMusic, Bpm, index)
        this.materialShader = []
        this.afterimagePass

        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000000 );
        this.camera.position.z = 3 ;


        this.scene = new THREE.Scene();
        
        this.mainGroup = new THREE.Group
        
        this.setSceneOptions()
        this.setlights()
        for (let i = 0; i < 2; i++) {
           this.setTerrain(i) 
        }
        this.setBuiding()

        this.setMainGroupOptions()

        this.scene.add(this.mainGroup)
        
        
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.shadowMap.enabled = true;
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );
        var controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
        this.afterimagePass = new THREE.AfterimagePass();
        this.afterimagePass.renderToScreen = true;
        this.composer.addPass(this.afterimagePass);
        
        this.renderer.animate( this.render.bind(this) );
        
        this.onWindowResize();
    }
    setSceneOptions() {
        this.scene.background = new THREE.Color(0x1E1E1E);
       // this.scene.fog = new THREE.Fog(0x050505, 0, 50);
    }

    setlights() {
        let ambLight = new THREE.AmbientLight(0xffffff)
        this.scene.add(ambLight)


        this.dirLight = new THREE.SpotLight(0xffffff, 0.1)
        this.dirLight.castShadow = true
        this.dirLight.position.y = 50
        this.dirLight.position.x = 75
        this.dirLight.position.z = -100
        this.dirLight.shadow.camera.fov = 30;
        this.dirLight.shadow.camera.near = 100;
        this.dirLight.shadow.camera.far = 200;
        this.dirLight.shadow.mapSize.width = 1024; // default
        this.dirLight.shadow.mapSize.height = 1024; // default
        this.dirLight.penumbra = 1; // default
        this.mainGroup.add(this.dirLight)

        var helper = new THREE.CameraHelper(this.dirLight.shadow.camera);
        this.mainGroup.add(helper);
    }

    setTerrain(i) {
        let transform = [
            "vec3 transformed = vec3(position.x, position.y, snoise(vec3(position.x/20., position.y/20. + u_time, 0)) * .8);",
            'vec3 transformed = vec3( position ) * m;'
    ]
        let geometry = new THREE.PlaneBufferGeometry(150, 70, 512,512);
        var material = new THREE.MeshStandardMaterial();
        material.onBeforeCompile = (shader) => {
            shader.uniforms.u_time = {
                value: 1.0, type: "f"
            };
            shader.vertexShader = 'uniform float u_time;\n' + fragmentShaderNoise + '\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                [
                    `float theta = sin( u_time + position.y ) / 2.;`,
                    `float c = cos( .5+ (theta*${i+1}.)/3.);`,
                    `float s = sin( .5+(theta*${i+1}.)/3.);`,
                    'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
                    transform[0],
                    'vNormal = vNormal * m;'
                ].join('\n')
            );
            
            this.materialShader.push(shader)
        };

        let landScape = new THREE.Mesh(geometry, material);
        
        landScape.rotation.x = -Math.PI/2
        // this.landScape.position.z = -5
        // this.landScape.position.y = 3
        landScape.receiveShadow = true
        landScape.castShadow = true
        if (i === 1) landScape.rotation.z = Math.PI/2 + 1
        landScape.position.y = -1
        this.mainGroup.add(landScape)
        

        // let landMat = new THREE.MeshLambertMaterial({
        //     color: 0xd3c7a2
        // });
        // landMat.onBeforeCompile = (shader) => {
        //     shader.uniforms.u_time = {value: 1.0,type: “f”}
        //     shader.vertexShader = ‘uniform float u_time;\n’ + random + ‘\n’ + shader.vertexShader;
        //     shader.vertexShader = shader.vertexShader.replace(
        //         ‘#include <begin_vertex>’,
        //         ‘vec3 transformed = vec3(position.x, position.y, (smoothstep(3.55, 4.0, position.x) + smoothstep(-3.55, -4., position.x)) * snoise(vec3(position.x, position.y + u_time, 0)) * 4.);’
        //     );
        //     console.log(shader.vertexShader);
        //     this.landShader = shader;
        // }
    }

    setBuiding() {
        let geometry = new THREE.BoxBufferGeometry(3, 5, 1)
        var material = new THREE.MeshStandardMaterial();

        var cube = new THREE.Mesh(geometry, material);
        cube.receiveShadow = true
        cube.castShadow = true
        this.mainGroup.add(cube);

    }

    setMainGroupOptions() {
      //  this.mainGroup.rotation.x = -0.5
    }

    render() {
        let time = performance.now() / 1000
        if (this.materialShader) {
            this.materialShader.forEach(el => {  
                el.uniforms.u_time.value = time
            });
        }
        this.composer.render( this.scene, this.camera );
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

}