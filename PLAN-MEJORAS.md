# Plan de Mejoras — Vibe Coding Hub

> De sitio informativo a **estudio de arquitectura de producto**: una herramienta que convierte una idea
> en un PRD, un TRD, un plan de ejecución y un brief de UX/UI listos para pegar en Lovable, Manus o Claude Code.

**Fecha:** 24 de julio de 2026
**Repositorio:** https://github.com/victogarcia4/vibe-coding-hub
**Despliegue:** https://vibe-coding-hub-one.vercel.app/
**Revisado contra:** commit `965f0d5` (embudo ampliado con 12 tipos de proyecto) — ver §1.3

---

## 0. Decisiones fijadas

| Tema | Decisión |
|---|---|
| **Motor de documentos** | Híbrido: plantillas deterministas (siempre funcionan, gratis, sin conexión) + capa de IA opcional para enriquecer |
| **Bilingüe** | Completo: interfaz + contenido + documentos generados. Español por defecto |
| **Tema** | Claro por defecto, rediseñado como modo principal. Oscuro derivado de él, con toggle |
| **Persistencia** | Local primero (IndexedDB) como fuente de verdad + Google Drive como respaldo y exportación |
| **Modelo** | Herramienta personal. Sin autenticación, sin facturación, sin multi-tenant |
| **Identidad visual** | Rediseñar el modo claro como principal; adaptar el oscuro a partir de él |

**Consecuencia arquitectónica:** la app sigue siendo **100% estática** (Vercel, `build:static`). Sin backend, sin base de datos
en servidor, sin costes de infraestructura. Todo lo nuevo se ejecuta en el navegador.

---

## 1. Diagnóstico del estado actual

### 1.1 Lo que la app es hoy

Cinco páginas informativas construidas con React 19 + Vite 7 + Tailwind 4 + wouter + framer-motion:

- **Home** — hero y features
- **Resource Vault** — 25 enlaces curados en 4 categorías
- **Project Architect** — asistente de 4 preguntas
- **Vibe Coding** — perfiles de 3 herramientas con precios
- **Workflow Map** — 7 fases de flujo de trabajo

Es un **catálogo de enlaces con un cuestionario**. No produce ningún artefacto.

### 1.2 Brechas frente al objetivo

#### A. No genera nada (brecha principal)

El "Project Architect" no produce PRD ni TRD. Sus recomendaciones son cuatro funciones con `if/else`
sobre cuatro respuestas — `client/src/pages/ProjectArchitect.tsx:66-88`:

```ts
function getVibeTool(a: ArchitectAnswers) {
  if (a.complexity === "complex" || a.complexity === "enterprise") return "Manus";
  if (a.scope === "static") return "Lovable";
  if (a.complexity === "simple") return "Emergent";
  return "Lovable";
}
```

Cuatro preguntas × cuatro opciones = 256 combinaciones posibles, pero solo existen **3 resultados**.
No hay exportación, ni documento, ni nada que puedas llevarte a otra herramienta. El resultado se muestra
en pantalla y se pierde.

Peor: la lógica está **duplicada** en `WorkflowMap.tsx:26-44`, con las mismas reglas reescritas. Cualquier
cambio hay que hacerlo en dos sitios, y ya han divergido en los textos.

#### B. Cero bilingüismo

No hay ninguna infraestructura de i18n. Aproximadamente 2.900 líneas con todo el texto en inglés
incrustado directamente en el JSX y en los objetos de datos. `client/index.html:2` declara `lang="en"`.

#### C. Tema oscuro por defecto

`client/src/App.tsx:31` — `<ThemeProvider defaultTheme="dark" switchable>`. Hay que invertirlo.

Además, el tema se aplica dentro de un `useEffect` (`ThemeContext.tsx:32`), lo que significa que en cada
carga el navegador pinta primero el tema equivocado y luego salta al correcto: **destello de tema incorrecto**
visible en cada visita.

#### D. La app no es una PWA

No existe `manifest.json`. No existe service worker. No hay iconos de instalación. No funciona sin conexión.
Es una herramienta que enseña a construir PWAs y no es una PWA.

Agravante: las fuentes se cargan desde el CDN de Google Fonts (`index.html:15`). Sin conexión no habría
tipografía, aunque hubiera service worker.

#### E. Deuda técnica que causa los bugs de contraste recurrentes

**Este es el hallazgo más importante a nivel de código.**

El sistema de variables CSS en `client/src/index.css:48-119` está bien construido: `:root` define el tema
claro, `.dark` lo sobrescribe, y `@theme inline` los expone a Tailwind. Es correcto.

**Pero ningún componente lo usa.** Cada página recalcula a mano cada color con ternarios en estilos inline:

```ts
// ProjectArchitect.tsx:123-129 — y esto se repite en las 6 páginas
const cyan       = isDark ? "oklch(0.78 0.18 200)" : "oklch(0.45 0.18 200)";
const cardBg     = isDark ? "oklch(0.11 0.013 260)" : "oklch(1 0 0)";
const cardBorder = isDark ? "1px solid oklch(0.18 0.015 260)" : "1px solid oklch(0.88 0.006 260)";
const optionBg   = isDark ? "oklch(0.13 0.013 260)" : "oklch(0.97 0.003 260)";
const textMuted  = isDark ? "oklch(0.38 0.01 260)" : "oklch(0.50 0.01 260)";
```

Y luego trucos como `cyan.replace(")", " / 0.15)")` para generar transparencias mediante manipulación
de cadenas de texto — 23 veces solo en `ProjectArchitect.tsx`.

**Por eso hiciste tres commits consecutivos peleando con el contraste** (`f0ea848`, `9dc0c25`, y antes
`dceae62`). No es mala suerte: con esta estructura, cada color nuevo es una oportunidad de romper el
modo claro otra vez, y no hay una sola fuente de verdad que revisar. Los valores están dispersos en
cientos de expresiones inline.

Esto **debe arreglarse antes de añadir funciones nuevas**. Añadir i18n y el motor de documentos sobre
esta base multiplicaría la deuda.

#### F. Sin persistencia real

`ArchitectContext.tsx:20` usa `sessionStorage`: las respuestas se borran al cerrar la pestaña. Un solo
proyecto a la vez. No puedes volver a un proyecto de la semana pasada.

