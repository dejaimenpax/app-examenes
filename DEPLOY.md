# 🚀 Guía de Despliegue - Render.com

## Pasos para desplegar tu aplicación GRATIS en Render.com

### 1️⃣ Subir código a GitHub

```bash
cd "/Users/U01ABC6C/URJC/PREGUNTAS MARIA/app-examenes"

# Inicializar git (si no lo has hecho)
git init

# Añadir todos los archivos
git add .

# Hacer commit
git commit -m "Aplicación de exámenes lista para deploy"

# Crear repositorio en GitHub y subir
# Ve a github.com -> New Repository -> crea "app-examenes"
# Luego ejecuta:
git remote add origin https://github.com/TU_USUARIO/app-examenes.git
git branch -M main
git push -u origin main
```

### 2️⃣ Desplegar en Render.com

1. **Ve a** [render.com](https://render.com) y crea una cuenta (gratis, con GitHub)

2. **Click en "New +"** → **"Web Service"**

3. **Conecta tu repositorio** de GitHub `app-examenes`

4. **Configuración automática** (Render detecta `render.yaml`):
   - ✅ Name: `app-examenes`
   - ✅ Runtime: `Python`
   - ✅ Build Command: `pip install -r requirements.txt`
   - ✅ Start Command: `gunicorn app:app`

5. **Click en "Create Web Service"** 

6. **Espera 2-3 minutos** y listo! 🎉

### 3️⃣ Obtén tu URL

Una vez desplegado, Render te dará una URL como:
```
https://app-examenes.onrender.com
```

**Comparte esta URL con tu amigo** y podrá usar la aplicación desde cualquier lugar.

---

## ⚠️ Importante

- **La app se "duerme"** después de 15 minutos sin uso
- **Primera visita tarda ~30 segundos** en "despertar"
- **Después de despertar funciona normal**
- **100% GRATIS, sin límites de tiempo**

---

## 🔄 Actualizar la aplicación

Cada vez que hagas cambios:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

**Render detecta los cambios y redespliega automáticamente** ✨

---

## 💡 Alternativas si Render no funciona

### PythonAnywhere

1. Ve a [pythonanywhere.com](https://www.pythonanywhere.com)
2. Crea cuenta gratuita
3. En "Web" → "Add a new web app"
4. Sigue el asistente para Flask
5. Sube tus archivos manualmente

### Railway.app

1. Ve a [railway.app](https://railway.app)
2. Conecta con GitHub
3. Click en "Deploy from GitHub repo"
4. Selecciona tu repositorio
5. Listo (requiere tarjeta pero no cobra en plan free)

---

## 🎯 Resumen

**Render.com es la opción más fácil:**
- ✅ Sin configuración
- ✅ Sin tarjeta de crédito
- ✅ Deploy automático
- ✅ 2 minutos de setup

**Tu amigo solo necesitará:**
- La URL que te dé Render
- Un navegador web
- Nada más! 🚀
