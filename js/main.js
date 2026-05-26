document.addEventListener('DOMContentLoaded', function () {
// Соединение раскрытого списка и шапки  
const header = document.querySelector('.header');

    function updateHeaderHeight() {
        document.documentElement.style.setProperty(
            '--min-header-height',
            header.offsetHeight + 'px'
        );
    }

updateHeaderHeight();

// Debounce resize - ограничивает частоту выполнения обработчика события изменения размера окна (resize)
let resizeTimeout;

window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);

    resizeTimeout = setTimeout(() => {
        updateHeaderHeight();
    }, 100);
});

// Меню бургера
const burger = document.querySelector('.header__burger');
const nav = document.querySelector('.nav');

    if (burger && nav) {
        // Функции, отвечающие за открытие и закрытие выпадающего меню навигации
        function openMenu() {
            nav.classList.add('active');
            burger.setAttribute('aria-expanded', 'true');
            burger.setAttribute('aria-label', 'Закрыть меню');
            nav.setAttribute('aria-hidden', 'false');

            document.body.classList.add('menu-open');
        }

        function closeMenu() {
            nav.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-label', 'Открыть меню');
            nav.setAttribute('aria-hidden', 'true');

            document.body.classList.remove('menu-open');
        }   
        
        burger.addEventListener('click', function () {
            if (nav.classList.contains('active'))
                closeMenu();
            else
                openMenu();
        });

        // Закрытие по Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && nav.classList.contains('active'))
                closeMenu();
        });

        // Закрытие по клику вне меню
        document.addEventListener('click', function (e) {

        const isClickInsideNav = nav.contains(e.target);
        const isClickOnBurger = burger.contains(e.target);

        if (nav.classList.contains('active') && !isClickInsideNav && !isClickOnBurger)
            closeMenu();
        });
    }

    // ========== ACTIVE NAV LINK ==========
    highlightActiveLink();
});

function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'main.html';
    const navLinks = document.querySelectorAll('.nav__link, .nav__dropdown-link');

    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href && href.split('#')[0] === currentPath) {
            link.classList.add('active');
        }
    });
}