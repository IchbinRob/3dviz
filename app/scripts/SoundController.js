import Sound from './Sound'
export default class SoundController {

    constructor(SrcMusic, Bpm, index) {
        this.audioAnalyzer = new Sound(SrcMusic[index], Bpm[index], 0, this.playSound.bind(this), false)
    }

    playSound() {
        console.log('coucou');
       // this.audioAnalyzer.play()
    }
}