---
marp: true
---

# Práctica: Desarrollo colaborativo de un videojuego web con metodologías ágiles

## Objetivo de la práctica
Iniciar al alumnado en el desarrollo colaborativo de un proyecto software realista utilizando **GitHub como control de versiones**, **VS Code como entorno de desarrollo** y **Antigravity como asistente de generación de código**, aplicando una organización basada en el método **KANBAN**.

---

## Parte 1. Preparación del entorno de trabajo

### 1. Configuración inicial
Cada alumno debe asegurarse de tener:
- Git instalado.
- Una cuenta activa en GitHub.
- Antigravity instalado.

---

### 2. Creación del repositorio
- Crear un repositorio nuevo en GitHub.
- Clonar el repositorio utilizando Antigravity.
- Abrir el proyecto usando el IDE de Antigravity.

---

### 3. Configuración de git:
- **Live Server** para visualizar los cambios en tiempo real.
- **Git** desde la consola de VS Code:
 ```
 git config --global user.name "username"
 git config --global user.email "your.email@example.com"
 ```

---

### 4. Primer contacto con el flujo de trabajo
1. Crea un archivo de texto de prueba. Escribe en él, por ejemplo, tu nombre.
2. Crea una rama de prueba.
3. Para hacer *commit*:
- Usa el apartado *Source Control* del IDE.
- Selecciona los cambios (asegúrate de que contiene el archivo de texto).
- Escribe un mensaje de commit claro y descriptivo.
- Ejecuta *commit* para registrar los cambios.
4. Una vez se haya procesado el commit, haz *push* para que se suba al repositorio. 

---

### Configuración del Personal Access Token

- Generar un **Personal Access Token** en GitHub (usando la plantilla sugerida).
- Copiaremos el token (`ghp_…`) para pegarlo cuando el IDE se solicite.

---

## Parte 2. Inicio del proyecto

### Organización del trabajo
- Grupos de **4 personas**.
- Cada grupo debe acordar:
- Diseño y reparto de tareas.
- Estrategia de comunicación y coordinación.

---

## Requisitos del proyecto

### Diseño de juego
- Menú principal desde el que se accede al juego.
- Al principio, el jugador dispone de **4 vidas**:
- Un juego principal que encadena **microjuegos**
 ```
Videojuego de muy corta duración, con una única mecánica y objetivo que debe completarse en un tiempo limitado.
 ```
- Cada fallo en un microjuego resta una vida.
- Debe contener 12 microjuegos diferentes. 
- Al perder todas las vidas, el juego termina.

---

### Microjuegos
Cada microjuego debe cumplir los siguientes criterios:
- Un objetivo único y claramente definido.
- Un tiempo límite para completarlo.
- Interacción directa mediante ratón y/o teclado.

Ejemplo orientativo:
> Un vaso sustituye al cursor, el jugador debe moverlo para recoger partículas que caen de arriba a abajo de la pantalla, en forma de gotas de agua durante un tiempo limitado. Si el tiempo termina y el vaso no se ha llenado, el jugador pierde.
> Al fallar el microjuego, el juagor pierde una vida. Si todavía conserva alguna vida, continúa al siguiente microjuego. 

---

### Contenido educativo
- Cada microjuego debe estar relacionado con uno o varios **Objetivos de Desarrollo Sostenible**.
![Objetivos de Desarrollo Sostenible](/imgs/ODS.jpg)

---

## Parte 3. Gestión del proyecto

### Planificación
- Elaborar un **diagrama de Gantt sencillo** que contemple:
- Diseño.
- Desarrollo.
- Integración.
- Pruebas.

---

### Organización de tareas
- Uso de **Trello** (u otra herramienta similar) para:
- Definir el backlog.
- Asignar tareas.
- Hacer seguimiento del progreso.

---

### Control de versiones
- GitHub será el repositorio único del proyecto.
- Se tendrá en cuenta:
- Frecuencia de commits.
- Claridad de los mensajes.
- Coordinación entre los miembros del grupo.

---

## Entrega
- Activar **GitHub Pages**:
   - Rama: `main`
   - Carpeta: raíz del proyecto.
- Comprobar que la web es accesible desde la siguiente URL:https://USUARIO.github.io/NOMBRE_DEL_REPO/

---

## Ampliación (opcional)
- Investigar el uso de un servidor para permitir la competición entre varios jugadores:
- Ranking de puntuaciones.
- Resultados compartidos.
- Multijugador básico.
