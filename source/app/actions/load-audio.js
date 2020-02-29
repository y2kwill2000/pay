import ActionBase from 'meepworks/action-base';
import mp3Start from '../assets/mp3/start.mp3!asset';
import mp3End from '../assets/mp3/focus-end.mp3!asset';

export default class LoadAudio extends ActionBase {
  *action () {
    let ctx = new AudioContext();

    let res = yield [
      mp3Start,
      mp3End
    ].map(f=> new Promise((resolve, reject) => {
      let req = new XMLHttpRequest();
      req.open('get', f);
      req.responseType = 'arraybuffer';
      req.onload = () => {
        if(req.status!==200) {
          return reject(req.status);
        }
        ctx.decodeAudioData(req.response, (b) => {
          resolve(b);
        });
      };
      req.onerror = (err) => {
        reject(err);
      };
      req.send();
    }));
    return {
      start: res[0],
      end: res[1]
    };
  }
}