#### G. Restos del andamio de Manus

El proyecto se generó con Manus y arrastra su infraestructura:

- `vite.config.ts` — 241 líneas, de las cuales la mayoría son plugins de Manus: recolector de logs de
  depuración, proxy de almacenamiento que apunta a `BUILT_IN_FORGE_API_KEY`, hosts permitidos
  `.manusvm.computer`, `.manus-asia.computer`, etc.
- `vite-plugin-manus-runtime` como dependencia
- `client/public/__manus__/debug-collector.js`
- `client/src/components/ManusDialog.tsx`
- `index.css:121-128` — regla CSS para ocultar la marca de agua de Manus
- `client/src/components/Map.tsx` (155 líneas de Google Maps) + `@types/google.maps` — sin usar
- `template.json` (14 KB de metadatos de plantilla) — sin usar
- `express` + `server/index.ts` — un servidor estático que no se usa: Vercel y Netlify están
  configurados con `build:static` y sirven `dist/public` directamente

#### H. Script de analítica roto

`index.html:21-24` carga `src="%VITE_ANALYTICS_ENDPOINT%/umami"`. No existe ningún archivo `.env` en el
proyecto y la variable no está definida. Vite deja los `%VAR%` desconocidos sin sustituir, así que en
producción el navegador pide literalmente la ruta `%VITE_ANALYTICS_ENDPOINT%/umami` → **404 en cada
carga de página**. (Verificar si está definida en las variables de entorno de Vercel; si no lo está, es
una petición fallida en cada visita.)

#### I. Sin ejemplos de UX/UI propios

El vault enlaza a galerías externas (Godly, Awwwards, Refero) pero la app no muestra ni un patrón, ni un
token de diseño, ni un ejemplo visual propio. Para una herramienta cuyo objetivo es que lo construido sea
"visualmente atractivo", esto es una ausencia notable.

#### J. Accesibilidad y calidad

Medido en el código actual:

- **Cero atributos `aria-*` o `role`** en las cinco páginas (solo 3 en el Navbar)
- **Cero pruebas** en todo el proyecto, aunque Vitest está instalado
- Las opciones del asistente son `<button>` sueltos: sin `role="radio"`, sin `aria-checked`, sin navegación
  por flechas. Un lector de pantalla no puede saber qué opción está seleccionada
- El menú móvil no atrapa el foco ni se cierra con `Escape`
- No hay enlace "saltar al contenido"
- `prefers-reduced-motion` no se respeta en ninguna de las animaciones de framer-motion
- Etiquetas `tag-mono` con fondos al 8% de opacidad — contraste probablemente por debajo de AA
- Sin code-splitting: las cinco páginas van en un solo bundle
- Sin Open Graph, sin `sitemap.xml`, sin `robots.txt`, sin imagen para compartir

---

### 1.3 Revisión posterior al commit `965f0d5`

Este diagnóstico se escribió antes del commit `965f0d5` ("expanded Architect funnel with 12 project
types + non-tech blueprint"), que reescribió `ProjectArchitect.tsx` por completo (642 líneas
modificadas) y añadió `client/src/data/architectData.ts` (260 líneas nuevas). Se revisó el código
resultante. Conclusiones:

#### Lo que mejora (y adelanta trabajo del plan)

`architectData.ts` **es el primer paso correcto hacia `engine/`**. Separa los datos de la UI y ya
contiene una función pura, `generateBlueprint(projectTypeId, goalId, audienceId, dataNeedId)`, sin
ninguna dependencia de React. Eso es exactamente la arquitectura que propone §2: lógica pura,
trivialmente testeable. El catálogo de capacidades de la Fase 3.2 se construirá **sobre este archivo**,
no desde cero.

El embudo también mejora en producto: 12 tipos de proyecto en lugar de 4 opciones abstractas, con
lenguaje para no-técnicos y la metáfora del restaurante (frontend = comedor, backend = cocina). Es
un buen marco conceptual y se conserva.

#### Lo que empeora

**El problema de los colores inline se duplicó, no se redujo.** Recuento actual:

| Archivo | `isDark` | `oklch(` inline |
|---|---|---|
| `pages/VibeCoding.tsx` | 34 | 33 |
| `pages/Home.tsx` | 30 | 34 |
| `pages/ProjectArchitect.tsx` | 25 | 24 |
| `pages/ResourceVault.tsx` | 24 | 23 |
| `components/Navbar.tsx` | 21 | 15 |
| `components/PageLayout.tsx` | 17 | 16 |
| `pages/WorkflowMap.tsx` | 15 | 14 |
| **Total** | **166** | **159** |

La reescritura de `ProjectArchitect.tsx` mantuvo el patrón: 13 constantes de color calculadas a mano
en las líneas 27–40, y `cyan.replace(")", " / 0.15)")` repetido a lo largo del archivo. La Fase 1
sigue siendo el prerrequisito, y ahora con más superficie que cubrir.

#### Bug 1 — El contrato entre las dos páginas está roto

`ProjectArchitect.tsx:52-57` escribe en `ArchitectContext` con el **vocabulario nuevo**.
`WorkflowMap.tsx:26-43` sigue leyendo el **vocabulario viejo**. Los valores no coinciden:

| Campo | Lo que ahora se escribe | Lo que `WorkflowMap` espera | Resultado |
|---|---|---|---|
| `scope` | `landing`, `portfolio`, `store`, `saas`, `dashboard`, `crm`, `funnel`, `blog`, `slides`, `mobile`, `pwa`, `booking` | `pwa`, `static`, `dynamic`, `saas` | `static` y `dynamic` **nunca coinciden** |
| `complexity` | solo `complex` o `moderate` (línea 55) | `simple`, `moderate`, `complex`, `enterprise` | `simple` y `enterprise` son **código muerto** |
| `data` | `none`, `forms`, `auth`, `content`, `realtime`, `payments` | `realtime`, `relational`, `document`, `minimal` | `relational` y `document` **nunca coinciden** |
| `audience` | `consumers`, `professionals`, `team`, `creators`, `students` | `consumers`, `developers`, `business`, `internal` | 4 de 5 caen al caso por defecto |

