function sendMessage(data) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs && tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, data, function (response) { });
        }
    });
}

/*
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    if (details.type == "xmlhttprequest" && details.method == "GET") {
        sendMessage({ action: "onBeforeRequest", requestId: details.requestId });
    }
}, { urls: ["*://*.github.com/*"] });

chrome.webRequest.onErrorOccurred.addListener(function (details) {
    if (details.type == "xmlhttprequest" && details.method == "GET") {
        sendMessage({ action: "onErrorOccurred", requestId: details.requestId });
    }
}, { urls: ["*://*.github.com/*"] });
*/
chrome.webRequest.onCompleted.addListener(function(details) {
    if (details.type == "xmlhttprequest" && details.method == "GET") {
        sendMessage({ action: "onCompleted", requestId: details.requestId });
    }
}, { urls: ["*://*.github.com/*"] });
