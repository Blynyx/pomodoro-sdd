# Pomodoro Timer — Spec Driven Development (SDD)

## Descripción

Este proyecto implementa una aplicación web de gestión de tiempo basada en la técnica Pomodoro utilizando la metodología **Spec Driven Development (SDD)**.

El desarrollo se realizó siguiendo una especificación funcional formal (`SPEC.md`), que actúa como la única fuente de verdad durante toda la implementación.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript Vanilla

No se utilizaron frameworks ni librerías externas.

## Funcionalidades

- Temporizador de trabajo (25 minutos)
- Temporizador de descanso (5 minutos)
- Botón Iniciar / Pausar
- Botón Reiniciar
- Cambio automático entre fases
- Contador de pomodoros completados
- Notificación sonora mediante Web Audio API
- Notificación visual mediante Notifications API
- Modo Debug (`?debug`)
- Diseño responsive
- Accesibilidad mediante HTML semántico y atributos ARIA

## Estructura del proyecto

```
pomodoro-sdd/
│
├── SPEC.md
├── README.md
├── PROMPTS.md
├── index.html
├── styles.css
└── app.js
```

## Metodología

El desarrollo siguió el enfoque Spec Driven Development:

1. Elaboración de la especificación funcional (`SPEC.md`).
2. Aprobación de la especificación.
3. Implementación de `index.html`.
4. Implementación de `styles.css`.
5. Implementación de `app.js`.
6. Validación del cumplimiento de la especificación.

## Ejecución

Abrir `index.html` en cualquier navegador moderno.

Para activar el modo de pruebas:

```
index.html?debug
```

## Autor

Proyecto desarrollado para la práctica de Desarrollo Asistido por IA.