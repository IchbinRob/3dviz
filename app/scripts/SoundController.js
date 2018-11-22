import Sound from './Sound'

export default class SoundController {

    constructor(SrcMusic, Bpm, index) {
        this.onKickDetected = null
        this.offKickDetected = null
        this.audioAnalyzer = new Sound(SrcMusic[index], Bpm[index], 0, this.playSound.bind(this), false)
    }

    playSound() {
        let frequency = [120, 250]
        let threshold = 75
        let decay = 1.5
        this.kick = this.audioAnalyzer.createKick({
            frequency,
            threshold,
            decay,
            onKick: (mag) => {
                this.onKickDetected()
            },
            offKick: (mag) => {
                this.offKickDetected()
            }
        })
        this.kick.on()
        this.audioAnalyzer.play()
    }
} 