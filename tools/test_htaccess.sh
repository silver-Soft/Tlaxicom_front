#!/usr/bin/env bash
# Pruebas de .htaccess/robots. Uso: tools/test_htaccess.sh [base]   (local: http://localhost:8080; prod: https://tlaxicom.com)
BASE="${1:-http://localhost:8080}"; fail=0
# Local no tiene SSL: se envia X-Forwarded-Proto y se desactiva la prueba de redireccion https/www.
chk() { # ruta esperado
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$BASE$1")
  if [ "$code" = "$2" ]; then echo "OK   $code $1"; else echo "FAIL $code (esperado $2) $1"; fail=1; fi
}
for p in /index.html /nosotros.html /contacto.html /ayuda.html /aviso_priv.html /atencionCliente.html /ui/problemasConex.html /robots.txt /sitemapTlaxicom.xml /google3ef956785c0a2e95.html /css/style.css /contratos/login.php /404.html; do chk $p 200; done
for p in /ruta-inexistente /xyz.html /docs/no-existe.pdf /wp-login.php; do chk $p 404; done
for p in "/search?category=50101" /category/85/1 "/pcmypage?callback=x" /avsoft.html /amp/ /amp/index.html /inicio/ /inicio/index.html /event/x /unsubscribe/ /5xal9aijf80/ /product/x; do chk "$p" 410; done
# 406: en produccion el WAF del hosting bloquea algunas rutas (.env, .sql) antes de llegar al .htaccess
for p in /composer.json /composer.lock /.htaccess /contratos/error_log /contratos/x.log /contratos/README.md /.env /MANIFEST.sha256 /tlaxicom_contratos.sql; do
  c=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 "$BASE$p"); if [ "$c" = 403 ] || [ "$c" = 406 ]; then echo "OK   $c $p"; else echo "FAIL $c (esperado 403/406) $p"; fail=1; fi
done
chk /contratos/dashboard.php 302
echo "--- cabeceras"; curl -sI "$BASE/index.html" | grep -i -E 'x-content-type|x-frame|referrer-policy|permissions-policy' 
echo "--- redirecciones"
r=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' -H 'Host: www.tlaxicom.com' "$BASE/nosotros.html"); echo "www       -> $r (esperado 301 https://tlaxicom.com/nosotros.html)"
r=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" -H "Host: tlaxicom.com" "$BASE/nosotros.html"); echo "sin https -> $r (local: sin redireccion; prod: 301 https)"
case "$BASE" in https://*) 
  r=$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "http://www.tlaxicom.com/index.html"); echo "http://www -> $r (esperado 301 https://tlaxicom.com/index.html)";;
esac
[ $fail -eq 0 ] && echo "TODO OK" || echo "HAY FALLOS"; exit $fail