Consecuencias observables: `WorkflowMap` nunca recomienda Emergent (requiere `complexity === "simple"`),
nunca recomienda Supabase/Neon ni MongoDB (requieren `data === "relational"` / `"document"`), y para
casi cualquier audiencia muestra las mismas galerías genéricas. La página dice "workflow personalizado"
y entrega uno degradado.

**Por qué TypeScript no lo detecta:** `ArchitectAnswers` declara los cuatro campos como `string`
(`contexts/ArchitectContext.tsx:5-10`). El vocabulario válido solo existe en un comentario, que además
ya está desactualizado. `tsc --noEmit` pasa limpio. Con uniones literales (`type Scope = "landing" | ...`)
este bug habría sido un error de compilación.

Esto confirma el diagnóstico original desde otro ángulo: la lógica duplicada no solo se desincroniza
en el texto, se desincroniza en los **datos**. La Fase 3.3 (un único recomendador con tipos estrictos,
consumido por ambas páginas) resuelve la causa, no el síntoma.

#### Bug 2 — 19 declaraciones CSS inválidas que se descartan en silencio

El idioma de transparencia hexadecimal (`` `${color}18` `` → `#00D4FF18`) se está aplicando a cadenas
`oklch()`, donde no existe:

```tsx
// WorkflowMap.tsx:145
style={{ background: `${gold}10`, border: `1px solid ${gold}35` }}
// gold === "oklch(0.82 0.16 85)"
// produce: "oklch(0.82 0.16 85)10"  ← valor inválido
```

El navegador descarta la declaración completa. Esos fondos y bordes teñidos **no se están pintando**.
19 ocurrencias en 4 archivos:

| Archivo | Ocurrencias |
|---|---|
| `pages/WorkflowMap.tsx` | 14 (líneas 145, 164, 172, 190-192, 194, 208) |
| `pages/ResourceVault.tsx` | 3 (líneas 104, 151, 203) |
| `pages/VibeCoding.tsx` | 1 (línea 77) |

Pasó desapercibido porque un fondo transparente sobre una tarjeta oscura casi no se distingue de un
fondo teñido al 6%. En modo claro la pérdida es más visible. Nótese que el mismo archivo usa las **dos**
formas — `${cyan}18` (inválida) y `cyan.replace(")", " / 0.3)")` (válida) — a veces en la misma línea
(`ResourceVault.tsx:151`). Es el síntoma más claro de que falta una única fuente de verdad.

La Fase 1 elimina ambas formas: los tokens semánticos (`--signal-soft`, `--signal-border`) sustituyen
tanto la concatenación de cadenas como el `.replace()`.

#### Ajustes al plan

1. **§3.1 (Briefing)** — conservar los 12 tipos de proyecto, los 6 objetivos, las 5 audiencias y las
   6 necesidades de datos de `architectData.ts`; son mejores que las 4 opciones abstractas que iba a
   proponer. Traducirlos al español y añadir las dos secciones que faltan para llegar a las seis:
   restricciones (presupuesto, plazo, equipo) y marca/estética.
2. **§3.2 (Capacidades)** — `generateBlueprint()` es el punto de partida. Su lógica (`needsBackend`,
   `needsPayments`, `needsAuth`, `isRealtime`) se convierte en capacidades declarativas en lugar de
   booleanos calculados. Los mapas `frontendStructures`, `styleByAudience`, `animByType` y `costMap`
   se reutilizan como datos semilla del catálogo.
3. **§3.3 (Recomendador)** — sube de prioridad. Ya no es solo "eliminar duplicación": es **corregir un
   bug en producción**. Primer paso obligatorio: cambiar `ArchitectAnswers` de `string` a uniones
   literales, para que el desajuste se vuelva imposible.
4. **Fase 1** — añadir a los criterios de hecho: `grep -rn '\${\(cyan\|gold\|green\)}[0-9]' client/src`
   debe devolver 0 resultados.
5. Las referencias a líneas de `ProjectArchitect.tsx` en §1.2 corresponden a la versión anterior. Las
   equivalentes en la versión actual son las líneas 27–40 (constantes de color) y 120–130, 142, 156–158
   (`.replace()` para transparencias).

---

## 2. Arquitectura objetivo

```
client/src/
├── i18n/
│   ├── index.ts                 # hook useT(), proveedor de locale, tipos
│   └── locales/
│       ├── es/  ui.json  resources.json  tools.json  patterns.json  docs.json
│       └── en/  ui.json  resources.json  tools.json  patterns.json  docs.json
│
├── design/
│   ├── tokens.css               # ÚNICA fuente de verdad de color/espaciado/tipografía
│   └── palette.ts               # generador OKLCH + validador de contraste (compartido con la app)
│
├── engine/                      # ← el corazón nuevo. Lógica pura, sin React, 100% testeable
│   ├── schema.ts                # esquemas Zod del briefing
│   ├── capabilities.ts          # catálogo de capacidades → requisitos + implicaciones técnicas
│   ├── stackRules.ts            # recomendador por puntuación (sustituye los if/else)
│   ├── builders/
│   │   ├── prd.ts               # → documento PRD
│   │   ├── trd.ts               # → documento TRD (+ diagramas Mermaid, DDL)
│   │   ├── actionPlan.ts        # → plan de ejecución por fases con tareas
│   │   ├── uxBrief.ts           # → brief UX/UI + tokens de diseño
│   │   └── promptPack.ts        # → prompts listos para el agente
│   └── export/
│       ├── markdown.ts  pdf.ts  zip.ts  agentFiles.ts   # CLAUDE.md, AGENTS.md, .cursorrules
│
├── ai/
│   ├── client.ts                # cliente de la API de Claude (clave del usuario, en localStorage)
│   └── enrich.ts                # operaciones: enriquecer, criticar, traducir, ampliar
│
├── storage/
│   ├── db.ts                    # IndexedDB: proyectos, ajustes, versiones
│   └── drive.ts                 # Google Drive: OAuth scope drive.file, subida, Google Docs
│
├── pages/
│   ├── Home  Projects  Briefing  Documents  Vault  Tools  Patterns  Studio  Settings
│
└── components/
    ├── ui/                      # shadcn (ya existe, 50 componentes sin usar)
    └── ...                      # componentes propios, todos con tokens semánticos
```

