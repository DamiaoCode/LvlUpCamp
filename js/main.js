// Detectar caminho base dinâmico
const GHPagesBase = '/LvlUpCamp/';
const currentPath = window.location.pathname;
const isOnGitHubPages = currentPath.startsWith(GHPagesBase);
const base = isOnGitHubPages ? GHPagesBase : '/';

// Carregar os posts
fetch(base + 'posts.json')
  .then(res => res.json())
  .then(posts => {
    const container = document.getElementById('posts');
    if (!container) return;
    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'col-md-6 col-lg-4 mb-4';

      const hasImage = post.image && (
        post.image.startsWith("http") ||
        post.image.endsWith(".jpg") ||
        post.image.endsWith(".png") ||
        post.image.endsWith(".webp")
      );

      card.innerHTML = `
        <div class="card post-card h-100 flex-row">
          ${hasImage ? `
          <div class="col-md-4">
            <img src="${post.image}" class="img-fluid rounded-start w-100 h-100 object-fit-cover" alt="${post.title}">
          </div>` : ''}
          <div class="card-body col p-3">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.excerpt}</p>
            ${post.date ? `<p class="text-muted small">${post.date}</p>` : ''}
            <a href="${base + post.link}" class="btn btn-sm btn-outline-primary mt-2">Ler mais →</a>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Failed to load posts.json:", err);
  });

// Carregar a sidebar
fetch(base + 'sidebar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('sidebar').innerHTML = html;

    // Corrigir links da sidebar para funcionarem no GitHub Pages e local
    document.querySelectorAll('#sidebar a[data-href]').forEach(link => {
      link.setAttribute('href', base + link.getAttribute('data-href'));
    });

    // Criar botão de toggle visível em mobile
    const toggleBtn = document.createElement('nav');
    toggleBtn.className = 'd-md-none bg-dark text-white p-2';
    toggleBtn.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <span class="fw-bold">LvlUpCamp</span>
        <button class="btn btn-outline-light btn-sm" id="toggleSidebar">☰</button>
      </div>
    `;

    const container = document.querySelector('.container-fluid');
    container.parentElement.insertBefore(toggleBtn, container);

    document.getElementById('toggleSidebar').addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('mobile-show');
    });
  })
  .catch(err => {
    console.error("Failed to load sidebar:", err);
  });
