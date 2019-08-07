let ContextMenuItem = {
  "id": "RevealURLMenu",
  "title": "RevealURL",
  "contexts": ["link"]
}

chrome.contextMenus.create(ContextMenuItem);

chrome.contextMenus.onClicked.addListener(function (info) {
  setTimeout(() => {
    alert(info.linkUrl)
  },1000)
});