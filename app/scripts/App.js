// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats


import Sound from './Sound'
//Assets
import imgTexture from '../assets/Rock_025_COLOR.jpg';
import imgNormal from '../assets/Rock_025_NORM.jpg';
import imgDisp from '../assets/Rock_025_DISP.png';
import imgRoughness from '../assets/Rock_025_ROUGH.jpg';
import imgAo from '../assets/Rock_025_OCC.jpg';

// 126
import SrcMusic from '../assets/Blaz - Steven - 08 Battle Of Steven.mp3'


export default class App {

    constructor() {

        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );

        this.sound = new SoundController()

        let textureLoader = new THREE.TextureLoader();
        let texture = textureLoader.load(imgTexture);
        let normal = textureLoader.load(imgNormal);
        let disp = textureLoader.load(imgDisp)
        let roughnessmap = textureLoader.load(imgRoughness)
        let ao = textureLoader.load(imgAo)

        this.camera = new THREE.PerspectiveCamera( 150, window.innerWidth / window.innerHeight, 0.1, 10 );
        this.camera.position.z = 1;

    	this.scene = new THREE.Scene();
        let material = new THREE.MeshStandardMaterial({
            roughness: .3, metalness: 0,
            color: 0xffffff,
            map: texture,
            normalMap: normal,
            normalScale: new THREE.Vector2(5, 5),
            displacementMap: disp,
            displacementScale: 0.05,
            roughnessMap: roughnessmap,
            aoMap: ao,
            aoMapIntensity: 2
        });

        let ambLight = new THREE.AmbientLight(0xffffff)
        this.scene.add(ambLight)


        let dirLight = new THREE.DirectionalLight(0xffffff, 0.2)
        this.scene.add(dirLight)

        this.mesh = []
        for (let i = 0; i < 1; i++) {
            let geometry
            if (i % 2 == 0) {
                geometry = new THREE.SphereGeometry(0.8, 50, 50);
            } else {
                geometry = new THREE.ConeGeometry(Math.random() * 0.5, Math.random() * 0.5, Math.random() * 0.5);
            }
            
            this.mesh[i] = new THREE.Mesh( geometry, material );
            this.scene.add( this.mesh[i] );
            this.mesh[i].position.x = i * 0.5
            this.mesh[i].position.y = i * 0.5
            //this.mesh[i].position.z = i * 0.5
            ///this.mesh[i].scale.set(-1,-1,-1)
            //this.mesh[i].position.z = i * 0.25
            
        }

    	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    	this.renderer.setPixelRatio( window.devicePixelRatio );
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    	this.container.appendChild( this.renderer.domElement );

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

        this.renderer.animate( this.render.bind(this) );
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

class SoundController {

    constructor() {
        this.audioAnalyzer = new Sound(SrcMusic, 126, 0, this.playSound.bind(this), true)
    }

    playSound() {
        console.log('coucou');
       // this.audioAnalyzer.play()
    }
}
