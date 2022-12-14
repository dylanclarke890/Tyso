UI.onPageReady(() => {
  AddThisHelper.initGlobals();
  const videos = [
    { src: "assets/videos/tyso-vid-1.mp4", poster: "assets/videos/poster-3.png" },
    { src: "assets/videos/tyso-vid-2.mp4", poster: "assets/videos/poster-1.png" },
    { src: "assets/videos/tyso-vid-3.mp4", poster: "assets/videos/poster-2.png" },
  ];

  const videoElements = videos
    .map(
      ({ src, poster }) =>
        `<video controls src="${src}" ${poster ? `poster="${poster}"` : ""}></video>`
    )
    .join("");

  const content = document.querySelector(".content");
  if (content) content.innerHTML = videoElements;
});
