'use strict';

riot.tag2('sitemap-generator', '<form name="sitemapForm" onsubmit="{generate}" style="margin-bottom: 20px;"> <div class="form-group" if="{showWebsiteURLInput()}"> <label>{tr(\'WEBSITE_URL_LABEL\')}</label> <input type="url" class="form-control" name="websiteUrl" placeholder="https://example.com" riot-value="{enteredWebsiteURL}" oninput="{setWebsiteURL}" disabled="{generateDisabled}" required> </div> <div class="form-group" if="{showWebsiteURLInput()}"> <label>{tr(\'TOKEN_LABEL\')}</label> <textarea class="form-control" name="token" rows="4" placeholder="{tr(\'TOKEN_DESC\')}" riot-value="{enteredToken}" oninput="{setToken}" disabled="{generateDisabled}"></textarea> </div> <div class="btn-group" role="group"> <button type="submit" class="btn {generateClass}" if="{!generateDisabled}">{tr(\'GENERATE_SITEMAP_BUTTON\')}</button> <button type="button" class="btn btn-danger" onclick="{stopGeneration}" if="{generateDisabled}">{tr(\'STOP_GENERATION_BUTTON\')}</button> <a class="btn {downloadClass}" onclick="{download}" disabled="{downloadDisabled}" download="sitemap.xml" href="{href}">{tr(\'DOWNLOAD_BUTTON\')}</a> </div> </form> <message plugin="{events}" text="{tr(\'INIT_MESSAGE\')}" type="warning"></message> <ul if="{showTabs()}" class="nav nav-tabs" id="tabnav{id}" role="tablist"> <li role="presentation" class="{active: isActiveTab(\'stats\')}"><a href="#stats{id}" aria-controls="stats{id}" role="tab" data-toggle="tab" onclick="{showStatsTab}">{tr(\'STATS_TAB\')}</a></li> <li role="presentation" class="{active: isActiveTab(\'config\')}"><a href="#config{id}" aria-controls="config{id}" role="tab" data-toggle="tab" onclick="{showConfigTab}">{tr(\'CONFIG_TAB\')}</a></li> </ul> <div if="{showTabs()}" class="tab-content"> <div role="tabpanel" class="tab-pane {active: isActiveTab(\'stats\')}" id="stats{id}"> <p if="{!stats}" style="margin-top: 15px;">{tr(\'NO_STATS_MESSAGE\')}</p> <div class="row"> <div if="{stats}" class="col-lg-12"> <div class="panel panel-default"> <div class="panel-heading">{tr(\'SITEMAP_STATS_HEADING\')} <span title="{tr(\'STATS_FINISHED_AT_TITLE\')} {datetime(stats.FinishedAt)}" class="pull-right">{datetime(stats.FinishedAt)}</span></div> <table class="table table-bordered"> <tr> <td>{tr(\'SITEMAP_URL_COUNT\')}</td> <td class="text-right" style="width: 200px;">{stats.SitemapURLCount}</td> </tr> <tr if="{hasToken()}"> <td>{tr(\'SITEMAP_IMAGE_COUNT\')}</td> <td class="text-right">{stats.SitemapImageCount}</td> </tr> <tr if="{hasToken()}"> <td>{tr(\'SITEMAP_VIDEO_COUNT\')}</td> <td class="text-right">{stats.SitemapVideoCount}</td> </tr> </table> </div> </div> <div if="{stats && hasToken()}" class="col-lg-12"> <div class="panel panel-default"> <div class="panel-heading">{tr(\'DOWNLOAD_LAST_SITEMAP_HEADING\')} <span title="{tr(\'DOWNLOADS_FINISHED_AT_TITLE\')} {datetime(stats.FinishedAt)}" class="pull-right">{datetime(stats.FinishedAt)}</span></div> <table class="table table-bordered"> <tr> <td><a href="{apiserverURL(\'/sitemap.xml?download=1\');}">sitemap.xml</a></td> </tr> <tr each="{subSitemap in subSitemaps()}"> <td><a href="{apiserverURL(\'/\' + subSitemap + \'?download=1\')}">{subSitemap}</a></td> </tr> </table> </div> </div> <div if="{stats}" class="col-lg-12"> <div class="panel panel-default"> <div class="panel-heading">{tr(\'CRAWL_STATS_HEADING\')} <span title="{tr(\'STATS_FINISHED_AT_TITLE\')} {datetime(stats.FinishedAt)}" class="pull-right">{datetime(stats.FinishedAt)}</span></div> <table class="table table-bordered"> <tr> <td>{tr(\'CRAWLED_URLS_COUNT\')}</td> <td class="text-right" style="width: 200px;">{stats.CrawledResourcesCount}</td> </tr> <tr> <td>{tr(\'DEAD_URLS_COUNT\')}</td> <td class="text-right">{stats.DeadResourcesCount}</td> </tr> <tr> <td>{tr(\'TIMED_OUT_URLS_COUNT\')}</td> <td class="text-right">{stats.TimedOutResourcesCount}</td> </tr> <tr> <td>{tr(\'STARTED_AT\')}</td> <td class="text-right">{datetime(stats.StartedAt)}</td> </tr> <tr> <td>{tr(\'FINISHED_AT\')}</td> <td class="text-right">{datetime(stats.FinishedAt)}</td> </tr> <tr> <td colspan="2"> <i><raw content="{tr(\'LINK_CHECKER_PROMO\')}"></raw></i> </td> </tr> </table> </div> </div> <div if="{stats}" class="col-lg-12"> <div class="panel panel-default"> <div class="panel-heading">{tr(\'SETTING_STATS_HEADING\')} <span title="{tr(\'STATS_FINISHED_AT_TITLE\')} {datetime(stats.FinishedAt)}" class="pull-right">{datetime(stats.FinishedAt)}</span></div> <table class="table table-bordered"> <tr> <td>{tr(\'CRAWL_DELAY\')}</td> <td class="text-right" style="width: 200px;">{stats.CrawlDelayInSeconds} {tr(\'SECONDS_UNIT\')}</td> </tr> <tr> <td>{tr(\'CONCURRENT_FETCHERS\')}</td> <td class="text-right">{stats.MaxFetchers}</td> </tr> <tr> <td>{tr(\'URL_LIMIT\')}</td> <td class="text-right">{stats.URLLimit} {tr(\'URLS_UNIT\')}</td> </tr> <tr> <td>{tr(\'LIMIT_REACHED\')}</td> <td class="text-right">{bool2text(stats.URLLimitReached)}</td> </tr> <tr> <td>{tr(\'TOKEN_USED\')}</td> <td class="text-right">{bool2text(stats.TokenUsed)}</td> </tr> </table> </div> </div> </div> </div> <div role="tabpanel" class="tab-pane {active: isActiveTab(\'config\')}" id="config{id}"> <div class="help-block config-help" style="margin-top: 15px;"><raw content="{tr(\'CONFIG_DESC\')}"></raw></div> <div class="form-group"> <label>{tr(\'IGNORE_EMBEDDED_CONTENT_LABEL\')}</label> <select class="form-control" name="ignoreEmbeddedContent" riot-value="{configIgnoreEmbeddedContent}" onchange="{setIgnoreEmbeddedContent}" disabled="{generateDisabled}"> <option value="0">{tr(\'NO\')}</option> <option value="1">{tr(\'YES\')}</option> </select> <div class="help-block config-help"><raw content="{tr(\'IGNORE_EMBEDDED_CONTENT_DESC\')}"></raw></div> </div> <div class="form-group"> <label>{tr(\'MAX_FETCHERS_LABEL\')}</label> <input class="form-control" name="maxFetchers" min="1" max="10" step="1" riot-value="{configMaxFetchers}" oninput="{setMaxFetchers}" disabled="{generateDisabled}" type="{\'number\'}"> <div class="help-block config-help"><raw content="{tr(\'MAX_FETCHERS_DESC\')}"></raw></div> </div> <div class="form-group"> <label>{tr(\'REFERENCE_COUNT_THRESHOLD_LABEL\')}</label> <select class="form-control" name="referenceCountThreshold" riot-value="{configReferenceCountThreshold}" onchange="{setReferenceCountThreshold}" disabled="{generateDisabled}"> <option each="{option in referenceCountThresholdOptions}" riot-value="{option.value}">{option.label}</option> </select> <div class="help-block config-help"><raw content="{tr(\'REFERENCE_COUNT_THRESHOLD_DESC\')}"></raw></div> </div> <div class="form-group"> <label>{tr(\'QUERY_PARAMS_TO_REMOVE_LABEL\')}</label> <input type="text" class="form-control" name="queryParamsToRemove" riot-value="{configQueryParamsToRemove}" oninput="{setQueryParamsToRemove}" disabled="{generateDisabled}"> <div class="help-block config-help"><raw content="{tr(\'QUERY_PARAMS_TO_REMOVE_DESC\')}"></raw></div> </div> <div class="form-group"> <label>{tr(\'DISABLE_COOKIES_LABEL\')}</label> <select class="form-control" name="disableCookies" riot-value="{configDisableCookies}" onchange="{setDisableCookies}" disabled="{generateDisabled}"> <option value="0">{tr(\'NO\')}</option> <option value="1">{tr(\'YES\')}</option> </select> <div class="help-block config-help"><raw content="{tr(\'DISABLE_COOKIES_DESC\')}"></raw></div> </div> </div> </div>', 'sitemap-generator .config-help,[data-is="sitemap-generator"] .config-help,sitemap-generator .config-help p,[data-is="sitemap-generator"] .config-help p,sitemap-generator .config-help pre,[data-is="sitemap-generator"] .config-help pre{ font-size: 14px; line-height: 1.6; } sitemap-generator .config-help p,[data-is="sitemap-generator"] .config-help p{ margin: 0 0 5px; } sitemap-generator .config-help pre,[data-is="sitemap-generator"] .config-help pre{ margin: 5px 0 0; } sitemap-generator .config-help p:last-child,[data-is="sitemap-generator"] .config-help p:last-child{ margin-bottom: 0; }', '', function(opts) {


		var self = this;

		self.translations = {
			en: {
				'NO': 'No',
				'YES': 'Yes',
				'GENERATE_SITEMAP_BUTTON': 'Generate sitemap',
				'STOP_GENERATION_BUTTON': 'Stop generation',
				'DOWNLOAD_BUTTON': 'Download',
				'INIT_MESSAGE': 'Sitemap Generator is initializing, please wait a moment.',
				'STATS_TAB': 'Stats',
				'CONFIG_TAB': 'Config',
				'NO_STATS_MESSAGE': 'No stats available yet. Generate a sitemap to see stats here.',
				'SITEMAP_STATS_HEADING': 'Sitemap Stats',
				'STATS_FINISHED_AT_TITLE': 'Stats for generation process that has finished at',
				'DOWNLOADS_FINISHED_AT_TITLE': 'Downloads for generation process that has finished at',
				'SITEMAP_URL_COUNT': 'Sitemap URL count',
				'SITEMAP_IMAGE_COUNT': 'Sitemap image count',
				'SITEMAP_VIDEO_COUNT': 'Sitemap video count',
				'DOWNLOAD_LAST_SITEMAP_HEADING': 'Download Last Sitemap (or Index File and Sitemaps)',
				'CRAWL_STATS_HEADING': 'Crawl Stats',
				'CRAWLED_URLS_COUNT': 'Crawled URLs count',
				'DEAD_URLS_COUNT': 'Dead URLs count',
				'TIMED_OUT_URLS_COUNT': 'Timed out URLs count',
				'STARTED_AT': 'Started at',
				'FINISHED_AT': 'Finished at',
				'LINK_CHECKER_PROMO': 'Want find out more about the dead and timed out URLs? Have a look at my <a href="https://www.marcobeierer.com/tools/link-checker" target="_blank">Link Checker</a>.',
				'SETTING_STATS_HEADING': 'Setting Stats',
				'CRAWL_DELAY': 'Crawl delay',
				'SECONDS_UNIT': 'seconds',
				'CONCURRENT_FETCHERS': 'Concurrent fetchers',
				'URL_LIMIT': 'URL limit',
				'URLS_UNIT': 'URLs',
				'LIMIT_REACHED': 'Limit reached',
				'TOKEN_USED': 'Token used',
				'CONFIG_DESC': "Use the Sitemap Generator to create a sitemap with up to 500 URLs for free. For more URLs or image and video sitemaps, buy a token for <a href='https://www.marcobeierer.com/tools/sitemap-generator/pro'>Sitemap Generator Pro</a>. It lets you create sitemaps with up to 50,000 URLs.",
				'WEBSITE_URL_LABEL': 'Website URL',
				'TOKEN_LABEL': 'Token',
				'TOKEN_DESC': 'Optional token for Sitemap Generator Pro. Without a token, the Sitemap Generator works for websites with up to 500 URLs.',
				'IGNORE_EMBEDDED_CONTENT_LABEL': 'Ignore Embedded Content',
				'IGNORE_EMBEDDED_CONTENT_DESC': 'Does not add embedded content such as images and videos to the sitemap. This option is only useful with a valid token. Without a token, embedded content is never added to the sitemap.',
				'MAX_FETCHERS_LABEL': 'Concurrent Connections',
				'MAX_FETCHERS_DESC': 'Maximum number of concurrent connections. The default is three. Some hosts allow fewer connections. Limit the connections here so the Sitemap Generator still works. Increase the value only if your server can handle it.',
				'REFERENCE_COUNT_THRESHOLD_LABEL': 'Reference Count Threshold',
				'REFERENCE_COUNT_THRESHOLD_DESC': '<p>With the reference count threshold, exclude images and videos embedded on more than the selected number of HTML pages.</p><p>This is useful for header or footer images that should not appear in the sitemap.</p><p>Without a threshold, all images and videos are included, even if they are embedded on all HTML pages. At 0, no images and videos are included. At 5, all images and videos embedded on more than 5 HTML pages are excluded. If an excluded image or video is also embedded on the front page, it is assigned to the front page and included once in the sitemap. Linked, non-embedded images are always added.</p><p>The value does not affect the URL limit because images and videos are still crawled.</p>',
				'QUERY_PARAMS_TO_REMOVE_LABEL': 'Query Params To Remove',
				'QUERY_PARAMS_TO_REMOVE_DESC': '<p>List of query parameters separated by ampersands (&amp;). These parameters are removed from each URL before processing, for example timestamps.</p><p>For <em>q</em> and <em>timestamp</em>, this value is valid:</p><pre>q&amp;timestamp</pre>',
				'DISABLE_COOKIES_LABEL': 'Disable Cookies',
				'DISABLE_COOKIES_DESC': '<p>The Sitemap Generator crawler uses cookies by default. Cookies set by your website are used for subsequent requests and deleted after each run.</p><p>Cookie support should usually stay enabled because visitors usually have cookies enabled and the Sitemap Generator can behave like a visitor. Disable cookies only if needed.</p>',
				'NO_THRESHOLD': 'No Threshold',
				'SITEMAP_GENERATOR_NOT_STARTED': 'The Sitemap Generator was not started yet.',
				'GENERATION_NOT_STARTED': 'The generation of the sitemap was not started yet.',
				'ENTER_WEBSITE_URL': 'Please enter a website URL before generating the sitemap.',
				'GENERATION_IN_PROGRESS': 'The sitemap is being generated. Please wait a moment.',
				'URLS_PROCESSED': '{count} URLs already processed.',
				'URL_LIMIT_REACHED_MESSAGE': 'The Sitemap Generator reached the URL limit and the generated sitemap probably is not complete. You may buy a token for the <a href="{professionalUrl}">Sitemap Generator Professional</a> to crawl up to 50\'000 URLs and create a complete sitemap. Additionally to a higher URL limit, the professional version also adds images and videos to your sitemap.',
				'GENERATION_SUCCESS_DOWNLOAD': 'Your sitemap was generated successfully. You can download the sitemap now.',
				'GENERATION_SUCCESS_SAVED': 'The generation of the sitemap was successful. The sitemap was saved with the filename {filename} in the root folder of your {systemName} instance. Please see the stats below.',
				'TOKEN_INVALID': 'The validation of your token failed. The token is invalid or has expired. Please try it again or contact me if the token should be valid.',
				'WRITE_ERROR': 'Could not write sitemap to file. The reason for that could be a permission issue or that not enough space is available.',
				'GENERATION_FAILED_WITH_ERROR': 'The generation of your sitemap failed with the error:<br/><strong>{error}</strong>.',
				'GENERATION_FAILED_TRY_AGAIN': 'The generation of your sitemap failed. Please try it again.',
				'BACKEND_UNAVAILABLE': 'The backend server is temporarily unavailable. Please try it again later.',
				'CURL_ERROR_EMPTY': 'A cURL error occurred. Please contact the developer of the extensions.',
				'CURL_ERROR_WITH_MESSAGE': 'A cURL error occurred with the error message:<br/><strong>{message}</strong>.',
				'GENERATION_FAILED_CONTACT': 'The generation of your sitemap failed. Please try it again or contact the developer of the extensions.',
				'STOPPING_GENERATION': 'Going to stop the current generation.',
				'GENERATION_STOPPED': 'The current generation was stopped successfully.',
				'STOP_FAILED': 'Could not stop the generation because the connection to the server failed.'
			},
			de: {
				'NO': 'Nein',
				'YES': 'Ja',
				'GENERATE_SITEMAP_BUTTON': 'Sitemap generieren',
				'STOP_GENERATION_BUTTON': 'Generierung stoppen',
				'DOWNLOAD_BUTTON': 'Herunterladen',
				'INIT_MESSAGE': 'Sitemap-Generator wird initialisiert. Bitte einen Moment warten.',
				'STATS_TAB': 'Statistiken',
				'CONFIG_TAB': 'Konfiguration',
				'NO_STATS_MESSAGE': 'Noch keine Statistiken verfügbar. Generiere eine Sitemap, um hier Statistiken zu sehen.',
				'SITEMAP_STATS_HEADING': 'Sitemap-Statistiken',
				'STATS_FINISHED_AT_TITLE': 'Statistiken für den Generierungsvorgang, der abgeschlossen wurde am',
				'DOWNLOADS_FINISHED_AT_TITLE': 'Downloads für den Generierungsvorgang, der abgeschlossen wurde am',
				'SITEMAP_URL_COUNT': 'Anzahl der Sitemap-URLs',
				'SITEMAP_IMAGE_COUNT': 'Anzahl der Sitemap-Bilder',
				'SITEMAP_VIDEO_COUNT': 'Anzahl der Sitemap-Videos',
				'DOWNLOAD_LAST_SITEMAP_HEADING': 'Letzte Sitemap herunterladen (oder Indexdatei und Sitemaps)',
				'CRAWL_STATS_HEADING': 'Crawl-Statistiken',
				'CRAWLED_URLS_COUNT': 'Anzahl gecrawlter URLs',
				'DEAD_URLS_COUNT': 'Anzahl defekter URLs',
				'TIMED_OUT_URLS_COUNT': 'Anzahl der URLs mit Zeitüberschreitung',
				'STARTED_AT': 'Gestartet am',
				'FINISHED_AT': 'Abgeschlossen am',
				'LINK_CHECKER_PROMO': 'Möchtest du mehr über die defekten URLs und URLs mit Zeitüberschreitung erfahren? Sieh dir meinen <a href="https://www.marcobeierer.com/tools/link-checker" target="_blank">Link Checker</a> an.',
				'SETTING_STATS_HEADING': 'Einstellungen',
				'CRAWL_DELAY': 'Crawl-Verzögerung',
				'SECONDS_UNIT': 'Sekunden',
				'CONCURRENT_FETCHERS': 'Gleichzeitige Verbindungen',
				'URL_LIMIT': 'URL-Limit',
				'URLS_UNIT': 'URLs',
				'LIMIT_REACHED': 'Limit erreicht',
				'TOKEN_USED': 'Token verwendet',
				'CONFIG_DESC': "Mit dem Sitemap-Generator kannst du kostenlos eine Sitemap mit bis zu 500 URLs erstellen. Für mehr URLs oder Bild- und Video-Sitemaps kannst du einen Token für <a href='https://www.marcobeierer.com/tools/sitemap-generator/pro'>Sitemap-Generator Pro</a> kaufen. Damit erstellst du Sitemaps mit bis zu 50.000 URLs.",
				'WEBSITE_URL_LABEL': 'Website-URL',
				'TOKEN_LABEL': 'Token',
				'TOKEN_DESC': 'Optionaler Token für Sitemap-Generator Pro. Ohne Token funktioniert der Sitemap-Generator für Websites mit bis zu 500 URLs.',
				'IGNORE_EMBEDDED_CONTENT_LABEL': 'Eingebettete Inhalte ignorieren',
				'IGNORE_EMBEDDED_CONTENT_DESC': 'Fügt eingebettete Inhalte wie Bilder und Videos nicht zur Sitemap hinzu. Diese Option ist nur mit gültigem Token sinnvoll. Ohne Token werden eingebettete Inhalte nie zur Sitemap hinzugefügt.',
				'MAX_FETCHERS_LABEL': 'Gleichzeitige Verbindungen',
				'MAX_FETCHERS_DESC': 'Maximale Anzahl gleichzeitiger Verbindungen. Standard sind drei. Manche Hoster erlauben weniger Verbindungen. Begrenze hier die Verbindungen, damit der Sitemap-Generator trotzdem funktioniert. Erhöhe den Wert nur, wenn dein Server das verkraftet.',
				'REFERENCE_COUNT_THRESHOLD_LABEL': 'Referenzanzahl-Schwellenwert',
				'REFERENCE_COUNT_THRESHOLD_DESC': '<p>Mit dem Referenzanzahl-Schwellenwert schliesst du Bilder und Videos aus, die auf mehr als der gewählten Anzahl von HTML-Seiten eingebettet sind.</p><p>Das ist nützlich für Header- oder Footer-Bilder, die nicht in die Sitemap sollen.</p><p>Ohne Schwellenwert werden alle Bilder und Videos aufgenommen, auch wenn sie auf allen HTML-Seiten eingebettet sind. Bei 0 werden keine Bilder und Videos aufgenommen. Bei 5 werden alle ausgeschlossen, die auf mehr als 5 HTML-Seiten eingebettet sind. Ist ein ausgeschlossenes Bild oder Video auch auf der Startseite eingebettet, wird es der Startseite zugeordnet und einmal in die Sitemap aufgenommen. Verlinkte, nicht eingebettete Bilder werden immer hinzugefügt.</p><p>Der Wert beeinflusst das URL-Limit nicht, weil Bilder und Videos trotzdem gecrawlt werden.</p>',
				'QUERY_PARAMS_TO_REMOVE_LABEL': 'Zu entfernende Query-Parameter',
				'QUERY_PARAMS_TO_REMOVE_DESC': '<p>Liste von Query-Parametern, getrennt durch kaufmännische Und-Zeichen (&amp;). Diese Parameter werden vor der Verarbeitung aus jeder URL entfernt, etwa Zeitstempel.</p><p>Für <em>q</em> und <em>timestamp</em> ist dieser Wert gültig:</p><pre>q&amp;timestamp</pre>',
				'DISABLE_COOKIES_LABEL': 'Cookies deaktivieren',
				'DISABLE_COOKIES_DESC': '<p>Der Sitemap-Generator-Crawler nutzt Cookies standardmässig. Von deiner Website gesetzte Cookies werden für folgende Requests verwendet und nach jedem Lauf gelöscht.</p><p>Cookie-Unterstützung sollte meist aktiv bleiben, weil Besucher Cookies üblicherweise aktiviert haben und der Sitemap-Generator sich so wie ein Besucher verhält. Deaktiviere Cookies nur bei Bedarf.</p>',
				'NO_THRESHOLD': 'Kein Schwellenwert',
				'SITEMAP_GENERATOR_NOT_STARTED': 'Der Sitemap-Generator wurde noch nicht gestartet.',
				'GENERATION_NOT_STARTED': 'Die Generierung der Sitemap wurde noch nicht gestartet.',
				'ENTER_WEBSITE_URL': 'Bitte gib eine Website-URL ein, bevor du die Sitemap generierst.',
				'GENERATION_IN_PROGRESS': 'Die Sitemap wird generiert. Bitte einen Moment warten.',
				'URLS_PROCESSED': '{count} URLs bereits verarbeitet.',
				'URL_LIMIT_REACHED_MESSAGE': 'Der Sitemap-Generator hat das URL-Limit erreicht. Die generierte Sitemap ist wahrscheinlich unvollständig. Mit einem Token für den <a href="{professionalUrl}">Sitemap-Generator Professional</a> kannst du bis zu 50.000 URLs crawlen und eine vollständige Sitemap erstellen. Die Professional-Version fügt der Sitemap ausserdem Bilder und Videos hinzu.',
				'GENERATION_SUCCESS_DOWNLOAD': 'Deine Sitemap wurde erfolgreich generiert. Du kannst die Sitemap jetzt herunterladen.',
				'GENERATION_SUCCESS_SAVED': 'Die Generierung der Sitemap war erfolgreich. Die Sitemap wurde mit dem Dateinamen {filename} im Root-Verzeichnis deiner {systemName}-Instanz gespeichert. Bitte siehe die Statistiken unten.',
				'TOKEN_INVALID': 'Die Überprüfung deines Tokens ist fehlgeschlagen. Der Token ist ungültig oder abgelaufen. Bitte versuche es erneut oder kontaktiere mich, falls der Token gültig sein sollte.',
				'WRITE_ERROR': 'Die Sitemap konnte nicht in die Datei geschrieben werden. Grund dafür könnte ein Berechtigungsproblem sein oder dass nicht genügend Speicherplatz verfügbar ist.',
				'GENERATION_FAILED_WITH_ERROR': 'Die Generierung deiner Sitemap ist mit folgendem Fehler fehlgeschlagen:<br/><strong>{error}</strong>.',
				'GENERATION_FAILED_TRY_AGAIN': 'Die Generierung deiner Sitemap ist fehlgeschlagen. Bitte versuche es erneut.',
				'BACKEND_UNAVAILABLE': 'Der Backend-Server ist vorübergehend nicht verfügbar. Bitte versuche es später erneut.',
				'CURL_ERROR_EMPTY': 'Ein cURL-Fehler ist aufgetreten. Bitte kontaktiere den Entwickler der Erweiterungen.',
				'CURL_ERROR_WITH_MESSAGE': 'Ein cURL-Fehler ist mit folgender Fehlermeldung aufgetreten:<br/><strong>{message}</strong>.',
				'GENERATION_FAILED_CONTACT': 'Die Generierung deiner Sitemap ist fehlgeschlagen. Bitte versuche es erneut oder kontaktiere den Entwickler der Erweiterungen.',
				'STOPPING_GENERATION': 'Die aktuelle Generierung wird gestoppt.',
				'GENERATION_STOPPED': 'Die aktuelle Generierung wurde erfolgreich gestoppt.',
				'STOP_FAILED': 'Die Generierung konnte nicht gestoppt werden, weil die Verbindung zum Server fehlgeschlagen ist.'
			}
		};

		self.language = opts.language == 'de' ? 'de' : 'en';

		self.tr = function(key) {
			var translations = self.translations[self.language] || self.translations.en;
			return translations[key] || self.translations.en[key] || key;
		}

		self.trFormat = function(key, values) {
			var text = self.tr(key);
			values = values || {};

			Object.keys(values).forEach(function(name) {
				text = text.replace(new RegExp('\\{' + name + '\\}', 'g'), values[name]);
			});

			return text;
		}

		self.optionValue = function(value, defaultValue) {
			return [undefined, null, ''].includes(value) ? defaultValue : value;
		}

		self.referenceCountThresholdOptions = [
			{ value: '-1', label: self.tr('NO_THRESHOLD') }
		];
		for (var i = 1; i <= 100; i++) {
			self.referenceCountThresholdOptions.push({ value: String(i), label: String(i) });
		}

		self.events = riot.observable();

		self.downloadDisabled = true;
		self.generateDisabled = false;
		self.pageCount = 0;
		self.stats = null;
		self.forceStop = false;

		self.sitemapGeneratorBlob;
		self.href;
		self.enteredWebsiteURL = '';
		self.enteredToken = opts.token || '';
		self.configIgnoreEmbeddedContent = String(self.optionValue(opts.ignoreEmbeddedContent, '0'));
		self.configMaxFetchers = String(self.optionValue(opts.maxFetchers, 3));
		self.configReferenceCountThreshold = String(self.optionValue(opts.referenceCountThreshold, 5));
		self.configQueryParamsToRemove = self.optionValue(opts.queryParamsToRemove, '');
		self.configDisableCookies = String(self.optionValue(opts.disableCookies, '0'));
		self.id = opts.id || self._riot_id || 0;

		self.showWebsiteURLInput = function() {
			return (opts.websiteUrl || '').trim() == '';
		}

		self.showTabs = function() {
			return [true, 'true', '1', 1].includes(opts.showTabs);
		}

		self.activeTab = 'stats';

		self.isActiveTab = function(tabName) {
			return self.activeTab == tabName;
		}

		self.showTab = function(tabName, e) {
			if (e) {
				e.preventDefault();
			}

			self.activeTab = tabName;
		}

		self.showStatsTab = function(e) {
			self.showTab('stats', e);
		}

		self.showConfigTab = function(e) {
			self.showTab('config', e);
		}

		self.setWebsiteURL = function(e) {
			self.enteredWebsiteURL = e.target.value;
		}

		self.setToken = function(e) {
			self.enteredToken = e.target.value;
		}

		self.setIgnoreEmbeddedContent = function(e) {
			self.configIgnoreEmbeddedContent = e.target.value;
		}

		self.setMaxFetchers = function(e) {
			self.configMaxFetchers = e.target.value;
		}

		self.setReferenceCountThreshold = function(e) {
			self.configReferenceCountThreshold = e.target.value;
		}

		self.setQueryParamsToRemove = function(e) {
			self.configQueryParamsToRemove = e.target.value;
		}

		self.setDisableCookies = function(e) {
			self.configDisableCookies = e.target.value;
		}

		self.websiteURL = function() {
			return (opts.websiteUrl || self.enteredWebsiteURL || '').trim();
		}

		self.websiteURL64 = function() {
			var url64 = window.btoa(encodeURIComponent(self.websiteURL()).replace(/%([0-9A-F]{2})/g, function(match, p1) {
				return String.fromCharCode('0x' + p1);
			}));
			url64.replace(/\+/g, '-').replace(/\//g, '_');

			return url64;
		}

		self.token = function() {
			var token = self.showWebsiteURLInput() ? self.enteredToken : opts.token;

			if (token) {
				return token.replace(/\s/g, '');
			}
			return token;
		}

		self.hasToken = function() {
			return ![undefined, null, ''].includes(self.token());
		}

		self.identifier = function() {
			return opts.identifier || '';
		}

		self.systemName = function() {
			return opts.systemName || 'Unknown';
		}
		self.btnPrimaryClass = function() {
			return opts.btnPrimaryClass || 'btn-primary';
		}
		self.btnDefaultClass = function() {
			return opts.btnDefaultClass || 'btn-default';
		}

		self.maxFetchers = function() {
			return self.configMaxFetchers || 3;
		}
		self.ignoreEmbeddedContent = function() {
			return self.configIgnoreEmbeddedContent;
		}
		self.referenceCountThreshold = function() {
			return self.configReferenceCountThreshold || 5;
		}
		self.queryParamsToRemove = function() {
			return self.configQueryParamsToRemove || '';
		}
		self.disableCookies = function() {
			return self.configDisableCookies;
		}
		self.enableIndexFile = function() {
			return opts.enableIndexFile || '';
		}
		self.sitemapFilename = function() {
			return opts.sitemapFilename || 'sitemap.xml';
		}

		self.setMessage = function(text, type, name) {
			self.events.trigger('set-message', text, type, name);
		};

		self.on('before-mount', function() {
			self.generateClass = self.btnPrimaryClass();
			self.downloadClass = self.btnDefaultClass();
		});

		self.on('mount', function() {

			if (self.websiteURL() != '') {
				var tokenHeader = '';
				if (self.hasToken()) {
					tokenHeader = 'BEARER ' + self.token();
				}

				var url64 = self.websiteURL64();
				var url = self.apiserverURL('/running');

				jQuery.ajax({
					method: 'GET',
					url: url,
					headers: {
						'Authorization': tokenHeader,
						'Cache-Control': 'no-store',
					}
				}).done(function(data, textStatus, xhr) {
					if (data.Running) {
						self.generate();
					} else {
						self.setMessage(self.tr('SITEMAP_GENERATOR_NOT_STARTED'), 'info');
					}

					if (data.SitemapAvailable) {
						self.loadDataFromServer();
					}
				})
				.fail(function(xhr) {
					self.setMessage(self.tr('SITEMAP_GENERATOR_NOT_STARTED'), 'info');
				});
			} else {

				setTimeout(function() {
					self.setMessage(self.tr('GENERATION_NOT_STARTED'), 'info');
				}, 500);
			}
		});

		self.apiserverURL = function(endpoint) {
			if (endpoint == undefined) {
				endpoint = '';
			}

			var urlSuffix = '';
			var apiserverURL = opts.proxyUrl;

			if (!apiserverURL || endpoint != '') {

				if (opts.dev) {
					apiserverURL = 'http://marco-desktop:9999/sitemap/v2/' + self.websiteURL64();
				} else {
					apiserverURL = 'https://api.marcobeierer.com/sitemap/v2/' + self.websiteURL64();
				}
			}

			if (endpoint != '') {
				urlSuffix = endpoint;
			} else {
				var query = '';

				if (opts.proxyUrl) {
					query += '&';
				} else {
					query += '?';
				}
				query += 'pdfs=1';

				query += '&origin_system=' + encodeURIComponent(self.systemName().toLowerCase());
				query += '&max_fetchers=' + encodeURIComponent(self.maxFetchers());
				query += '&ignore_embedded_content=' + encodeURIComponent(self.ignoreEmbeddedContent());
				query += '&reference_count_threshold=' + encodeURIComponent(self.referenceCountThreshold());
				query += '&query_params_to_remove=' + encodeURIComponent(self.queryParamsToRemove());
				query += '&disable_cookies=' + encodeURIComponent(self.disableCookies());
				query += '&enable_index_file=' + encodeURIComponent(self.enableIndexFile());

				if (opts.proxyUrl) {
					query += '&baseurl64=' + self.websiteURL64();
					if (self.identifier() != '') {
						query += '&identifier=' + self.identifier();
					}
				}

				urlSuffix = query;
			}

			return apiserverURL + urlSuffix;
		}

		self.generate = function(e) {

			if (e) {
				e.preventDefault();
			}

			if (self.generateDisabled) {
				return;
			}

			if (self.websiteURL() == '') {
				self.setMessage(self.tr('ENTER_WEBSITE_URL'), 'danger');
				return;
			}

			self.downloadDisabled = true;
			self.generateDisabled = true;
			self.pageCount = 0;

			var isGeneratingMessage = self.tr('GENERATION_IN_PROGRESS');
			self.setMessage(isGeneratingMessage, 'warning');

			self.generateClass = self.btnPrimaryClass();
			self.downloadClass = self.btnDefaultClass();

			self.retries = 0;

			var doRequest = function() {
				var tokenHeader = '';
				if (self.hasToken()) {
					tokenHeader = 'BEARER ' + self.token();
				}

				jQuery.ajax({
					method: 'GET',
					url: self.apiserverURL(),
					headers: {
						'Authorization': tokenHeader,
						'Cache-Control': 'no-store',
					},
				}).
				done(function(data, statusText, xhr) {
					self.retries = 0;

					if (xhr.getResponseHeader('Content-Type').startsWith('application/xml') || xhr.getResponseHeader('Content-Type').startsWith('text/xml')) {
						self.sitemapGeneratorBlob = new Blob([ xhr.responseText ], { type : 'application/xml' });
						self.href = (window.URL || window.webkitURL).createObjectURL(self.sitemapGeneratorBlob);

						self.downloadDisabled = false;
						self.events.trigger('stopped');

						if (xhr.getResponseHeader('X-Stats') != null) {
							self.stats = JSON.parse(xhr.getResponseHeader('X-Stats'));
						}

						if (self.stats && self.stats.URLLimitReached) {
							self.setMessage(self.trFormat('URL_LIMIT_REACHED_MESSAGE', { professionalUrl: opts.professionalUrl || '' }), 'danger');
						}
						else {
							var message = self.tr('GENERATION_SUCCESS_DOWNLOAD');
							if (['WordPress', 'Joomla'].includes(self.systemName())) {
								message = self.trFormat('GENERATION_SUCCESS_SAVED', { filename: self.sitemapFilename(), systemName: self.systemName() });
							}
							self.setMessage(message, 'success');
						}

						self.generateClass = self.btnDefaultClass();
						self.downloadClass = self.btnPrimaryClass();
					}
					else {
						self.pageCount = data.page_count;

					if (self.pageCount > 0) {
							var message = isGeneratingMessage + '<br />' + self.trFormat('URLS_PROCESSED', { count: self.pageCount });
							self.setMessage(message, 'warning');
						}

						if (self.forceStop) {
							self.stop(self.apiserverURL(), tokenHeader);
						} else {
							setTimeout(doRequest, 1000);
						}
					}

					self.update();
				}).
				fail(function(xhr, t, x) {
					var status = xhr.status;

					self.events.trigger('stopped');

					if (status == 401) {
						self.setMessage(self.tr('TOKEN_INVALID'), 'danger');
					}
					else if (status == 500) {
						if (xhr.getResponseHeader('X-Write-Error') == 1) {
							self.setMessage(self.tr('WRITE_ERROR'), 'danger');
						} else if (![undefined, null, ''].includes(xhr.responseJSON) && xhr.getResponseHeader('Content-Type').startsWith('application/json')) {
							self.setMessage(self.trFormat('GENERATION_FAILED_WITH_ERROR', { error: xhr.responseJSON }), 'danger');
						} else {
							self.setMessage(self.tr('GENERATION_FAILED_TRY_AGAIN'), 'danger');
						}
					}
					else if (status == 503) {
						self.setMessage(self.tr('BACKEND_UNAVAILABLE'));
					}
					else if (status == 504 && xhr.getResponseHeader('X-CURL-Error') == 1) {
						var message = xhr.responseJSON;
						if (message == '') {
							self.setMessage(self.tr('CURL_ERROR_EMPTY'), 'danger');
						} else {
							self.setMessage(self.trFormat('CURL_ERROR_WITH_MESSAGE', { message: message }), 'danger');
						}
					}
					else if (status == 0 && self.retries < 3) {
						self.retries++;

						if (self.forceStop) {
							self.stop(self.apiserverURL(), tokenHeader);
						} else {
							setTimeout(doRequest, 1000);
						}

						self.update();
						return;
					}
					else {
						self.setMessage(self.tr('GENERATION_FAILED_CONTACT'), 'danger');
					}

					self.update();
				});
			}
			doRequest();
		}

		self.download = function(e) {

			if (window.navigator.msSaveOrOpenBlob && self.sitemapGeneratorBlob) {
				window.navigator.msSaveOrOpenBlob(self.sitemapGeneratorBlob, 'sitemap.xml');
			}
		}

		self.stopGeneration = function(e) {
			e.preventDefault();
			self.forceStop = true;
		}

		self.events.on('stopped', function() {
			self.generateDisabled = false;
			self.update();
		});

		self.stop = function(url, tokenHeader) {
			self.setMessage(self.tr('STOPPING_GENERATION'), 'warning');
			self.update();

			jQuery.ajax({
				method: 'DELETE',
				url: url,
				headers: {
					'Authorization': tokenHeader,
				}
			}).done(function(data) {
				self.setMessage(self.tr('GENERATION_STOPPED'), 'info');
			}).fail(function(xhr) {
				self.setMessage(self.tr('STOP_FAILED'), 'danger');
			}).always(function() {
				self.forceStop = false;
				self.events.trigger('stopped');
				self.update();
			});
		}

		self.loadDataFromServer = function() {
			if (!self.hasToken()) {
				return;
			}
			var tokenHeader = 'BEARER ' + self.token();

			var url64 = self.websiteURL64();
			var url = self.apiserverURL('/stats');

			jQuery.ajax({
				method: 'GET',
				url: url,
				headers: {
					'Authorization': tokenHeader,
				}
			})
			.done(function(data) {
				self.stats = data;
			})
			.fail(function(xhr) {
				console.log('fetching saved result failed');
			})
			.always(function() {
				self.update();
			});
		};

		self.bool2text = function(val) {
			if (val) {
				return self.tr('YES');
			}
			return self.tr('NO');
		}

		self.subSitemaps = function() {
			var subSitemaps = [];

			if (!self.stats) {
				return subSitemaps;
			}

			var nulls = '';

			for (var i = 0; i < self.stats.SitemapIndexNumberOfDigits; i++) {
				nulls += '0';
			}

			for (var i = 0; i < self.stats.SitemapIndexCount; i++) {
				var indexString = (nulls + i).slice(-self.stats.SitemapIndexNumberOfDigits);
				subSitemaps.push('sitemap.' + indexString + '.xml');
			}

			return subSitemaps;
		}

		self.datetime = function(val) {
			return new Date(val).toLocaleString();
		}

		self.datetimeAt = function(val) {
			var datetime = self.datetime(val);
			return datetime.replace(',', ' at');
		};
});
