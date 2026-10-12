-- Usuarios de prueba SOLO locales (se agregan despues del dump). Contrasena de ambos: dev-pass-123
INSERT INTO usuarios (id, usuario, contrasena, estado, privilegios) VALUES
 (9001, 'admin_dev', '__HASH__', 'activo', 1),
 (9002, 'operador_dev', '__HASH__', 'activo', 0);
