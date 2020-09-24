import { createReducer } from '../../utils/createReducer';
import {BehaviorState, MessagesState} from '../types';

import {
  BehaviorActions,
  TOGGLE_CHAT,
  TOGGLE_INPUT_DISABLED,
  TOGGLE_MESSAGE_LOADER,
  REMEMBER_WINDOW_POS,
  SET_IS_SCROLLING
} from '../actions/types';

const initialState = {
  showChat: false,
  disabledInput: false,
  messageLoader: false,
  windowPos: 0
};

const behaviorReducer = {
  [TOGGLE_CHAT]: (state: BehaviorState) => ({ ...state, showChat: !state.showChat}),

  [TOGGLE_INPUT_DISABLED]: (state: BehaviorState) => ({ ...state, disabledInput: !state.disabledInput }),

  [TOGGLE_MESSAGE_LOADER]: (state: BehaviorState) => ({ ...state, messageLoader: !state.messageLoader }),

  [REMEMBER_WINDOW_POS]: (state: BehaviorState, { position }) => ({ ...state, windowPos: position }),

  [SET_IS_SCROLLING]: (state: BehaviorState, { scrollingInProcess }) => ({ ...state, scrollingInProcess: scrollingInProcess }),
};

export default (state: BehaviorState = initialState, action: BehaviorActions) => createReducer(behaviorReducer, state, action);
