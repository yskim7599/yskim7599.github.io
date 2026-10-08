async function fetchPosts() {
  const listEl = document.getElementById("blog-list");

  try {
    const response = await fetch(`blog-posts.json?v=${Date.now()}`, {
      cache: "no-store"
    });
    const posts = await response.json();

    listEl.innerHTML = "";

    if (!Array.isArray(posts) || posts.length === 0) {
      listEl.innerHTML = '<li class="blog-empty">등록된 글이 없습니다.</li>';
      return;
    }

    posts.forEach((post) => {
      const li = document.createElement("li");
      const title = escapeHtml(post.title || "");
      const link = escapeAttribute(post.link || "#");
      const thumbnail = escapeAttribute(post.thumbnail || "");
      const summary = escapeHtml(post.summary || "");
      const date = formatDate(post.pubDate || post.publishedDate);

      const thumbHtml = thumbnail
        ? `<a class="blog-thumb-link" href="${link}" target="_blank" rel="noopener" aria-label="${title}">
            <img class="blog-thumb" src="${thumbnail}" alt="${title}" loading="lazy" decoding="async" width="365" height="365" referrerpolicy="no-referrer" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="blog-thumb-placeholder" style="display:none">🏗️</div>
          </a>`
        : `<a class="blog-thumb-link" href="${link}" target="_blank" rel="noopener" aria-label="${title}">
            <div class="blog-thumb-placeholder">🏗️</div>
          </a>`;

      li.innerHTML = `${thumbHtml}
        <div class="blog-body">
          <a href="${link}" target="_blank" rel="noopener">${title}</a>
          ${summary ? `<p class="blog-summary">${summary}</p>` : ""}
          ${date ? `<div class="blog-date">📅 ${date}</div>` : ""}
        </div>`;

      listEl.appendChild(li);
    });
  } catch (e) {
    listEl.innerHTML = '<li class="blog-empty">블로그 글을 불러오지 못했습니다.</li>';
  }
}

function formatDate(rawDate) {
  if (!rawDate) return "";
  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ko-KR");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

fetchPosts();
