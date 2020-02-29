import React, { Component } from 'react';
import TimeStore from '../stores/time-store';
import { merge as m } from 'meepworks/styles';
import styles from './clock-styles';


export class ClockFace extends Component {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <svg
        style={
          styles.clockContainer
        }
        height="100%"
        width="100%"
        viewBox="0 0 1000 1000" >
        <circle cx="500" cy="500" r="400" stroke="black" fill="#E1EEFD" opacity="0.3"/>
        <text fill="black" fontSize="80" transform="translate(500, 180)" textAnchor="middle">12</text>
        <text fill="black" fontSize="80" transform="translate(500, 880)" textAnchor="middle">6</text>
        <text fill="black" fontSize="80" transform="translate(860, 530)" textAnchor="middle">3</text>
        <text fill="black" fontSize="80" transform="translate(140, 530)" textAnchor="middle">9</text>
        <circle fill="black" r="3" transform="translate(500 500) rotate (30) translate(0 -360) "/>
        <circle fill="black" r="3" transform="translate(500 500) rotate (60) translate(0 -360) "/>
        <circle fill="black" r="3" transform="translate(500 500) rotate (120) translate(0 -360) "/>
        <circle fill="black" r="3" transform="translate(500 500) rotate (150) translate(0 -360) "/>
        <circle fill="black" r="3" transform="translate(500 500) rotate (210) translate(0 -360) "/>
        <circle fill="black" r="3" transform="translate(500 500) rotate (240) translate(0 -360) "/>
        <circle fill="black" r="3" transform="translate(500 500) rotate (300) translate(0 -360) "/>
        <circle fill="black" r="3" transform="translate(500 500) rotate (330) translate(0 -360) "/>
      </svg>
    );
  }
}

export class Clock extends Component {
  render() {
    let now = this.props.now;
    if(!now) {
      now = new Date();
    }
    let ms = now.getMilliseconds();
    let s = now.getSeconds();
    let m = now.getMinutes();
    let h = now.getHours();

    return (
      <svg
        style={styles.clock}
        height="100%"
        width="100%"
        viewBox="0 0 1000 1000"
        >
        <Hand
          length={320}
          angle={(ms + s*1000)/60000*360}
        />
        <StyleHand
          length={200}
          color="red"
          width={10}
          angle={(h*3600000 + m*60000 + s*1000 + ms)/43200000*360}
        />
        <StyleHand
          length={350}
          width={5}
          angle={(m*60000 + s*1000 + ms)/3600000*360}
        />
      </svg>
    );

  }
}

class Hand extends Component{
  static get defaultProps() {
    return {
      color: 'black',
      width: 1,
      length: 0,
      angle: 0
    };
  }
  shouldComponentUpdate(nextProps) {
    return !(nextProps.angle === this.props.angle &&
             nextProps.color === this.props.color &&
             nextProps.width === this.props.width &&
             nextProps.length === this.props.length);
  }
  render() {
    return (
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={-this.props.length}
        stroke={this.props.color}
        strokeWidth={this.props.width}
        transform={`translate(500, 500) rotate(${this.props.angle})`}
      />
    );
  }
}

class StyleHand extends Component {
  static get defaultProps() {
    return {
      color: 'black',
      width: 1,
      length: 0,
      angle: 0
    };
  }
  shouldComponentUpdate(nextProps) {
    return !(nextProps.angle === this.props.angle &&
             nextProps.color === this.props.color &&
             nextProps.width === this.props.width &&
             nextProps.length === this.props.length);
  }
  render() {
    return (
      <polygon
        points={`0,0 ${-this.props.width/2},${-this.props.length*0.3} 0,${-this.props.length} ${this.props.width/2},${-this.props.length*0.3}`}
        fill={this.props.color}
        transform={`translate(500, 500) rotate(${this.props.angle})`}
      />
    );
  }
}
