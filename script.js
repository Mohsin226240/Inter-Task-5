// Dark Mode Toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

// Check for saved theme preference or respect OS preference
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            localStorage.setItem('theme', 'light');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    });
}

// Wishlist Toggle (delegated)
document.querySelector('.listings-grid')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;
    e.stopPropagation();
    const icon = btn.querySelector('i');
    if (!icon) return;
    const liked = icon.classList.toggle('fas');
    icon.classList.toggle('far', !liked);
    btn.style.color = liked ? '#ff385c' : '';
});

// Navigation active state (delegated)
document.querySelector('.main-nav')?.addEventListener('click', (e) => {
    const item = e.target.closest('.nav-item');
    if (!item) return;
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
});

// Filter toggle
const filterToggle = document.querySelector('.filter-toggle');
if (filterToggle) {
    filterToggle.addEventListener('click', () => {
        const icon = filterToggle.querySelector('i');
        if (!icon) return;
        if (icon.classList.contains('fa-toggle-off')) {
            icon.classList.remove('fa-toggle-off');
            icon.classList.add('fa-toggle-on');
        } else {
            icon.classList.remove('fa-toggle-on');
            icon.classList.add('fa-toggle-off');
        }
    });
}

// Modal Popup
const modal = document.getElementById('filter-modal');
const openModalBtn = document.querySelector('.open-modal-btn');
const closeModalBtn = document.querySelector('.close-modal-btn');

function openModal() {
    if (!modal) return;
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
}

if (openModalBtn) openModalBtn.addEventListener('click', openModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (modal && event.target === modal) {
        closeModal();
    }
});

// Close modal on ESC
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
        closeModal();
    }
});

// Smooth-scroll anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId.length > 1) {
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// HERO SLIDER
(function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.slide'));
    const nextBtn = slider.querySelector('#hero-next');
    const prevBtn = slider.querySelector('#hero-prev');
    const dots = Array.from(slider.querySelectorAll('.dot'));

    let index = 0;
    let timer = null;
    const INTERVAL = 5000; // 5s

    function goTo(i) {
        index = (i + slides.length) % slides.length;
        slides.forEach((s, idx) => {
            s.classList.toggle('active', idx === index);
            s.setAttribute('aria-hidden', idx === index ? 'false' : 'true');
        });
        dots.forEach((d, idx) => {
            d.classList.toggle('active', idx === index);
            d.setAttribute('aria-selected', idx === index ? 'true' : 'false');
        });
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() { stop(); timer = setInterval(next, INTERVAL); }
    function stop() { if (timer) clearInterval(timer); timer = null; }

    nextBtn.addEventListener('click', () => { next(); start(); });
    prevBtn.addEventListener('click', () => { prev(); start(); });
    dots.forEach(d => d.addEventListener('click', () => { goTo(Number(d.dataset.index)); start(); }));

    slider.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { next(); start(); } if (e.key === 'ArrowLeft') { prev(); start(); } });
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; stop(); }, { passive: true });
    slider.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) { if (dx < 0) next(); else prev(); }
        start();
    });

    goTo(0); start();
})();

// CATEGORY SCROLLER BUTTONS
(function initCategoryScroller(){
    const scroller = document.querySelector('.nav-scroller');
    if (!scroller) return;
    const list = scroller.querySelector('.main-nav');
    const prev = scroller.querySelector('.nav-scroll-btn.prev');
    const next = scroller.querySelector('.nav-scroll-btn.next');

    function updateButtons(){
        const maxScroll = list.scrollWidth - list.clientWidth;
        prev.style.visibility = list.scrollLeft > 0 ? 'visible' : 'hidden';
        next.style.visibility = list.scrollLeft < maxScroll - 1 ? 'visible' : 'hidden';
    }

    prev.addEventListener('click', () => { list.scrollBy({ left: -list.clientWidth, behavior: 'smooth' }); });
    next.addEventListener('click', () => { list.scrollBy({ left: list.clientWidth, behavior: 'smooth' }); });
    list.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
})();

// LISTING MINI-CAROUSELS
(function initListingCarousels(){
    const carousels = Array.from(document.querySelectorAll('.listing-slider'));
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.slider-track');
        const imgs = Array.from(track.querySelectorAll('img'));
        const dots = Array.from(carousel.querySelectorAll('.dot'));
        const btnNext = carousel.querySelector('.card-btn.next');
        const btnPrev = carousel.querySelector('.card-btn.prev');
        let idx = 0;

        function goTo(i){
            idx = (i + imgs.length) % imgs.length;
            track.style.transform = `translateX(-${idx * 100}%)`;
            dots.forEach((d, di) => d.classList.toggle('active', di === idx));
        }

        btnNext.addEventListener('click', (e) => { e.stopPropagation(); goTo(idx + 1); });
        btnPrev.addEventListener('click', (e) => { e.stopPropagation(); goTo(idx - 1); });
        dots.forEach(d => d.addEventListener('click', (e) => { e.stopPropagation(); goTo(Number(d.dataset.index)); }));

        // Swipe
        let startX = 0;
        carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
        carousel.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 30) { if (dx < 0) goTo(idx + 1); else goTo(idx - 1); }
        });

        goTo(0);
    });
})();

