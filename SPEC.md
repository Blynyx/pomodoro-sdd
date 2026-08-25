# SPEC.md — Pomodoro SDD v3.0

**Proyecto:** Aplicación Web Pomodoro
**Metodología:** Specification-Driven Development (SDD)
**Versión de especificación:** 3.0
**Fecha:** 2026-08-25
**Estado:** Especificación completa, implementación pendiente

---

## Índice

1. [Visión general](#1-visión-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura de archivos](#3-estructura-de-archivos)
4. [Requisitos funcionales](#4-requisitos-funcionales)
5. [Estados del temporizador](#5-estados-del-temporizador)
6. [Modo debug](#6-modo-debug)
7. [Notificaciones](#7-notificaciones)
8. [Accesibilidad](#8-accesibilidad)
9. [Diseño responsive](#9-diseño-responsive)
10. [Casos de prueba](#10-casos-de-prueba)

---

## 1. Visión general

Aplicación web de temporizador Pomodoro que sigue la técnica clásica: bloques de 25 minutos de trabajo seguidos de descansos de 5 minutos. La interfaz es íntegramente en español.

**Características principales:**

- Temporizador con cuentregas regresiva visual
- Cambio automático entre fases de trabajo y descanso
- Contador de pomodoros completados
- Notificaciones sonora y del navegador
- Modo debug para pruebas rápidas
- Accesibilidad completa
- Diseño responsive

---

## 2. Stack tecnológico

| Tecnología | Uso |
|------------|-----|
| HTML5 | Estructura semántica |
| CSS3 | Estilos, animaciones, diseño responsive |
| JavaScript (vanilla) | Lógica del temporizador, notificaciones, estado |

**Restricciones explícitas:**

- No se permite ningún framework o librería externa
- No se permite Bootstrap, Tailwind ni similar
- No se permite jQuery ni ninguna librería de utilidades
- No se requiere bundler, transpilador ni gestor de dependencias
- El resultado debe funcionar abriendo `index.html` directamente en el navegador

---

## 3. Estructura de archivos

```
pomodoro-sdd/
├── SPEC.md          ← Este archivo de especificación
├── index.html       ← Estructura HTML
├── styles.css       ← Estilos CSS
└── app.js           ← Lógica JavaScript
```

No se permite crear archivos adicionales más allá de estos tres para la aplicación.

---

## 4. Requisitos funcionales

### REQ-001 — Duración de trabajo

**Descripción:** El temporizador debe tener una fase de trabajo con duración de 25 minutos (1500 segundos).

**Criterios de aceptación:**

- [ ] Al iniciar la aplicación, el temporizador muestra `25:00`
- [ ] El contador regresivo avanza un segundo cada segundo real (±500ms de tolerancia)
- [ ] La duración total de la fase de trabajo es exactamente 1500 segundos

---

### REQ-002 — Duración de descanso

**Descripción:** El temporizador debe tener una fase de descanso con duración de 5 minutos (300 segundos).

**Criterios de aceptación:**

- [ ] Al cambiar a fase de descanso, el temporizador muestra `05:00`
- [ ] La duración total de la fase de descanso es exactamente 300 segundos

---

### REQ-003 — Iniciar / Pausar

**Descripción:** Un único botón toggle permite iniciar el temporizador o pausarlo. El botón muestra "Iniciar" cuando el temporizador está detenido o pausado, y "Pausar" cuando está en ejecución.

**Criterios de aceptación:**

- [ ] El botón está visible y accesible con un clic
- [ ] En estado IDLE, el botón muestra "Iniciar"
- [ ] En estado PAUSED, el botón muestra "Iniciar"
- [ ] En estado RUNNING, el botón muestra "Pausar"
- [ ] Pulsar "Iniciar" pone el temporizador en estado RUNNING
- [ ] Pulsar "Pausar" pone el temporizador en estado PAUSED
- [ ] Pulsar "Pausar" no resetea el tiempo restante
- [ ] Pulsar "Iniciar" desde PAUSED continua desde el tiempo restante

---

### REQ-004 — Reiniciar

**Descripción:** Un botón de reiniciar detiene el temporizador y restaura el tiempo completo de la fase actual sin cambiar de fase.

**Criterios de aceptación:**

- [ ] El botón está visible y accesible con un clic
- [ ] Pulsar Reiniciar detiene el temporizador si está RUNNING
- [ ] Pulsar Reiniciar restaura el tiempo completo de la fase actual
  - Si está en fase trabajo → vuelve a `25:00`
  - Si está en fase descanso → vuelve a `05:00`
- [ ] Pulsar Reiniciar NO cambia la fase actual (si era trabajo, sigue siendo trabajo)
- [ ] Pulsar Reiniciar NO resetea el contador de pomodoros completados

---

### REQ-005 — Cambio automático de fase

**Descripción:** Al llegar a `00:00` en cualquier fase, el sistema cambia automáticamente a la fase opuesta. El temporizador NO arranca automáticamente en la siguiente fase; el usuario debe pulsar "Iniciar" para comenzarla.

**Flujo de transición:**

1. Fase de trabajo llega a `00:00`
2. Se ejecutan las notificaciones (sonora + navegador) — REQ-007, REQ-008
3. El contador de pomodoros se incrementa — REQ-006
4. La fase cambia a descanso
5. El temporizador muestra `05:00`
6. El estado queda IDLE, esperando que el usuario pulse "Iniciar"

**Flujo inverso (descanso → trabajo):**

1. Fase de descanso llega a `00:00`
2. Se ejecutan las notificaciones (sonora + navegador)
3. La fase cambia a trabajo
4. El temporizador muestra `25:00`
5. El estado queda IDLE

**Criterios de aceptación:**

- [ ] Al terminar trabajo, la fase cambia a descanso automáticamente
- [ ] Al terminar descanso, la fase cambia a trabajo automáticamente
- [ ] La siguiente fase NO arranca automáticamente
- [ ] El temporizador muestra el tiempo completo de la nueva fase
- [ ] El label de fase cambia de "Trabajo" a "Descanso" o viceversa
- [ ] Las notificaciones se disparan antes del cambio de fase visible

---

### REQ-006 — Contador de pomodoros completados

**Descripción:** La aplicación mantiene un contador que se incrementa cada vez que se completa una fase de trabajo (llega a `00:00`). El contador NO se incrementa al completar un descanso.

**Criterios de aceptación:**

- [ ] El contador muestra el número de pomodoros completados
- [ ] El contador se incrementa en 1 cuando una fase de trabajo llega a `00:00`
- [ ] El contador NO se incrementa cuando un descanso llega a `00:00`
- [ ] El contador se muestra siempre visible en la interfaz
- [ ] Reiniciar el temporizador (REQ-004) NO resetea el contador
- [ ] El contador comienza en 0 al cargar la página

---

### REQ-007 — Notificación sonora

**Descripción:** Al completar cualquier fase (trabajo o descanso), se reproduce un beep generado con la Web Audio API.

**Parámetros del sonido:**

| Parámetro | Valor |
|-----------|-------|
| Tipo de onda | Seno (`sine`) |
| Frecuencia | 880 Hz |
| Ganancia inicial | 0.3 |
| Ganancia final | 0.001 |
| Duración del fade | 0.5 segundos |

**Criterios de aceptación:**

- [ ] Se reproduce un beep al completar una fase de trabajo
- [ ] Se reproduce un beep al completar una fase de descanso
- [ ] El sonido se genera con Web Audio API (sin archivos de audio externos)
- [ ] La implementación está envuelta en try/catch para manejar errores de AudioContext
- [ ] El sonido es perceptible pero no molesto

---

### REQ-008 — Notificación del navegador

**Descripción:** Al completar cualquier fase, se muestra una notificación nativa del navegador usando la Notifications API, con un título y cuerpo diferenciados por fase.

**Cuerpos de notificación:**

| Fase completada | Título | Cuerpo |
|-----------------|--------|--------|
| Trabajo | ¡Pomodoro completado! | Es hora de descansar. Toma un respiro. |
| Descanso | ¡Descanso terminado! | Listo para concentrarse de nuevo. |

**Criterios de aceptación:**

- [ ] Se muestra una notificación del navegador al completar trabajo
- [ ] Se muestra una notificación del navegador al completar descanso
- [ ] Los textos son diferentes según la fase completada
- [ ] Se solicita el permiso de notificaciones al usuario solo una vez, en el primer clic de "Iniciar"
- [ ] Si el permiso fue denegado, la aplicación funciona correctamente sin notificaciones del navegador
- [ ] Si la API de Notifications no está disponible, la aplicación funciona correctamente

---

### REQ-009 — Modo debug

**Descripción:** Al acceder a la aplicación con el parámetro de URL `?debug`, se activa un modo de depuración que reduce las duraciones para facilitar las pruebas.

**Configuración de debug:**

| Parámetro | Valor normal | Valor debug |
|-----------|-------------|-------------|
| Duración trabajo | 1500s (25:00) | 10s (00:10) |
| Duración descanso | 300s (05:00) | 5s (00:05) |

**Criterios de aceptación:**

- [ ] Al acceder a `index.html?debug`, el tiempo de trabajo es 10 segundos
- [ ] Al acceder a `index.html?debug`, el tiempo de descanso es 5 segundos
- [ ] Se muestra un badge visual visible que indica "DEBUG MODE"
- [ ] El badge se posiciona de forma que no interfiera con la UI principal
- [ ] Sin el parámetro `?debug`, la aplicación usa las duraciones normales
- [ ] El modo debug afecta todas las transiciones y reseteos de fase
- [ ] Reiniciar en modo debug resetea al tiempo reducido (10s o 5s)

---

### REQ-010 — Indicador visual de progreso

**Descripción:** Un anillo SVG alrededor del temporizador muestra visualmente el progreso de la fase actual. El anillo se va vaciando conforme avanza el tiempo.

**Comportamiento:**

- El anillo comienza completo (100%) al inicio de cada fase
- Se vacía proporcionalmente al tiempo transcurrido
- La animación debe ser suave (transición CSS o actualización por frame)

**Criterios de aceptación:**

- [ ] El anillo SVG es visible al cargar la página
- [ ] El anillo comienza completamente lleno en `25:00` / `05:00`
- [ ] El anillo se vacía proporcionalmente al tiempo transcurrido
- [ ] El anillo se reinicia a completo al cambiar de fase
- [ ] La animación es suave (sin saltos visibles)

---

### REQ-011 — Muestra del estado actual

**Descripción:** Un label visible indica la fase actual: "Trabajo" o "Descanso". El label se actualiza automáticamente al cambiar de fase.

**Criterios de aceptación:**

- [ ] El label muestra "Trabajo" al cargar la página
- [ ] El label cambia a "Descanso" al transicionar de trabajo a descanso
- [ ] El label cambia a "Trabajo" al transicionar de descanso a trabajo
- [ ] El label es legible y tiene tamaño apropiado

---

### REQ-012 — Accesibilidad

**Descripción:** La aplicación debe ser accesible según WCAG 2.1 nivel AA, con soporte completo para navegación por teclado y lectores de pantalla.

**Requisitos de accesibilidad:**

| Elemento | Requisito |
|----------|-----------|
| `<html>` | `lang="es"` |
| Display del temporizador | `role="timer"`, `aria-live="polite"`, `aria-atomic="true"` |
| Botón Iniciar/Pausar | `aria-label` dinámico que refleje la acción actual ("Iniciar temporizador" / "Pausar temporizador") |
| Botón Reiniciar | `aria-label="Reiniciar temporizador"` |
| Sección de controles | Envuelta en un elemento con `aria-label` descriptivo |
| Foco visible | Estilo `:focus-visible` con outline visible en todos los elementos interactivos |
| Movimiento reducido | `@media (prefers-reduced-motion: reduce)` desactiva todas las transiciones y animaciones |
| Tipografía | Todos los tamaños de fuente en `rem` o `em`, no en `px` |

**Criterios de aceptación:**

- [ ] Todos los botones son navegables con Tab y activables con Enter/Space
- [ ] El `aria-label` del botón Iniciar/Pausar cambia dinámicamente
- [ ] El display del temporizador tiene `role="timer"` y `aria-live="polite"`
- [ ] El `:focus-visible` muestra un outline claro en todos los interactivos
- [ ] Con `prefers-reduced-motion: reduce`, no hay transiciones ni animaciones
- [ ] Un lector de pantalla puede leer el estado actual del temporizador
- [ ] Todos los tamaños de fuente usan unidades relativas (`rem`/`em`)

---

### REQ-013 — Diseño responsive

**Descripción:** La aplicación se adapta a diferentes tamaños de pantalla. El diseño es desktop-first con un breakpoint para móviles.

**Breakpoint:**

| Condición | Comportamiento |
|-----------|----------------|
| `> 480px` | Diseño completo, timer de tamaño normal (~260px) |
| `≤ 480px` | Tamaños reducidos, espaciado compacto |

**Criterios de aceptación:**

- [ ] La aplicación es usable en pantallas de 320px de ancho
- [ ] La aplicación es usable en pantallas de 1920px de ancho
- [ ] El contenedor principal usa `width: min(90vw, 420px)` para adaptarse fluidamente
- [ ] Los tamaños de fuente se reducen en el breakpoint móvil
- [ ] Los botones mantienen un tamaño mínimo táctil de 44x44px
- [ ] No se requiere scroll horizontal en ningún tamaño de pantalla

---

### REQ-014 — Título de pestaña dinámico

**Descripción:** El título de la pestaña del navegador muestra el tiempo restante y el nombre de la aplicación, actualizándose cada segundo.

**Formato del título:**

- RUNNING: `MM:SS — Pomodoro`
- IDLE: `Pomodoro`

**Criterios de aceptación:**

- [ ] Mientras el temporizador está en ejecución, el título muestra `MM:SS — Pomodoro`
- [ ] Cuando el temporizador está pausado o en IDLE, el título muestra solo `Pomodoro`
- [ ] El título se actualiza cada segundo durante la ejecución

---

## 5. Estados del temporizador

### Diagrama de estados

```
                    ┌──────────┐
                    │   IDLE   │ ← Estado inicial al cargar la página
                    │ (25:00)  │
                    └────┬─────┘
                         │ pulse Iniciar
                         ▼
                    ┌──────────┐
            ┌──────│ RUNNING  │──────┐
            │      │          │      │
            │      └──────────┘      │
            │                         │
     pulse Pausar              llega a 00:00
            │                         │
            ▼                         ▼
       ┌──────────┐            ┌──────────┐
       │  PAUSED  │            │ IDLE     │
       │ (MM:SS)  │            │ (siguiente fase)
       └────┬─────┘            │ (05:00 o 25:00)
            │                  └──────────┘
            │ pulse Iniciar
            ▼
       ┌──────────┐
       │ RUNNING  │
       └──────────┘
```

### Transiciones

| Estado actual | Evento | Estado destino | Acciones |
|---------------|--------|----------------|----------|
| IDLE | Pulse Iniciar | RUNNING | Iniciar intervalo, actualizar botón a "Pausar", actualizar título |
| RUNNING | Pulse Pausar | PAUSED | Detener intervalo, actualizar botón a "Iniciar" |
| RUNNING | Llegue a 00:00 | IDLE (siguiente fase) | Detener intervalo, disparar notificaciones, incrementar contador si fase=trabajo, cambiar fase, mostrar tiempo de nueva fase, actualizar botón a "Iniciar" |
| PAUSED | Pulse Iniciar | RUNNING | Reanudar intervalo, actualizar botón a "Pausar", actualizar título |
| Cualquier estado | Pulse Reiniciar | IDLE (misma fase) | Detener intervalo, restaurar tiempo completo de fase actual, actualizar botón a "Iniciar" |

### Variables de estado requeridas

| Variable | Tipo | Descripción |
|----------|------|-------------|
| `mode` | `"work"` \| `"break"` | Fase actual |
| `totalSeconds` | `number` | Duración total de la fase actual (1500 o 300) |
| `remainingSeconds` | `number` | Segundos restantes |
| `isRunning` | `boolean` | Si el temporizador está en ejecución |
| `cycles` | `number` | Contador de pomodoros completados |
| `intervalId` | `number` \| `null` | ID del `setInterval` activo |

---

## 6. Modo debug

### Activación

El modo debug se activa cuando la URL contiene el parámetro `?debug`:

```
index.html?debug
```

También funciona con otros parámetros presentes:

```
index.html?debug=true
index.html?debug&foo=bar
```

### Duraciones en modo debug

| Fase | Normal | Debug |
|------|--------|-------|
| Trabajo | 1500s (25:00) | 10s (00:10) |
| Descanso | 300s (05:00) | 5s (00:05) |

### Badge visual

- Texto: **"DEBUG MODE"**
- Color de fondo: naranja (`#f39c12` o similar)
- Posición: esquina superior derecha, fija (`position: fixed`)
- z-index alto para que siempre esté visible
- Tamaño de fuente legible pero no intrusivo

### Comportamiento

- El modo debug se determina una vez al cargar la página
- No se puede activar/desactivar dinámicamente
- Afecta duraciones en: inicialización, reinicio, y cambio de fase
- La aplicación funciona idéntica a la normal en todos los aspectos excepto las duraciones y el badge

---

## 7. Notificaciones

### 7.1 Notificación sonora

**Tecnología:** Web Audio API (AudioContext + OscillatorNode + GainNode)

**Parámetros:**

```javascript
// Referencia de especificación — no es código ejecutable
frecuencia: 880        // Hz
tipo_onda: "sine"      // oscilador seno
ganancia_inicial: 0.3  // volumen inicial
ganancia_final: 0.001  // volumen final (fade out)
duracion_fade: 0.5     // segundos
```

**Implementación obligatoria:**

- La creación del AudioContext debe estar envuelta en `try/catch`
- Si la API no está disponible, la aplicación continúa sin sonido
- El beep se reproduce exactamente al llegar a `00:00`

### 7.2 Notificación del navegador

**Tecnología:** Notifications API

**Momento de solicitud de permiso:**

- Se solicita en el **primer clic** del botón "Iniciar"
- NO se solicita al cargar la página
- Se verifica `Notification.permission` antes de solicitar

**Textos de notificación:**

| Fase completada | Título | Cuerpo |
|-----------------|--------|--------|
| Trabajo | ¡Pomodoro completado! | Es hora de descansar. Toma un respiro. |
| Descanso | ¡Descanso terminado! | Listo para concentrarse de nuevo. |

**Comportamiento de errores:**

- Si `Notification` no existe en `window` → la aplicación funciona sin notificaciones del navegador
- Si el permiso es `"denied"` → la aplicación funciona sin notificaciones del navegador
- Si el permiso es `"default"` → se solicita permiso (solo en primer clic de Iniciar)
- Si la creación de la notificación falla → se captura el error silenciosamente

---

## 8. Accesibilidad

### 8.1 Estructura semántica HTML

```html
<!-- Referencia de estructura — no es código final -->
<html lang="es">
  <main>
    <section aria-label="...">  <!-- Indicador de progreso + tiempo -->
      <!-- Display del temporizador -->
    </section>
    <section aria-label="...">  <!-- Controles -->
      <!-- Botones -->
    </section>
    <section aria-label="...">  <!-- Contador -->
      <!-- Pomodoros completados -->
    </section>
  </main>
</html>
```

### 8.2 Atributos ARIA

| Elemento | Atributos requeridos |
|----------|---------------------|
| Display del temporizador | `role="timer"`, `aria-live="polite"`, `aria-atomic="true"` |
| Botón Iniciar/Pausar | `aria-label` dinámico: "Iniciar temporizador" o "Pausar temporizador" |
| Botón Reiniciar | `aria-label="Reiniciar temporizador"` |
| Todos los botones | `type="button"` explícito |

### 8.3 Navegación por teclado

- Todos los botones accesibles con `Tab`
- Activables con `Enter` o `Space`
- Orden de tabulación lógico: Iniciar/Pausar → Reiniciar

### 8.4 Focus visible

```css
/* Referencia de especificación */
:focus-visible {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}
```

### 8.5 Preferencias de movimiento

```css
/* Referencia de especificación */
@media (prefers-reduced-motion: reduce) {
  /* Desactivar todas las transiciones y animaciones */
}
```

---

## 9. Diseño responsive

### Breakpoint

```css
/* Referencia de especificación */
@media (max-width: 480px) {
  /* Estilos para móvil */
}
```

### Contenedor principal

```css
/* Referencia de especificación */
width: min(90vw, 420px);
```

### Variables de diseño

| Propiedad | Desktop | Móvil (≤480px) |
|-----------|---------|-----------------|
| Tamaño del timer | ~260px | ~220px |
| Padding del contenedor | ~40px | ~20px |
| Tamaño de fuente del timer | ~4rem | ~3rem |
| Tamaño de fuente de botones | ~1rem | ~0.9rem |

### Restricciones

- Mínimo táctil: 44x44px para todos los botones
- Sin scroll horizontal en ningún viewport
- El diseño se centra vertical y horizontalmente

---

## 10. Casos de prueba

### TC-001 — Inicialización correcta

| Campo | Valor |
|-------|-------|
| **Precondición** | Navegador abriendo `index.html` por primera vez |
| **Acción** | Cargar la página |
| **Resultado esperado** | Timer muestra `25:00`, label dice "Trabajo", contador muestra 0, botón dice "Iniciar", anillo SVG está completo |

---

### TC-002 — Iniciar temporizador

| Campo | Valor |
|-------|-------|
| **Precondición** | Aplicación cargada, timer en IDLE mostrando `25:00` |
| **Acción** | Pulsar "Iniciar" |
| **Resultado esperado** | Timer comienza a decrementar (`24:59`, `24:58`...), botón cambia a "Pausar", título de pestaña muestra `24:59 — Pomodoro`, anillo SVG comienza a vaciarse |

---

### TC-003 — Pausar temporizador

| Campo | Valor |
|-------|-------|
| **Precondición** | Timer en RUNNING, mostrando algún valor intermedio (ej. `20:30`) |
| **Acción** | Pulsar "Pausar" |
| **Resultado esperado** | Timer se detiene en `20:30`, botón cambia a "Iniciar", título de pestaña vuelve a "Pomodoro" |

---

### TC-004 — Reanudar desde pausa

| Campo | Valor |
|-------|-------|
| **Precondición** | Timer en PAUSED, mostrando `20:30` |
| **Acción** | Pulsar "Iniciar" |
| **Resultado esperado** | Timer continúa desde `20:30` → `20:29` → `20:28`..., botón cambia a "Pausar" |

---

### TC-005 — Reiniciar temporizador

| Campo | Valor |
|-------|-------|
| **Precondición** | Timer en RUNNING o PAUSED, mostrando un valor intermedio (ej. `15:00`) en fase trabajo |
| **Acción** | Pulsar "Reiniciar" |
| **Resultado esperado** | Timer vuelve a `25:00`, fase sigue siendo "Trabajo", botón muestra "Iniciar", anillo SVG vuelve a estar completo |

---

### TC-006 — Transición trabajo → descanso

| Campo | Valor |
|-------|-------|
| **Precondición** | Timer en RUNNING en fase trabajo, mostrando `00:01` |
| **Acción** | Esperar 1 segundo |
| **Resultado esperado** | Timer llega a `00:00`, se reproduce beep, se muestra notificación del navegador "¡Pomodoro completado!", label cambia a "Descanso", timer muestra `05:00`, botón muestra "Iniciar", contador incrementa en 1, timer NO arranca automáticamente |

---

### TC-007 — Transición descanso → trabajo

| Campo | Valor |
|-------|-------|
| **Precondición** | Timer en RUNNING en fase descanso, mostrando `00:01` |
| **Acción** | Esperar 1 segundo |
| **Resultado esperado** | Timer llega a `00:00`, se reproduce beep, se muestra notificación del navegador "¡Descanso terminado!", label cambia a "Trabajo", timer muestra `25:00`, botón muestra "Iniciar", contador NO incrementa, timer NO arranca automáticamente |

---

### TC-008 — Contador de pomodoros

| Campo | Valor |
|-------|-------|
| **Precondición** | Contador en 0 |
| **Acción** | Completar 3 fases de trabajo consecutivas |
| **Resultado esperado** | Contador muestra 3 después de cada fase de trabajo completada. Contador NO cambia al completar fases de descanso. |

---

### TC-009 — Notificación sonora

| Campo | Valor |
|-------|-------|
| **Precondición** | Aplicación abierta con audio habilitado |
| **Acción** | Dejar que una fase llegue a `00:00` |
| **Resultado esperado** | Se escucha un beep de tono medio-alto (~880 Hz) durante ~0.5 segundos |

---

### TC-010 — Notificación del navegador

| Campo | Valor |
|-------|-------|
| **Precondición** | Permisos de notificación concedidos |
| **Acción** | Completar una fase de trabajo |
| **Resultado esperado** | Aparece notificación nativa con título "¡Pomodoro completado!" y cuerpo "Es hora de descansar. Toma un respiro." |

---

### TC-011 — Modo debug

| Campo | Valor |
|-------|-------|
| **Precondición** | Navegar a `index.html?debug` |
| **Acción** | Observar la interfaz |
| **Resultado esperado** | Timer muestra `00:10`, badge "DEBUG MODE" visible en esquina superior derecha. Iniciar el timer muestra countdown desde 10. Al completar, descanso muestra `00:05`. |

---

### TC-012 — Modo debug: reiniciar

| Campo | Valor |
|-------|-------|
| **Precondición** | Aplicación en modo debug, timer en fase trabajo mostrando `00:05` |
| **Acción** | Pulsar "Reiniciar" |
| **Resultado esperado** | Timer vuelve a `00:10` (no a `25:00`), badge "DEBUG MODE" sigue visible |

---

### TC-013 — Responsive: móvil

| Campo | Valor |
|-------|-------|
| **Precondición** | Navegador en viewport de 375px de ancho (iPhone SE) |
| **Acción** | Abrir la aplicación |
| **Resultado esperado** | Toda la UI visible sin scroll horizontal, botones tienen al menos 44x44px, timer es legible, anillo SVG se muestra completo |

---

### TC-014 — Responsive: desktop

| Campo | Valor |
|-------|-------|
| **Precondición** | Navegador en viewport de 1920x1080 |
| **Acción** | Abrir la aplicación |
| **Resultado esperado** | Aplicación centrada vertical y horizontalmente, tamaño máximo de contenedor 420px, diseño completo sin compactación |

---

### TC-015 — Navegación por teclado

| Campo | Valor |
|-------|-------|
| **Precondición** | Aplicación cargada, sin ratón conectado |
| **Acción** | Navegar con Tab, activar con Enter/Space |
| **Resultado esperado** | Tab llega al botón Iniciar (focus visible), Enter inicia el timer. Tab llega a Reiniciar (focus visible), Enter reinicia. Focus visible con outline en cada elemento. |

---

### TC-016 — Accesibilidad: aria-label dinámico

| Campo | Valor |
|-------|-------|
| **Precondición** | Aplicación con lector de pantalla activo |
| **Acción** | Interactuar con el botón Iniciar/Pausar |
| **Resultado esperado** | El lector announce "Iniciar temporizador" cuando está pausa/IDLE y "Pausar temporizador" cuando está en ejecución |

---

### TC-017 — Preferencias de movimiento reducido

| Campo | Valor |
|-------|-------|
| **Precondición** | Sistema operativo con preferencia de movimiento reducido activada |
| **Acción** | Usar la aplicación normalmente |
| **Resultado esperado** | Sin animaciones ni transiciones en ningún elemento. Los cambios de estado ocurren de forma instantánea. |

---

## Estado de implementación

| Requisito | Estado |
|-----------|--------|
| REQ-001 | ⬜ Pendiente |
| REQ-002 | ⬜ Pendiente |
| REQ-003 | ⬜ Pendiente |
| REQ-004 | ⬜ Pendiente |
| REQ-005 | ⬜ Pendiente |
| REQ-006 | ⬜ Pendiente |
| REQ-007 | ⬜ Pendiente |
| REQ-008 | ⬜ Pendiente |
| REQ-009 | ⬜ Pendiente |
| REQ-010 | ⬜ Pendiente |
| REQ-011 | ⬜ Pendiente |
| REQ-012 | ⬜ Pendiente |
| REQ-013 | ⬜ Pendiente |
| REQ-014 | ⬜ Pendiente |