**Principio rector:** `engine/` es lógica pura de TypeScript sin dependencias de React. Eso lo hace
trivialmente testeable y significa que la calidad de los documentos se puede verificar con pruebas
automáticas, no a ojo.

---

## 3. Plan por fases

Las fases están **ordenadas por dependencia**, no por atractivo. Las fases 0 y 1 son bloqueantes:
construir i18n y el motor de documentos sobre los ternarios `isDark` duplicaría el trabajo de limpieza
después, y con dos idiomas en juego.

---

### Fase 0 — Limpieza de cimientos
**Tamaño: pequeño (media sesión) · Bloqueante**

Objetivo: eliminar todo lo que no es tuyo, para que el resto del trabajo sea sobre código que controlas.

1. **Purgar Manus:** reescribir `vite.config.ts` de 241 líneas a ~40 (solo react, tailwind, alias de rutas,
   y más adelante el plugin PWA). Borrar `vite-plugin-manus-runtime`, `public/__manus__/`,
   `ManusDialog.tsx`, la regla CSS de la marca de agua, `template.json`, `@builder.io/vite-plugin-jsx-loc`.
2. **Borrar código muerto:** `Map.tsx`, `@types/google.maps`, `server/index.ts`, `express`,
   `@types/express`, el script `build` con esbuild, `.gitkeep`. `recharts`, `embla-carousel`, `vaul`,
   `input-otp`, `react-day-picker`, `cmdk`, `streamdown`, `next-themes`, `axios` — verificar uso real y
   eliminar los no usados (`next-themes` es especialmente redundante: hay un ThemeContext propio).
3. **Arreglar el script de analítica:** eliminarlo, o definir las variables en Vercel. Si quieres analítica,
   recomiendo Vercel Analytics (una línea, sin configuración) o Plausible autoalojado.
4. **Autoalojar las fuentes:** instalar Space Grotesk, Inter y JetBrains Mono como paquetes
   `@fontsource-variable/*` y quitar los enlaces al CDN de Google. Requisito para funcionar sin conexión;
   además elimina dos peticiones bloqueantes y un problema de privacidad.
5. **Activar `tsc --noEmit` limpio** y añadir un GitHub Action que lo ejecute.

**Criterio de hecho:** `grep -ri manus client/ server/ vite.config.ts` no devuelve nada. La app compila,
se despliega y se ve igual que ahora.

---

### Fase 1 — Sistema de diseño y modo claro como principal
**Tamaño: mediano (2 sesiones) · Bloqueante**

Objetivo: una sola fuente de verdad para el color, y un modo claro que se sienta diseñado, no invertido.

1. **Ampliar los tokens semánticos.** El sistema actual tiene los tokens de shadcn (`--card`, `--muted`…)
   pero las páginas necesitan otros que hoy están a mano. Añadir a `tokens.css`:

   ```
   --surface-1 / -2 / -3        superficies por elevación
   --text-strong / -body / -muted / -subtle
   --signal / -soft / -border / -glow     (el cian de marca)
   --gold / -soft / -border               (acento ámbar)
   --success / -soft / -border            (verde de despliegue)
   --border-subtle / -strong
   --elevation-1 / -2 / -3      sombras en claro, resplandores en oscuro
   ```

   Y exponerlos en `@theme inline` para que existan como clases Tailwind (`bg-surface-2`, `text-muted`,
   `border-signal-border`).

2. **Rediseñar el modo claro con intención.** No basta con invertir. Concretamente:
   - Fondo: de `oklch(0.97 0.004 260)` (blanco frío azulado) a un blanco ligeramente cálido — más
     agradable en sesiones largas
   - Cian de marca: oscurecer a ~`oklch(0.52 0.15 220)` para cumplir contraste AA sobre superficies claras
     (el `oklch(0.45 0.18 200)` actual funciona en texto pero no como fondo con texto encima)
   - **Sombras en vez de resplandores.** Los `box-shadow: 0 0 24px cyan` del modo oscuro se ven sucios
     sobre blanco. En claro: sombras suaves y direccionales que sugieren elevación
   - Tipografía: subir medio peso en display y body para compensar la menor percepción de peso sobre
     fondo claro
   - Bordes: en claro el borde define la tarjeta; en oscuro es el fondo el que la define. Ajustar
     contrastes en consecuencia

3. **Erradicar los ternarios `isDark`.** Trabajo mecánico pero es el que desbloquea todo:
   reemplazar cada `isDark ? "oklch(...)" : "oklch(...)"` por una clase Tailwind semántica.
   Elimina también los `.replace(")", " / 0.15)")` (usar `color-mix()` o tokens `-soft` predefinidos).

   **Criterio de hecho medible:** `grep -rc "isDark" client/src` devuelve 0 en todos los archivos.
   Estimo que esto elimina entre el 30% y el 40% de las líneas de las páginas.

4. **Invertir el default y matar el destello.** `defaultTheme="light"`. Añadir un script inline en el
   `<head>` que lea `localStorage` y ponga la clase en `<html>` **antes** de que React monte — así
   desaparece el salto de tema. Añadir `<meta name="color-scheme" content="light dark">`.

5. **Respetar `prefers-reduced-motion`** en todas las animaciones (framer-motion tiene
   `useReducedMotion()`).

**Criterio de hecho:** cero ternarios de tema. Cambiar un color de marca requiere editar **una** línea.
Auditoría de contraste con axe sin fallos AA en ambos modos.

---

### Fase 2 — Bilingüe completo (ES por defecto)
**Tamaño: mediano (2 sesiones) · Bloqueante para la Fase 3**

Debe ir antes del motor de documentos: si se escriben primero las plantillas de PRD/TRD en inglés,
habrá que traducir el doble de texto después.

