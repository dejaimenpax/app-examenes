# 📚 Aplicación de Exámenes Tipo Test

Aplicación web desarrollada en Python Flask para realizar exámenes tipo test con preguntas aleatorias.

## 🎯 Características

- **2 Modos de Examen**:
  - **Sin Revisión**: 10 preguntas aleatorias, corrección al finalizar
  - **Con Revisión**: 10 preguntas aleatorias, retroalimentación inmediata
- **Preguntas hardcodeadas**: Todas las preguntas están almacenadas en JSON (no requiere base de datos)
- **Interfaz intuitiva**: Diseño limpio y fácil de usar, responsive para móviles
- **Corrección automática**: Muestra puntuación y respuestas correctas
- **100% Aleatorio**: Cada vez que inicias un examen, las preguntas son diferentes

## 📂 Estructura del Proyecto

```
app-examenes/
├── app.py                      # Servidor Flask
├── requirements.txt            # Dependencias Python
├── data/
│   └── preguntas.json         # Base de datos de 27 preguntas
├── static/
│   ├── css/
│   │   └── styles.css         # Estilos CSS
│   └── js/
│       └── app.js             # Lógica JavaScript
└── templates/
    ├── index.html             # Página principal con modos
    └── examen.html            # Página del examen
```

## 🚀 Instalación y Uso

### 1. Crear entorno virtual

```bash
cd app-examenes
python3 -m venv venv
source venv/bin/activate  # En Mac/Linux
# venv\Scripts\activate   # En Windows
```

### 2. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 3. Ejecutar la aplicación

```bash
python app.py
```

### 3. Abrir en el navegador

Abre tu navegador y visita:
```
http://localhost:5000
```

## 💡 Cómo Funciona

### Modo Sin Revisión
1. **Inicio**: Presiona "Iniciar Examen sin Revisión"
2. **Responder**: 10 preguntas aleatorias, navega con anterior/siguiente
3. **Finalizar**: Al terminar presiona "Finalizar Examen"
4. **Resultados**: Ve tu puntuación total
5. **Revisión**: Revisa todas las respuestas correctas e incorrectas

### Modo Con Revisión  
1. **Inicio**: Presiona "Iniciar Examen con Revisión"
2. **Responder**: Selecciona una respuesta
3. **Comprobar**: Presiona "Comprobar Respuesta"
4. **Feedback**: Ves inmediatamente si acertaste o no
5. **Continuar**: Pasa a la siguiente pregunta
6. **Resultados finales**: Al completar las 10 preguntas

**Nota**: Cada vez que inicias un examen, las 10 preguntas son seleccionadas aleatoriamente de la batería completa.

## 📝 Añadir Más Preguntas

Para añadir más preguntas, edita el archivo `data/preguntas.json`:

```json
{
  "id": 28,
  "pregunta": "Texto de la pregunta",
  "opciones": [
    "Opción A",
    "Opción B",
    "Opción C",
    "Opción D"
  ],
  "respuesta_correcta": 0
}
```

**Nota**: `respuesta_correcta` es el índice (0-3) de la opción correcta.

## 🎨 Personalización

### Cambiar número de preguntas por examen

Edita `app.py` y cambia el número en la función `api_examen_aleatorio`:

```python
# Cambiar 10 por el número que quieras
preguntas_seleccionadas = random.sample(todas_preguntas, min(10, len(todas_preguntas)))
```

### Cambiar colores

Edita las variables CSS en `static/css/styles.css`:

```css
:root {
    --primary-color: #2563eb;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* ... más colores */
}
```

### Modificar exámenes

~~Edita `data/examenes.json` para cambiar qué preguntas aparecen en cada examen~~

**Ya no es necesario**: Las preguntas son seleccionadas aleatoriamente cada vez.

## 🔧 Tecnologías Utilizadas

- **Backend**: Python 3 + Flask
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Datos**: JSON (sin base de datos)
- **Aleatoriedad**: Python `random.sample()`

## 📱 Responsive

La aplicación está optimizada para:
- ✅ Desktop
- ✅ Tablet
- ✅ Móvil

## 🎓 Características Pedagógicas

- ✅ **Dos modos de estudio**: práctica con corrección inmediata o examen real
- ✅ **Preguntas aleatorias**: cada intento es diferente
- ✅ **Retroalimentación inmediata** (modo con revisión)
- ✅ **Revisión completa** al finalizar (modo sin revisión)
- ✅ **Puntuación sobre 10** y porcentaje de aciertos
- ✅ **10 preguntas por examen**: rápido y efectivo

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo.

---

**Desarrollado para**: María - URJC
**Fecha**: Noviembre 2025
