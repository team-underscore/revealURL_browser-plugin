let ContextMenuItem = {
  "id": `${Date().now}`,
  "title": "RevealURL",
  "contexts": ["link"]
}

chrome.contextMenus.create(ContextMenuItem);

// Creates a Status notification
chrome.contextMenus.onClicked.addListener(function (info) {
  var opt = {
    iconUrl: 'images/icon_128.png',
    type: 'basic',
    title: 'RevealURL',
    message: 'Please wait while we get the data',
    priority: 0
  };
  chrome.notifications.create(`${Date.now()}`, opt);

  // API call
  var xmlhttp = new XMLHttpRequest();
  var backendURL = "";
  xmlhttp.open("POST", theUrl);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      handleCallback(xmlhttp.response)
    }
  }

  xmlhttp.send(JSON.stringify({ "url": info.linkUrl }));

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


  // Shows the data
  var opt = {
    iconUrl: 'images/icon_128.png',
    type: 'basic',
    title: title,
    message: url,
    priority: 1,
    eventTime: 5
  };
  chrome.notifications.create(`${Date.now()}`, opt)
}