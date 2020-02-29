import React from 'react';
import TimeStore from './stores/time-store';
import SetFocustimes from './actions/set-focustimes';
import UpdateTime from './actions/update-time';
import 'normalize.css/normalize.css!';
import styles from './app-styles';
import {merge as m} from 'meepworks/styles';
import {ClockFace, Clock} from './lib/clock';

import AudioStore from './stores/audio-store';
import InitAudio from './actions/init-audio';
import LoadAudio from './actions/load-audio';
import PlayAudio from './actions/play-audio';
import ClientInit from './actions/client-init';

import Application from 'meepworks/application';

import focusImgA from './assets/images/focus-a.png!asset';
import focusImgD from './assets/images/focus-d.png!asset';
import coopImg from './assets/images/cooperation.png!asset';
import coopLogoImg from './assets/images/cooperation-logo.png!asset';


export default class App extends Application {
  constructor(props, context) {
    super(props, context);
    this.state = {
      time: this.getStore(TimeStore).state
    };

    this.handleChange = () => {
      this.setState({
        time: this.getStore(TimeStore).state
      });

    };
  }
  static get stores() {
    return [
      TimeStore,
      AudioStore
    ];
  }
  static title() {
    return 'Meepshop Clock';
  }
  static willTransitionTo(transition, params, query, cb) {
    this.runAction(new SetFocustimes([
      '9:30~10:30',
      '11:00~12:00',
      '14:00~15:00'
    ])).then(cb);
  }
  componentDidMount() {
    (async () => {
      this.getStore(TimeStore).on(this.handleChange);

      await this.runAction(new InitAudio());
      this.runAction(new LoadAudio());

      await this.runAction(new ClientInit());
      this.mounted = true;
      requestAnimationFrame(::this.triggerUpdateTime);
    }());
  }
  componentWillUnmount() {
    this.getStore(TimeStore).off(this.handleChange);
    this.mounted = false;
  }
  shouldComponentUpdate(nextProps, nextState) {
    let focus = nextState.time.get('focus');
    let wasFocused = this.state.time.get('focus');
    if(focus !== wasFocused) {
      this.runAction(new PlayAudio(focus ? 'start' : 'end'));
    }
    return nextState.time !== this.state.time;
  }
  triggerUpdateTime() {
    (async () => {
      await this.runAction(new UpdateTime());
      if(this.mounted) {
        requestAnimationFrame(::this.triggerUpdateTime);
      }
    }());
  }
  render() {
    let focus = this.state.time.get('focus');
    return (
      <div className="app-contaier">
        {
          //<div className="debug-info">
          //  Now: {this.state.time.get('now').toString()}<br />
          //  Focus: {focus.toString()}<br /><br />
          //  Focus times: <pre><code>{JSON.stringify(this.state.time.get('focusTimes'), null, 2)}</code></pre>
          //</div>
          }
          <div
            className="app-content"
            style={m(
              styles.app
            )}
            >
            <div
              key="focus"
              style={m(
                styles.background,
                styles.focusColor
              )}>
              <div
                key="focus-background"
                style={m(
                  styles.focusBackground
                )}></div>
              <img
                key="focus-egg"
                src={focusImgA}
                style={m(
                  styles.focusEgg,
                  !focus && styles.focusEggTransform
                )}
              />
              <img
                key="focus-logo"
                src={focusImgD}
                style={m(
                  styles.focusLogo,
                  !focus && styles.focusLogoTransform
                )}
              />
            </div>
            <div
              key="normal"
              style={m(
                styles.background,
                styles.normalColor,
                focus && styles.transparent
              )}>
              <img
                key="cooperation"
                src={coopImg}
                style={m(
                  styles.cooperation,
                  focus && styles.cooperationTransform
                )}
              />
              <img
                key="cooperation-logo"
                src={coopLogoImg}
                style={m(
                  styles.cooperationLogo,
                  focus && styles.cooperationLogoTransform
                )}
              />
            </div>
            <div
              className="clock-container"
              style={m(
                styles.clockContainer,
                !focus && styles.clockCasual
              )}>
              <ClockFace />
              <Clock now={
                this.state.time.get('now')
              }/>
          </div>
        </div>
      </div>
    );
  }
}
