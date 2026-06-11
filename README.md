# Agentic AI QA E2E Workflow

Flujo de trabajo de QA End-to-End impulsado por agentes de IA (Claude Code) que automatiza el ciclo completo de
pruebas: desde la lectura de una historia de usuario hasta la generación, ejecución, auto-reparación ("healing") y
reporte de pruebas automatizadas con Playwright.

---

## 1. Descripción del proyecto

### ¿Qué hace el proyecto?

Este repositorio implementa un flujo de QA automatizado de 7 pasos (definido en
[QAEnd2EndPromptFile.md](QAEnd2EndPromptFile.md)) que usa Claude Code junto con servidores MCP de Playwright para:

1. Leer y resumir una historia de usuario (`user-stories/`).
2. Generar un plan de pruebas explorando la aplicación en vivo (`specs/`).
3. Ejecutar pruebas exploratorias manuales con el navegador MCP, capturando evidencia (`specs/exploratory-screenshots/`).
4. Generar scripts de automatización de Playwright a partir del plan (`tests/`).
5. Ejecutar las pruebas en múltiples navegadores y aplicar "healing" automático sobre las que fallen.
6. Producir un informe de ejecución completo (`test-results/`).
7. Comprometer (commit/push) todos los artefactos generados al repositorio.

### Arquitectura multi-agente (Planner, Generator, Healer)

El flujo se apoya en tres agentes especializados, definidos en [.github/agents/](.github/agents/), cada uno con
su propio set de herramientas MCP:

| Agente | Archivo | Responsabilidad |
|---|---|---|
| **Planner** (`playwright-test-planner`) | [playwright-test-planner.agent.md](.github/agents/playwright-test-planner.agent.md) | Explora la aplicación en el navegador, mapea los flujos de usuario y genera un plan de pruebas en Markdown con escenarios happy-path, edge cases y validaciones. |
| **Generator** (`playwright-test-generator`) | [playwright-test-generator.agent.md](.github/agents/playwright-test-generator.agent.md) | Toma cada escenario del plan, lo ejecuta paso a paso en el navegador para validar el comportamiento real, y genera el archivo `.spec.ts` correspondiente con buenas prácticas de Playwright. |
| **Healer** (`playwright-test-healer`) | [playwright-test-healer.agent.md](.github/agents/playwright-test-healer.agent.md) | Ejecuta la suite completa, depura cualquier prueba fallida (`test_debug`), corrige selectores/timing/aserciones y reintenta hasta que pase, o la marca como `test.fixme()` si es un bug real de la app. |

### MCP servers usados

Configurados en [.mcp.json](.mcp.json):

| Servidor | Comando | Uso |
|---|---|---|
| `playwright` | `npx @playwright/mcp@latest` | Navegador MCP de propósito general (pasos 1-3 y 6: exploración, pruebas manuales, capturas de pantalla). |
| `playwright-test` | `npx playwright run-test-mcp-server` | Servidor MCP especializado para los agentes Planner, Generator y Healer (planificación, generación y ejecución/depuración de pruebas). |

> **Nota:** este proyecto no usa actualmente un servidor MCP de GitHub. El paso 7 (commit/push) se realiza con el
> CLI de `git` directamente, usando la configuración de credenciales de Git ya existente en el equipo.

---

## 2. Requisitos previos

