# Flujo de Control de Calidad End-to-End con Lenguaje Natural

## Descripción General del Flujo

Este indicador te guía a través de un flujo completo de 7 pasos de QA utilizando servidores MCP y agentes de IA para pasar de una historia de usuario a scripts de prueba automatizada comprometidos.

---

## 🔍 PASO 1: Leer Historia de Usuario

**Prompt:**
Necesito comenzar un nuevo flujo de prueba. Por favor, lee la historia de usuario del archivo: user-stories/SCRUM-101-ecommerce-checkout.md

Resume los requisitos clave, criterios de aceptación y alcance de prueba.

**Salida Esperada:**
- Resumen de la historia de usuario
- Lista de criterios de aceptación
- URL de la aplicación y credenciales de prueba
- Características clave a probar

---


## 📋 PASO 2: Crear Plan de Prueba

**Prompt:**

Basado en la historia de usuario SCRUM-101 que acabamos de revisar, utiliza el agente playwright-test-planner para:

1. Leer la URL de la aplicación y credenciales de prueba de la historia de usuario
2. Explorar la aplicación y comprender todos los flujos mencionados en los criterios de aceptación
3. Crear un plan de prueba integral que cubra todos los criterios de aceptación incluyendo:
   - Escenarios de ruta feliz
   - Escenarios negativos (errores de validación, campos vacíos, datos inválidos)
   - Casos límite y condiciones fronterizas
   - Pruebas de flujo de navegación
   - Validación de elementos de interfaz de usuario

4. Guardar el plan de prueba como: specs/saucedemo-checkout-test-plan.md

Asegúrate de que cada escenario de prueba incluya:
- Título claro del caso de prueba
- Instrucciones detalladas paso a paso
- Resultados esperados para cada paso
- Requisitos de datos de prueba

**Salida Esperada:**

- Archivo markdown del plan de prueba completo guardado en specs/
- Escenarios de prueba organizados con estructura clara
- Capturas de pantalla de exploración del navegador (si es necesario)

---

## 🔧 PASO 3: Realizar Pruebas Exploratorias

**Prompt:**

Ahora necesito realizar pruebas exploratorias manuales utilizando herramientas del navegador MCP de Playwright.

Por favor, lee el plan de prueba desde: specs/saucedemo-checkout-test-plan.md

Luego ejecuta cada escenario de prueba definido en el plan:
1. Usa las herramientas del navegador Playwright para ejecutar manualmente cada escenario de prueba del plan
2. Sigue las instrucciones paso a paso en cada caso de prueba
3. Verifica que los resultados esperados coincidan con los resultados reales
4. Toma capturas de pantalla en pasos clave y estados de error
5. Documenta tus hallazgos:
   - Resultados de ejecución de pruebas para cada escenario
   - Cualquier inconsistencia de interfaz de usuario o comportamiento inesperado
   - Validaciones faltantes o errores descubiertos
   - Capturas de pantalla como evidencia

**Salida Esperada:**

- Resultados de ejecución de pruebas manual
- Capturas de pantalla de la aplicación en varios estados
- Lista de observaciones y hallazgos
- Cualquier problema descubierto durante la exploración

---

## ⚙️ PASO 4: Generar Scripts de Automatización

**Prompt:**

Ahora necesito crear scripts de prueba automatizados utilizando el agente playwright-test-generator.

Por favor, revisa:
1. Plan de prueba desde: specs/saucedemo-checkout-test-plan.md (para escenarios de prueba y pasos)
2. Resultados de pruebas exploratorias del Paso 3 (para selectores de elementos reales e información de interfaz de usuario)

Utilizando información de las pruebas exploratorias manuales:
- Aprovecha los selectores de elementos y localizadores que se utilizaron exitosamente en el Paso 3
- Captura propiedades de elementos estables (IDs, atributos de datos, roles de ARIA)
- Descubre las propiedades de UI identificadas durante la exploración
- Aplica estrategias de espera y comportamientos de interfaz de usuario observados en las pruebas manuales
- Incorpora cualquier solución alternativa para problemas de interfaz de usuario descubiertos

Genera scripts de automatización Playwright JavaScript:
1. Crea scripts para cada escenario de prueba del plan de prueba
2. Organiza los scripts en archivos de suite de prueba apropiados en: tests/saucedemo-checkout/
3. Usa el mismo nombre de caso de prueba y pasos del plan de prueba
4. Usa selectores confiables y estrategias descubiertos en las pruebas exploratorias

