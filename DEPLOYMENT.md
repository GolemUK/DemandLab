# DemandLab — GitHub → Cloudflare Pages

Дата: 17 октября 2026. Публикация не выполнялась. Папка пока не является Git-репозиторием; аккаунты и защита ветки не настроены агентом.

## Архитектура и гарантия проверки

Astro генерирует статические HTML/CSS/JS в `dist/`. Сервер, адаптер Cloudflare, Worker, база данных и токены API не нужны. Order Rescue обрабатывает CSV в браузере.

Cloudflare собирает сайт командой `npm run build:pages`: TypeScript → Vitest → production build → внутренние ссылки → SEO/release audit. Первый ненулевой код завершает процесс; Pages не публикует неуспешную сборку. Не заменяйте команду на `npm run build`.

`.github/workflows/quality.yml` выполняет ту же проверку для PR и main и выдаёт статус `quality`. Workflow ничего не деплоит: публикацией занимается только штатная Git-интеграция Pages. Повтор проверки в Pages необходим: сам Pages не ждёт GitHub Actions перед сборкой. Одобрение изменений обеспечивает защита main.

## 1. Подготовка GitHub (однократно)

1. Создайте репозиторий DemandLab без автоматически добавленных README/license. Загрузите содержимое **этой папки** в корень репозитория, включая `.github`, `.node-version`, package-lock.json и `.gitignore`. Не загружайте родительскую папку Codex. GitHub Desktop: Add local repository → Create repository here, затем Publish repository. Не включайте dist, node_modules, .env и архивы — они исключены .gitignore.
2. Назовите production-ветку `main`. Если выбираете другое имя, измените push.branches в workflow и задайте одинаковый `PRODUCTION_BRANCH` в обоих окружениях Pages.
3. Дождитесь первого успешного Actions → DemandLab quality. В Settings → Branches или Rulesets защитите main: Require a pull request before merging; required status check `quality` от GitHub Actions; require branches to be up to date; запрет force push/delete; запрет обхода правил, включая администраторов, если доступно. Выберите минимум одно одобрение, если есть второй участник: автор PR не может одобрить свой PR. Для одиночной работы используйте ручной merge после просмотра diff и обязательных проверок.
4. Защита зависит от тарифа/видимости репозитория. Если нужные правила недоступны, не считайте одобрение технически обеспеченным. Не покупайте тариф автоматически; оставьте production auto deploy выключенным до решения владельца. Встроенная команда Pages всё равно блокирует сборки с ошибками.
5. GitHub Settings → Secrets and variables → Actions → Variables: `SITE_URL` = фактический подтверждённый production origin, когда он известен. Это публичная настройка, не секрет. До подключения домена локальные/CI проверки допускают отсутствие адреса.

## 2. Первое подключение Pages — действие владельца, запускающее публикацию

Продолжайте только после собственного одобрения первой публикации.

1. Cloudflare → Workers & Pages → создать **Pages** проект → подключить GitHub через штатную авторизацию; дать доступ только к нужному репозиторию. Выберите Git integration, а не Direct Upload. Существующий Direct Upload проект нельзя просто переключить на Git integration: создайте новый Pages проект.
2. Production branch: `main`; Root directory: корень репозитория (пустое поле, если DemandLab загружен в корень); Framework preset: Astro; **Build command: `npm run build:pages`**; Build output directory: `dist`.
3. Переменные Production: `NODE_VERSION=24`, `PRODUCTION_BRANCH=main`, `SITE_URL` = точный постоянный HTTPS-адрес проекта, показанный Cloudflare (`https://` + назначенное имя + `.pages.dev`) либо уже подключённый и подтверждённый собственный домен. Не используйте адрес с хешем деплоя и не копируйте условные примеры как реальные значения. Если окончательное имя Pages ещё неизвестно, первая сборка без SITE_URL намеренно завершится ошибкой; после получения адреса задайте переменную и Retry deployment.
4. Переменные Preview: `NODE_VERSION=24`, `PRODUCTION_BRANCH=main`, `DEPLOY_CONTEXT=preview`; SITE_URL тот же production origin. В Production не задавайте DEPLOY_CONTEXT=preview. Контакты `PUBLIC_TELEGRAM_URL` и `PUBLIC_VIBER_URL` заполните реальными публичными ссылками; без них сайт честно сообщает, что канал ещё не подключён.
5. Pages устанавливает зависимости по package-lock.json. Не исключайте devDependencies: они нужны для проверки типов и тестов. Никаких CLOUDFLARE_API_TOKEN в репозитории/Actions не требуется.
6. После Save and Deploy проверьте журнал quality и адрес сайта. Далее: feature branch → PR → успешный quality → просмотр и одобрение → merge в main → Pages повторяет проверки → автоматически обновляет production. PR preview не является production.