- **Node.js**: versión 18 LTS o superior (recomendado 20+/22+).
- **Claude Code CLI**: instalado y configurado ([guía oficial](https://docs.claude.com/claude-code)).
- **Playwright**: se instala como dependencia de desarrollo (`@playwright/test`), pero se requiere también instalar
  los binarios de los navegadores (ver sección de instalación).
- **GitHub Personal Access Token (PAT)**: necesario solo si se va a ejecutar el Paso 7 (commit/push automatizado) o
  si se desea autenticación adicional para operaciones de Git.

---

## 3. Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/jvelardcrepo-web/AgentE2EQAWorkflow-Playwright.git
cd AgentE2EQAWorkflow-Playwright

# 2. Instalar dependencias
npm install

# 3. Instalar los navegadores de Playwright (Chromium, Firefox, WebKit)
npx playwright install

# 4. Configurar el archivo .env con el token de GitHub
#    (crear el archivo .env en la raíz del proyecto, NUNCA versionarlo)
echo "GITHUB_PAT=tu_personal_access_token_aqui" > .env
```

### Configurar los MCP servers

Los servidores MCP ya están definidos en [.mcp.json](.mcp.json) en la raíz del proyecto. Claude Code los detecta
automáticamente al iniciar una sesión dentro de este directorio. No se requiere configuración adicional, salvo
reiniciar la sesión de Claude Code después de clonar el repo para que cargue las herramientas `mcp__playwright__*`
y `mcp__playwright-test__*`.

---

## 4. Configuración de MCP Servers

El archivo [.mcp.json](.mcp.json) en la raíz define los servidores disponibles para Claude Code:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "playwright-test": {
      "command": "npx",
      "args": ["playwright", "run-test-mcp-server"]
    }
  }
}
```

- **`playwright`**: levanta un navegador controlable mediante herramientas genéricas (`browser_navigate`,
  `browser_click`, `browser_snapshot`, `browser_take_screenshot`, etc.). Se usa en los pasos de exploración y
  pruebas manuales.
- **`playwright-test`**: expone herramientas específicas para los agentes de planificación
  (`planner_setup_page`, `planner_save_plan`), generación (`generator_setup_page`, `generator_write_test`,
  `generator_read_log`) y depuración/ejecución de pruebas (`test_run`, `test_debug`, `test_list`).

### Agregar un servidor MCP de GitHub (opcional)

Si se desea automatizar el Paso 7 mediante un MCP de GitHub en lugar del CLI de `git`, se puede agregar una entrada
adicional en `.mcp.json`, por ejemplo:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"
      }
    }
  }
}
```

> ⚠️ Nunca incluyas el valor del token directamente en `.mcp.json`. Usa variables de entorno (`.env`, que está en
> `.gitignore`) y referencia el nombre de la variable.

---

## 5. Estructura del proyecto

```
.
├── .github/
│   ├── agents/                    # Definiciones de los agentes (Planner, Generator, Healer)
│   └── workflows/                 # CI: copilot-setup-steps.yml, playwright.yml
├── specs/                         # Planes de prueba y evidencia exploratoria
│   ├── README.md
│   ├── <STORY-ID>-test-plan.md    # Plan de pruebas generado por el Planner
│   └── exploratory-screenshots/   # Capturas del Paso 3 (pruebas manuales)
├── tests/                         # Suites de Playwright generadas por el Generator
│   ├── seed.spec.ts               # Estado inicial / setup compartido
│   ├── example.spec.ts
│   └── <feature>/
│       ├── helpers.ts             # Funciones auxiliares (login, navegación, etc.)
│       └── *.spec.ts              # Un archivo por suite/escenario
├── test-results/                  # Informes de ejecución (Paso 6)
│   └── <STORY-ID>-test-report.md
├── user-stories/                  # Historias de usuario de entrada (Paso 1)
│   └── <STORY-ID>-*.md
├── .mcp.json                      # Configuración de servidores MCP
├── playwright.config.ts           # Configuración de Playwright (proyectos por navegador)
├── QAEnd2EndPromptFile.md          # Definición del flujo de 7 pasos
├── .env                            # Variables de entorno (NO versionado)
└── .gitignore
```

---

## 6. Cómo ejecutar los tests

```bash
# Ejecutar toda la suite en los 3 navegadores (chromium, firefox, webkit)
npx playwright test

# Ejecutar en modo UI interactivo
npx playwright test --ui

# Ejecutar solo en un navegador específico
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Ejecutar un archivo de prueba específico
npx playwright test tests/saucedemo-checkout/checkout-information.spec.ts

# Ejecutar con la UI visible (modo headed)
npx playwright test --headed

# Ver el último reporte HTML de resultados
npx playwright show-report
```

---

## 7. Agentes disponibles

### 🧭 Planner (`playwright-test-planner`)
- **Cuándo usarlo**: para crear un plan de pruebas integral de una aplicación web o de una nueva historia de usuario.
- **Qué hace**: configura una página con `planner_setup_page`, explora la interfaz (formularios, navegación,
  funcionalidades), identifica flujos críticos de usuario y diseña escenarios happy-path, edge cases y manejo de
  errores. Guarda el plan resultante con `planner_save_plan` como un Markdown estructurado en `specs/`.

### ⚙️ Generator (`playwright-test-generator`)
- **Cuándo usarlo**: para convertir cada escenario de un plan de pruebas en un script de Playwright.
- **Qué hace**: configura la página con `generator_setup_page`, ejecuta cada paso del escenario en tiempo real
  usando herramientas del navegador, lee el log de acciones con `generator_read_log` y escribe el archivo
  `.spec.ts` final con `generator_write_test`, agrupando los escenarios por `test.describe` según el plan.

### 🩹 Healer (`playwright-test-healer`)
- **Cuándo usarlo**: para depurar y corregir pruebas de Playwright que fallan.
- **Qué hace**: ejecuta toda la suite con `test_run`, depura cada prueba fallida con `test_debug`, analiza la causa
  raíz (selectores desactualizados, problemas de timing, datos, cambios en la app), corrige el código y vuelve a
  ejecutar hasta que pase. Si determina que la prueba es correcta pero la app tiene un bug real, marca el test con
  `test.fixme()` y documenta el motivo.

---

## 8. Seguridad

- El archivo **`.env`** contiene el `GITHUB_PAT` (token de acceso personal de GitHub) y **nunca debe subirse al
  repositorio**. Está incluido en [.gitignore](.gitignore) junto con `.vscode/mcp.json`.
- Verifica antes de cada commit que `.env` y cualquier archivo con credenciales no aparezcan en `git status` como
  archivos en seguimiento (`tracked`).
- Si un token llega a exponerse accidentalmente (commit, log, captura de pantalla, etc.), **rótalo de inmediato**
  desde la configuración de GitHub (Settings → Developer settings → Personal access tokens) y actualiza el valor
  en tu `.env` local.
- Otros directorios excluidos por ser artefactos locales/temporales: `.claude/`, `.playwright-mcp/`,
  `node_modules/`, `/playwright-report/`, `/blob-report/`, `/playwright/.cache/`, `/playwright/.auth/`.
