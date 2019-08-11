let ContextMenuItem = {
  "id": `${Date().now}`,
  "title": "RevealURL",
  "contexts": ["link"]
}

chrome.contextMenus.create(ContextMenuItem);

// Creates a Status notification
chrome.contextMenus.onClicked.addListener(function (info) {

  createNotification('RevealURL', 'Please wait while we get the data', 0)

  // API call
  var xhr = new XMLHttpRequest();
  var backendURL = "";
  xhr.open("POST", backendURL);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        handleCallback(xhr.response)
      } else {
        createNotification('ERROR', 'Please try again later  😓', 1)
      }
    }
  }

  xhr.send(JSON.stringify({ "url": info.linkUrl }));

});


function handleCallback(resp) {
  resp = JSON.parse(resp);

  let title, safetyProbability, url;

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
  } else {
    title = `Hey There !!`;
    url = '😑 Thats not a short URL'
  }

  createNotification(title, url, 1)
}

function createNotification(title, message, priority) {
  var options = {
    iconUrl: 'images/icon_128.png',
    type: 'basic',
    title: title,
    message: message,
    priority: priority
  };
  chrome.notifications.create(`${Date.now()}`, options)
}