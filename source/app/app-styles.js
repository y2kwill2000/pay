import StyleMap from 'meepworks/styles';
import focusImgC from './assets/images/focus-c.png!asset';

function transition (props) {
  return {
    transition: props,
    WebkitTransition: props
  };
}

function transform (props) {
  return {
    transform: props,
    WebkitTransform: props
  };
}

function transformOrigin(props) {
  return {
    transformOrigin: props,
    WebkitTransformOrigin: props
  };
}

const base = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  overflow: 'hidden'
};

const defaultTransition = transition('all 0.8s linear');

export default new StyleMap({
  app: {
    base,
    top: 0,
    left: 0,
    opacity: 1
  },
  clockContainer: {
    base,
    defaultTransition,
    margin: 'auto',
    transformOrigin: transformOrigin('100% 50%')
  },
  clockCasual: {
    transform: transform('scale(0.5)')
  },
  background: {
    base,
    defaultTransition
  },
  focusColor: {
    backgroundColor: '#BDBE08'
  },
  normalColor: {
    backgroundColor: '#75CDBE'
  },
  focusBackground: {
    base,
    defaultTransition,
    display: 'block',
    backgroundImage: `url('${focusImgC}')`,
    backgroundPosition: '50% 50%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },
  focusEgg: {
    position: 'absolute',
    maxWidth: '60%',
    maxHeight: '60%',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    defaultTransition
  },
  focusEggTransform: {
    transform: transform('scale(0)')
  },
  focusLogo: {
    display: 'block',
    position: 'absolute',
    bottom: 0,
    right: 0,
    maxWidth: '40%',
    maxHeight: '30%',
    defaultTransition
  },
  focusLogoTransform: {
    transform: transform('translateX(100%)')
  },
  transparent: {
    opacity: 0
  },
  cooperation: {
    display: 'block',
    position: 'absolute',
    maxWidth: '50%',
    maxHeight: '75%',
    top: '10%',
    right: '50%',
    defaultTransition
  },
  cooperationTransform: {
    transform:  transform('translateX(-120%)')
  },
  cooperationLogo: {
    display: 'block',
    position: 'absolute',
    right: 0,
    bottom: 0,
    maxWidth: '50%',
    defaultTransition
  },
  cooperationLogoTransform: {
    transform: transform('translateX(100%)')

  }

});
