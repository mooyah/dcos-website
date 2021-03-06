(function(){

  // grab data-toggle buttons
  let btns = $('[data-overlay-toggle]');

  // attach eventlisteners to the buttons
  Array.prototype.map.call(btns, (btn) => {
    $(btn).on('click', (e) => {
      e.preventDefault();
      // grab reference to overlay based on data-attribute
      let overlay = $(`[data-overlay=${btn.dataset.overlayToggle}]`)

      // toggle the visibility CSS class
      overlay.toggleClass('overlay-visible');

      // run open/close logic based on presence visibility class
      let visible = overlay.hasClass('overlay-visible');
      if (visible) {
        showOverlay.call(overlay);
      } else {
        closeOverlay.call(overlay);
      }
    });
  });

  // overlay is closed
  function closeOverlay() {
    $(this).removeClass('overlay-visible');
    $(document).off('keydown', escapePressed);
    $(document).off('click', closeOverlay);
    toggleVideoState('pause', $(this).find('.overlay__video'));
    $('body').removeClass('overlay-active');
  }

  // overlay is shown
  function showOverlay() {
    // both esc or close button closes the overlay
    $(document).on('keydown', escapePressed.bind(this));
    toggleVideoState('play', this.find('.overlay__video'));
    $('body').addClass('overlay-active');
  }

  function escapePressed(e) {
    // if escape is pressed
    if ( e.keyCode === 27 ) {
      closeOverlay.call(this);
    }
  }

  function toggleVideoState (state, element) {
    // if state === 'pause', pause video. Else: play video
    const iframe = element.find('iframe')[0].contentWindow;
    const func = state === 'pause' ? 'pauseVideo' : 'playVideo';
    iframe.postMessage('{"event":"command","func":"' + func + '","args":""}', '*'); // for some reason this doesn't work with ES6 interpolation
  }

})();
