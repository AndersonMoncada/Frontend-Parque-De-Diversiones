🎡 Parque de Atracciones — Frontend
Interfaz web del sistema de gestión del Parque de Atracciones, desarrollada en Angular con Angular Material. Consume los endpoints del backend FastAPI y permite realizar operaciones CRUD completas sobre todas las entidades del sistema.

🎥 Video demostrativo

📌 URL del video: [[Insertar enlace aquí]](https://drive.google.com/file/d/18NkgR83fhBc1VAlLsKxzqnMT9yGoqUA-/view?usp=sharing)


Tecnologías utilizadas

Angular 17+ — Framework principal con standalone components
Angular Material — Componentes de UI (tablas, formularios, dialogs, snackbars)
TypeScript — Tipado estático
RxJS — Manejo de peticiones HTTP reactivas
Angular Router — Navegación con lazy loading por entidad


Estructura del proyecto
src/
├── app/
│   ├── core/
│   │   ├── services/          # Servicios HTTP por entidad
│   │   ├── audit-context.service.ts
│   │   └── audit-user.guard.ts
│   ├── features/              # Componentes por entidad
│   │   ├── login/
│   │   ├── shell/
│   │   ├── usuarios/
│   │   ├── titulares/
│   │   ├── visitantes/
│   │   ├── entradas/
│   │   ├── sedes/
│   │   ├── atracciones/
│   │   ├── acuaticas/
│   │   ├── electronicas/
│   │   ├── mecanicas/
│   │   └── fisicas/
│   ├── models/
│   │   └── api.models.ts      # Interfaces TypeScript alineadas con el backend
│   ├── app.routes.ts
│   └── app.config.ts
└── environments/
    └── environment.ts        

Entidades con CRUD completo
EntidadCrearLeerActualizarEliminarUsuarios✅✅✅✅Titulares✅✅✅✅Visitantes✅✅✅✅Entradas✅✅✅✅Sedes✅✅✅✅Atracciones✅✅✅✅Acuáticas✅✅✅✅Electrónicas✅✅✅✅Mecánicas✅✅✅✅Físicas✅✅✅✅

Instalación y ejecución

Clona el repositorio:

bashgit clone https://github.com/tu-usuario/frontend-parque-diversiones.git
cd frontend-parque-diversiones

Instala las dependencias:

bashnpm install

Configura la URL del backend en src/environments/environment.ts:

typescriptexport const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000'
};

Ejecuta el servidor de desarrollo:

bashng serve

Abre el navegador en http://localhost:4200


Requisitos

Node.js 18+
Angular CLI 17+
Backend del Parque de Atracciones corriendo en http://127.0.0.1:8000


Repositorio del Backend

[🔗 [Insertar enlace al repositorio del backend aquí]](https://github.com/AndersonMoncada/backend-ORM-proyecto)
```


For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
