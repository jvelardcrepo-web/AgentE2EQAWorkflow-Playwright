# Informe de Ejecución de Pruebas — SCRUM-101: Proceso de Checkout en E-commerce

**Aplicación bajo prueba:** [SauceDemo](https://www.saucedemo.com)
**Usuario de prueba:** `standard_user` / `secret_sauce`
**Fecha de ejecución:** 2026-06-11
**Plan de prueba:** [specs/saucedemo-checkout-test-plan.md](../specs/saucedemo-checkout-test-plan.md)

---

## 1. Resumen Ejecutivo

| Métrica | Valor |
|---|---|
| Casos de prueba planificados | 16 escenarios |
| Casos ejecutados manualmente (exploratorios) | 8 escenarios clave |
| Casos automatizados (Playwright) | 16 escenarios × 3 navegadores = 48 ejecuciones |
| Resultado general | ✅ **PASE** |
| Pruebas automatizadas — Pase | 48 / 48 (100%) |
| Pruebas automatizadas — Fallo | 0 |
| Defectos encontrados | 0 (ningún defecto bloqueante; 1 observación de comportamiento documentada) |

**Estado general: PASE.** El flujo de checkout de SauceDemo cumple con todos los criterios de aceptación (AC1–AC5) de la historia de usuario SCRUM-101 en Chromium, Firefox y WebKit.

---

## 2. Resultados de Pruebas Manuales (Paso 3 — Pruebas Exploratorias)

Pruebas ejecutadas manualmente con las herramientas del navegador MCP de Playwright contra https://www.saucedemo.com.

| # | Escenario | Resultado | Evidencia |
|---|---|---|---|
| 1 | Acceso no autenticado a `/checkout-step-one.html` redirige al login con mensaje "Epic sadface: You can only access '/checkout-step-one.html' when you are logged in." | ✅ PASE | [01-unauthenticated-checkout-redirect.png](../specs/exploratory-screenshots/01-unauthenticated-checkout-redirect.png) |
| 2 | Carrito muestra ítems agregados (Backpack $29.99, Bike Light $9.99) con descripción y cantidad | ✅ PASE | [02-cart-with-items.png](../specs/exploratory-screenshots/02-cart-with-items.png) |
| 3 | Continuar sin "Last Name" muestra "Error: Last Name is required" | ✅ PASE | [03-error-lastname-required.png](../specs/exploratory-screenshots/03-error-lastname-required.png) |
| 4 | Continuar sin "Zip/Postal Code" muestra "Error: Postal Code is required" | ✅ PASE | [04-error-zip-required.png](../specs/exploratory-screenshots/04-error-zip-required.png) |
| 5 | Caracteres especiales (`O'Brian-Jr.`, `D'Souza`, `A1B 2C3`) son aceptados y avanzan a Overview | ✅ PASE | (verificado vía navegación a `/checkout-step-two.html`) |
| 6 | Página de Overview muestra ítems, "Payment Information: SauceCard #31337", "Shipping Information: Free Pony Express Delivery!", subtotal/impuesto/total | ✅ PASE | [05-order-overview.png](../specs/exploratory-screenshots/05-order-overview.png), [07-overview-with-item.png](../specs/exploratory-screenshots/07-overview-with-item.png) |
| 7 | "Cancel" en Overview regresa a `/inventory.html` conservando el contenido del carrito | ✅ PASE | — |
| 8 | "Finish" muestra página de confirmación "Thank you for your order!" y "Back Home" regresa a `/inventory.html` con el carrito vacío | ✅ PASE | [08-order-complete.png](../specs/exploratory-screenshots/08-order-complete.png) |

### Observaciones de la exploración

- **Validación de campos requeridos**: el banner de error (`Error: <Campo> is required`) reporta únicamente el **primer** campo vacío en orden First Name → Last Name → Postal Code. Si todos los campos están vacíos, solo se muestra "First Name is required".
- **Persistencia del carrito**: el estado del carrito se mantiene en memoria de la SPA (Vue/React) y se actualiza correctamente mediante navegación por clics (íconos/botones de la UI) y `goBack()` del navegador. Una navegación de página completa con `page.goto()` directamente a una URL de checkout (sin pasar por la UI) puede mostrar el carrito vacío ($0), ya que provoca una recarga completa que reinicia el estado en memoria de la aplicación. **Recomendación para automatización**: navegar siempre mediante interacciones de UI (clics), nunca con `goto()` directo entre pasos del checkout.
- Los selectores `data-test="*"` de SauceDemo son estables y se usaron como localizadores principales en los scripts generados.

---

## 3. Resultados de Pruebas Automatizadas (Paso 4 y 5)

### 3.1 Generación de Scripts (Paso 4)

Se generaron 5 archivos de suite en `tests/saucedemo-checkout/`, basados en el plan de prueba y reutilizando los selectores `data-test` y clases CSS estables descubiertos durante la exploración manual:

| Archivo | Suite | # Pruebas |
|---|---|---|
| `cart-review.spec.ts` | Cart Review | 2 |
| `checkout-information.spec.ts` | Checkout Information | 7 |
| `order-overview.spec.ts` | Order Overview | 2 |
| `order-completion.spec.ts` | Order Completion | 2 |
| `navigation-edge-cases.spec.ts` | Navigation and Edge Cases | 2 |
| `helpers.ts` | Funciones auxiliares compartidas (login, addToCart, goToCart, fillCheckoutInformation) | — |

Configuración multi-navegador: `playwright.config.ts` ya define los proyectos `chromium`, `firefox` y `webkit`.

### 3.2 Ejecución y Curación (Paso 5)

**Resultados iniciales (primera ejecución completa, 3 navegadores):**

| Navegador | Pruebas | Pase | Fallo |
|---|---|---|---|
| chromium | 16 | 16 | 0 |
| firefox | 16 | 16 | 0 |
| webkit | 16 | 16 | 0 |
| **Total** | **48** | **48** | **0** |

**Actividades de curación realizadas:** Ninguna. Todas las 48 ejecuciones (16 escenarios × 3 navegadores) pasaron en el primer intento, por lo que el agente test-healer no fue requerido.

**Resultados finales:** ✅ 48/48 pasaron de forma estable.

### 3.3 Resumen por Suite (todos los navegadores)

| Suite | Escenarios | Resultado |
|---|---|---|
| Cart Review | 2 | ✅ PASE |
| Checkout Information | 7 | ✅ PASE |
| Order Overview | 2 | ✅ PASE |
| Order Completion | 2 | ✅ PASE |
| Navigation and Edge Cases | 2 | ✅ PASE |

---

## 4. Registro de Defectos

No se identificaron defectos bloqueantes, críticos ni de severidad alta o media durante las pruebas manuales o automatizadas. Todos los criterios de aceptación se cumplieron según lo especificado.

| ID | Severidad | Título | Estado |
|---|---|---|---|
| N/A | — | No se registraron defectos | — |

**Nota de comportamiento (no es un defecto):** ver "Persistencia del carrito" en la sección 2 — comportamiento esperado de una SPA, documentado para guiar futuras automatizaciones.

---

## 5. Análisis de Cobertura de Pruebas

| Criterio de Aceptación | Cobertura Manual | Cobertura Automatizada | Estado |
|---|---|---|---|
| AC1 — Revisión del Carrito | ✅ | ✅ `cart-review.spec.ts` | Cubierto |
| AC2 — Ingreso de Información de Checkout (incl. validación de campos requeridos) | ✅ | ✅ `checkout-information.spec.ts` | Cubierto |
| AC3 — Resumen del Pedido (subtotal, impuestos, total, payment/shipping info) | ✅ | ✅ `order-overview.spec.ts` | Cubierto |
| AC4 — Finalización del Pedido y "Back Home" | ✅ | ✅ `order-completion.spec.ts` | Cubierto |
| AC5 — Manejo de Errores (campos vacíos, caracteres especiales) | ✅ | ✅ `checkout-information.spec.ts` | Cubierto |
| Navegación / botón Atrás / acceso no autenticado | ✅ | ✅ `navigation-edge-cases.spec.ts` | Cubierto |

**Brechas de cobertura identificadas:**
- No se probó la responsividad móvil (mencionada en notas técnicas de la historia de usuario) — requiere proyectos de dispositivo móvil adicionales en `playwright.config.ts`.
- No se probaron usuarios alternativos (`locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`) que SauceDemo provee para pruebas negativas adicionales.
- No se probó la actualización de cantidades de artículos en el carrito (SauceDemo no permite editar cantidad, solo eliminar).

**Recomendaciones para pruebas adicionales:**
1. Agregar proyectos de dispositivos móviles (`Pixel 5`, `iPhone 12`) al `playwright.config.ts` y re-ejecutar la suite para validar responsividad.
2. Agregar un suite de "usuarios especiales" (`locked_out_user`, `error_user`, `visual_user`) para validar manejo de errores de autenticación y comportamiento visual/funcional degradado.

---

## 6. Resumen y Recomendaciones

**Evaluación general de calidad:** El flujo de checkout de SauceDemo es funcionalmente estable y cumple con todos los criterios de aceptación de SCRUM-101. La suite automatizada de 16 escenarios pasa de manera consistente en los 3 navegadores principales (Chromium, Firefox, WebKit).

**Áreas de riesgo:**
- Dependencia de la app de demostración pública SauceDemo (fuera de nuestro control); cambios futuros en selectores o textos podrían requerir mantenimiento de la suite.
- Falta de cobertura móvil y de usuarios alternativos limita la detección de regresiones específicas de esos escenarios.

**Próximos pasos:**
1. Integrar la suite `tests/saucedemo-checkout/` en el pipeline de CI (`.github/workflows/playwright.yml`).
2. Ampliar cobertura con proyectos móviles y usuarios alternativos según lo recomendado en la sección 5.
3. Mantener actualizado `specs/saucedemo-checkout-test-plan.md` ante cualquier cambio en los criterios de aceptación.

---

## Definición de Hecho — Verificación

- [x] Todos los criterios de aceptación tienen casos de prueba
- [x] Pruebas exploratorias manuales completadas
- [x] Scripts de prueba automatizados creados y pasando
- [x] Resultados de pruebas documentados
- [x] Bugs registrados para cualquier fallo (ninguno encontrado)
- [ ] Código comprometido en el repositorio (Paso 7)
