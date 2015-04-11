(function($, deck, window, undefined) {
	var $d = $(document),
		$w = $(window),
		videos,

	handleMedia = function(current, previous) {
		$.deck("getSlide", current).find("video, audio").each(function() {
			$(this)[0].play();
		});

		$.deck("getSlide", previous).find("video, audio").each(function() {
			$(this)[0].pause();
		});
	}

	$d.bind("deck.change", function(e, from, to) {
		// Don't run if within a presenter iframe
		if ($d.find("body").hasClass("deck-presenter-iframe")) {
			return;
		}

		handleMedia(to, from);
	});
})(jQuery, 'deck', this);