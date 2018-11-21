import Sound from './Sound'

export default class SoundController {

    constructor(SrcMusic, Bpm, index) {
        this.onKickDetected = null
        this.offKickDetected = null
        this.audioAnalyzer = new Sound(SrcMusic[index], Bpm[index], 0, this.playSound.bind(this), true)
    }

    playSound() {
        let frequency = [20, 30]
        let threshold = 0.3
        let decay = 0.02
        this.kick = this.audioAnalyzer.createKick({
            frequency,
            threshold,
            decay,
            onKick: (mag) => {
                console.log('Kick!');
                this.onKickDetected()
            },
            offKick: (mag) => {
                console.log('no kick :(');
                this.offKickDetected()
            }
        })
        this.kick.on()
        this.audioAnalyzer.play()
    }

    onKick() {
        console.log('test');
        
    }
} 