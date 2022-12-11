UI.onPageReady(() => {
  AddThisHelper.initGlobals();

  window.twttr = (function (d, s, id) {
    var t,
      js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
    return (
      window.twttr ||
      (t = {
        _e: [],
        ready: function (f) {
          t._e.push(f);
        },
      })
    );
  })(document, "script", "twitter-wjs");

  const classModalSettings = {
    id: "class-modal",
    closeButton: true,
  };
  new Modal(classModalSettings);

  const videoModalSettings = {
    id: "video-modal",
    onOpen: () => {
      const vid = document.getElementById("intro-video");
      vid.volume = 0.2;
      vid.play();
    },
    onClose: () => {
      const vid = document.getElementById("intro-video");
      vid.pause();
      vid.currentTime = 0;
    },
  };
  const videoModal = new Modal(videoModalSettings);

  UI.addEvent(document.querySelector("#video-modal a[href='videos.html']"), "click", () =>
    videoModal.close()
  );
});
