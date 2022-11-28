document.addEventListener("DOMContentLoaded", addVideos);

function createVideo({ src, poster } = {}) {
  return `<video controls src="${src}" ${poster ? `poster="${poster}"` : ""}></video>`;
}

function addVideos() {
  const videos = [
    { src: "assets/videos/tyso-vid-1.mp4", poster: "" },
    { src: "assets/videos/tyso-vid-2.mp4", poster: "assets/images/poster-1.png" },
    { src: "assets/videos/tyso-vid-3.mp4", poster: "assets/images/poster-2.png" },
  ];
  const videoElements = videos.map((v) => createVideo(v)).join("");
  const content = document.getElementsByClassName("content");
  if (content.length >= 1) content[0].innerHTML = videoElements;
}
