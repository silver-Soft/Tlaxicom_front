#!/usr/bin/env bash
# Genera / verifica un manifiesto SHA-256 del sitio para detectar archivos alterados o ajenos.
#   tools/manifest.sh generate [dir]           -> escribe MANIFEST.sha256 (usar sobre el repo limpio)
#   tools/manifest.sh verify   [dir]           -> compara dir (p. ej. copia descargada de produccion
#                                                 por SFTP en modo lectura) contra MANIFEST.sha256
# Excluye .git, node_modules y archivos de logs; contratos/vendor-like se incluyen.
set -u
MODE="${1:-}"; ROOT="${2:-$(cd "$(dirname "$0")/.." && pwd)}"
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$SCRIPT_DIR/MANIFEST.sha256"
list() { (cd "$1" && find . -type f -not -path './.git/*' -not -path '*/node_modules/*' -not -name 'MANIFEST.sha256' -not -name 'error_log' -not -name '*.log' | LC_ALL=C sort); }
hashes() { (cd "$1" && list "$1" | while read -r f; do sha256sum "$f"; done); }
case "$MODE" in
  generate)
    hashes "$ROOT" > "$MANIFEST"; echo "Escrito $MANIFEST ($(wc -l < "$MANIFEST") archivos)";;
  verify)
    tmp="$(mktemp)"; hashes "$ROOT" > "$tmp"
    echo "--- Diferencias (< manifiesto | > directorio verificado) ---"
    diff <(sed 's/  \.\//  /' "$MANIFEST" | sort -k2) <(sed 's/  \.\//  /' "$tmp" | sort -k2); rc=$?
    rm -f "$tmp"
    [ $rc -eq 0 ] && echo "OK: coincide con el manifiesto." ; exit $rc;;
  *) echo "Uso: $0 generate|verify [directorio]"; exit 2;;
esac
