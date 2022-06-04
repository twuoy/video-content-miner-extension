import * as contansts from './contanst';
import * as types from './type';

chrome.runtime.onMessage.addListener(async (request: types.MessageAction, sender) => {
  const { action } = request;

  if (action === contansts.MessageAction.SetVideoTimestamp) {
    document.getElementsByTagName('video')[0].currentTime = request.payload.startTimeSec;
  }
});

export {};
