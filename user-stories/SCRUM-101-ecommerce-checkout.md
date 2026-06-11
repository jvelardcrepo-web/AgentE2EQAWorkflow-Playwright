# Historia de Usuario: SCRUM-101 - Proceso de Checkout en E-commerce

## Título de la Historia
Como cliente, quiero completar mi compra a través de un proceso de checkout para poder ordenar productos en línea.

## Descripción de la Historia
Implementar un flujo de checkout completo que permita a los clientes:
- Revisar su carrito
- Ingresar información de envío
- Seleccionar método de pago
- Confirmar su pedido

El proceso de checkout debe ser **intuitivo**, **seguro** y proporcionar **retroalimentación clara** en cada paso.

## URL de la Aplicación
[https://www.saucedemo.com](https://www.saucedemo.com)

---

## Credenciales de Prueba
- Usuario: `standard_user`
- Contraseña: `secret_sauce`

---

## Criterios de Aceptación

### AC1: Revisión del Carrito
- **DADO** que soy un usuario autenticado con artículos en el carrito  
- **CUANDO** navego a la página del carrito  
- **ENTONCES** debo ver todos los artículos agregados con sus detalles (nombre, descripción, precio, cantidad)  
- **Y** debo ver el cálculo del precio total  
- **Y** debo tener opciones para continuar comprando o proceder al checkout  

### AC2: Ingreso de Información de Checkout
- **DADO** que estoy en la página del carrito con artículos  
- **CUANDO** hago clic en el botón "Checkout"  
- **ENTONCES** debo ser redirigido a la página de información de checkout  
- **Y** debo ver campos de formulario para Nombre, Apellido y Código Postal  
- **Y** todos los campos deben ser obligatorios  
- **CUANDO** dejo algún campo vacío y hago clic en "Continuar"  
- **ENTONCES** debo ver un mensaje de error indicando qué campo es requerido  

### AC3: Resumen del Pedido
- **DADO** que he ingresado información de checkout válida  
- **CUANDO** hago clic en el botón "Continuar"  
- **ENTONCES** debo ser redirigido a la página de resumen del pedido  
- **Y** debo ver un resumen de todos los artículos en mi orden  
- **Y** debo ver la información de pago y envío  
- **Y** debo ver subtotal, impuestos y monto total  
- **Y** debo tener opciones para Cancelar o Finalizar la orden  

### AC4: Finalización del Pedido
- **DADO** que estoy en la página de resumen del pedido  
- **CUANDO** hago clic en el botón "Finalizar"  
- **ENTONCES** debo ser redirigido a la página de confirmación de la orden  
- **Y** debo ver un mensaje de éxito confirmando mi pedido  
- **Y** debo ver un botón "Volver al inicio" para regresar a la página de productos  

### AC5: Manejo de Errores
- **DADO** que estoy en la página de información de checkout  
- **CUANDO** ingreso datos inválidos (ej. caracteres especiales, información incompleta)  
- **ENTONCES** debo ver mensajes de validación apropiados  
- **Y** no debo poder continuar hasta que todos los campos sean válidos  

---

## Reglas de Negocio
1. Todos los campos del formulario de checkout son obligatorios  
2. Los usuarios deben estar autenticados para acceder al checkout  
3. El carrito no puede estar vacío al proceder al checkout  
4. La confirmación de la orden debe vaciar el carrito  
5. Los usuarios pueden cancelar el checkout en cualquier paso y regresar al carrito  

---

## Notas Técnicas
- Usar **Playwright** para la automatización de pruebas  
- Probar en navegadores **Chrome, Firefox y Safari**  
- Asegurar **responsividad móvil** en el flujo de checkout  
- Validar todos los mensajes de error de formulario  
- Probar el flujo de navegación y el comportamiento del botón "Atrás"  

---

## Definición de Hecho (Definition of Done)
- [ ] Todos los criterios de aceptación tienen casos de prueba  
- [ ] Pruebas exploratorias manuales completadas  
- [ ] Scripts de prueba automatizados creados y pasando  
- [ ] Resultados de pruebas documentados  
- [ ] Bugs registrados para cualquier fallo  
- [ ] Código comprometido en el repositorio
