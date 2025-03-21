# Prueba Técnica Fullstack

Este proyecto es una aplicación web fullstack construida con Next.js, GraphQL, Prisma y PostgreSQL.

## 🚀 Tecnologías Principales

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: GraphQL, Prisma ORM
- **Base de datos**: PostgreSQL
- **Testing**: Jest, React Testing Library
- **Autenticación**: NextAuth.js
- **UI Components**: shadcn/ui

## 📋 Prerrequisitos

- Node.js (versión 18 o superior)
- PostgreSQL instalado localmente
- npm o yarn

## 🔧 Configuración Local

1. **Clonar el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd prueba-tecnica-fullstack
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Configurar variables de entorno**
   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
   ```
   DATABASE_URL=tu_url_de_base_de_datos
   ```

4. **Configurar la base de datos**
   ```bash
   # Ejecutar migraciones de Prisma
   npx prisma migrate dev
   
   # Ejecutar el seed de la base de datos
   npx prisma db seed
   ```

5. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

La aplicación estará disponible en `http://localhost:3000`

## 🧪 Testing

Para ejecutar los tests:
```bash
npm run test
# o
yarn test
```

Para modo watch:
```bash
npm run test:watch
# o
yarn test:watch
```

## 🚀 Despliegue en Vercel

1. **Preparar el proyecto**
   ```bash
   # Construir el proyecto
   npm run build
   # o
   yarn build
   ```

2. **Configurar en Vercel**
   - Crea una cuenta en [Vercel](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - En la configuración del proyecto en Vercel, añade las siguientes variables de entorno:
     ```
     DATABASE_URL=tu_url_de_base_de_datos
     ```

3. **Desplegar**
   - Vercel detectará automáticamente que es un proyecto Next.js
   - Cada push a la rama principal desplegará automáticamente
   - También puedes desplegar manualmente desde el dashboard de Vercel

## 📁 Estructura del Proyecto

```
├── components/         # Componentes React reutilizables
├── graphql/           # Configuración y esquemas de GraphQL
├── lib/               # Utilidades y configuraciones
├── pages/             # Páginas y rutas de Next.js
├── prisma/            # Esquema y migraciones de Prisma
├── styles/            # Estilos globales
└── __tests__/         # Tests
```

## 🔒 Seguridad

- Las credenciales de la base de datos deben mantenerse seguras
- No compartas el archivo `.env`
- Utiliza variables de entorno en producción

## 📝 Notas Adicionales

- El proyecto utiliza Turbopack para desarrollo
- La autenticación está implementada con NextAuth.js
- Los componentes UI están construidos con shadcn/ui
- El proyecto incluye un sistema de temas claro/oscuro

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
