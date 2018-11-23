import Sound from './Sound'

export default class SoundController {

    constructor(SrcMusic, Bpm, index) {
        this.onKickDetected = null
        this.offKickDetected = null
        this.musicReady = null
        this.onBeat = null
        this.cameraMove = null
        this.cameraChange = null
        this.cameraDecal =null

        this.audioAnalyzer = new Sound(SrcMusic[index], Bpm[index], 61, this.playSound.bind(this), false)
    }

    playSound() {
        this.musicReady()
        let frequency = [120, 250]
        let threshold = 75
        let decay = 1.5
        this.kick = this.audioAnalyzer.createKick({
            frequency,
            threshold,
            decay,
            onKick: (mag) => {
                this.onKickDetected('saturation', mag)
            },
            offKick: (mag) => {
                this.offKickDetected('saturation')
            }
        })
        this.kick.on()


        let frequencyB = [90, 100]
        let thresholdB = 90
        let decayB = 0.5

        this.kickBeat = this.audioAnalyzer.createKick({
            frequency: frequencyB,
            threshold: thresholdB,
            decay: decayB,
            onKick: (mag) => {
                this.onKickDetected('beat', mag)
                
            },
            offKick: (mag) => {
                this.offKickDetected('beat')
            }
        })

        this.kickBeat.on()

        this.beat = this.audioAnalyzer.createBeat(
           { factor: 1,
            onBeat: () => {
                this.onBeat()
            }}
        )

        this.audioAnalyzer.after('offBeatKick', 61, ()=>{
            this.kickBeat.off()
            this.beat.on()
        })

        this.audioAnalyzer.between('changeCamOn', 75, 185, () => {
            this.cameraChange('on')
        }).after('changeCamOn', 185,()=>{
            this.cameraChange('off')
        })

        this.audioAnalyzer.between('WOUSH', 195, 270, () => {
            this.cameraDecal('on')
        })
        this.audioAnalyzer.after('WOUSHoff', 270, () => {
            this.cameraDecal('off')
        })

        this.audioAnalyzer.after('WOUHOUon', 270, () => {
            this.cameraMove('on')
        })
        this.audioAnalyzer.after('WOUHOUoff', 320, () => {
            this.cameraMove('off')
            this.beat.off()
        })


        
        // dancer.onceAt(10, function () {
        //     // Let's set up some things once at 10 seconds
        // }).between(10, 60, function () {
        //     // After 10s, let's do something on every frame for the first minute
        // }).after(60, function () {
        //     // After 60s, let's get this real and map a frequency to an object's y position
        //     // Note that the instance of dancer is bound to "this"
        //     object.y = this.getFrequency(400);
        // }).onceAt(120, function () {
        //     // After 120s, we'll turn the kick off as another object's y position is still being mapped from the previous "after" method
        //     kick.off();
        // })

        

        this.audioAnalyzer.play()
    }
} 