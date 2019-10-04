<raw>
	<span></span>

	<script>
		var self = this;

		self.root.innerHTML = opts.content;

		self.on('update', function() {
			self.root.innerHTML = opts.content
		});
	</script>
</raw>
