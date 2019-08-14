let ContextMenuItem = {
  "id": `RevealURL_Extension`,
  "title": "RevealURL",
  "contexts": ["link"]
}

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create(ContextMenuItem);
  chrome.storage.sync.set({
    revealedUrls: []
  });
});


// Creates a Status notification
chrome.contextMenus.onClicked.addListener(function (info) {

  createNotification('RevealURL', 'Please wait while we get the data', 1)

  // API call
  var xhr = new XMLHttpRequest();
  var backendURL = "";
  xhr.open("POST", backendURL);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        handleCallback(xhr.response, info.linkUrl)
      } else {
        createNotification('ERROR', 'Please try again later  😓', 2)
      }
    }
  }

  xhr.send(JSON.stringify({ "url": info.linkUrl }));

});


function handleCallback(resp, shortUrl) {
  resp = JSON.parse(resp);

  let title, safetyProbability, url;
  let that = this;

  if (resp.isShortUrl) {

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

    let normalizedResp = {
      longUrl: resp.url,
      shortUrl: shortUrl,
      safetyProbability: title
    }

    chrome.storage.sync.get(['revealedUrls'], function (result) {
      that.accessStorage(result.revealedUrls, normalizedResp);
    });

  } else {
    title = `Hey There !!`;
    url = '😑 Thats not a short URL'
  }

  createNotification(title, url, 2)
}

function createNotification(title, message, priority) {
  var options = {
    iconUrl: 'assets/images/icon_128.png',
    type: 'basic',
    title: title,
    message: message,
    priority: priority
  };
  chrome.notifications.create(`${Date.now()}`, options)
}

function accessStorage(storedData, data) {
  if (storedData.length > 0) {
    let isDuplicate = storedData.findIndex(function (item) {
      return item.shortUrl === data.shortUrl
    })

    if (isDuplicate === -1) {
      storedData.push(data);
      chrome.storage.sync.set({ revealedUrls: storedData });
    }
  } else {
    storedData.push(data);
    chrome.storage.sync.set({ revealedUrls: storedData });
  }
}