1. **Mecanismo: i18n propio y tipado, sin dependencias.** Recomiendo no usar `react-i18next` aquí:

   | | i18n propio (~80 líneas) | react-i18next |
   |---|---|---|
   | Tamaño | 0 KB | ~40 KB |
   | Seguridad de tipos | **TypeScript verifica que toda clave existe en ambos idiomas** | no en tiempo de compilación |
   | Plurales, fechas | `Intl` nativo (suficiente aquí) | integrado |
   | Namespaces diferidos | `import()` dinámico | integrado |

   La seguridad de tipos es el argumento decisivo: con un diccionario tipado, **el proyecto no compila si
   falta una traducción**. Con react-i18next, la clave faltante aparece como texto crudo en pantalla.
   Si más adelante necesitas plurales complejos o RTL, migrar es directo.

2. **Separar hechos de palabras en los datos.** Hoy `resources.ts` y `vibeTools.ts` mezclan datos
   estructurales con prosa en inglés. Reestructurar:
   - `data/resources.ts` mantiene solo **hechos**: `id`, `url`, `category`, `tags`, `pricingTier`,
     `hasFreeTier`, `capabilities[]`, `maturity`
   - `i18n/locales/{es,en}/resources.json` contiene **toda la prosa**, indexada por `id`:
     `name`, `description`, `vibecoderNote`, `whenNotToUse`

   Beneficio doble: un tipo de TypeScript puede exigir que cada `id` de recurso tenga entrada en ambos
   idiomas, y añadir un idioma nuevo no toca la lógica.

3. **Estrategia de URL:** rutas únicas + preferencia en `localStorage` + parámetro `?lang=en` para
   compartir. Mantener `<html lang>` sincronizado. Prefijos `/es/` y `/en/` son mejores para SEO pero
   innecesarios para una herramienta personal; el parámetro cubre el caso de compartir un enlace.

4. **Selector de idioma** junto al toggle de tema en el Navbar. Persistente.

5. **Documentos generados bilingües:** el motor de la Fase 3 recibe el locale y compone el PRD/TRD en ese
   idioma, con un botón "generar también en inglés" (útil si el proyecto es para un cliente angloparlante o
   si vas a pegar el prompt en un agente que rinde mejor en inglés).

6. **Traducción del contenido existente:** ~25 recursos + 3 perfiles de herramientas + toda la interfaz.
   Táctica pragmática y coherente con el propósito de la app: escribir el español a mano (es el
   principal), y generar el borrador en inglés con la capa de IA de la Fase 3, revisándolo tú.
   Es literalmente usar la herramienta para construir la herramienta.

**Criterio de hecho:** una prueba automática falla si falta cualquier clave en cualquier idioma.
Recorrer toda la app en ambos idiomas sin ver una sola cadena sin traducir.

---

### Fase 3 — El motor de documentos (el núcleo del producto)
**Tamaño: grande (5-6 sesiones) · Es la razón de ser del proyecto**

Aquí la app deja de ser un catálogo y se convierte en una herramienta.

#### 3.1 El Briefing — sustituye el asistente de 4 preguntas

Un cuestionario estructurado en seis secciones, navegable de forma no lineal, con guardado automático de
borrador y barra de completitud. Dos modos: **rápido** (8 preguntas → documentos base) y **completo**
(→ documentos profundos).

| Sección | Qué captura | Para qué sirve |
|---|---|---|
| **1. Identidad** | nombre, propuesta en una frase, tipo (PWA / web estática / SaaS / e-commerce / herramienta interna / marketplace), objetivo (personal, venta directa, suscripción, cliente) | portada del PRD, decisiones de monetización en el TRD |
| **2. Usuarios** | 1-3 personas: rol, dolor principal, contexto de uso, nivel técnico; dispositivo primario; volumen esperado | personas e historias de usuario del PRD; decisiones de UX y de escala |
| **3. Capacidades** | selección de un **catálogo** (ver 3.2) | **el mecanismo clave**: cada capacidad inyecta requisitos en el PRD y decisiones en el TRD |
| **4. Datos** | entidades principales con campos clave, relaciones, sensibilidad (PII / salud / pagos), retención | modelo de datos y DDL del TRD; requisitos de cumplimiento |
| **5. Restricciones** | presupuesto mensual, fecha objetivo, tu nivel técnico, herramienta preferida (o "recomiéndame"), plataforma de despliegue | recomendación de stack; fases realistas del plan |
| **6. Marca y estética** | 3 adjetivos de tono, referencia visual, densidad, color base, ¿hay logo? | brief de UX/UI; generación de la paleta |

Mejoras de forma respecto al asistente actual: validación con Zod, accesible de verdad
(`role="radiogroup"` + `aria-checked` + navegación con flechas), navegación libre entre secciones,
y poder guardar a medias y volver.

#### 3.2 Catálogo de capacidades — el multiplicador de calidad

Esto es lo que permite que un motor determinista produzca documentos ricos **sin IA**.
Cada capacidad es un objeto declarativo:

```ts
{
  id: "auth",
  requirements: [ /* requisitos funcionales numerados y trazables */ ],
  userStories: [ /* con criterios de aceptación en formato Dado/Cuando/Entonces */ ],
  technical: {
    services:   ["Clerk", "Supabase Auth", "Better Auth"],   // puntuados según el briefing
    dataModel:  [ /* tablas/campos que esta capacidad exige */ ],
    risks:      [ /* p.ej. gestión de sesiones, recuperación de contraseña */ ],
    nfrs:       [ /* p.ej. hash de contraseñas, límite de intentos */ ],
  },
  uxScreens:  ["registro", "acceso", "recuperar contraseña", "verificar email"],
  effort:     "M",
  monthlyCost: { free: true, from: 0 },
  dependsOn:  [],
  conflictsWith: [],
}
```

Capacidades a cubrir (~25): autenticación, roles y permisos, pagos y suscripciones, notificaciones push,
subida de archivos, tiempo real, funcionamiento sin conexión, i18n, búsqueda, integración con LLM, mapas,
calendario, email transaccional, exportación de datos, panel de administración, analítica, comentarios,
mensajería, importación masiva, webhooks, tareas programadas, versionado, auditoría, multi-idioma de
contenido, accesibilidad reforzada.

**Efecto:** seleccionar 6 capacidades genera automáticamente ~30 requisitos funcionales trazables,
~20 historias de usuario con criterios de aceptación, un modelo de datos coherente, una lista de riesgos
y un inventario de pantallas. Sin llamar a ninguna IA.

