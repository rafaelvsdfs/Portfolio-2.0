document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    const links = document.querySelectorAll('.nav-link');

    if (!header || !nav || links.length === 0) return;

    const STORAGE_KEY = 'navIndicatorPos';

    // indicador é filho do HEADER, não do nav — bottom:0 do CSS cola na borda de baixo do header
    const indicator = document.createElement('span');
    indicator.classList.add('nav-indicator');
    header.appendChild(indicator);

    const currentPage = window.location.pathname.split('/').pop();

    let activeLink = null;

    links.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();

        link.classList.remove('active');

        if (linkPage === currentPage) {
            link.classList.add('active');
            activeLink = link;
        }

        link.addEventListener('click', () => {
            const headerRect = header.getBoundingClientRect();
            const indicatorRect = indicator.getBoundingClientRect();

            sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
                left: indicatorRect.left - headerRect.left,
                width: indicatorRect.width
            }));
        });
    });

    function getTargetPosition(link) {
        const headerRect = header.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        return {
            left: linkRect.left - headerRect.left,
            width: linkRect.width
        };
    }

    function applyPosition(pos, animate) {
        if (!animate) indicator.style.transition = 'none';

        indicator.style.left = `${pos.left}px`;
        indicator.style.width = `${pos.width}px`;
        indicator.style.opacity = '1';

        if (!animate) {
            indicator.getBoundingClientRect(); // força reflow
            indicator.style.transition = 'left 0.35s ease, width 0.35s ease';
        }
    }

    const savedPos = sessionStorage.getItem(STORAGE_KEY);

    if (savedPos && activeLink) {
        const startPos = JSON.parse(savedPos);

        applyPosition(startPos, false);

        requestAnimationFrame(() => {
            applyPosition(getTargetPosition(activeLink), true);
        });

        sessionStorage.removeItem(STORAGE_KEY);
    } else if (activeLink) {
        applyPosition(getTargetPosition(activeLink), false);
    }

    window.addEventListener('resize', () => {
        if (activeLink) applyPosition(getTargetPosition(activeLink), false);
    });
});