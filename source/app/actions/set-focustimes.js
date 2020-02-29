import ActionBase from 'meepworks/action-base';


export default class SetFocustimes extends ActionBase {
  *action (focustimes) {
    return focustimes;
  }
}
