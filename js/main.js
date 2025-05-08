fetch('posts.json')
  .then(res => res.json())
  .then(posts => {
    const container = document.getElementById('posts');
    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'col-md-6 col-lg-4 mb-4';

      const hasImage = post.image && (post.image.startsWith("http") || post.image.endsWith(".jpg") || post.image.endsWith(".png") || post.image.endsWith(".webp"));

        card.innerHTML = `
        <div class="card post-card h-100 flex-row">
            ${hasImage ? `
            <div class="col-md-4">
                <img src="${post.image}" class="img-fluid rounded-start w-100 h-100 object-fit-cover" alt="${post.title}">
            </div>
            ` : ''}
            <div class="card-body col p-3">
            <h5 class="card-title">${post.title}</h5>
            <p class="card-text">${post.excerpt}</p>
            ${post.date ? `<p class="text-muted small">${post.date}</p>` : ''}
            <a href="${post.link}" class="btn btn-sm btn-outline-primary mt-2">Ler mais →</a>
            </div>
        </div>
        `;


      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Failed to load posts.json:", err);
  });

const sidebarPath = window.location.pathname.includes('posts/') ? '../sidebar.html' : 'sidebar.html';

fetch(sidebarPath)
  .then(res => res.text())
  .then(html => {
    document.getElementById('sidebar').innerHTML = html;
  })
  .catch(err => {
    console.error("Failed to load sidebar:", err);
  });
