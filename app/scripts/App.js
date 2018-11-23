// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats
import './controls/OrbitControls'
import vertexShaderTerrain from './vertex.vert'
import fragmentShaderNoise from './noise.frag'
import fragmentPCSS from './PCSS.frag'

import './shaders/CopyShader'
import './shaders/AfterimageShader'
import './shaders/DigitalGlitch'

import './pp/EffectComposer'
import './pp/SSAARenderPass'
import './pp/RenderPass'
import './pp/MaskPass'
import './pp/ShaderPass'
import './pp/AfterimagePass'
import './pp/GlitchPass'

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

    constructor(quality) {

        this.container = document.querySelector( '#main' );
        document.body.appendChild( this.container );
        let index = 6
        this.sound = new SoundController(SrcMusic, Bpm, index)
        this.sound.musicReady = this.musicReady.bind(this)
        this.materialShader = []
        this.afterimagePass
        this.zoom = 0
        this.cameraMoveScale = 5

        this.camera = new THREE.PerspectiveCamera( 180, this.WIDTH / this.HEIGHT, 0.1, 1000000 );
        this.camera.position.z = 3
        this.camera.position.y = -1
        this.camera.rotation.x = 0.5


        this.scene = new THREE.Scene();
        
        this.mainGroup = new THREE.Group
        
        this.setSceneOptions()
        this.setlights()

        this.setTerrain() 

        this.setWind()

        this.setBuiding()


        this.setMainGroupOptions()

        this.scene.add(this.mainGroup)

        var shadowShader = THREE.ShaderChunk.shadowmap_pars_fragment;
        shadowShader = shadowShader.replace(
            '#ifdef USE_SHADOWMAP',
            '#ifdef USE_SHADOWMAP'+'\n'+
            fragmentPCSS + '\n'
        );
        shadowShader = shadowShader.replace(
            '#if defined( SHADOWMAP_TYPE_PCF )',
            'return PCSS( shadowMap, shadowCoord );\n' +
            '#if defined( SHADOWMAP_TYPE_PCF )'
        );
        THREE.ShaderChunk.shadowmap_pars_fragment = shadowShader;
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        // this.renderer.gammaInput = true;
        // this.renderer.gammaOutput = true;
        this.quality = quality

        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.HEIGHT = (window.innerHeight) / this.quality
        this.WIDTH = (window.innerHeight*4/3) / this.quality
        this.renderer.setSize( this.WIDTH, this.HEIGHT );
        this.container.appendChild( this.renderer.domElement );

      // var controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
     

        

        
        this.ssaaRenderPass = new THREE.SSAARenderPass(this.scene, this.camera);
        (this.quality === '1') ? this.ssaaRenderPass.sampleLevel = 2 : this.ssaaRenderPass.sampleLevel = 0
        
        this.ssaaRenderPass.unbiased = true;
        this.composer.addPass(this.ssaaRenderPass);

        // this.copyPass = new THREE.ShaderPass(THREE.CopyShader);
        // this.copyPass.renderToScreen = true;
        // this.composer.addPass(this.copyPass);

        this.glitchPass = new THREE.GlitchPass();
       // this.glitchPass.renderToScreen = true;
        this.composer.addPass(this.glitchPass);

        this.afterimagePass = new THREE.AfterimagePass();
        this.afterimagePass.renderToScreen = true;
        this.composer.addPass(this.afterimagePass);

 


    }

    musicReady() {

        this.amp = 1
        this.kick = 20.
        this.sound.onKickDetected = this.onKickDetected.bind(this)
        this.sound.offKickDetected = this.offKickDetected.bind(this)

        this.sound.onBeat = this.onBeat.bind(this)

        this.sound.cameraMove = this.cameraMove.bind(this)
        
        this.renderer.animate(this.render.bind(this));

        this.onWindowResize();
    }

    onKickDetected(opt, mag) {
        
        switch (opt) {
            case 'saturation':
                if(this.kick >= 1.) this.kick -= .5
                this.materialShaderMountain.uniforms.u_kick.value = this.kick

                if (this.amp <= (mag / 255) * 15) this.amp += .05
                this.materialShaderMountain.uniforms.u_amp.value = this.materialShaderDesert.uniforms.u_amp.value = this.amp
                break;

            case 'beat':
                this.glitchPass.goWild = true
                setTimeout(()=> {
                    this.glitchPass.goWild = false
                }, 700)
                break;
            default:
                break;
        }

    }

    offKickDetected(opt) {
        if (!this.materialShaderMountain) return;

        switch (opt) {
            case 'saturation':
                if (this.kick <= 20.) this.kick += .1
                if (this.amp >= 0) this.amp -= 0.01

                this.materialShaderMountain.uniforms.u_amp.value = this.materialShaderDesert.uniforms.u_amp.value = this.amp
                this.materialShaderMountain.uniforms.u_kick.value = this.kick
                break;
            default:
                break;
        }
    }
    
    cameraMove() {
        this.cameraMoveScale = 0.5
    }

    onBeat() {
        console.log('coucou');
        this.city
        this.city.children.forEach(build => {
            build.scale.y += 1
            setTimeout(()=> {
                build.scale.y -= 1
            }, 500)
        });
    }

    setSceneOptions() {
        this.scene.background = new THREE.Color(0x1E1E1E);
        this.scene.fog = new THREE.Fog(0x050505, 0, 40);
    }

    setlights() {
        let ambLight = new THREE.AmbientLight(0xffffff)
        this.scene.add(ambLight)


        this.dirLight = new THREE.SpotLight(0xffffff, 1, 400)
        this.dirLight.castShadow = true
        this.dirLight.position.z = -30
        this.dirLight.position.y = 175
        this.dirLight.position.x = 20
        // this.dirLight.position.y = -150
        // this.dirLight.position.x = 75
        // this.dirLight.position.z = -100
        // this.dirLight.shadow.camera.fov = 30;
        this.dirLight.shadow.camera.near = 125;
        this.dirLight.shadow.camera.far = 200;
        // this.dirLight.shadow.mapSize.width = 1024; // default
        // this.dirLight.shadow.mapSize.height = 1024; // default
        // this.dirLight.penumbra = 1; // default
        this.scene.add(this.dirLight)

        var helper = new THREE.CameraHelper(this.dirLight.shadow.camera);
        //this.scene.add(helper);
    }

    setTerrain() {

        let terrain = new THREE.Group()
        this.shaderTransform = [
            `vec3 transformed = vec3(position.x, position.y, (smoothstep(0., 4.0, position.x)+smoothstep(-0., -4., position.x)) * snoise(vec3(position.x/20., position.y/20. + u_time, 0)) * u_amp);`,
            'vec3 transformed = vec3( position.x, position.y, (smoothstep(1., 4.0, position.x)+smoothstep(-1., -4., position.x)) * snoise(vec3(position.x/u_kick, position.y/u_kick + u_time, 0)) * u_amp );'
    ]
        let geometryDesert = new THREE.PlaneBufferGeometry(200, 70, 512,512);
        var materialDesert = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x985a02),
            emissive: new THREE.Color(0x49054d),
            metalness: 0,
            roughness:1, 
        });
        materialDesert.onBeforeCompile = (shader) => {
            shader.uniforms.u_time = {
                value: 1.0, type: "f"
            };
            shader.uniforms.u_amp = {
                value: this.amp, type: "f"
            };
            shader.vertexShader = 'uniform float u_time;\n' + 'uniform float u_amp;\n' + fragmentShaderNoise + '\n' + shader.vertexShader;

            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                [
                    
                    `float theta = sin( u_time + position.y ) / 2.;`,
                    `float c = cos( .5+ (theta*${1}.)/3.);`,
                    `float s = sin( .5+(theta*${1}.)/3.);`,
                    'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
                    this.shaderTransform[0],
                    'vNormal = vNormal * m;'
                ].join('\n')
            );
            
            this.materialShaderDesert = shader
        };

        let landScapeDesert = new THREE.Mesh(geometryDesert, materialDesert);
        terrain.add(landScapeDesert)

        let geometryMountain = new THREE.PlaneBufferGeometry(200, 70, 512, 512);
        var materialMountain = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x526d99),
            emissive: new THREE.Color(0x49054d),
            metalness: 1,
            roughness: 0,
            transparent: true,
            opacity: .5,
            wireframe: false
        });
        materialMountain.onBeforeCompile = (shader) => {
            shader.uniforms.u_time = {
                value: 1.0, type: "f"
            };
            shader.uniforms.u_amp = {
                value: this.amp, type: "f"
            };
            shader.uniforms.u_kick = {
                value: this.kick, type: "f"
            };
            shader.vertexShader = 'uniform float u_time;\n' + 'uniform float u_amp;\n' + 'uniform float u_kick;\n' + fragmentShaderNoise + '\n' + shader.vertexShader;

            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                [

                    `float theta = sin( u_time + position.y ) / 2.;`,
                    `float c = cos( .5+ (theta*${1}.)/3.);`,
                    `float s = sin( .5+(theta*${1}.)/3.);`,
                    'mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );',
                    this.shaderTransform[1],
                    'vNormal = vNormal * m;'
                ].join('\n')
            );
            
            this.materialShaderMountain = shader
        };

        let landScapeMountain = new THREE.Mesh(geometryMountain, materialMountain);
        landScapeMountain.position.z = -1
        landScapeDesert.castShadow = true
        landScapeMountain.castShadow = true
        landScapeDesert.receiveShadow = true
        landScapeMountain.receiveShadow = true
        terrain.add(landScapeMountain)

        terrain.rotation.x = -Math.PI/2
        // this.landScape.position.z = -5
        // this.landScape.position.y = 3
        terrain.receiveShadow = true
        terrain.castShadow = true
        //if (i === 1) landScape.rotation.z = Math.PI/2 + 1
        terrain.position.y = -1
        this.mainGroup.add(terrain)
    }

    setWind() {

        this.particlesData = [];
        this.particulesPositions
        this.particulesColors;
        var particles;
        this.pointCloud;
        var maxParticleCount = 1000;
        this.particlePositions;
        this.linesMesh;
        this.particleCount = 1000;
        var r = 150;
        this.rHalf = r / 2;
        this.effectController = {
            showDots: true,
            showLines: true,
            minDistance: 10,
            limitConnections: false,
            maxConnections: 3,
            particleCount: this.particleCount
        };

        var segments = maxParticleCount * maxParticleCount;
        this.particulesPositions = new Float32Array(segments * 3);
        this.particulesColors = new Float32Array(segments * 3);
        var pMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 3,
            blending: THREE.AdditiveBlending,
            transparent: true,
            sizeAttenuation: false
        });
        particles = new THREE.BufferGeometry();
        this.particlePositions = new Float32Array(maxParticleCount * 3);
        for (var i = 0; i < maxParticleCount; i++) {
            var x = Math.random() * r - r / 2;
            var y = Math.random() * r - r / 2;
            var z = Math.random() * r - r / 2;
            this.particlePositions[i * 3] = x;
            this.particlePositions[i * 3 + 1] = y;
            this.particlePositions[i * 3 + 2] = z;
            // add it to the geometry
            this.particlesData.push({
                velocity: new THREE.Vector3(Math.cos(-1 + Math.random() * 2), Math.cos(-1 + Math.random() * 2), Math.cos(-1 + Math.random() * 2)),
                numConnections: 0
            });
        }
        particles.setDrawRange(0, this.particleCount);
        particles.addAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3).setDynamic(true));
        // create the particle system
        this.pointCloud = new THREE.Points(particles, pMaterial);
        this.mainGroup.add(this.pointCloud);
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.BufferAttribute(this.particulesPositions, 3).setDynamic(true));
        geometry.addAttribute('color', new THREE.BufferAttribute(this.particulesColors, 3).setDynamic(true));
        geometry.computeBoundingSphere();
        geometry.setDrawRange(0, 0);
        var material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        this.linesMesh = new THREE.LineSegments(geometry, material);
        this.mainGroup.add(this.linesMesh);
    }

    setBuiding() {
        this.city = new THREE.Group()

        for (let i = 0; i < 50; i++) {
            let geometry = new THREE.BoxBufferGeometry(3, Math.random()*50, 1)
            var material = new THREE.MeshStandardMaterial({
                roughness:0,
            });
            let cube = new THREE.Mesh(geometry, material);
            cube.receiveShadow = true
            cube.castShadow = true
            cube.position.set(Math.cos(i)*20, 0, Math.cos(i)*10)
            this.city.add(cube)
        }


        for (let i = 0; i < 50; i++) {
            let geometry = new THREE.BoxBufferGeometry(3, Math.random() * 50, 1)
            var material = new THREE.MeshStandardMaterial({
                roughness: 0,
            });
            let cube = new THREE.Mesh(geometry, material);
            cube.receiveShadow = true
            cube.castShadow = true
            cube.position.set( - Math.cos(i) * 20, 0, Math.cos(i) * 10)
            this.city.add(cube)
        }

        this.city.position.z = -25
       // this.camera.lookAt(cube)
       this.dirLight.target = this.city
        this.mainGroup.add(this.city);

    }

    setMainGroupOptions() {
     this.mainGroup.rotation.x = 0.6
    }

    render() {
        this.time = performance.now() / 1000
        if (this.materialShaderDesert) {
            this.materialShaderDesert.uniforms.u_time.value = this.time    
            this.materialShaderMountain.uniforms.u_time.value = this.time 
        }
        // if (this.wind.position.x > 50) {
        //     this.wind.position.x = -50
        // }
        //this.animateWind()
        if (this.camera.fov > 80) {
            //.01
            this.camera.fov -= .01
            this.camera.updateProjectionMatrix();
        }

        this.camera.lookAt(new THREE.Vector3(Math.sin(this.time / this.cameraMoveScale), Math.cos(this.time / this.cameraMoveScale) + 1, 0))
        this.composer.render( this.scene, this.camera );
        //this.renderer.render(this.scene, this.camera);

    }

    onWindowResize() {

    	this.camera.aspect = this.WIDTH / this.HEIGHT;
    	this.camera.updateProjectionMatrix();
        this.renderer.setSize( this.WIDTH, this.HEIGHT );
        this.composer.setSize(this.WIDTH, this.HEIGHT);
        if (this.quality !== 1) {
            document.querySelector('canvas').style.width = 'inherit'
            document.querySelector('canvas').style.height = '100vh'
        }
    }

}