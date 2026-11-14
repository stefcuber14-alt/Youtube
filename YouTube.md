<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YouTube плеер</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #f2f2f2;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      min-height: 100vh;
    }
    h1 { color: #222; margin-bottom: 20px; }
    .form { display: flex; gap: 10px; width: 100%; max-width: 800px; }
    input {
      flex: 1; padding: 12px; font-size: 16px;
      border: 1px solid #ccc; border-radius: 8px;
    }
    button {
      padding: 12px 20px; font-size: 16px;
      background: #ff0000; color: white;
      border: none; border-radius: 8px; cursor: pointer;
    }
    button:hover { background: #cc0000; }
    .player {
      width: 100%; max-width: 800px; aspect-ratio: 16 / 9;
      margin-top: 20px; background: #000;
      border-radius: 8px; overflow: hidden;
    }
    .player iframe { width: 100%; height: 100%; border: none; }
    .error { color: #c00; margin-top: 10px; }
  </style>
</head>
<body>
  <h1>YouTube плеер</h1>

  <div class="form">
    <input type="text" id="url" placeholder="Вставьте ссылку на YouTube">
    <button id="play">Смотреть</button>
  </div>

  <div class="error" id="error"></div>
  <div class="player" id="player"></div>


<script>
    const input = document.getElementById('url');
    const playBtn = document.getElementById('play');
    const player = document.getElementById('player');
    const errorBox = document.getElementById('error');

    // Достаём ID видео из разных форматов ссылок
    function getVideoId(url) {
      const patterns = [
        /youtu\.be\/([\w-]{11})/,
        /youtube\.com\/watch\?.*v=([\w-]{11})/,
        /youtube\.com\/embed\/([\w-]{11})/,
        /youtube\.com\/shorts\/([\w-]{11})/
      ];
      for (const p of patterns) {
        const match = url.match(p);
        if (match) return match[1];
      }
      return null;
    }

    function playVideo() {
      const id = getVideoId(input.value.trim());

      if (!id) {
        errorBox.textContent = 'Не удалось найти видео. Проверьте ссылку.';
        player.innerHTML = '';
        return;
      }

      errorBox.textContent = '';
      player.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${id}?autoplay=1"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowfullscreen>
        </iframe>`;
    }

    playBtn.addEventListener('click', playVideo);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') playVideo();
    });
  </body>
</script>
</html>  
