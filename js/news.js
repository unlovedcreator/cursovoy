document.addEventListener('DOMContentLoaded', () => {

    const adminBtn = document.querySelector('#adminLoginBtn');
    const adminModal = document.querySelector('#adminModal');
    const loginSubmit = document.querySelector('#loginSubmit');

    const loginInput = document.querySelector('#loginInput');
    const passwordInput = document.querySelector('#passwordInput');

    const adminError = document.querySelector('#adminError');
    const adminPanel = document.querySelector('#adminPanel');

    const newsForm = document.querySelector('#newsForm');
    const newsList = document.querySelector('.news-list');

    // Открытие окна авторизации
    adminBtn.addEventListener('click', () => {
        adminModal.classList.add('active');
    });

    // Отображение корзин
    function showBins() {
        const newsBins = document.querySelectorAll('.news-card__bin');
        newsBins.forEach(bin => {
            bin.classList.add('visible');
        });
    }

    // Авторизация
    loginSubmit.addEventListener('click', () => {
        const login = loginInput.value.trim();                                              // trim удаляет пробелы
        const password = passwordInput.value.trim();
        if (login === 'admin' && password === '12345') {
            adminModal.classList.remove('active');                          
            adminPanel.classList.add('active');
            sessionStorage.setItem('adminAuth', 'true');
            adminBtn.classList.add('hidden');

            showBins();
        } else 
            adminError.textContent = 'Неверный логин или пароль';
    });

    // Закрытие окна авторизации 
    function closeAdminModal() {
        adminModal.classList.remove('active');
    }

    const adminCloseButton = document.querySelector('.admin-modal__close')
    adminCloseButton.addEventListener('click', closeAdminModal);

    document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminModal.classList.contains('active'))
        closeAdminModal();
    });

    adminModal.addEventListener('click', (e) => {                                                  
        if (e.target === adminModal)                                                        // adminModal - это темный фон вокруг окна                                                                  
            closeAdminModal();
    });

    // Проверка авторизации
    if (sessionStorage.getItem('adminAuth') === 'true') {
        adminPanel.classList.add('active');

        const button = document.querySelector('#adminLoginBtn');
        button.classList.add('hidden');

        const newsBins = document.querySelectorAll('.news-card__bin')
        showBins();
    }
    
    // Добавление новости
    newsForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = document.querySelector('#newsTitle').value.trim();
        const text = document.querySelector('#newsText').value.trim();
        if (!title || !text)
            return;

        const now = new Date();                                                             // new Date() фиксирует текущие дату и время
        const months = [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря'
        ];
        const day = String(now.getDate()).padStart(2, '0');                                 // padStart добавляет 0, если символов меньше 2
        const month = `${months[now.getMonth()]} ${now.getFullYear()}`;

        const newsHTML = `
            <article class="news-card">
                <div class="news-card__date">
                    <span class="news-card__day">${day}</span>
                    <span class="news-card__month">${month}</span>
                </div>
                <button class="news-card__bin">🗑️</button>
                <div class="news-card__content">
                    <h2 class="news-card__title">
                        ${title}
                    </h2>
                    <p class="news-card__text">
                        ${text}
                    </p>
                </div>
            </article>
        `;

        newsList.insertAdjacentHTML('afterbegin', newsHTML);

        saveNews(title, text, day, month);

        newsForm.reset();
        showBins();
        checkEmptyState();
    });

    // Сохранение новости в локальном хранилище
    function saveNews(title, text, day, month) {

        const news = JSON.parse(localStorage.getItem('news')) || [];                        // Сначала забирает строку из localStorage под
                                                                                            // ключом news, затем преобразует в массив.
        news.unshift({                                                                      // Метод unshift добавляет новый элемент в массив
            title,
            text,
            day,
            month
        });

        localStorage.setItem('news', JSON.stringify(news));                                 // Сначала преобразует массив в строку, затем
                                                                                            // затем записывает в lS под ключом news.
    }

    // Загрузка новостей
    function loadNews() {
        const news = JSON.parse(localStorage.getItem('news')) || [];

        news.reverse().forEach(item => {

            const newsHTML = `
                <article class="news-card">
                    <div class="news-card__date">
                        <span class="news-card__day">${item.day}</span>
                        <span class="news-card__month">
                            ${item.month}
                        </span>
                    </div>
                    <button class="news-card__bin">🗑️</button>
                    <div class="news-card__content">
                        <h2 class="news-card__title">
                            ${item.title}
                        </h2>
                        <p class="news-card__text">
                            ${item.text}
                        </p>
                    </div>
                </article>
            `;
            newsList.insertAdjacentHTML('afterbegin', newsHTML);
        });
    }

    // Функция проверки наличия новостей
    function checkEmptyState() {
        const newsCards = newsList.querySelectorAll('.news-card');
        let emptyMessage = newsList.querySelector('.news-empty');

        // Если новостей нет — показать сообщение
        if (newsCards.length === 0) {
            if (!emptyMessage) {
                newsList.innerHTML = `
                    <p class="news-empty">
                        Новостей пока нет.
                    </p>
                `;
            }
        } else {
            // Если новости появились — удалить сообщение
            if (emptyMessage)
                emptyMessage.remove();
        }
    } 

    loadNews();
    if (sessionStorage.getItem('adminAuth') === 'true')
        showBins(); 
    checkEmptyState();

    // Удаление новости: при клике находится карточка через closest, определяется её порядковый номер 
    // среди всех карточек, затем она удаляется из DOM и из localStorage по тому же индексу.
    function deleteNews(index) {
        const news = JSON.parse(localStorage.getItem('news')) || [];
        news.splice(index, 1);
        localStorage.setItem('news', JSON.stringify(news));
    }

    newsList.addEventListener('click', (e) => {
        if (!e.target.classList.contains('news-card__bin'))
            return;

        const card = e.target.closest('.news-card');
        const index = [...newsList.querySelectorAll('.news-card')].indexOf(card);

        card.remove();
        deleteNews(index);

        checkEmptyState();
    });
})