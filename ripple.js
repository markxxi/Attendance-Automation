var rippleIntervals = {};
         
function getRandomInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRippleEffect(selector) {
  // Create the ripple interval and store its ID
  var intervalId = setInterval(function() {
    let width = $(selector).width() / 2;
    let height = $(selector).height() / 2;
    $(selector).ripples('drop', width, height, 20, 0.6);
  }, getRandomInterval(5000, 20000));
  rippleIntervals[selector] = intervalId;
}

function clearRippleEffect(selector) {
  clearInterval(rippleIntervals[selector]);
  delete rippleIntervals[selector];
}

$(document).ready(function() {
  $(".ellipse-1, .ellipse-2, .ellipse-3").ripples({
    resolution: 500,
    dropRadius: 20,
    perturbance: 0.04,
    interactive: false
  });

  // Start ripple effects for each element
  createRippleEffect(".ellipse-1");
  createRippleEffect(".ellipse-2");
  createRippleEffect(".ellipse-3");
});

// Use the Page Visibility API to pause/resume intervals
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Pause the ripple intervals when the page is hidden.
    clearRippleEffect(".ellipse-1");
    clearRippleEffect(".ellipse-2");
    clearRippleEffect(".ellipse-3");
  } else {
    // Resume the ripple intervals when the page becomes visible.
    createRippleEffect(".ellipse-1");
    createRippleEffect(".ellipse-2");
    createRippleEffect(".ellipse-3");
  }
});