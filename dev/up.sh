#!/usr/bin/env bash
# Levanta el entorno local: sitio http://localhost:8080 , buzon de pruebas http://localhost:8025
# Uso: dev/up.sh [down]     ("down" apaga y borra la BD local)
cd "$(dirname "$0")" || exit 1
if [ "${1:-}" = "down" ]; then docker compose down -v; exit; fi
HASH="$(docker run --rm php:8.2-cli php -r 'echo password_hash("dev-pass-123", PASSWORD_BCRYPT);')"
sed "s#__HASH__#$(printf '%s' "$HASH" | sed 's/[#&\]/\&/g')#g" init.sql > .init.rendered.sql
docker compose up -d --build