#### 3.3 Recomendador por puntuación — sustituye los `if/else`

En lugar de ramas que devuelven una cadena, un sistema que puntúa cada opción contra el briefing en
varios ejes (complejidad, tiempo real, presupuesto, tu nivel técnico, necesidad de exportar el código,
escala prevista, capacidades requeridas).

Devuelve **las 3 mejores opciones con justificación explícita y contrapartidas**, más un apartado
**"por qué no las otras"**. Esa transparencia es lo que convierte una recomendación en una decisión
informada — y es exactamente lo que hoy falta.

Se elimina la duplicación: `ProjectArchitect` y `WorkflowMap` consumen el mismo motor.

#### 3.4 Los documentos generados

**PRD — Documento de Requisitos de Producto**
Visión y problema · Objetivos y **no-objetivos** · Personas · Historias de usuario con criterios de
aceptación (Dado/Cuando/Entonces) · Alcance por fases (MVP / v1 / futuro) · Requisitos funcionales
numerados (RF-01…) · Requisitos no funcionales (rendimiento, accesibilidad AA, offline, i18n, seguridad) ·
Métricas de éxito · Riesgos y supuestos · Glosario.

**TRD — Documento de Requisitos Técnicos**
Arquitectura elegida con justificación · **Diagrama Mermaid** de componentes y de flujo de datos ·
Modelo de datos con entidades y relaciones · **DDL listo para ejecutar** (SQL para Postgres/Supabase/Neon,
o esquema de Convex, o reglas de Firestore — según la BD recomendada) · Contratos de API (endpoints,
payloads, códigos de error) · Autenticación y autorización (roles, políticas RLS) · **Estrategia PWA**
(manifest, estrategia de caché por tipo de recurso, sincronización en segundo plano) · Presupuestos de
rendimiento (Core Web Vitals) · Seguridad (validación de entrada, gestión de secretos, cabeceras CSP) ·
Plan de pruebas · Observabilidad · CI/CD y entornos · **Matriz de trazabilidad RF → componente técnico**.

**Plan de Acción**
El Workflow Map actual convertido en un plan real y vivo: fases con tareas marcables, entregable y
criterio de "hecho" por fase, tiempo estimado, y **los prompts exactos** para pegar en tu herramienta en
cada paso. El progreso se guarda: la app recuerda dónde lo dejaste.

**Brief de UX/UI**
Arquitectura de información · Inventario de pantallas (derivado de las capacidades elegidas) ·
**Tokens de diseño concretos**: paleta en OKLCH generada desde tu color base **con contraste verificado
en claro y oscuro**, escala tipográfica, escala de espaciado, radios, sombras · Componentes necesarios ·
**Estados obligatorios por componente** (vacío, cargando, error, éxito, deshabilitado — la causa más
común de que una app generada por IA se sienta a medias) · Lista de verificación de accesibilidad ·
**el CSS/Tailwind de los tokens listo para copiar**.

**Paquete de Prompts**
En la práctica, el artefacto más útil: prompt maestro de arranque (con el PRD+TRD condensados al tamaño
óptimo de contexto), prompts por fase, prompts de diagnóstico de errores, prompt de revisión de
accesibilidad, prompt de revisión visual.

#### 3.5 Exportación

- Markdown — por documento y paquete completo
- **PDF** — vía `@media print` bien construido (cero dependencias) en lugar de jsPDF
- JSON del briefing — reimportable, para versionar o duplicar un proyecto
- ZIP del paquete completo
- Google Doc nativo en Drive (Fase 4)
- Copiar al portapapeles por sección
- **`CLAUDE.md`, `AGENTS.md` y `.cursorrules` generados** — para dejarlos en la raíz del repo nuevo y que
  el agente conozca el proyecto desde el primer mensaje. Detalle pequeño, impacto grande.

#### 3.6 Capa de IA opcional

Sobre documentos que **ya existen**. Si la IA falla, no pierdes nada — esa es la ventaja del enfoque híbrido.

Operaciones: *enriquecer una sección* · *generar más historias de usuario* · *criticar mi PRD* (buscar
huecos y ambigüedades) · *traducir el documento* · *generar los textos de la interfaz*.

Implementación: cliente directo a la API de Claude desde el navegador (requiere la cabecera
`anthropic-dangerous-direct-browser-access`), con la clave guardada en `localStorage` y nunca en el repo.
Modelo recomendado: `claude-sonnet-5` por relación calidad/coste; `claude-opus-4-8` para los documentos
más exigentes.

> **Advertencia de seguridad que hay que tener presente:** una clave de API en el navegador es visible
> para cualquiera que abra las herramientas de desarrollo. Es **aceptable para una herramienta personal**
> en tu propia máquina. Si algún día publicas o compartes esta app, hay que mover las llamadas a una
> función serverless de Vercel (`/api/enrich`) con la clave del lado del servidor. Conviene diseñar
> `ai/client.ts` con esa migración en mente desde el principio: una sola interfaz, dos implementaciones.

**Criterio de hecho:** un briefing completo produce cinco documentos coherentes y exportables, con
requisitos trazables, sin haber hecho una sola llamada a la IA. La capa de IA los mejora, no los habilita.

---

### Fase 4 — Biblioteca de proyectos + Google Drive
**Tamaño: mediano (2-3 sesiones)**

1. **IndexedDB como fuente de verdad.** Usar `idb` (~1 KB, envoltorio con promesas). Almacenes:
   `projects` (id, nombre, briefing, documentos, fechas, versión de esquema), `settings`, `snapshots`.
   Incluir migración de esquema desde el primer día — vas a cambiar la forma del briefing.

2. **Pantalla "Mis Proyectos":** tarjetas con estado y progreso, duplicar, renombrar, archivar, borrar
   con confirmación, buscar, importar/exportar JSON.

3. **Versionado ligero:** guardar una instantánea del briefing cada vez que regeneras documentos, para
   poder comparar decisiones. Barato de implementar, muy útil en la práctica.

