import * as contansts from './contanst';
import * as types from './type';

chrome.runtime.onMessage.addListener((message: types.MessageAction) => {
  const { action } = message;

  if (action === contansts.MessageAction.SetVideoTimestamp) {
    document.getElementsByTagName('video')[0].currentTime = message.payload.startTimeSec;
  }
});

export {};
