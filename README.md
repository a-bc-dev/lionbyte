# LionByte

Web de captación de clientes para servicios de desarrollo web.

## Stack

- **Astro 7**: web estática ultrarrápida, sin JS innecesario en el navegador
- **i18n nativo de Astro**: español (`/`), inglés (`/en/`) y rumano (`/ro/`)
- **Tailwind CSS v4**: estilos
- **TypeScript**
- **Astro Actions + Zod**: formulario validado en servidor
- **Resend**: envío de emails de cada lead
- **Vercel**: hosting y despliegue automático

## Empezar

```bash
npm install
cp .env.example .env   # rellena tus claves de Resend
npm run dev            # http://localhost:4321
```

Sin claves en `.env`, el formulario funciona igual y muestra los leads en la consola.

## Estructura

```
src/
  actions/index.ts      → lógica del formulario (validación + email)
  i18n/translations.ts  → TODOS los textos en es / en / ro (edita aquí)
  i18n/utils.ts         → idiomas y URLs de cada página por idioma
  components/           → secciones de la landing
  layouts/              → plantilla base (SEO) y páginas legales
  pages/                → páginas por idioma (/, /en, /ro)
  styles/global.css     → tema Tailwind (colores de marca, fuentes)
```

## Pendiente

- [ ] Dominio definitivo en `astro.config.mjs` (`site`) y `public/robots.txt`
- [ ] Imagen `public/og.png` (1200×630) para compartir en redes
- [ ] Datos reales de privacidad y aviso legal (en `src/i18n/translations.ts`, 3 idiomas)
- [ ] Ajustar precios en `components/Pricing.astro`
- [ ] Añadir sección de portfolio cuando haya proyectos

## Despliegue

1. Sube el repo a GitHub
2. En [vercel.com](https://vercel.com) → *Add New Project* → importa el repo
3. Añade las variables `RESEND_API_KEY`, `CONTACT_TO` y `CONTACT_FROM`
4. Deploy. Cada `git push` vuelve a publicar la web