4. **Google Drive — respaldo y exportación.**
   - Autorización con Google Identity Services desde el navegador, **scope `drive.file`**. Ese scope
     limita el acceso a los archivos que la propia app crea o que tú eliges explícitamente, y por eso
     no exige la auditoría de seguridad anual que Google impone a los scopes amplios como `drive`.
     *(Conviene verificar la política vigente de Google al implementarlo — estas clasificaciones cambian.)*
   - Carpeta "Vibe Coding Hub" en tu Drive. Subida de `proyecto.json` como respaldo y creación de los
     PRD/TRD como **Google Docs nativos** (editables y compartibles desde el móvil).
   - Estado de sincronización visible y manejo honesto de errores: si el token caduca, se pide
     reautorizar **sin perder trabajo** — porque la fuente de verdad sigue siendo local.
   - **Requiere una acción manual tuya:** crear un proyecto en Google Cloud Console, activar la Drive API
     y generar un Client ID de OAuth con tu dominio de Vercel autorizado. Documentaré los pasos, pero no
     puedo hacerlo en tu nombre.

**Criterio de hecho:** cerrar el navegador y volver días después con todos los proyectos intactos.
Botón "Guardar en Drive" que produce un Google Doc legible en el móvil. Con Drive desconectado, la app
funciona igual.

---

### Fase 5 — La app como PWA ejemplar
**Tamaño: pequeño (1 sesión)**

Doble propósito: la necesitas instalable en tu escritorio y tu móvil, y sirve de referencia viva de
lo que la app enseña.

1. `vite-plugin-pwa` con Workbox.
2. **Manifest completo:** nombre y descripción en ES/EN, iconos 192/512 + maskable, capturas de pantalla,
   `shortcuts` a "Nuevo briefing" y "Mis proyectos", `theme_color` por esquema, `display: standalone`.
3. **Service worker:** precache del shell de la app, runtime caching por tipo de recurso, aviso de
   "hay una versión nueva" con recarga, indicador de estado sin conexión.
4. **Generar el juego de iconos** desde `favicon.svg` (hoy solo existe el SVG).
5. Fuentes autoalojadas — ya resuelto en la Fase 0, y es requisito para offline real.
6. **Objetivo Lighthouse:** instalable + ≥95 en Rendimiento, Accesibilidad, Buenas prácticas y SEO.

---

### Fase 6 — Ampliar el arsenal y añadir ejemplos de UX/UI
**Tamaño: grande (3-4 sesiones)**

> *"desplegar todas las herramientas disponibles, las que están allí y más"*

#### 6.1 Resource Vault: de 25 a ~100 recursos

Las categorías actuales (frontend, backend, assets, inspiration) dejan fuera casi todo lo que un proyecto
real necesita. Categorías nuevas:

| Categoría | Ejemplos |
|---|---|
| **Autenticación** | Clerk, Supabase Auth, Better Auth, Auth0, WorkOS |
| **Pagos y suscripciones** | Stripe, Lemon Squeezy, Polar, Paddle |
| **Email transaccional** | Resend, Postmark, Loops |
| **Notificaciones push** | Web Push nativo, OneSignal, Novu |
| **Almacenamiento y CDN** | Cloudinary, UploadThing, Vercel Blob, Cloudflare R2 |
| **Búsqueda** | Algolia, Meilisearch, Typesense |
| **CMS** | Sanity, Payload, TinaCMS, Contentful |
| **IA y LLM** | API de Claude, OpenRouter, Replicate, fal.ai, ElevenLabs |
| **Analítica** | Plausible, Umami, PostHog, Vercel Analytics |
| **Errores y monitorización** | Sentry, Highlight, Axiom |
| **Bases de datos (ampliar)** | Turso, PlanetScale, Xata, Upstash Redis |
| **Tareas y colas** | Inngest, Trigger.dev, QStash |
| **Componentes (ampliar)** | Aceternity, Origin UI, Tremor, Park UI, Radix Primitives |
| **Animación (ampliar)** | Motion, GSAP, Rive, Auto-Animate |
| **Color y tipografía** | Realtime Colors, Huemint, selector OKLCH, Type Scale, Fontpair |
| **Iconos** | Lucide, Phosphor, Heroicons, Iconify |
| **Ilustración** | unDraw, Storyset, Blush, Humaaans |
| **Pruebas** | Playwright, Vitest, Testing Library |
| **Accesibilidad** | axe DevTools, WAVE, Contrast, Pa11y |
| **Rendimiento** | Lighthouse CI, WebPageTest, Bundlephobia |
| **Legal** | generadores de política de privacidad, plantillas de términos, cumplimiento de cookies |

Metadatos nuevos por recurso, todos con propósito funcional:
`hasFreeTier`, `pricingTier`, `maturity`, `alternatives[]`, **`whenNotToUse`**, y
**`capabilities[]`** — este último es el que conecta el vault con el motor: al elegir la capacidad
"pagos" en el briefing, el motor puede recomendar automáticamente los recursos etiquetados con ella.

Mejoras de interfaz: filtro por capacidad y por precio, **comparación lado a lado**, y marcar favoritos.

#### 6.2 Ejemplos de UX/UI propios (completamente nuevo)

> *"Debe establecer ejemplos para UX/UI... y todo lo necesario para que aplicaciones construidas con
> esto sean visualmente atractivas"*

Hoy esto se resuelve con enlaces salientes. Propongo cuatro piezas propias:

1. **Galería de patrones** — ~14 patrones con **vista previa en vivo** dentro de la app y el código
   copiable: onboarding, estado vacío, formulario multi-paso, tabla de datos, panel de métricas, página
   de precios, flujo de autenticación, ajustes, búsqueda con filtros, notificaciones, carga esquelética,
   manejo de errores, confirmación destructiva, estado sin conexión.
   Cada patrón con su *por qué* y su prompt correspondiente.
   *Ventaja lateral: ya tienes 50 componentes de shadcn instalados y sin usar — esta galería les da uso.*

2. **Recetas estéticas** — 6 kits completos por tipo de producto (SaaS B2B, app de consumo móvil,
   portafolio editorial, panel de datos, e-commerce, herramienta interna). Cada receta: paleta,
   tipografía, densidad, tratamiento de sombras, referencias, y el prompt de estilo listo.