Requisitos para todos los scripts:
- Sigue las mejores prácticas de Playwright
- Incluye aserciones apropiadas usando expect()
- Los nombres descriptivos de pruebas coinciden con el formato en el plan de prueba
- Usa selectores de elementos robustos descubiertos en las pruebas manuales
- Agrega comentarios para pasos complejos
- Usa estrategias de espera apropiadas basadas en el comportamiento real de la aplicación
- Agrega ganchos de prueba apropiados (beforeEach, afterEach)
- Configura para múltiples navegadores (Chrome, Firefox, Safari)

Después de generar los scripts, ejecuta las pruebas para verificar que pasen.

**Salida Esperada:**

- Archivos de suite de prueba creados en tests/saucedemo-checkout/ basados en escenarios del plan de prueba
- Scripts utilizando selectores robustos descubiertos durante las pruebas exploratorias
- Todos los scripts siguen las mejores prácticas de Playwright
- Generación inicial de pruebas completada

---

## 🔨 PASO 5: Ejecutar y Reparar Pruebas de Automatización

**Prompt:**

Ahora necesito ejecutar los scripts de automatización generados y reparar cualquier fallo utilizando el agente playwright-test-healer.

1. Ejecuta todos los scripts de automatización en: tests/saucedemo-checkout/
2. Identifica cualquier prueba que falle
3. Para cada prueba que falle, usa el agente playwright-test-healer para:
   - Analizar el fallo (problemas de selectores, problemas de tiempo, fallos de aserciones)
   - Investigar y actualizar los selectores, agregar esperas o ajustar aserciones
   - Actualizar el script de prueba con las correcciones
4. Re-ejecuta las pruebas reparadas para verificar que pasen
5. Repite el proceso de curación hasta que todas las pruebas sean estables y pasen
6. Documenta:
   - Resultados iniciales de pruebas (conteo de pase/fallo)
   - Actividades de curación realizadas
   - Resultados finales de pruebas después de la curación
   - Cualquier prueba que no pudo ser reparada automáticamente

**Salida Esperada:**

- Todas las pruebas de automatización ejecutadas
- Pruebas que fallan identificadas y reparadas utilizando el agente test-healer
- Scripts de prueba curados actualizados en tests/saucedemo-checkout/
- Resultados finales estables de ejecución de pruebas
- Resumen de actividades de curación realizadas

---

## 📊 PASO 6: Crear Informe de Pruebas

**Prompt:**

Ahora necesito crear un informe integral de ejecución de pruebas basado en pruebas manuales, ejecución de automatización y actividades de curación.

Por favor, compila resultados de:
- Paso 3: Resultados de pruebas exploratorias manuales
- Paso 4: Scripts de automatización generados
- Paso 5: Resultados de ejecución y curación de pruebas automatizadas

Estructura el informe como: test-results/SCRUM-101-checkout-test-report.md

Incluye:

1. **Resumen Ejecutivo**
   - Casos de prueba totales planificados
   - Casos de prueba ejecutados (manual + automatizado)
   - Estado general Pase/Fallo/Bloqueado

2. **Resultados de Pruebas Manuales**
   - Resultados del Paso 3 de pruebas exploratorias
   - Capturas de pantalla y observaciones
   - Problemas encontrados durante pruebas manuales

3. **Resultados de Pruebas Automatizadas**
   - Resultados iniciales de automatización del Paso 5
   - Actividades de curación realizadas
   - Resultados finales de ejecución de pruebas después de la curación
   - Resumen de ejecución de suite de pruebas
   - Conteo de Pase/Fallo para cada suite de prueba

4. **Registro de Defectos**
   - Para cualquier prueba que falle (manual o automatizado):
     - ID de Defecto
     - Severidad (Crítico/Alto/Medio/Bajo)
     - Título y Descripción
     - Pasos para Reproducir
     - Comportamiento Esperado vs Comportamiento Real
     - Capturas de Pantalla/Evidencia
     - Detalles del Entorno

5. **Análisis de Cobertura de Pruebas**
   - Qué criterios de aceptación están cubiertos
   - Cobertura de pruebas manuales vs automatizadas
   - Cualquier brecha en cobertura de pruebas
   - Recomendaciones para pruebas adicionales

6. **Resumen y Recomendaciones**
   - Evaluación general de calidad
   - Áreas de riesgo
   - Próximos pasos

