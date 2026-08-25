# Bitácora de Prompts — Spec Driven Development (SDD)

## Metodología

El desarrollo siguió el enfoque **Spec Driven Development**, donde la implementación fue guiada estrictamente por el documento `SPEC.md`.

---

## Prompt 1 — Elaboración de la especificación

**Objetivo**

Generar una especificación funcional completa para la aplicación Pomodoro.

**Prompt**

```
Crear un archivo SPEC.md que defina completamente la aplicación Pomodoro utilizando la metodología Spec Driven Development.

La especificación debe incluir requisitos funcionales, arquitectura, estados del sistema, accesibilidad, responsive, casos de prueba y criterios de aceptación.

No generar código.
```

**Resultado**

Se creó `SPEC.md` como fuente única de verdad del proyecto.

---

## Prompt 2 — Implementación de index.html

**Objetivo**

Crear únicamente la estructura HTML basada en `SPEC.md`.

**Prompt**

```
Lee completamente SPEC.md.

Analiza únicamente los requisitos relacionados con HTML.

Presenta primero un plan.

Después de aprobar el plan, genera únicamente index.html.

No modifiques ningún otro archivo.
```

**Resultado**

Se implementó la estructura semántica del proyecto.

---

## Prompt 3 — Implementación de styles.css

**Objetivo**

Crear los estilos definidos en la especificación.

**Prompt**

```
Lee completamente SPEC.md.

Analiza únicamente los requisitos relacionados con CSS.

Presenta un plan de implementación.

Después de aprobar el plan, genera únicamente styles.css.

No modifiques ningún otro archivo.
```

**Resultado**

Se implementó la interfaz responsive y accesible.

---

## Prompt 4 — Implementación de app.js

**Objetivo**

Implementar toda la lógica del temporizador.

**Prompt**

```
Lee completamente SPEC.md.

Analiza únicamente los requisitos relacionados con JavaScript.

Presenta un plan.

Después de aprobar el plan, genera únicamente app.js.

No modifiques ningún otro archivo.
```

**Resultado**

Se implementó la lógica del temporizador, cambio de fases, contador de pomodoros, modo debug y notificaciones.

---

## Prompt 5 — Verificación

**Objetivo**

Comprobar que la implementación cumple la especificación.

**Prompt**

```
Lee completamente SPEC.md.

Compara SPEC.md con:

- index.html
- styles.css
- app.js

Indica requisitos cumplidos, inconsistencias y mejoras.

No modifiques archivos.
```

**Resultado**

Se verificó el cumplimiento de la especificación antes de finalizar el proyecto.