## 3. Индексация и preview

SITE_URL управляет canonical, og:url, hreflang, Article/Breadcrumb JSON-LD и sitemap; CF_PAGES_URL никогда не используется как canonical. Production Pages без SITE_URL останавливается. Ветки вне PRODUCTION_BRANCH автоматически получают preview-режим: HTML `noindex, nofollow`, HTTP X-Robots-Tag, отсутствие sitemap. Robots разрешает обход, чтобы поисковик увидел noindex; это не контроль доступа. Для закрытых preview используйте настройки доступа Cloudflare. Не помещайте туда секреты.

После изменения SITE_URL обязательно новая сборка. При смене домена обновите переменную и в Preview, и в GitHub Actions Variables. На production проверьте `/robots.txt`, `/sitemap.xml`, исходный HTML UK/EN и отсутствие noindex. Preview должен содержать noindex и не иметь sitemap.

## 4. Будущий demandlab.com.ua и HOSTiQ

Домен лишь планируется: владение, доступность и покупка не подтверждены. Сейчас адрес не зашит в production-конфигурацию.

1. После подтверждения регистрации у HOSTiQ добавьте зону demandlab.com.ua в Cloudflare; самостоятельно выберите бесплатный план. До смены NS скопируйте существующие DNS-записи, особенно MX/TXT почты. Если DNSSEC уже активен, согласуйте удаление старой DS-записи перед сменой провайдера и включение нового DNSSEC после делегирования.
2. В HOSTiQ откройте домен → NS-серверы → указать NS другого сервиса; внесите **две индивидуальные NS из вашей зоны Cloudflare**, не NS из примеров. Регистратор остаётся HOSTiQ; DNS управляется Cloudflare. Дождитесь статуса зоны Active.
3. В Pages → Custom domains добавьте demandlab.com.ua и завершите предложенную настройку DNS. Для apex-домена Pages требует зону Cloudflare. Дождитесь активного HTTPS-сертификата. Не создавайте только CNAME, пропустив добавление домена в Pages.
4. Лишь после успешной проверки HTTPS задайте SITE_URL=https://demandlab.com.ua в Production, Preview и GitHub Variables; запустите новую сборку.
5. Если нужен www, добавьте его как custom domain и настройте перенаправление на выбранный основной домен. Настройте отдельный redirect постоянного project.pages.dev на собственный домен с сохранением пути/параметров по инструкции Cloudflare; не перенаправляйте все preview-хосты. Проверьте отсутствие цикла. Canonical уже будет ссылаться на основной домен.

## 5. Проверка и откат

Проверьте UK/EN, переключение языка в статье, поиск, загрузку демонстрационного CSV, отчёт/экспорт, 404, мобильную ширину, Content-Security-Policy и preview noindex. Lighthouse и реальные Core Web Vitals выполняются отдельно после публикации; локальные размеры файлов не заменяют их.

При ошибке новой сборки прежняя успешная версия остаётся доступна. Для регрессии после успешной публикации выберите предыдущий успешный production deployment и Rollback, затем исправьте/revert коммит через PR, иначе последующий push снова опубликует проблемный код.

Локальная проверка в PowerShell из папки проекта:

```powershell
npm ci
# Продолжайте только если установка завершилась успешно.
npm run build:pages
# Для локального просмотра результата:
npm run preview:production
```

Сервер проверки: http://127.0.0.1:4322/uk/. Он не публикует сайт.

## Документация, сверено 17.10.2026

- [Cloudflare: build configuration и коды завершения](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Branch controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/)
- [Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Перенаправление pages.dev](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/)
- [GitHub: protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [HOSTiQ: где управлять DNS](https://hostiq.ua/wiki/faq-how-to-change-dns-records/)
