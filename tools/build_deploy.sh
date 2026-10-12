#!/usr/bin/env bash
# Genera deploy/ con SOLO lo que se sube a produccion (desde el ultimo commit, no desde el arbol de trabajo).
# Uso: tools/build_deploy.sh      -> crea deploy/ y deploy.sha256 (manifiesto para comparar con produccion)
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -n "$(git status --porcelain --untracked-files=no)" ]; then
  echo "Hay cambios sin confirmar en git; haz commit antes de generar el despliegue." >&2; exit 1
fi
rm -rf deploy deploy.sha256 && mkdir deploy
git archive HEAD | tar -x -C deploy
# Fuera de produccion: entorno local, herramientas, metadatos de git y plantillas
rm -rf deploy/dev deploy/tools deploy/.gitattributes deploy/.gitignore deploy/contratos/.gitignore \
       deploy/contratos/README.md deploy/contratos/config.example.php
find deploy -name '*.sql' -delete
MANIFEST_FILE="$PWD/deploy.sha256" bash tools/manifest.sh generate deploy >/dev/null
echo "deploy/: $(find deploy -type f | wc -l) archivos, $(du -sh deploy | cut -f1)"
echo "Manifiesto: deploy.sha256"
