'use strict';

function setData(data) {

	let revealedUrlsList = document.getElementById('revealed_urls-list');

	if (data.length > 0) {
		document.getElementById('empty-state').style.display = 'none';
	}
	data.forEach(function (item) {
		// 0
		let list = document.createElement('li');

		// 1
		let statusText = document.createElement('p');
		statusText.setAttribute('class', 'status_label');
		statusText.appendChild(document.createTextNode(item.safetyProbability));

		let longUrl = document.createElement('a');
		longUrl.setAttribute('title', item.longUrl);
		longUrl.setAttribute('href', item.longUrl);
		longUrl.setAttribute('class', 'url_long');
		longUrl.setAttribute('target', '_blank');
		longUrl.appendChild(document.createTextNode(item.longUrl));
		// longUrl.innerText = 'copy';

		let shortUrl = document.createElement('a');
		shortUrl.setAttribute('title', item.shortUrl);
		shortUrl.setAttribute('href', item.shortUrl);
		shortUrl.setAttribute('class', 'url_short');
		shortUrl.setAttribute('target', '_blank');
		shortUrl.appendChild(document.createTextNode(item.shortUrl));
		// shortUrl.innerText = 'copy';

		// 2
		let fullDetails = document.createElement('a');
		fullDetails.setAttribute('title', item.shortUrl);
		fullDetails.setAttribute('href', `https://revealurl.xyz/?url=${item.shortUrl}`);
		fullDetails.setAttribute('class', 'share_url');
		fullDetails.setAttribute('target', '_blank');
		fullDetails.innerText = '[get full data]';

		list.appendChild(statusText);
		list.appendChild(longUrl);
		list.appendChild(shortUrl);
		list.appendChild(fullDetails);

		revealedUrlsList.appendChild(list);

	});
}

function init() {
	const items = ['#2529D8', '#FAA916', '#EF2D56', '#6BD425', '#A01A7D', '#0767e8', '#07bae8', '#02c554', '#13c502', '#d32f2f', '#512da8'];
	const root = document.documentElement;
	let randomColor = items[Math.floor(Math.random() * items.length)];
	root.style.setProperty('--secondary-color', `${randomColor}`);
	chrome.storage.sync.get(['revealedUrls'], function (result) {
		setData(result.revealedUrls);
	});
}

window.onload = init;
