# Размещение сайта на хостинге

## ⚠️ Если Wrangler выдаёт «fetch failed» или «Failed to upload»

Загрузка с вашего компьютера обрывается (сеть, файлов много). **Не загружайте с машины** — используйте деплой через GitHub: Cloudflare сам заберёт код из репозитория, без загрузки с вашего ПК.

**Кратко:**
1. Создайте репозиторий на GitHub, залейте туда проект (GitHub Desktop или `git push`).
2. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → выберите репозиторий.
3. **Build command** — пусто. **Build output directory** — `./` (корень).
4. Сохраните. Сайт появится по ссылке вида `https://ok-its-my-toys.pages.dev`.

Подробные шаги — в разделе «Деплой через GitHub + Cloudflare Pages» ниже.

---

## Бесплатные варианты

| Сервис | Плюсы |
|--------|--------|
| **Cloudflare Pages** (Wrangler) | Бесплатно, быстрый CDN, без лимита трафика |
| **GitHub Pages** | Бесплатно, деплой из репозитория |
| **Netlify** | Бесплатный тариф, автодеплой из Git |
| **Vercel** | Бесплатный тариф для статики |

---

## Деплой через Wrangler (Cloudflare Pages)

Сайт статический (HTML/CSS/JS), его можно выложить на **Cloudflare Pages** с помощью Wrangler.

### 1. Установка Wrangler

```bash
npm install -g wrangler
```

Или без установки (через npx):

```bash
npx wrangler --version
```

### 2. Вход в Cloudflare

```bash
npx wrangler login
```

Откроется браузер для входа в аккаунт Cloudflare (регистрация бесплатная).

### 3. Создание проекта Pages (один раз)

Из **корня проекта** (там, где лежит `index.html`):

```bash
npx wrangler pages project create "ok-its-my-toys"
```

Укажите имя проекта (например, `ok-its-my-toys`) и production-ветку (например, `main`).

### 4. Деплой сайта

**Вариант А — Cloudflare Pages** (из той же папки):

```bash
npx wrangler pages deploy . --project-name=ok-its-my-toys
```

После деплоя появится ссылка вида:  
`https://ok-its-my-toys.pages.dev`

**Вариант Б — Worker с папкой assets** (если Pages выдаёт ошибку загрузки):

В проекте уже есть файл `wrangler.jsonc` с настройкой `assets.directory: "."`. Из корня проекта (там, где `index.html` и `wrangler.jsonc`) выполните:

```bash
npx wrangler deploy
```

Сайт будет доступен по адресу вида:  
`https://ok-its-my-toys.<ваш-поддомен>.workers.dev`

### 5. Повторный деплой

При следующих изменениях снова выполните:

```bash
npx wrangler pages deploy . --project-name=ok-its-my-toys
```

---

## Деплой через GitHub + Cloudflare Pages (рекомендуется при ошибках загрузки)

Файлы заливает Cloudflare из GitHub, а не ваш компьютер — поэтому «fetch failed» и «Failed to upload» не возникают.

### Шаг 1. Репозиторий на GitHub

- Зайдите на [github.com](https://github.com), войдите в аккаунт.
- **New repository** → имя, например `ok-its-my-toys` → **Create repository**.
- На компьютере в папке проекта выполните (если ещё не инициализирован git):
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git remote add origin https://github.com/ВАШ_ЛОГИН/ok-its-my-toys.git
  git push -u origin main
  ```
  Либо откройте папку в **GitHub Desktop** → **Add existing repository** → **Publish repository**.

### Шаг 2. Подключение к Cloudflare Pages

- Откройте [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
- Выберите аккаунт GitHub и репозиторий `ok-its-my-toys` → **Begin setup**.

### Шаг 3. Настройки сборки

- **Project name** — например `ok-its-my-toys`.
- **Production branch** — `main`.
- **Build command** — оставьте **пустым**.
- **Build output directory** — введите `./` (корень репозитория, где лежит `index.html`).
- Нажмите **Save and Deploy**.

Через 1–2 минуты сайт будет доступен по адресу вида  
`https://ok-its-my-toys.pages.dev`.  
При каждом `git push` в `main` деплой будет запускаться автоматически.

---

## Если при деплое ошибка «Failed to upload files» (EPIPE)

В логах при этом бывает **`write EPIPE`** — соединение с Cloudflare обрывается во время загрузки. Что сделать:

### 1. Обновить Wrangler

У вас может быть старая версия. Поставьте последнюю:

```bash
npm install -g wrangler@latest
npx wrangler --version
```

Потом снова выполните деплой.

### 2. Деплой через GitHub (самый надёжный вариант)

Так файлы на Cloudflare заливает не ваш компьютер, а Cloudflare забирает их из репозитория — ошибки загрузки с вашей стороны исчезают.

1. Создайте репозиторий на GitHub и залейте туда проект (через приложение GitHub Desktop или `git`).
2. Зайдите в [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Выберите ваш репозиторий и ветку (например, `main`).
4. В настройках сборки:
   - **Build command** — оставьте пустым.
   - **Build output directory** — укажите `/` (корень репозитория, где лежит `index.html`).
5. Сохраните. Сайт соберётся и появится по адресу `https://ok-its-my-toys.pages.dev` (или как назовёте проект).

Дальше при каждом `git push` в эту ветку сайт будет обновляться сам.

### 3. Деплой из папки без кириллицы и пробелов

Иногда помогает запускать деплой из пути без спецсимволов. Скопируйте проект, например, в домашнюю папку:

```bash
cp -R "/Users/rasulnazaraliev/Документы/Ok it's my toys" ~/ok-its-my-toys
cd ~/ok-its-my-toys
npx wrangler pages deploy . --project-name=ok-its-my-toys
```

### 4. Сеть и VPN

Попробуйте другую сеть (другой Wi‑Fi, мобильный интернет) или отключите VPN на время деплоя.

---

## Важно

- Все пути в коде уже относительные (`project/css/...`, `project/js/...`), для хостинга менять ничего не нужно.
- Домен `*.pages.dev` выдаётся бесплатно; свой домен можно подключить в настройках проекта в Cloudflare.
