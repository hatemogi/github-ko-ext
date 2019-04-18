chrome.webRequest.onCompleted.addListener(function (details) {
    console.debug(details);
    if (details.type == "xmlhttprequest" && details.method == "GET") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs.length > 0) {
                chrome.tabs.sendMessage(tabs[0].id, 
                    {action: "translate", requestId: details.requestId}, 
                    function (response) { });
            }
        });
    }
}, { urls: ["*://*.github.com/*"] });
