import * as contansts from './contanst';
import * as types from './type';

try {
  const getCurrentTab = (): Promise<chrome.tabs.Tab> => {
    return new Promise(function(resolve, reject) {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => { resolve(tabs[0]) }
      )
    });
  };

  const handleHandshakeResponse = (message: types.MessageAction, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
    if (message.action === contansts.MessageAction.PopupToBGHandshake) {
      getCurrentTab().then((tab) => {
        const resMessage = {
          action: contansts.MessageAction.SendTabInfo,
          payload: {
            tabID: tab.id,
            tabURL: tab.url
          }
        };
        sendResponse(resMessage);
      });
    }

    // don't use async/await in background listener callback, it will raise an exception "The message port closed before a response was received" currently
    // Ref: https://stackoverflow.com/questions/54126343/how-to-fix-unchecked-runtime-lasterror-the-message-port-closed-before-a-respon
    // and return true from the event listener keeps the sendResponse() function valid after the listener returns, so we can call it later.
    // Ref: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#sending_an_asynchronous_response_using_sendresponse
    return true;
  };

  // When the extension is installed or upgraded
  chrome.runtime.onInstalled.addListener(function() {
    // Page actions are disabled by default and enabled on select tabs
    chrome.action.disable();

    // Replace all rules with a new rule
    chrome.declarativeContent.onPageChanged.removeRules(undefined, async () => {
      const onlyEnableOnYoutubeVideoRule = {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostContains: 'www.youtube.com', queryContains: 'v=' },
          })
        ],
        actions: [
          new chrome.declarativeContent.ShowAction()
        ]
      };

      chrome.declarativeContent.onPageChanged.addRules([onlyEnableOnYoutubeVideoRule]);
    });
  });

  chrome.runtime.onStartup.addListener(function() {
    chrome.storage.sync.clear();
  });

  chrome.runtime.onMessage.addListener(handleHandshakeResponse);

} catch (e) {
  console.error(`backgroung page exception: ${e}`);
}

export {};
