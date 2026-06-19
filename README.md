# Sitemap Generator

## Development

Run the demo through Vite instead of opening `index.html` directly. The Riot in-browser compiler fetches `.tag` files with XHR, and browsers block those requests from `file://` URLs.

1. Run `npm install`.
2. Run `npm run dev`.
3. Open `http://127.0.0.1:5173/`.

## TODO
- add tabs
- download splitted sitemaps
	- provide links for backups
	- initially when generation has finished
		- only Joomla and Wordpress
- robots.txt example for hosted version

release for joomla and wordpress?

## Changelog

### Next Release
- Features
	- Hosted sitemaps (pro only).

### 1.1.1
*Released on ... October 2019*

- Bug fix release, especially handling of proxies.

### 1.1.0
*Released on 17th October 2019*

- Features
	- Split sitemaps into multiple files if more than 50'000 URLs (pro only).
	- Sitemap backup on server (pro only).
		- Posibility to download last generated sitemap multiple times.
	- Download function to redownload sitemap from last run (pro only).
	- Stop generation process.
	- Show more detailed stats after generation has finished.
- Usability
	- Autoresume without an extra click when already running.
	- Load stats of last generation process when Sitemap Generator is opened (pro only).

### 1.0.0
*Released on 10th October 2019* 

- Initial release for WebsiteTools with all features from WordPress and Joomla version.
