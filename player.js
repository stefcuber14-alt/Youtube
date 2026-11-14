// TubeNova — встроенный YouTube-плеер.
(() => {
  const wrap = document.getElementById("playerWrap");
  const frame = document.getElementById("videoFrame");
  const titleBox = document.getElementById("nowTitle");

  window.playVideo = (videoId, title) => {
    if (!videoId) return;
    frame.replaceChildren();
    const iframe = document.createElement("iframe");
    iframe.src = "https://www.youtube-nocookie.com/embed/" +
      encodeURIComponent(videoId) + "?autoplay=1&rel=0";
    iframe.title = title || "YouTube video";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);
    titleBox.textContent = title || "Сейчас воспроизводится";
    wrap.classList.add("visible");
    wrap.scrollIntoView({behavior:"smooth", block:"start"});
  };

  document.getElementById("closePlayer").addEventListener("click", () => {
    frame.replaceChildren();
    wrap.classList.remove("visible");
  });
})();