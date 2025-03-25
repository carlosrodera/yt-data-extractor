#!/bin/bash

# Script para publicar YT Data Extractor en GitHub

echo "=== Publicación de YT Data Extractor en GitHub ==="
echo ""
echo "Este script te ayudará a publicar el repositorio en GitHub como público."
echo "Nota: Necesitas tener acceso a GitHub y tener configuradas tus credenciales."
echo ""

# Verificar si git está instalado
if ! command -v git &> /dev/null; then
    echo "Error: Git no está instalado. Por favor, instala Git antes de continuar."
    exit 1
fi

# Verificar que estamos en el directorio correcto
if [ ! -f "manifest.json" ] || [ ! -f "popup.html" ]; then
    echo "Error: Este script debe ejecutarse desde el directorio raíz de YT Data Extractor."
    exit 1
fi

# Preguntar si desea continuar
read -p "¿Deseas continuar con la publicación? (s/n): " confirm
if [ "$confirm" != "s" ] && [ "$confirm" != "S" ]; then
    echo "Operación cancelada."
    exit 0
fi

echo ""
echo "=== Opciones de publicación ==="
echo ""
echo "1. Publicar en un repositorio existente"
echo "2. Crear un nuevo repositorio en GitHub"
echo ""

read -p "Selecciona una opción (1-2): " option

case $option in
    1)
        echo ""
        echo "=== Publicar en un repositorio existente ==="
        read -p "Introduce la URL del repositorio (ejemplo: https://github.com/usuario/repo.git): " repo_url
        
        # Verificar el formato de la URL
        if [[ ! $repo_url =~ ^https://github.com/.+/.+\.git$ ]]; then
            echo "Error: Formato de URL incorrecto. Debe ser como: https://github.com/usuario/repo.git"
            exit 1
        fi
        
        echo "Configurando el repositorio remoto..."
        git remote set-url origin "$repo_url"
        ;;
    2)
        echo ""
        echo "=== Crear un nuevo repositorio en GitHub ==="
        echo ""
        echo "Para crear un nuevo repositorio en GitHub:"
        echo ""
        echo "1. Ve a https://github.com/new"
        echo "2. Ingresa 'yt-data-extractor' como nombre del repositorio"
        echo "3. Añade una descripción como 'Extensión de Chrome para extraer datos de videos de YouTube'"
        echo "4. Selecciona 'Público' como visibilidad"
        echo "5. NO inicialices el repositorio con README, .gitignore o licencia"
        echo "6. Haz clic en 'Crear repositorio'"
        echo ""
        echo "Después de crear el repositorio, GitHub mostrará comandos para conectar tu repositorio local."
        echo "Copia la URL del repositorio (termina en .git)"
        echo ""
        
        read -p "Introduce la URL del repositorio creado: " repo_url
        
        # Verificar el formato de la URL
        if [[ ! $repo_url =~ ^https://github.com/.+/.+\.git$ ]]; then
            echo "Error: Formato de URL incorrecto. Debe ser como: https://github.com/usuario/repo.git"
            exit 1
        fi
        
        echo "Configurando el repositorio remoto..."
        git remote set-url origin "$repo_url"
        ;;
    *)
        echo "Opción no válida. Saliendo."
        exit 1
        ;;
esac

echo ""
echo "=== Autenticación ==="
echo ""
echo "Para publicar en GitHub, necesitas autenticarte. Puedes usar:"
echo "1. Credenciales HTTPS (nombre de usuario y token)"
echo "2. Clave SSH (si ya está configurada)"
echo ""

read -p "¿Qué método de autenticación prefieres usar? (1-2): " auth_method

case $auth_method in
    1)
        echo ""
        echo "=== Autenticación HTTPS ==="
        echo ""
        echo "Necesitarás tu nombre de usuario de GitHub y un token de acceso personal."
        echo "Si no tienes un token, puedes crear uno en: https://github.com/settings/tokens"
        echo "(Asegúrate de que el token tenga permisos 'repo')"
        echo ""
        
        read -p "Nombre de usuario de GitHub: " github_user
        read -s -p "Token de acceso personal: " github_token
        echo ""
        
        # Configurar credenciales temporales
        repo_url_with_auth="https://${github_user}:${github_token}@${repo_url#https://}"
        
        echo "Publicando cambios en GitHub..."
        git push -u "$repo_url_with_auth" main
        
        # Limpiar URL con credenciales
        git remote set-url origin "$repo_url"
        ;;
    2)
        echo ""
        echo "=== Autenticación SSH ==="
        echo ""
        echo "Asegúrate de que tu clave SSH esté configurada correctamente con GitHub."
        echo "Si no tienes una clave SSH configurada, consulta: https://docs.github.com/es/authentication/connecting-to-github-with-ssh"
        echo ""
        
        # Convertir URL HTTPS a SSH
        ssh_url="git@github.com:${repo_url#https://github.com/}"
        ssh_url=${ssh_url%.git}.git
        
        echo "Configurando URL SSH: $ssh_url"
        git remote set-url origin "$ssh_url"
        
        echo "Publicando cambios en GitHub..."
        git push -u origin main
        ;;
    *)
        echo "Opción no válida. Saliendo."
        exit 1
        ;;
esac

echo ""
echo "=== Configuración del repositorio ==="
echo ""
echo "Para completar la configuración de tu repositorio en GitHub:"
echo ""
echo "1. Ve a: https://github.com/[tu-usuario]/yt-data-extractor/settings"
echo "2. En la sección 'Features', habilita Issues y Projects si lo deseas"
echo "3. En 'Topics', añade etiquetas como: youtube, chrome-extension, data-extraction"
echo "4. Opcionalmente, configura las GitHub Pages para mostrar documentación"
echo ""
echo "También puedes crear releases para facilitar la distribución:"
echo "https://github.com/[tu-usuario]/yt-data-extractor/releases/new"
echo ""

echo "¡Listo! YT Data Extractor ahora está publicado en GitHub como repositorio público."
echo "URL del repositorio: ${repo_url}"
echo ""
