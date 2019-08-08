let ContextMenuItem = {
  "id": "RevealURLMenu",
  "title": "RevealURL",
  "contexts": ["link"]
}

chrome.contextMenus.create(ContextMenuItem);

chrome.contextMenus.onClicked.addListener(function (info) {
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
  var theUrl = "";
  xmlhttp.open("POST", theUrl);
  xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      handleCallback(xmlhttp.response)
    }
  }

  xmlhttp.send(JSON.stringify({ "url": info.linkUrl }));
  
});

  function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }


  function handleCallback(resp) {
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


    chrome.notifications.create(create_UUID(), {
      title: title,
      iconUrl: chrome.runtime.getURL("images/icon_128.png"),
      type: 'basic',
      message: url || ''
    }, function () { });
  }