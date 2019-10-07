'use strict';

riot.tag2('sitemap-generator', '<div id="sitemap-widget"> <form name="sitemapForm"> <div class="input-group"> <span class="input-group-btn"> <button type="submit" class="btn {generateClass}" onclick="{generate}" disabled="{generateDisabled}">Sitemap generieren</button> </span> <a class="btn {downloadClass}" onclick="{download}" disabled="{downloadDisabled}" download="sitemap.xml" href="{href}">Download</a> </div> </form> <message plugin="{events}" text="Sitemap Generator is initializing, please wait a moment." type="warning"></message> </div> <div class="row"> <div if="{stats}" class="col-lg-12"> <div class="panel panel-default"> <div class="panel-heading">Sitemap Stats</div> <table class="table table-bordered"> <tr> <td>Sitemap URL count</td> <td class="text-right" style="width: 200px;">{stats.SitemapURLCount}</td> </tr> <tr if="{hasToken()}"> <td>Sitemap image count</td> <td class="text-right">{stats.SitemapImageCount}</td> </tr> <tr if="{hasToken()}"> <td>Sitemap video count</td> <td class="text-right">{stats.SitemapVideoCount}</td> </tr> </table> </div> </div> <div if="{stats}" class="col-lg-12"> <div class="panel panel-default"> <div class="panel-heading">Crawl Stats</div> <table class="table table-bordered"> <tr> <td>Crawled URLs count</td> <td class="text-right" style="width: 200px;">{stats.CrawledResourcesCount}</td> </tr> <tr> <td>Dead URLs count</td> <td class="text-right">{stats.DeadResourcesCount}</td> </tr> <tr> <td>Timed out URLs count</td> <td class="text-right">{stats.TimedOutResourcesCount}</td> </tr> <tr> <td colspan="2"> <i>Want find out more about the dead and timed out URLs? Have a look at my <a href="https://www.marcobeierer.com/tools/link-checker" target="_blank">Link Checker</a>.</i> </td> </tr> </table> </div> </div> <div class="col-lg-12"> <div class="panel panel-default"> <div class="panel-heading">Settings</div> <table class="table table-bordered"> <tr> <td>Token activated</td> <td class="text-right" style="width: 200px;">{bool2text(hasToken())}</td> </tr> <tr> <td>Concurrent fetchers</td> <td class="text-right">{maxFetchers()}</td> </tr> </table> </div> </div> </div>', '', '', function(opts) {


		var self = this;

		self.events = riot.observable();

		self.downloadDisabled = true;
		self.generateDisabled = false;
		self.pageCount = 0;
		self.stats = null;

		self.sitemapGeneratorBlob;
		self.href;

		self.websiteURL64 = function() {
			var url64 = window.btoa(encodeURIComponent(opts.websiteUrl).replace(/%([0-9A-F]{2})/g, function(match, p1) {
				return String.fromCharCode('0x' + p1);
			}));
			url64.replace(/\+/g, '-').replace(/\//g, '_');

			return url64;
		}

		self.token = function() {
			if (opts.token) {
				return opts.token.replace(/\s/g, '');
			}
			return opts.token;
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
			return opts.maxFetchers || 3;
		}
		self.ignoreEmbeddedContent = function() {
			return opts.ignoreEmbeddedContent || '';
		}
		self.referenceCountThreshold = function() {
			return opts.referenceCountThreshold || 5;
		}
		self.queryParamsToRemove = function() {
			return opts.queryParamsToRemove || '';
		}
		self.disableCookies = function() {
			return opts.disableCookies || '';
		}
		self.enableIndexFile = function() {
			return opts.enableIndexFile || '';
		}

		self.setMessage = function(text, type, name) {
			self.events.trigger('set-message', text, type, name);
		};

		self.on('before-mount', function() {
			self.generateClass = self.btnPrimaryClass();
			self.downloadClass = self.btnDefaultClass();
		});

		self.on('mount', function() {

			setTimeout(function() {
				self.setMessage('The generation of the sitemap was not started yet.', 'info');
			}, 500);
		});

		self.apiserverURL = function() {

			if (!opts.proxyURL) {
				var query = '';
				query += '&origin_system=' + encodeURIComponent(self.systemName().toLowerCase());
				query += '&max_fetchers=' + encodeURIComponent(self.maxFetchers());
				query += '&ignore_embedded_content=' + encodeURIComponent(self.ignoreEmbeddedContent());
				query += '&reference_count_threshold=' + encodeURIComponent(self.referenceCountThreshold());
				query += '&query_params_to_remove=' + encodeURIComponent(self.queryParamsToRemove());
				query += '&disable_cookies=' + encodeURIComponent(self.disableCookies());
				query += '&enable_index_file=' + encodeURIComponent(self.enableIndexFile());

				if (opts.dev) {
					return 'http://marco-desktop:9999/sitemap/v2/' + self.websiteURL64() + '?pdfs=1' + query;
				}

				return 'https://api.marcobeierer.com/sitemap/v2/' + self.websiteURL64() + '?pdfs=1' + query;
			}

			var proxyURL = opts.proxyURL;

			if (self.systemName() == 'Joomla') {
				proxyURL += '&base64url=' + self.websiteURL64() + '&identifier=' + self.identifier();
			}

			return proxyURL;
		}

		self.generate = function(e) {
			e.preventDefault();

			self.downloadDisabled = true;
			self.generateDisabled = true;
			self.pageCount = 0;
			self.stats = null;

			var isGeneratingMessage = 'The sitemap is being generated. Please wait a moment.';
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
						self.generateDisabled = false;

						if (xhr.getResponseHeader('X-Limit-Reached') == 1) {
							self.setMessage('The Sitemap Generator reached the URL limit and the generated sitemap probably isn\'t complete. You may buy a token for the <a href="' + opts.professionalURL + '">Sitemap Generator Professional</a> to crawl up to 50\'000 URLs and create a complete sitemap. Additionally to a higher URL limit, the professional version also adds images and videos to your sitemap.', 'danger');
						}
						else {
							var message = 'Your sitemap was generated successfully. You can download the sitemap now.';
							if (['WordPress', 'Joomla'].includes(self.systemName())) {
								message = 'The generation of the sitemap was successful. The sitemap was saved as sitemap.xml in the ' + self.systemName() + ' root folder. Please see the stats below.';

							}
							self.setMessage(message, 'success');
						}

						if (xhr.getResponseHeader('X-Stats') != null) {
							self.stats = JSON.parse(xhr.getResponseHeader('X-Stats'));
						}

						self.generateClass = self.btnDefaultClass();
						self.downloadClass = self.btnPrimaryClass();
					}
					else {
						self.pageCount = data.page_count;

						if (self.pageCount > 0) {
							var message = isGeneratingMessage + '<br />' + self.pageCount + ' URLs already processed.';
							self.setMessage(message, 'warning');
						}

						setTimeout(doRequest, 1000);
					}

					self.update();
				}).
				fail(function(xhr, t, x) {
					var status = xhr.status;

					self.generateDisabled = false;

					if (status == 401) {
						self.setMessage('The validation of your token failed. The token is invalid or has expired. Please try it again or contact me if the token should be valid.', 'danger');
					}
					else if (status == 500) {
						if (xhr.getResponseHeader('X-Write-Error') == 1) {
							self.setMessage('Could not write sitemap to file. The reason for that could be a permission issue or that not enough space is available.', 'danger');
						} else if (![undefined, null, ''].includes(xhr.responseJSON) && xhr.getResponseHeader('Content-Type').startsWith('application/json')) {
							self.setMessage('The generation of your sitemap failed with the error:<br/><strong>' + xhr.responseJSON + '</strong>.', 'danger');
						} else {
							self.setMessage('The generation of your sitemap failed. Please try it again.', 'danger');
						}
					}
					else if (status == 503) {
						self.setMessage('The backend server is temporarily unavailable. Please try it again later.');
					}
					else if (status == 504 && xhr.getResponseHeader('X-CURL-Error') == 1) {
						var message = xhr.responseJSON;
						if (message == '') {
							self.setMessage('A cURL error occurred. Please contact the developer of the extensions.', 'danger');
						} else {
							self.setMessage('A cURL error occurred with the error message:<br/><strong>' + message + '</strong>.', 'danger');
						}
					}
					else if (status == 0 && self.retries < 3) {
						self.retries++;
						setTimeout(doRequest, 1000);

						self.update();
						return;
					}
					else {
						self.setMessage('The generation of your sitemap failed. Please try it again or contact the developer of the extensions.', 'danger');
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

		self.bool2text = function(val) {
			if (val) {
				return 'Yes';
			}
			return 'No';
		}
});
