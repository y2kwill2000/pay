import StoreBase from 'meepworks/store-base';
import InitAudio from '../actions/init-audio';
import LoadAudio from '../actions/load-audio';
import PlayAudio from '../actions/play-audio';

const DATA = Symbol();

export default class AudioStore extends StoreBase {
  constructor() {
    super();
    this.rehydrate();
    this.bindHandler(InitAudio, this.handleInitAudio);
    this.bindHandler(LoadAudio, this.handleLoadAudio);
    this.bindHandler(PlayAudio, this.handlePlayAudio);
  }
  rehydrate() {
    this[DATA] = {
      loaded: false
    };
  }
  dehydrate() {
    return null;
  }
  handleInitAudio() {
    this[DATA].ctx = new AudioContext();
  }
  handleLoadAudio(buffers) {
    this[DATA].buffers = buffers;
    this[DATA].loaded = true;
  }
  handlePlayAudio(type) {
    if(this[DATA].loaded) {

      let src = this[DATA].ctx.createBufferSource();
      src.buffer = this[DATA].buffers[type];
      src.connect(this[DATA].ctx.destination);
      src.start(0);
    }
  }
}
