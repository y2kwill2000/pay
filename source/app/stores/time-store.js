import StoreBase from 'meepworks/store-base';
import Im from 'immutable';

import SetFocustimes from '../actions/set-focustimes';
import UpdateTime from '../actions/update-time';
import ClientInit from '../actions/client-init';

const DATA = Symbol();
const INTERNAL = Symbol();

export default class TimeStore extends StoreBase {
  constructor() {
    super();
    this[DATA] = Im.fromJS({
      now: new Date(),
      parsedFocusTimes: [],
      focusTimes: [],
      delay: 0,
      focus: false
    });
    this.bindHandler(SetFocustimes, this.handleSetFocus);
    this.bindHandler(UpdateTime, this.handleUpdateTime);
    this.bindHandler(ClientInit, this.handleClientInit);
  }
  rehydrate(state) {
    state.now = new Date(state.now);
    state.parsedFocusTimes = parseFocusTimes(state.focusTimes);
    this[DATA] = Im.fromJS(state);
  }
  dehydrate() {
    let state = this[DATA].toJS();
    state.now = state.now.getTime();
    return state;
  }
  handleSetFocus(f = []) {
    if(!Array.isArray(f)) {
      f = [f];
    }
    this[DATA] = this[DATA].withMutations(m => {
      let parsed = Im.fromJS(parseFocusTimes(f));
      m.set('focusTimes', Im.fromJS(f))
      .set('parsedFocusTimes', parsed)
      .set('focus', isFocusTime(this[DATA].get('now'), parsed));
    });
    this.changed();
  }
  handleUpdateTime() {
    this[DATA] = this[DATA].withMutations(m => {
      let now = new Date().getTime();
      let delay = this[DATA].get('delay');
      if(delay > 0) {
        delay -= 5;
        if(delay > 0) {
          now -= delay;
        }
      }
      now = new Date(now);

      m.set('now', now)
        .set('delay', delay)
        .set('focus', isFocusTime(now, this[DATA].get('parsedFocusTimes')));
    });
    this.changed();
  }
  handleClientInit() {
    let now = new Date();
    let delta = now.getTime() - this[DATA].get('now').getTime();
    this[DATA] = this[DATA].set('delay', delta);
  }
  static get state() {
    return this.getInstance()[DATA];
  }
  get state() {
    return this[DATA];
  }
  static get now() {
    return this.getInstance()[DATA].get('now');
  }
  get now() {
    return this[DATA].get('now');
  }
}

function isFocusTime(t, ftimes) {
  if(ftimes.size > 0) {
    let m = t.getHours()*60 + t.getMinutes();
    return !ftimes.every(r => !(r.get('start') <=m && r.get('end') > m));
  }
  return false;
}

function parseFocusTimes(f = []) {
  if(!Array.isArray(f)) {
    f = [f];
  }
  return f.map(range => {
    range = range.split('~').map(t => {
      t = t.split(':').map(x => ~~x);
      return t[0] * 60 + t[1];
    });
    return {
      start: range[0],
      end: range[1]
    };
  });
}
