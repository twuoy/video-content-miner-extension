try {
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

} catch (e) {
  console.error(`backgroung page exception: ${e}`);
}

export {};
