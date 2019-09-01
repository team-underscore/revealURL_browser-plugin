# <img src="src/assets/images/icon_128.png" width="45" align="left"> RevealURL Browser Extension

[link-cws]: https://chrome.google.com/webstore/detail/revealurl/kcdinmkejhkfmpbkonnmlacolheplnck "Version published on Chrome Web Store"
[link-ffa]: https://addons.mozilla.org/en-US/firefox/addon/revealurl/ "Version published on Mozilla Add-ons"

This repo contains the source code for the [RevealURL](https://revealurl.com) **cross-browser plugin**.

## Install

- [**Chrome** extension][link-cws] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/kcdinmkejhkfmpbkonnmlacolheplnck.svg?label=%20">][link-cws]
- [**Firefox** add-on][link-ffa] [<img valign="middle" src="https://img.shields.io/amo/v/revealurl.svg?label=%20">][link-ffa]


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### Setup

Load the extension locally on your computer
**for Chrome**
- Visit `chrome://extensions/` in your Chrome browser
- Click Load Unpacked
- Select the extension’s folder

**for Firefox**
- Visit `about:debugging`
- Click on Load Temporary Add-on
- Select the `manifest.json` within the extension’s folder

### Building

Run `grunt` which generates the `build/RevealURL<% version %>.zip` file.


## TODO
- [x] Chrome Plugin
- [x] Firefox Addon
- [ ] Safari Addon
- [ ] Opera Addon
