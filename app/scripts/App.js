// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats
import vertexShaderTerrain from './vertex.vert'
import fragmentShaderNoise from './fragment.frag'
import './utils/BufferGeometryUtils'
import './shaders/NormalMapShader'
import './ShaderTerrain'
import SoundController from './SoundController'
//Assets

// 157
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

        // let textureLoader = new THREE.TextureLoader();
        // let texture = textureLoader.load(imgTexture);
        this.uniformsNoise
        this.uniformsNormal
        this.uniformsTerrain
        this.heightMap
        this.normalMap
        this.mlib = {}
        this.terrain

        this.camera = new THREE.PerspectiveCamera( 150, window.innerWidth / window.innerHeight, 0.1, 10 );
        this.camera.position.z = 1;

        this.sceneRenderTarget = new THREE.Scene();
    	this.scene = new THREE.Scene();

        this.setSceneOptions()
        this.setlights()
        this.setTerrain()


    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );
    }

    setSceneOptions() {
        this.scene.background = new THREE.Color(0x050505);
        this.scene.fog = new THREE.Fog(0x050505, 2000, 4000);
    }

    setlights() {
        let ambLight = new THREE.AmbientLight(0xffffff)
        this.scene.add(ambLight)


        let dirLight = new THREE.DirectionalLight(0xffffff, 0.2)
        this.scene.add(dirLight)
    }

    setTerrain() {
        // HEIGHT + NORMAL MAPS

        var normalShader = THREE.NormalMapShader;

        var rx = 256,
            ry = 256;
        var pars = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBFormat
        };

        this.heightMap = new THREE.WebGLRenderTarget(rx, ry, pars);
        this.heightMap.texture.generateMipmaps = false;

        this.normalMap = new THREE.WebGLRenderTarget(rx, ry, pars);
        this.normalMap.texture.generateMipmaps = false;

        this.uniformsNoise = {

            time: {
                value: 1.0
            },
            scale: {
                value: new THREE.Vector2(1.5, 1.5)
            },
            offset: {
                value: new THREE.Vector2(0, 0)
            }

        };

        this.uniformsNormal = THREE.UniformsUtils.clone(normalShader.uniforms);

        this.uniformsNormal.height.value = 0.05;
        this.uniformsNormal.resolution.value.set(rx, ry);
        this.uniformsNormal.heightMap.value = this.heightMap.texture;

        var vertexShader = vertexShaderTerrain;
        // TEXTURES
        var loadingManager = new THREE.LoadingManager(function () {
            terrain.visible = true;
        });
        var textureLoader = new THREE.TextureLoader(loadingManager);
        var specularMap = new THREE.WebGLRenderTarget(2048, 2048, pars);
        specularMap.texture.generateMipmaps = false;
        // var diffuseTexture1 = textureLoader.load("textures/terrain/grasslight-big.jpg");
        // var diffuseTexture2 = textureLoader.load("textures/terrain/backgrounddetailed6.jpg");
        // var detailTexture = textureLoader.load("textures/terrain/grasslight-big-nm.jpg");
        // diffuseTexture1.wrapS = diffuseTexture1.wrapT = THREE.RepeatWrapping;
        // diffuseTexture2.wrapS = diffuseTexture2.wrapT = THREE.RepeatWrapping;
        // detailTexture.wrapS = detailTexture.wrapT = THREE.RepeatWrapping;
        specularMap.texture.wrapS = specularMap.texture.wrapT = THREE.RepeatWrapping;
        // TERRAIN SHADER
        var terrainShader = THREE.ShaderTerrain["terrain"];
        this.uniformsTerrain = THREE.UniformsUtils.clone(terrainShader.uniforms);
        this.uniformsTerrain['tNormal'].value = this.normalMap.texture;
        this.uniformsTerrain['uNormalScale'].value = 3.5;
        this.uniformsTerrain['tDisplacement'].value = this.heightMap.texture;
        // this.uniformsTerrain['tDiffuse1'].value = diffuseTexture1;
        // this.uniformsTerrain['tDiffuse2'].value = diffuseTexture2;
        this.uniformsTerrain['tSpecular'].value = specularMap.texture;
        // this.uniformsTerrain['tDetail'].value = detailTexture;
        this.uniformsTerrain['enableDiffuse1'].value = true;
        this.uniformsTerrain['enableDiffuse2'].value = true;
        this.uniformsTerrain['enableSpecular'].value = true;
        this.uniformsTerrain['diffuse'].value.setHex(0xffffff);
        this.uniformsTerrain['specular'].value.setHex(0xffffff);
        this.uniformsTerrain['shininess'].value = 30;
        this.uniformsTerrain['uDisplacementScale'].value = 375;
        this.uniformsTerrain['uRepeatOverlay'].value.set(6, 6);
        var params = [
            ['heightmap', fragmentShaderNoise, vertexShader, this.uniformsNoise, false],
            ['normal', normalShader.fragmentShader, normalShader.vertexShader, this.uniformsNormal, false],
            ['terrain', terrainShader.fragmentShader, terrainShader.vertexShader, this.uniformsTerrain, true]
        ];
        for (var i = 0; i < params.length; i++) {
            var material = new THREE.ShaderMaterial({
                uniforms: params[i][3],
                vertexShader: params[i][2],
                fragmentShader: params[i][1],
                lights: params[i][4],
                fog: true
            });
            this.mlib[params[i][0]] = material;
        }
        var plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
        this.quadTarget = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({
            color: 0x000000
        }));
        this.quadTarget.position.z = -500;
        this.sceneRenderTarget.add(this.quadTarget);
        // TERRAIN MESH
        var geometryTerrain = new THREE.PlaneBufferGeometry(6000, 6000, 256, 256);
        THREE.BufferGeometryUtils.computeTangents(geometryTerrain);
        this.terrain = new THREE.Mesh(geometryTerrain, this.mlib['terrain']);
        this.terrain.position.set(0, -125, 0);
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.visible = false;
        this.scene.add(this.terrain);
    }

    render() {
        let time = performance.now() / 1000
    
    	this.renderer.render( this.scene, this.camera );
    }

    onWindowResize() {

    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

}