// SEARCH OVERLAY & GUESTS
(function initSearchOverlay(){
    const headerSearch = document.querySelector('.header-search');
    const overlay = document.getElementById('search-overlay');
    const whereInput = document.getElementById('where-input');
    const whoSegment = document.querySelector('.segment.who');
    const guestsPopover = whoSegment ? whoSegment.querySelector('.guests-popover') : null;

    if (headerSearch && overlay) {
        function openOverlay(){
            overlay.setAttribute('aria-hidden', 'false');
            const headerEl = document.querySelector('header');
            if (headerEl) headerEl.classList.add('header--condensed');
            setTimeout(() => whereInput && whereInput.focus(), 50);
        }
        function closeOverlay(){
            overlay.setAttribute('aria-hidden', 'true');
        }

        headerSearch.addEventListener('click', openOverlay);
        overlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('overlay-backdrop')) closeOverlay();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') closeOverlay();
        });
    }

    if (whoSegment && guestsPopover) {
        // Guests steppers
        const updateGuestsValue = () => {
            const counts = guestsPopover.querySelectorAll('.count');
            let total = 0;
            counts.forEach(c => { if (c.dataset.type !== 'infants' && c.dataset.type !== 'pets') total += parseInt(c.textContent || '0', 10); });
            const input = whoSegment.querySelector('input');
            if (input) input.value = total > 0 ? `${total} guest${total>1?'s':''}` : '';
        };

        guestsPopover.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const row = btn.closest('.guest-row');
            const countEl = row.querySelector('.count');
            let val = parseInt(countEl.textContent || '0', 10);
            if (btn.classList.contains('plus')) val += 1; else if (btn.classList.contains('minus')) val = Math.max(0, val - 1);
            countEl.textContent = String(val);
            updateGuestsValue();
        });

        whoSegment.addEventListener('click', (e) => {
            e.stopPropagation();
            const hidden = guestsPopover.getAttribute('aria-hidden') !== 'false';
            guestsPopover.setAttribute('aria-hidden', hidden ? 'false' : 'true');
        });

        document.addEventListener('click', (e) => {
            if (!whoSegment.contains(e.target)) guestsPopover.setAttribute('aria-hidden', 'true');
        });
    }
})();

// ACCOUNT DROPDOWN
(function initAccountDropdown(){
    const trigger = document.querySelector('.profile-menu');
    const menu = document.getElementById('user-menu-dropdown');
    if (!trigger || !menu) return;

    function toggle(open){
        const show = typeof open === 'boolean' ? open : menu.getAttribute('aria-hidden') !== 'false';
        menu.style.left = 'auto';
        menu.style.right = '24px';
        menu.style.top = '72px';
        menu.setAttribute('aria-hidden', show ? 'false' : 'true');
        trigger.setAttribute('aria-expanded', show ? 'true' : 'false');
    }

    trigger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    document.addEventListener('click', (e) => { if (!menu.contains(e.target)) toggle(false); });
})();

// FILTER POPOVERS
(function initFilterPopovers(){
    const buttons = document.querySelectorAll('.filter-btn[data-popover]');
    const popovers = {
        price: document.getElementById('popover-price'),
        type: document.getElementById('popover-type'),
        rooms: document.getElementById('popover-rooms'),
        property: document.getElementById('popover-property'),
        more: document.getElementById('popover-more')
    };

    function hideAll(){ Object.values(popovers).forEach(p => p && p.setAttribute('aria-hidden', 'true')); }

    function positionPopover(btn, pop){
        const rect = btn.getBoundingClientRect();
        const top = rect.bottom + window.scrollY + 8;
        let left = rect.left + window.scrollX;
        const width = pop.offsetWidth || 280;
        const maxLeft = window.scrollX + document.documentElement.clientWidth - width - 12;
        if (left > maxLeft) left = maxLeft;
        pop.style.top = `${top}px`;
        pop.style.left = `${left}px`;
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const key = btn.dataset.popover;
            const pop = popovers[key];
            if (!pop) return;
            const isHidden = pop.getAttribute('aria-hidden') !== 'false';
            hideAll();
            if (isHidden) {
                pop.setAttribute('aria-hidden', 'false');
                positionPopover(btn, pop);
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.filter-btn[data-popover]') && !e.target.closest('.popover')) hideAll();
    });

    window.addEventListener('resize', hideAll);
})();

// STICKY HEADER CONDENSE
(function stickyHeader(){
    const header = document.querySelector('header');
    let last = 0;
    function onScroll(){
        const y = window.scrollY;
        if (y > 40 && last <= 40) header.classList.add('header--condensed');
        if (y <= 40 && last > 40) header.classList.remove('header--condensed');
        last = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// MAP TOGGLE
(function mapToggle(){
    const btn = document.querySelector('.map-toggle');
    const panel = document.querySelector('.map-panel');
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
        const showing = panel.hasAttribute('hidden');
        if (showing) {
            panel.removeAttribute('hidden');
            panel.setAttribute('aria-hidden', 'false');
            btn.setAttribute('aria-pressed', 'true');
            btn.innerHTML = '<i class="fas fa-map"></i> Hide map';
        } else {
            panel.setAttribute('hidden', '');
            panel.setAttribute('aria-hidden', 'true');
            btn.setAttribute('aria-pressed', 'false');
            btn.innerHTML = '<i class="fas fa-map"></i> Show map';
        }
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
})();
