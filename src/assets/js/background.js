'use strict';
// Determining the browser [chrome, firefox]
let browser = window.chrome ? window.chrome : window.browser;

// Creating context menu
let ContextMenuItem = {
  'id': `RevealURL_Extension`,
  'title': 'RevealURL',
  'contexts': ['link']
};

// initializing the local storage
browser.runtime.onInstalled.addListener(function () {
  browser.contextMenus.create(ContextMenuItem);
  browser.storage.sync.set({
    revealedUrls: []
  });
});

//create notification
function createNotification(title, message, priority) {
  var options = {
    iconUrl: 'assets/images/icon_128.png',
    type: 'basic',
    title: title,
    message: message,
    priority: priority
  };
  browser.notifications.create(`${Date.now()}`, options);
}

function accessStorage(storedData, data) {
  if (storedData.length > 0) {
    let isDuplicate = storedData.findIndex(function (item) {
      return item.shortUrl === data.shortUrl;
    });

    if (isDuplicate === -1) {
      storedData.push(data);
      browser.storage.sync.set({ revealedUrls: storedData });
    }
  } else {
    storedData.push(data);
    browser.storage.sync.set({ revealedUrls: storedData });
  }
}

// callback for ajax call
function handleCallback(resp, urlProvided) {
  resp = JSON.parse(resp);

  let title, safetyProbability, url;

  if (resp.spamDetails) {

    safetyProbability = (1 - (resp.spamDetails.servicesReportSpam / resp.spamDetails.servicesChecked)).toFixed(2) * 100;

    if (safetyProbability < 0.25) {
      title = `👹 SPAM`;
    } else if (safetyProbability > 0.25 && safetyProbability <= 0.5) {
      title = `⚠️ BE CAREFUL`;
    } else if (safetyProbability > 0.5 && safetyProbability <= 0.75) {
      title = `🤞 ALMOST SAFE`;
    } else {
      title = `👍 SAFE`;
    }

    url = resp.url;
  } else {
    title = `🤔 No info`;
    url = '';
  }

  if (resp.isShortUrl) {

  } else {
    url = urlProvided;
  }

  let normalizedResp = {
    longUrl: resp.url,
    shortUrl: urlProvided,
    safetyProbability: title
  };

  browser.storage.sync.get(['revealedUrls'], function (result) {
    accessStorage(result.revealedUrls, normalizedResp);
  });

  createNotification(title, url, 2);
}

// main function
browser.contextMenus.onClicked.addListener(function (info) {

  createNotification('RevealURL', 'Please wait while we get the data', 1);

  var xhr = new XMLHttpRequest();
  var backendURL = 'https://check-user-api.herokuapp.com/api/v1/uncoverUrl/';
  xhr.open('POST', backendURL);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        handleCallback(xhr.response, info.linkUrl);
      } else {
        createNotification('ERROR', 'Please try again later  😓', 2);
      }
    }
  };

  xhr.send(JSON.stringify({ 'url': info.linkUrl }));

});