**Salida Esperada:**

- Informe integral de ejecución de pruebas que cubra pruebas manuales y automatizadas
- Estado PASE/FALLO claro para todos los escenarios de prueba
- Reportes de defectos detallados para fallos
- Análisis completo de cobertura de pruebas
- Evidencia y capturas de pantalla adjuntas

---

## 🚀 PASO 7: Confirmar al Repositorio Git

**URL del Repositorio Git:** https://github.com/jvelardcrepo-web/AgentE2EQAWorkflow-Playwright.git

**Prompt:**

Ahora necesito confirmar todos los artefactos de prueba al repositorio Git utilizando el servidor MCP de GitHub.

**URL del Repositorio Git:** https://github.com/jvelardcrepo-web/AgentE2EQAWorkflow-Playwright.git

Por favor, realiza las siguientes operaciones de Git:

1. Inicializa el repositorio Git si aún no está inicializado

2. Coloca todos los archivos en el área de espera (todos los archivos nuevos y modificados)

3. Crea una confirmación con el mensaje:
"feat(tests): Add complete test suite for SCRUM-101 checkout workflow

- Add user story documentation
- Add comprehensive test plan with all scenarios
- Add test execution report with results
- Add automated test scripts for checkout process
- Include validation, navigation, and edge case tests

    Resolves SCRUM-101"


4. Envía todos los cambios al repositorio Git

5. Proporciona un resumen de lo que fue confirmado

**Salida Esperada:**

- Todos los archivos del espacio de trabajo confirmados en Git
- Mensaje de commit descriptivo siguiendo formato de commit convencional
- Confirmación de push exitoso al repositorio
- Resumen de cambios

---

## 📋 Ejecución Completa del Flujo de Trabajo

### Indicador Combinado Único (Para Demostración en Video):

Quiero demostrar un flujo de control de calidad end-to-end completo utilizando lenguaje natural y servidores MCP.

**PASO 1 - LEER HISTORIA DE USUARIO:**
Primero, lee la historia de usuario desde: user-stories/SCRUM-101-ecommerce-checkout.md
Proporciona un breve resumen de lo que necesita ser probado.

**PASO 2 - CREAR PLAN DE PRUEBA:**
Usa el agente playwright-test-planner para crear un plan de prueba integral basado en la historia de usuario. El agente debe explorar la URL de la aplicación desde la historia de usuario y cubrir todos los criterios de aceptación. Guarda el plan en specs/saucedemo-checkout-test-plan.md

**PASO 3 - PRUEBAS EXPLORATORIAS:**
Lee el plan de prueba desde specs/saucedemo-checkout-test-plan.md y usa las herramientas del navegador Playwright para ejecutar manualmente cada escenario de prueba. Documenta hallazgos con capturas de pantalla y anota cualquier problema descubierto.

**PASO 4 - GENERAR SCRIPTS DE AUTOMATIZACIÓN:**
Revisa tanto el plan de prueba (specs/saucedemo-checkout-test-plan.md) como los resultados de pruebas exploratorias del Paso 3. Usa el agente playwright-test-generator para crear scripts de automatización JavaScript aprovechando los selectores de elementos y información de interfaz de usuario descubiertos durante las pruebas manuales. Guarda los scripts en tests/saucedemo-checkout/.

**PASO 5 - EJECUTAR Y REPARAR PRUEBAS:**
Ejecuta todos los scripts de automatización desde tests/saucedemo-checkout/. Usa el agente playwright-test-healer para identificar y reparar cualquier prueba que falle. Re-ejecuta las pruebas hasta que todas sean estables y pasen. Documenta las actividades de curación.

**PASO 6 - CREAR INFORME DE PRUEBAS:**
Crea un informe integral de ejecución de pruebas en: test-results/SCRUM-101-checkout-test-report.md
Compila resultados del Paso 3 (pruebas manuales), Paso 4 (generación de scripts) y Paso 5 (ejecución y curación). Incluye estado PASE/FALLO, resumen de curación, registro de defectos y análisis de cobertura de pruebas.

**PASO 7 - CONFIRMAR EN GIT:**
Usa el agente MCP de GitHub para confirmar todos los archivos nuevos con un mensaje descriptivo y enviar al repositorio.

Ejecuta este flujo de trabajo completo y proporciona actualizaciones de estado después de cada paso.