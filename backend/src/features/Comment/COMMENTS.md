# Funcionalidad de Comentarios

Sistema completo de comentarios con validaciones, control de permisos y funcionalidades avanzadas.

## Endpoints

### 1. Crear Comentario
**POST** `/api/comments/create`

**Headers:**
- `Authorization: Bearer <token>`

**Body:**
```json
{
  "idPost": 1,
  "description": "¡Me encantó este post! Muy bueno."
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Comentario creado correctamente",
  "commentId": "a1b2c3d4e5f6g7h8"
}
```

**Validaciones:**
- Descripción no vacía (máx 500 caracteres)
- ID de post válido
- Usuario autenticado

**Errores:**
- 400: Datos inválidos

---

### 2. Editar Comentario
**PUT** `/api/comments/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Body:**
```json
{
  "description": "Actualicé mi comentario porque me di cuenta de un error."
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Comentario actualizado correctamente"
}
```

**Validaciones:**
- Solo el creador puede editar
- Descripción válida (máx 500 caracteres)

**Errores:**
- 400: Usuario no es el creador
- 400: Comentario no existe

---

### 3. Eliminar Comentario
**DELETE** `/api/comments/:id`

**Headers:**
- `Authorization: Bearer <token>`

**Respuesta Exitosa (200):**
```json
{
  "message": "Comentario eliminado correctamente"
}
```

**Validaciones:**
- Solo el creador puede eliminar

**Errores:**
- 400: Usuario no es el creador
- 400: Comentario no existe

---

### 4. Contar Comentarios de un Post
**GET** `/api/comments/count/:idPost`

**Parámetros:**
- `idPost`: ID del post (número)

**Respuesta Exitosa (200):**
```json
{
  "count": 15
}
```

---

### 5. Obtener Comentarios de un Post
**GET** `/api/comments/post/:idPost`

**Parámetros:**
- `idPost`: ID del post

**Query Parameters (opcionales):**
- `limit`: Cantidad de comentarios por página (default: 10)
- `offset`: Desplazamiento para paginación (default: 0)

**Ejemplo con paginación:**
```
GET /api/comments/post/5?limit=20&offset=0
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "a1b2c3d4e5f6g7h8",
    "idPost": 5,
    "idUser": "user123",
    "description": "¡Excelente post!",
    "date": "2024-04-06 10:30:00",
    "username": "juanperez",
    "urlPhoto": "https://example.com/photo.jpg"
  },
  {
    "id": "x9y8z7w6v5u4t3s2",
    "idPost": 5,
    "idUser": "user456",
    "description": "Totalmente de acuerdo contigo.",
    "date": "2024-04-06 11:15:00",
    "username": "mariasmith",
    "urlPhoto": "https://example.com/photo2.jpg"
  }
]
```

---

### 6. Obtener Comentarios de un Usuario
**GET** `/api/comments/user/:idUser/comments`

**Parámetros:**
- `idUser`: ID del usuario

**Respuesta Exitosa (200):**
```json
[
  {
    "id": "a1b2c3d4e5f6g7h8",
    "idPost": 5,
    "idUser": "user123",
    "description": "¡Excelente post!",
    "date": "2024-04-06 10:30:00",
    "username": "juanperez",
    "urlPhoto": "https://example.com/photo.jpg"
  }
]
```

---

### 7. Contar Comentarios de un Usuario
**GET** `/api/comments/user/:idUser/count`

**Parámetros:**
- `idUser`: ID del usuario

**Respuesta Exitosa (200):**
```json
{
  "count": 42
}
```

---

## Características Implementadas

✅ Crear comentarios en posts
✅ Editar comentarios (solo creador)
✅ Eliminar comentarios (solo creador)
✅ Contar comentarios por post
✅ Listar comentarios con información del usuario
✅ Paginación opcional en listados
✅ Ver comentarios por usuario
✅ Validaciones completas
✅ Timestamps automáticos
✅ Control de permisos basado en usuario

## Funcionalidades Adicionales Sugeridas

### 1. 🔥 Likes en Comentarios
```
POST /api/comments/:id/like       - Dar like a un comentario
POST /api/comments/:id/unlike     - Remover like
GET  /api/comments/:id/likecount  - Contar likes del comentario
```
**Descripción:** Similar a los likes de posts, permite a los usuarios reaccionar a los comentarios.

### 2. 💬 Respuestas a Comentarios (Comentarios Anidados)
```
POST /api/comments/:id/reply      - Responder a un comentario
GET  /api/comments/:id/replies    - Ver respuestas de un comentario
```
**Descripción:** Crear una estructura de comentarios anidados para conversaciones más profundas.

### 3. 🏆 Comentarios Pinnados/Destacados
```
POST /api/comments/:id/pin        - Destaca un comentario en un post
POST /api/comments/:id/unpin      - Quitar destaque
```
**Descripción:** El creador del post puede destacar comentarios importantes. _Requiere verificación de propiedad del post._

### 4. 🔍 Buscar Comentarios
```
GET /api/comments/search?q=palabra&idPost=1
```
**Descripción:** Buscar comentarios por texto en un post específico.

### 5. 📊 Estadísticas de Comentarios
```
GET /api/comments/stats/post/:idPost      - Estadísticas del post
GET /api/comments/stats/user/:idUser      - Estadísticas del usuario
```
**Descripción:** Devolver datos como: total de comentarios, promedio de palabras, comentarios por día, etc.

### 6. 🚫 Reportar Comentarios
```
POST /api/comments/:id/report
```
**Descripción:** Reportar comentarios inapropiados con motivo. Útil para moderación.

### 7. 📌 Comentarios Favoritos
```
POST /api/comments/:id/favorite    - Guardar comentario como favorito
GET  /api/comments/favorites       - Ver comentarios favoritos del usuario
```
**Descripción:** Los usuarios pueden marcar comentarios como favoritos para revisarlos después.

## Estructura de la Base de Datos

### Tabla: Comment
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | VARCHAR(100) | ID único (generado con crypto) |
| idPost | INT | ID del post (foránea) |
| idUser | VARCHAR(100) | ID del usuario (foránea) |
| description | VARCHAR(500) | Contenido del comentario |
| date | DATETIME | Fecha de creación automática |

**Restricciones:**
- Foránea: `idPost` → `Post(id)` con `ON DELETE CASCADE`
- Foránea: `idUser` → `User(id)` con `ON DELETE CASCADE`

## Nota sobre Permisos

- ✅ **Crear comentario:** Requiere autenticación
- ✅ **Editar comentario:** Solo el creador del comentario
- ✅ **Eliminar comentario:** Solo el creador del comentario
- ✅ **Ver comentarios:** Públicamente accesible (sin autenticación)

## Ejemplo de Flujo Completo

```javascript
// 1. Usuario auténtico crea un comentario en un post
POST /api/comments/create
Body: { idPost: 5, description: "¡Buen post!" }

// 2. Obtener todos los comentarios del post
GET /api/comments/post/5?limit=10&offset=0

// 3. Contar comentarios totales
GET /api/comments/count/5

// 4. Editar su propio comentario
PUT /api/comments/a1b2c3d4e5f6g7h8
Body: { description: "¡Buen post! Pero tengo una pregunta..." }

// 5. Eliminar si cambió de opinión
DELETE /api/comments/a1b2c3d4e5f6g7h8

// 6. Ver todos los comentarios que ha hecho un usuario
GET /api/comments/user/user123/comments

// 7. Ver cuántos comentarios ha hecho un usuario
GET /api/comments/user/user123/count
```
