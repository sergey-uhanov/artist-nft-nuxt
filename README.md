# 📦 Nuxt 4 Multilingual & Themed Application
## 📖 Опис
Проєкт створений на Nuxt 4 і реалізує базовий набір функціоналу, необхідного для сучасних веб‑додатків:

№	Функціонал	Короткий опис 

1️⃣ Мультимовність – Підтримка довільної кількості мов за допомогою **@nuxtjs/i18n**.

2️⃣ Тема – Світла / темна тема, перемикач збережений у **localStorage**.

3️⃣ Аутентифікація та авторизація – Реєстрація/вхід через **nuxt-auth-utils**, ролі користувачів, підтвердження e‑mail — лист‑посилання.

4️⃣ Месенджер – Вбудований чат‑модуль (Vue‑компоненти, віртуальний скролер).


NOTE: Усі налаштування зручні для розширення та кастомізації під ваші потреби.



🚀 Технології та залежності
Технології та залежності
### Основні (`dependencies`)

| Пакет | Версія | Призначення |
|-------|--------|-------------|
| `nuxt` | ^4.2.2 | Фреймворк Nuxt 4 |
| `@nuxtjs/i18n` | ^10.2.1 | Мультимовність |
| `@nuxt/image` | ^2.0.0 | Оптимізація зображень |
| `@pinia/nuxt` | ^0.11.3 | Стан‑менеджер Pinia |
| `pinia` | ^3.0.4 | Стан‑менеджер (для Vue) |
| `@vueuse/core` | ^14.2.0 | Корисні composable‑и |
| `@vueuse/nuxt` | ^14.1.0 | Інтеграція VueUse в Nuxt |
| `@vueuse/components` | ^14.2.0 | Компоненти VueUse |
| `nuxt-auth-utils` | ^0.5.26 | Аутентифікація, ролі |
| `nodemailer` | ^7.0.12 | Відправка листів‑підтверджень |
| `@prisma/client` | ^7.2.0 | ORM‑клієнт |
| `@prisma/adapter-pg` | ^7.2.0 | Адаптер PostgreSQL |
| `pg` | ^8.16.3 | Драйвер PostgreSQL |
| `typescript` | ^5.4.5 | Типізація |
| `vue` | ^3.5.26 | Основний Vue‑фреймворк |
| `vue-router` | ^4.6.4 | Маршрутизація |
| `vue-virtual-scroller` | ^2.0.0‑beta.8 | Віртуальний скролінг у чаті |
| `nanoid` | ^5.1.6 | Генерація унікальних ідентифікаторів |
| `zod` | ^4.3.5 | Схеми валідації |
| `eslint` | ^9.39.2 | Лінтинг коду |
| `sass-embedded` | ^1.97.2 | SCSS‑препроцесор |
| `vite-plugin-svg-icons` | ^2.0.1 | Робота з SVG‑іконками |
| `vite-svg-loader` | ^5.1.0 | Завантаження SVG‑файлів |

### Dev‑залежності (`devDependencies`)

| Пакет | Версія | Призначення |
|-------|--------|-------------|
| `@intlify/unplugin-vue-i18n` | ^11.0.3 | Інтеграція i18n у Vite |
| `@types/nodemailer` | ^7.0.5 | TypeScript‑типи для Nodemailer |
| `@types/pg` | ^8.16.0 | TypeScript‑типи для pg |
| `dotenv` | ^17.2.3 | Робота з .env файлами |
| `prisma` | ^7.2.0 | Міграції та генерація клієнта |
| `tsx` | ^4.21.0 | Виконання TS‑скриптів без компіляції |
| `vue-i18n` | ^11.2.8 | Бібліотека i18n для Vue |

📂 Структура проєкту
├─ .nuxt/                # Скомпільовані файли Nuxt <br>
├─ components/           # UI‑компоненти (ThemeSwitcher, ChatMessage, …)<br>
├─ composables/          # Vue‑composables (useAuth, useI18n, useTheme)<br>
├─ layouts/              # Основні макети (default.vue, auth.vue)<br>
├─ middleware/           # Перевірка ролей, підтвердження e‑mail<br>
├─ pages/                # Маршрути (/, /login, /register, /chat, /admin)<br>
├─ plugins/              # Плагіни (pinia, i18n, prisma, nodemailer)<br>
├─ public/               # Статичні файли (svg‑icons, картинки)<br>
├─ server/               # API‑шляхи (auth, users, messages)<br>
├─ prisma/               # Моделі та міграції БД<br>
├─ nuxt.config.ts        # Налаштування Nuxt<br>
├─ package.json<br>
└─ README.md<br>

### 🔐 Аутентифікація & Авторизація
Реєстрація – користувач вводить e‑mail, пароль та роль (наприклад, user або admin).
Після реєстрації Nodemailer надсилає лист з унікальною підтверджувальною URL‑посиланням.
Після переходу за посиланням акаунт активується і користувач може входити.
nuxt-auth-utils забезпечує JWT‑токени, refresh‑токени, middleware auth та role.

### 🎨 Тема (Light / Dark)
Тема зберігається у localStorage і перемикається компонентою ThemeSwitcher.
Стилі написані у SCSS, використовуючи CSS‑змінні (--color-bg, --color-text тощо).

### 💬 Вбудований месенджер
Компонент ChatWindow.vue використовує vue‑virtual‑scroller для продуктивного рендерингу великих історій.
Повідомлення зберігаються в PostgreSQL, доступ через server API (/api/messages).
Реальне оновлення реалізовано за допомогою Server‑Sent Events (SSE).

### 📧 Надсилання листів
Налаштування SMTP у файлі .env:

```
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_user
SMTP_PASS=your_password
SMTP_FROM=no-reply@example.com
nodemailer використовується у server/plugins/mail.ts та викликається сервісом authService.sendVerificationEmail().
```


### 🙏 Подяка
Nuxt – за сучасну SSR/SSG‑платформу. <br/>
Pinia – легкий та типізований стан.<br/>
Prisma – зручний ORM з типізацією.<br/>
VueUse – корисні composable‑и.<br/>
Nodemailer – просте надсилання e‑mail‑ів.<br/>

#### 📄 Ліцензія
Проєкт розповсюджується під ліцензією MIT. Деталі у файлі LICENSE.