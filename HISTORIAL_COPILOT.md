# Historial de Migración y Refactorización del Proyecto

Este archivo documenta los cambios clave realizados en el repositorio `app-examenes` mediante agentes de inteligencia artificial (Copilot) y resume el contexto técnico y funcional para facilitar la comprensión rápida del proyecto.

---

## Resumen del Proyecto
- **Tipo:** Aplicación web de exámenes (Flask + JS)
- **Propósito:** Presentar preguntas de examen, validar respuestas y mostrar feedback inmediato
- **Estructura de datos:** Preguntas organizadas por tema en archivos JSON independientes

---

## Historial de Cambios Clave

### 1. Migración de Datos
- **Fuente original:** `fuente.txt` (todas las preguntas)
- **Archivo antiguo:** `preguntas.json` (único, ahora eliminado)
- **Nuevo formato:** Un archivo JSON por tema (`tema1.json`, `tema2.json`, ..., `legislacion.json`) en `data/`
- **Motivo:** Mejor modularidad, escalabilidad y mantenibilidad

### 2. Refactorización de Código
- **Backend (`app.py`):**
  - Lógica de aleatorización mejorada (deep copy)
  - Validación de respuestas corregida
  - ✅ Adaptado para cargar preguntas desde múltiples archivos JSON por tema
  - Nuevas funciones: `cargar_preguntas()`, `cargar_preguntas_tema()`, `obtener_temas_disponibles()`
  - Endpoint `/api/examen-aleatorio` ahora acepta parámetro `tema` para filtrar preguntas
  - Nuevo endpoint `/api/temas` para obtener lista de temas disponibles
- **Frontend (`static/js/app.js`):**
  - Corrección de estados de botones y validación de respuestas
  - Actualizado para soportar parámetro de tema en URL

### 3. Eliminación de Archivos Obsoletos
- `preguntas.json` eliminado tras migración

---

## Instrucciones para Nuevos Agentes o Colaboradores
- **Fuente de verdad de preguntas:** Los archivos JSON por tema en `data/`
- **No usar:** `preguntas.json` (ya no existe)
- **Actualizar:** Si se añaden preguntas, hacerlo en el archivo de tema correspondiente
- **Backend:** Adaptar rutas y lógica para soportar la carga dinámica por tema

---

## Contexto de Conversación y Decisiones
- Solicitud de modularización de datos por temas
- Migración completa desde `fuente.txt` a JSONs por tema
- Refactorización para mejorar aleatoriedad y validación
- Eliminación de datos obsoletos
- ✅ Actualizado `app.py` para nueva estructura con soporte multi-tema
- ✅ Implementada interfaz de selección de temas específicos

### 3. Nueva Funcionalidad: Exámenes por Tema Específico
- **Interfaz (`templates/index.html`):**
  - Añadidos selectores de tema para ambos modos (sin/con revisión)
  - Botones adicionales "Iniciar por Tema" en cada modo
  - Script JavaScript para cargar temas dinámicamente desde API
  - Redirección con parámetro de tema en URL
- **Estilos (`static/css/styles.css`):**
  - Nuevos estilos para sección de tema específico
  - Diseño de selectores y botones secundarios
  - Separador visual entre opción general y por tema
- **Temas disponibles:**
  - Tema 1 al 7 (archivos `tema1.json` - `tema7.json`)
  - Tema extra: Legislación (`legislacion.json`)

---

## Última actualización
- Fecha: 5 de diciembre de 2025
- Agente: GitHub Copilot (Claude Sonnet 4.5)

---

Este archivo sirve como guía rápida para cualquier agente, colaborador o IA que trabaje en este repositorio. Actualizar este historial ante cambios significativos.
