#!/bin/bash

# Script para subir la aplicación a GitHub

echo "🚀 Preparando para subir a GitHub..."

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar si estamos en el directorio correcto
if [ ! -f "app.py" ]; then
    echo "❌ Error: Ejecuta este script desde la carpeta app-examenes"
    exit 1
fi

echo ""
echo "${BLUE}📋 Pasos a seguir:${NC}"
echo ""
echo "1️⃣  Ve a github.com y crea un NUEVO repositorio llamado 'app-examenes'"
echo "    - Marcalo como PÚBLICO"
echo "    - NO añadas README, .gitignore ni licencia"
echo ""
read -p "¿Ya creaste el repositorio en GitHub? (s/n): " respuesta

if [ "$respuesta" != "s" ]; then
    echo "⏸️  Primero crea el repositorio y vuelve a ejecutar este script"
    exit 0
fi

echo ""
read -p "Escribe tu usuario de GitHub: " usuario

# Inicializar git si no existe
if [ ! -d ".git" ]; then
    echo ""
    echo "${GREEN}🔧 Inicializando git...${NC}"
    git init
    git branch -M main
fi

# Añadir archivos
echo ""
echo "${GREEN}📦 Añadiendo archivos...${NC}"
git add .

# Hacer commit
echo ""
read -p "Mensaje del commit (Enter para usar mensaje por defecto): " mensaje
if [ -z "$mensaje" ]; then
    mensaje="Aplicación de exámenes lista para deploy"
fi

git commit -m "$mensaje"

# Configurar remote
echo ""
echo "${GREEN}🔗 Conectando con GitHub...${NC}"
git remote remove origin 2>/dev/null
git remote add origin "https://github.com/$usuario/app-examenes.git"

# Subir
echo ""
echo "${GREEN}⬆️  Subiendo a GitHub...${NC}"
git push -u origin main

echo ""
echo "${GREEN}✅ ¡Listo! Tu código está en GitHub${NC}"
echo ""
echo "${BLUE}🌐 Ahora ve a render.com para desplegar:${NC}"
echo "   1. Abre https://render.com"
echo "   2. Crea cuenta con GitHub"
echo "   3. New + → Web Service"
echo "   4. Conecta tu repositorio 'app-examenes'"
echo "   5. Click 'Create Web Service'"
echo ""
echo "En 2-3 minutos tendrás tu URL pública 🚀"
echo ""
