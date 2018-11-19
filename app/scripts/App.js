// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats


import Sound from './Sound'
//Assets

// 126
import SrcMusic from '../assets/Blaz - Steven - 08 Battle Of Steven.mp3'


export default class App {

    constructor() {

        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );

        this.sound = new SoundController()

        // let textureLoader = new THREE.TextureLoader();
        // let texture = textureLoader.load(imgTexture);


        this.camera = new THREE.PerspectiveCamera( 150, window.innerWidth / window.innerHeight, 0.1, 10 );
        this.camera.position.z = 1;

    	this.scene = new THREE.Scene();
        // let material = new THREE.MeshStandardMaterial({
        //     roughness: .3, metalness: 0,
        //     color: 0xffffff,
        //     map: texture,
        //     normalMap: normal,
        //     normalScale: new THREE.Vector2(5, 5),
        //     displacementMap: disp,
        //     displacementScale: 0.05,
        //     roughnessMap: roughnessmap,
        //     aoMap: ao,
        //     aoMapIntensity: 2
        // });

        let ambLight = new THREE.AmbientLight(0xffffff)
        this.scene.add(ambLight)


        let dirLight = new THREE.DirectionalLight(0xffffff, 0.2)
        this.scene.add(dirLight)


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
