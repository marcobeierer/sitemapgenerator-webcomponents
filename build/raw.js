riot.tag2('raw', '<span></span>', '', '', function(opts) {
		var self = this;

		self.root.innerHTML = opts.content;

		self.on('update', function() {
			self.root.innerHTML = opts.content
		});
});