3. **Generador de paletas** — eliges un color base, obtienes la escala completa de tokens en claro y
   oscuro **con contraste garantizado AA**, y la exportas como CSS/Tailwind. Se alimenta del mismo
   `design/palette.ts` que usa la propia app: la herramienta y su producto comparten el motor.

4. **Verificador de accesibilidad** — pegas tu paleta o tus pares de color y te dice si cumplen AA/AAA,
   con correcciones propuestas en OKLCH. Herramienta real, no un enlace a otra web.

Estas cuatro piezas son las que convierten "aplicaciones visualmente atractivas" de una aspiración en
un procedimiento.

---

### Fase 7 — Calidad, rendimiento y verificación
**Tamaño: mediano (2 sesiones)**

1. **Pruebas donde importan.** Vitest ya está instalado y no hay ni una prueba. Prioridad:
   - `engine/` — es lógica pura, así que es fácil de probar y es donde un fallo te cuesta un documento
     malo. Casos: cada capacidad genera sus requisitos; el recomendador es determinista; las plantillas
     no dejan huecos sin rellenar
   - **Completitud de traducciones** — una prueba que falla si falta cualquier clave en cualquier idioma
   - `design/palette.ts` — el validador de contraste debe estar probado, es la garantía de accesibilidad
2. **Playwright** para tres flujos: briefing completo → generar → exportar; cambiar idioma; cambiar tema.
3. **GitHub Actions:** typecheck + pruebas + build + Lighthouse CI en cada push.
4. **Accesibilidad:** auditoría con axe y corrección de lo detectado hoy — atributos ARIA ausentes,
   asistente sin `role="radiogroup"`, menú móvil sin atrapar el foco ni cerrarse con `Escape`, falta de
   enlace "saltar al contenido", contrastes de las etiquetas `tag-mono`.
5. **Rendimiento:** code-splitting por ruta (hoy todo va en un bundle), carga diferida de framer-motion
   donde se pueda, presupuesto de tamaño de bundle vigilado en CI.
6. **Compartir y SEO:** Open Graph, imagen OG, `sitemap.xml`, `robots.txt`, títulos y descripciones por
   página y por idioma.

---

## 4. Secuencia y esfuerzo

| Fase | Tamaño | Bloquea a | Valor visible |
|---|---|---|---|
| **0 — Limpieza** | S (½ sesión) | todas | Ninguno directo, pero todo lo demás va más rápido |
| **1 — Diseño + claro** | M (2) | 2, 3, 6 | **Alto** — se acaban los bugs de contraste; claro por defecto |
| **2 — Bilingüe** | M (2) | 3, 6 | **Alto** — español por defecto |
| **3 — Motor de documentos** | L (5-6) | 4 | **Máximo** — la app empieza a producir |
| **4 — Proyectos + Drive** | M (2-3) | — | Alto — el trabajo deja de perderse |
| **5 — PWA** | S (1) | — | Medio — instalable, offline |
| **6 — Vault + UX/UI** | L (3-4) | — | Alto — el arsenal completo |
| **7 — Calidad** | M (2) | — | Medio — invisible pero es lo que sostiene lo demás |

**Total estimado: 18-21 sesiones de trabajo.**

**Por qué este orden.** Las fases 0 y 1 no producen nada visible, y aun así van primero: escribir el motor
de documentos (Fase 3, la más grande) sobre los ternarios `isDark` y sin i18n significaría reescribir
después esa fase entera en dos idiomas. El coste de saltarse el orden es mayor que el de respetarlo.

**Si quieres valor visible cuanto antes:** las fases 0 → 1 → 2 se pueden desplegar juntas y ya resuelven
tres de tus requisitos explícitos (español por defecto, claro por defecto, toggle funcional sin bugs de
contraste), en unas 4-5 sesiones.

---

## 5. Riesgos y puntos que requieren tu intervención

| Riesgo / dependencia | Naturaleza | Mitigación |
|---|---|---|
| **Clave de API en el navegador** | Visible en las DevTools | Aceptable en uso personal. `ai/client.ts` se diseña con una interfaz que permita pasar a función serverless si algún día publicas |
| **Configuración de Google Cloud** | **Requiere acción tuya** | Documentaré los pasos (proyecto, Drive API, Client ID OAuth, dominios autorizados). No puedo crearlo en tu nombre |
| **Política de scopes de Google** | Las clasificaciones cambian | Verificar el estado de `drive.file` al implementar la Fase 4. La arquitectura local-primero significa que si Drive se complica, no bloquea nada |
| **Volumen de traducción** | ~2× el contenido | Escribir el español a mano, generar el borrador inglés con la capa de IA y revisarlo. Es dogfooding |
| **La Fase 1 toca todos los archivos** | Riesgo de regresión visual | Capturas de pantalla antes/después de cada página en ambos modos, y hacerlo en una rama |
| **Calidad de los documentos generados** | El riesgo real del proyecto | Es por lo que `engine/` es lógica pura y con pruebas: la calidad se verifica automáticamente, no a ojo. Y el primer usuario de prueba eres tú, generando el PRD de tu próximo proyecto |

---

## 6. Cómo se ve el resultado

Cuando el plan esté ejecutado, esto es tu flujo real de trabajo:

1. Abres Vibe Coding Hub (instalada en tu escritorio, arranca sin conexión, en español, en claro)
2. **Nuevo proyecto** → completas el briefing en ~15 minutos
3. **Generar** → cinco documentos: PRD, TRD, plan de acción, brief de UX/UI y paquete de prompts
4. Opcionalmente: **enriquecer con IA** las secciones donde quieras más profundidad
5. **Exportar** → el prompt maestro al portapapeles, el paquete a Drive como Google Docs, y los
   `CLAUDE.md` / `AGENTS.md` al repo nuevo
6. Pegas el prompt maestro en Lovable, Manus o Claude Code — **con un PRD y un TRD reales detrás, no
   con un párrafo improvisado**
7. Vuelves al plan de acción y vas marcando fases; la app recuerda dónde estás
8. Semanas después reabres el proyecto, comparas lo construido con el PRD, y regeneras lo que cambió

La diferencia entre esto y lo que tienes hoy no es de grado: hoy la app te da enlaces y un consejo de
tres opciones; después te da el documento con el que se construye el producto.
