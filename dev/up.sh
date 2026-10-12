#!/usr/bin/env bash
# Levanta el entorno local en http://localhost:8080  (uso: dev/up.sh [down])
cd "$(dirname "$0")" || exit 1
if [ "${1:-}" = "down" ]; then DB_DEV_PASSWORD=x docker compose down -v; exit; fi
# Reutiliza la contrasena que espera contratos/conexion.php (no se imprime)
export DB_DEV_PASSWORD="$(sed -n 's/.*contrasena_db *= *"\(.*\)";.*/\1/p' ../contratos/conexion.php | tail -1)"
HASH="$(docker run --rm php:8.2-cli php -r 'echo password_hash("dev-pass-123", PASSWORD_BCRYPT);')"
sed "s#__HASH__#$(printf '%s' "$HASH" | sed 's/[#&\]/\&/g')#g" init.sql > .init.rendered.sql
docker compose up -d --build
