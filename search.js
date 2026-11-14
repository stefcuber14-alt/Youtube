// TubeNova — поиск видео через официальный YouTube Data API v3.
(() => {
  const API_URL = "https://www.googleapis.com/youtube/v3/search";
  const queryInput = document.getElementById("query");
  const resultsBox = document.getElementById("results");
  const statusBox = document.getElementById("status");
  const sectionTitle = document.getElementById("sectionTitle");
  const apiKeyInput = document.getElementById("apiKey");
  const moreButton = document.getElementById("moreResults");

  let nextPageToken = "";
  let currentQuery = "";
  let loading = false;

  apiKeyInput.value = localStorage.getItem("tubeNovaApiKey") || "";

  document.getElementById("saveKey").addEventListener("click", () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      statusBox.textContent = "Вставь API-ключ в поле выше.";
      return;
    }
    localStorage.setItem("tubeNovaApiKey", key);
    statusBox.textContent = "Ключ сохранён в этом браузере.";
  });

  document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    searchVideos(queryInput.value.trim(), false);
  });

  document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(item => item.classList.remove("active"));
      chip.classList.add("active");
      queryInput.value = chip.dataset.query;
      searchVideos(chip.dataset.query, false);
    });
  });

  moreButton.addEventListener("click", () => searchVideos(currentQuery, true));

  async function searchVideos(query, loadMore) {
    const key = localStorage.getItem("tubeNovaApiKey") || "";
    if (!key) {
      statusBox.textContent = "Сначала добавь API-ключ в настройках поиска.";
      document.querySelector(".settings").open = true;
      return;
    }
    if (!query || loading) return;

    if (!loadMore) {
      currentQuery = query;
      nextPageToken = "";
      resultsBox.replaceChildren();
      sectionTitle.textContent = "Результаты: " + query;
    }

    loading = true;
    statusBox.textContent = "Ищем видео…";
    moreButton.style.display = "none";

    try {
      const params = new URLSearchParams({
        part:"snippet",
        type:"video",
        maxResults:"24",
        q:currentQuery,
        key
      });
      if (loadMore && nextPageToken) params.set("pageToken", nextPageToken);

      const response = await fetch(API_URL + "?" + params.toString());
      const data = await response.json();

      if (!response.ok) {
        const message = data.error?.message || "Ошибка YouTube API (" + response.status + ")";
        throw new Error(message);
      }

      nextPageToken = data.nextPageToken || "";
      renderVideos(data.items || []);
      statusBox.textContent = resultsBox.children.length
        ? (nextPageToken ? "Можно загрузить ещё видео." : "Больше результатов нет.")
        : "По этому запросу ничего не найдено.";
      moreButton.style.display = nextPageToken ? "block" : "none";
    } catch (error) {
      statusBox.textContent = "Ошибка поиска: " + error.message;
    } finally {
      loading = false;
    }
  }

  function renderVideos(items) {
    for (const item of items) {
      const videoId = item.id?.videoId;
      const snippet = item.snippet;
      if (!videoId || !snippet) continue;

      const card = document.createElement("article");
      card.className = "video-card";

      const thumbWrap = document.createElement("div");
      thumbWrap.className = "thumb-wrap";
      const image = document.createElement("img");
      image.className = "thumb";
      image.loading = "lazy";
      image.alt = "Обложка видео";
      image.src = snippet.thumbnails?.high?.url ||
                  snippet.thumbnails?.medium?.url ||
                  snippet.thumbnails?.default?.url || "";

      const overlay = document.createElement("div");
      overlay.className = "play-overlay";
      const play = document.createElement("span");
      play.textContent = "▶";
      overlay.appendChild(play);
      thumbWrap.append(image, overlay);

      const title = document.createElement("div");
      title.className = "video-title";
      title.textContent = snippet.title || "Видео";

      const channel = document.createElement("div");
      channel.className = "channel";
      channel.textContent = snippet.channelTitle || "Канал YouTube";

      const date = document.createElement("div");
      date.className = "meta";
      date.textContent = snippet.publishedAt
        ? new Date(snippet.publishedAt).toLocaleDateString("ru-RU")
        : "";

      card.append(thumbWrap, title, channel, date);
      card.addEventListener("click", () => window.playVideo(videoId, snippet.title));
      resultsBox.appendChild(card);
    }
  }
})();