const grid = document.getElementById('allPhotosGrid');
const count = document.getElementById('allPhotosCount');

let photos = [];
try {
    photos = JSON.parse(sessionStorage.getItem('chitrakshaDrivePhotos') || '[]');
} catch {
    photos = [];
}

function driveImageUrl(fileId, size) {
    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${size}`;
}

function openPhoto(photo) {
    const lightbox = document.createElement('div');
    lightbox.id = 'galleryLightbox';
    lightbox.innerHTML = `
        <div class="lb-backdrop"></div>
        <div class="lb-inner">
            <button class="lb-close" aria-label="Close photo">✕</button>
            <div class="lb-media"><img class="lb-img" alt=""></div>
            <div class="lb-caption">
                <span class="lb-tag"></span>
                <span class="lb-title"></span>
            </div>
        </div>`;
    lightbox.querySelector('.lb-img').src = driveImageUrl(photo.FileID, 1600);
    lightbox.querySelector('.lb-img').alt = photo.Title;
    lightbox.querySelector('.lb-tag').textContent = photo.Category;
    lightbox.querySelector('.lb-title').textContent = photo.Title;
    document.body.appendChild(lightbox);
    requestAnimationFrame(() => lightbox.classList.add('active'));

    const close = () => {
        lightbox.classList.remove('active');
        setTimeout(() => lightbox.remove(), 350);
    };
    lightbox.querySelector('.lb-close').addEventListener('click', close);
    lightbox.querySelector('.lb-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', function closeOnEscape(event) {
        if (event.key === 'Escape') {
            close();
            document.removeEventListener('keydown', closeOnEscape);
        }
    });
}

if (!Array.isArray(photos) || photos.length === 0) {
    grid.innerHTML = '<p class="all-photos-empty">Open this archive from the gallery page.</p>';
} else {
    count.textContent = `${photos.length} PHOTOS`;
    photos.forEach(photo => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'all-photo-card';
        card.setAttribute('aria-label', `Open ${photo.Title}`);

        const image = document.createElement('img');
        image.src = driveImageUrl(photo.FileID, 600);
        image.alt = photo.Title;
        image.loading = 'lazy';
        image.onerror = () => {
            card.disabled = true;
            image.remove();
            const unavailable = document.createElement('span');
            unavailable.className = 'all-photo-unavailable';
            unavailable.textContent = 'Enable link access in Drive';
            card.prepend(unavailable);
        };

        const caption = document.createElement('span');
        caption.className = 'all-photo-caption';
        caption.innerHTML = `<span></span><span></span>`;
        caption.children[0].textContent = photo.Category;
        caption.children[1].textContent = photo.Title;

        card.append(image, caption);
        card.addEventListener('click', () => openPhoto(photo));
        grid.appendChild(card);
    });
}