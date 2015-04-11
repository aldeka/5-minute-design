$(function() {
	var $current,
		$next,
		currentIndex,
		slidesWindow,
		$external,
		started;

	// Set up handler for file input
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		//$("#file-slides").bind("change", handleSlideSelect);
		jQuery.event.props.push("dataTransfer");
		$("#file-slides").bind("dragover", handleDragOver)
						 .bind("dragleave", handleDragLeave)
						 .bind("drop", handleSlideSelect);
	} else {
		console.log("The File APIs are not fully supported in this browser");
	}

	// Prevent click-through to slide iframes
	$(".slides-cover").bind("click", function(e) {
		e.preventDefault();
		e.stopPropagation();
		return false;
	});

	// Drag and drop handlers
	function handleDragOver(e) {
		e.stopPropagation();
		e.preventDefault();

		e.dataTransfer.dropEffect = "copy"; // Explicitly show this is a file copy
		$("#file-slides").addClass("drag-over");
	}

	function handleDragLeave(e) {
		e.stopPropagation();
		e.preventDefault();

		$("#file-slides").removeClass("drag-over");
	}

	// Slide selector handler
	function handleSlideSelect(e) {
		var files = e.dataTransfer.files; // FileList object
			objectURL = window.URL.createObjectURL(files[0]);

		e.stopPropagation();
		e.preventDefault();

		if (!objectURL) {
			console.log("Failed to create object URL from selected slide");
			return;
		}

		// Assume success and hide slide selection screen
		$("#select-slides").hide();

		// Show presenter display
		$("#presenter").show();

		// Populate iframes
		$("#current").attr("src", objectURL).bind("load", function(e) {
			$current = $("#current")[0].contentWindow["$"];
			$current("body").addClass("deck-presenter-iframe");
			$("#next").attr("src", objectURL).bind("load", function(e) {
				$next = $("#next")[0].contentWindow["$"];
				$next("body").addClass("deck-presenter-iframe");

				// Load slides in a new window for external monitor
				openSlidesWindow(objectURL);
			});
		});
	}

	// Load display
	function loadDisplay() {
		currentIndex = 0;
		started = false;

		// Move slides to initial positions
		$external.deck("go", currentIndex);
		$current.deck("go", currentIndex);
		$next.deck("go", currentIndex+1);

		// Update notes for the first time
		updateNotes();

		// Load clock
		loadClock();

		$(document).bind("keydown", function(e) {
			var options = $.deck.defaults;
			if (e.which === options.keys.next || $.inArray(e.which, options.keys.next) > -1) {
				e.preventDefault();

				if (!started) {
					// Start timer
					startTimer();
					started = true;
				}

				// Do nothing is this is the last slide
				if ($current.deck("getSlide", currentIndex+1) === null) {
					return;
				}

				$current.deck("go", ++currentIndex);
				$external.deck("go", currentIndex);

				var nextSlideIndex = currentIndex+1;
				if ($next.deck("getSlide", nextSlideIndex) !== null) {
					$next.deck("go", nextSlideIndex);
				} else {
					// Show black screen to signify end of deck
					$("#next").next(".slides-cover").addClass("end").html("End");
				}

				updateNotes();
			} else if (e.which === options.keys.previous || $.inArray(e.which, options.keys.previous) > -1) {
				e.preventDefault();

				if (currentIndex > 0) {
					$current.deck("go", --currentIndex);
					$external.deck("go", currentIndex);
					$next.deck("go", currentIndex+1);

					// Remove black screen over last slide (add conditional check here)
					$("#next").next(".slides-cover").removeClass("end").html("");

					updateNotes();
				}
			} else if (e.which == 116) {
				// Stop the laser button on my remote from causing a refresh
				e.preventDefault();
				e.stopPropagation();
			}
		});
	}

	// Update notes
	function updateNotes() {
		var notes = $(".notes"),
			currentNotes = $current(".deck-current .notes").html();

		notes.html(currentNotes);
	}

	// Open slide window
	function openSlidesWindow(url) {
		slidesWindow = window.open(url, "presenter-display-"+(Math.random()*1), "width=800, height=600");

		// Wait until the slides have loaded
		$(slidesWindow).bind("load", function(e) {
			$external = slidesWindow["$"];
			loadDisplay();
		});
	}

	// Set up clock
	function loadClock() {
		var clock = $(".clock"),
			time;

		setInterval(function() {
			time = moment();
			clock.html(time.format("HH:mm:ss"));
		}, 1000);
	}

	// Start timer
	function startTimer() {
		var timer = $(".timer"),
			time = Date.now();

		setInterval(function() {
			var diffTime = Math.floor((Date.now()-time)/1000),
				diffHours = ("0"+(Math.floor(diffTime/60/60))).substr(-2),
				diffMinutes = ("0"+(Math.floor(diffTime/60)-(Math.floor(diffTime/60/60)*60))).substr(-2),
				diffSeconds = ("0"+(Math.floor(diffTime-Math.floor(diffTime/60)*60))).substr(-2);

			timer.html(diffHours+":"+diffMinutes+":"+diffSeconds);
		}, 1000);
	}
});