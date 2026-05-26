document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('.form');

    if (contactForm) {
        const nameInput = contactForm.querySelector('#name');
        const phoneInput = contactForm.querySelector('#phone');
        const emailInput = contactForm.querySelector('#email');
        const successMsg = contactForm.querySelector('.form__success');

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            // Сброс ошибок
            clearErrors(contactForm);

            // Валидация имени
            if (!nameInput || nameInput.value.trim() === '') {
                showError(nameInput, 'Пожалуйста, укажите ваше имя');
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showError(nameInput, 'Имя должно содержать минимум 2 символа');
                isValid = false;
            }

            // Валидация телефона
            const phoneRegex = /^\+?\d[\d\s\-()]{6,17}$/;
            if (!phoneInput || phoneInput.value.trim() === '') {
                showError(phoneInput, 'Пожалуйста, укажите номер телефона');
                isValid = false;
            } else if (!phoneRegex.test(phoneInput.value.trim())) {
                showError(phoneInput, 'Введите корректный номер телефона (минимум 7 цифр)');
                isValid = false;
            }

            // Валидация email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput || emailInput.value.trim() === '') {
                showError(emailInput, 'Пожалуйста, укажите адрес электронной почты');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, 'Введите корректный email (например, name@domain.ru)');
                isValid = false;
            }

            // Если всё хорошо — имитация отправки
            if (isValid) {
                clearErrors(contactForm);

                if (successMsg) {
                    clearErrors(contactForm);
                    successMsg.classList.add('form__success--visible');
                    contactForm.reset();
                    // Скрыть сообщение через 5 секунд
                    setTimeout(function () {
                        successMsg.classList.remove('form__success--visible');
                    }, 5000);
                }
            }
        });

        // Сброс ошибок при вводе
        const inputs = contactForm.querySelectorAll('.form__input');
        inputs.forEach(function (input) {
            input.addEventListener('input', function () {
                input.classList.remove('form__input--error');
                const errorEl = input.parentElement.querySelector('.form__error-msg');
                if (errorEl) {
                    errorEl.style.display = 'none';
                }
            });
        });
    }

    function showError(input, message) {
        if (!input) return;
        input.classList.add('form__input--error');
        input.setAttribute('aria-invalid', 'true');
        const errorEl = input.parentElement.querySelector('.form__error-msg');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    function clearErrors(form) {
        const errorInputs = form.querySelectorAll('.form__input--error');
        errorInputs.forEach(function (input) {
            input.classList.remove('form__input--error');
        });
        const errorMsgs = form.querySelectorAll('.form__error-msg');
        errorMsgs.forEach(function (msg) {
            msg.style.display = 'none';
        });
    }
})
