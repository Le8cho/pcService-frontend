# Flujo en la base de datos al registrar un nuevo Antivirus desde el frontend

Cuando rellenas el formulario de registro de antivirus en el frontend y envías los datos, el flujo en la base de datos es el siguiente:

1. **El frontend envía los datos al backend**  
   - Los datos incluyen: cliente seleccionado, dispositivo, ingreso, egreso, fechas, detalles, nombre y usuario del antivirus, etc.

2. **El backend (Flask) recibe la petición y ejecuta:**
   - **a. Inserta en la tabla OPERACIONES**  
     Se crea un registro con el cliente, fecha, tipo de operación ('VENTA'), ingreso y egreso.  
     Se obtiene el nuevo `ID_OPERACION` generado.
   - **b. Inserta en la tabla VENTAS**  
     Se crea un registro en VENTAS usando el `
     ID_OPERACION` anterior y un nuevo `ID_LICENCIA` generado para el antivirus.
   - **c. Inserta en la tabla ANTIVIRUS**  
     Se crea el registro en ANTIVIRUS con el `ID_LICENCIA` y los datos específicos del antivirus.

3. **Relaciones entre tablas**
   - `OPERACIONES` se relaciona con `CLIENTES` por `ID_CLIENTE`.
   - `VENTAS` se relaciona con `OPERACIONES` por `ID_OPERACION` y con `ANTIVIRUS` por `ID_LICENCIA`.
   - `ANTIVIRUS` almacena los detalles técnicos de la licencia.

## Resumen de inserts ejecutados

```sql
-- 1. OPERACIONES
INSERT INTO OPERACIONES (ID_CLIENTE, FECHA, TIPO_OPERACION, INGRESO, EGRESO)
VALUES (:id_cliente, TRUNC(SYSDATE), 'VENTA', :ingreso, :egreso)
RETURNING ID_OPERACION INTO :id_operacion;

-- 2. VENTAS
INSERT INTO VENTAS (ID_OPERACION, ID_LICENCIA)
VALUES (:id_operacion, :id_licencia);

-- 3. ANTIVIRUS
INSERT INTO ANTIVIRUS (
    ID_LICENCIA, DETALLES, FEC_INICIO, FECHA_FIN, FECHA_AVISO, TIME_LICENCIA, NOM_ANTIVIRUS, USER_ANT
) VALUES (
    :id_licencia, :detalles, TO_DATE(:fecha_inicio, 'YYYY-MM-DD'), TO_DATE(:fecha_fin, 'YYYY-MM-DD'), TO_DATE(:fecha_aviso, 'YYYY-MM-DD'), :tiempo_licencia, :nombre_antivirus, :user_antivirus
);
```

**Notas:**
- El flujo asegura la integridad referencial entre las tablas.
- Si algún paso falla, no se completa el registro.
- El ID del cliente debe existir previamente en la tabla CLIENTES.
