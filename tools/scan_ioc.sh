#!/usr/bin/env bash
# Busca indicadores de compromiso (IOC) en un directorio (repo local o copia descargada de produccion).
# Uso: tools/scan_ioc.sh [directorio]   (por defecto, la raiz del repo)
# Salida: codigo 0 si no hay hallazgos, 1 si hay alguno.
ROOT="${1:-$(cd "$(dirname "$0")/.." && pwd)}"
cd "$ROOT" || exit 2
found=0
warn() { echo "[!] $*"; found=1; }

# 1. Cadenas de spam / dominios conocidos del atacante
IOC='DEMEN303|KINGTOTO|pages\.dev|tahubulat|kuemeranti|imgsaya4|dikit\.|slot gacor|togel'
if grep -rIlE -i "$IOC" --include='*.html' --include='*.htm' --include='*.js' --include='*.php' --include='*.xml' --include='*.txt' . 2>/dev/null | grep -v -E '^\./(tools/|\.git/)' ; then
  warn "Archivos con indicadores de spam (arriba)"
fi

# 2. Directorios que no deben existir
for d in amp inicio duck; do
  [ -e "$d" ] && warn "Existe ./$d (no deberia)"
done

# 3. PHP fuera de /contratos
php_out=$(find . -type f \( -iname '*.php' -o -iname '*.phtml' -o -iname '*.php[0-9]' -o -iname '*.phar' \) -not -path './contratos/*' -not -path './vendor/*' -not -path './.git/*')
[ -n "$php_out" ] && { echo "$php_out"; warn "PHP fuera de /contratos (arriba)"; }

# 4. Archivos de verificacion de Search Console (solo deben existir los confirmados)
gv=$(ls google*.html 2>/dev/null)
[ -n "$gv" ] && { echo "Verificaciones Search Console presentes:"; echo "$gv"; }
n=$(echo "$gv" | grep -c .)
[ "$n" -gt 1 ] && warn "Hay $n archivos google*.html; deja solo los de propietarios confirmados"

# 5. HTML sospechosamente grande (las paginas legitimas pesan < 100 KB)
big=$(find . -maxdepth 2 -name '*.html' -size +100k -not -path './contratos/*' -not -path './.git/*')
[ -n "$big" ] && { echo "$big"; warn "HTML > 100 KB (arriba)"; }

# 6. Funciones tipicas de webshell en PHP propio de contratos
if grep -rnE '(eval|assert|gzinflate|str_rot13|shell_exec|passthru|system)\s*\(' contratos --include='*.php' --exclude-dir=TCPDF --exclude-dir=PHPMailer --exclude-dir=vendor 2>/dev/null; then
  warn "Funciones peligrosas en PHP de contratos (revisar)"
fi

[ "$found" -eq 0 ] && echo "OK: sin hallazgos."
exit "$found"
