# Funcionalidad de Likes

La funcionalidad de likes permite a los usuarios dar y quitar likes a los posts, así como obtener información sobre los likes en un post específico.

## Endpoints

### 1. Dar Like a un Post

**POST** `/api/likes/like`

**Headers:**

- `Authorization: Bearer <token>`

**Body:**

```json
{
  "idPost": 1
}
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Like agregado correctamente",
  "likeId": 1
}
```

**Errores:**

- 400: El usuario ya ha dado like a este post
- 400: El ID del post debe ser un número válido
- 400: El usuario no está autenticado

---

### 2. Remover Like de un Post

**POST** `/api/likes/unlike`

**Headers:**

- `Authorization: Bearer <token>`

**Body:**

```json
{
  "idPost": 1
}
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Like removido correctamente"
}
```

**Errores:**

- 400: El usuario no ha dado like a este post
- 400: El ID del post debe ser un número válido
- 400: El usuario no está autenticado

---

### 3. Obtener Cantidad de Likes

**GET** `/api/likes/count/:idPost`

**Parámetros:**

- `idPost`: ID del post (número)

**Respuesta Exitosa (200):**

```json
{
  "count": 5
}
```

**Errores:**

- 400: El ID del post debe ser un número válido

---

### 4. Obtener Lista de Usuarios que Dieron Like

**GET** `/api/likes/getlikes/:idPost`

**Parámetros:**

- `idPost`: ID del post (número)

**Respuesta Exitosa (200):**

```json
[
  {
    "id": 1,
    "idUser": "user123",
    "date": "2024-04-06 10:30:00",
    "username": "juanperez",
    "urlPhoto": "https://example.com/photo.jpg"
  },
  {
    "id": 2,
    "idUser": "user456",
    "date": "2024-04-06 11:15:00",
    "username": "mariasmith",
    "urlPhoto": "https://example.com/photo2.jpg"
  }
]
```

**Errores:**

- 400: El ID del post debe ser un número válido

---

### 5. Verificar si el Usuario Actual Dio Like

**GET** `/api/likes/checklike/:idPost`

**Headers:**

- `Authorization: Bearer <token>`

**Parámetros:**

- `idPost`: ID del post (número)

**Respuesta Exitosa (200):**

```json
{
  "liked": true
}
```

**Errores:**

- 400: El ID del post debe ser un número válido
- 400: El usuario no está autenticado

---

## Características Implementadas

✅ Dar like a un post (con validación de duplicados)
✅ Remover like de un post
✅ Contar cantidad de likes en un post
✅ Obtener lista detallada de usuarios que dieron like
✅ Verificar si el usuario actual dio like a un post
✅ Validaciones de ID de post
✅ Validaciones de autenticación de usuario
✅ Timestamps automáticos en cada like
✅ Restricción de un like por usuario por post (UNIQUE constraint)

## Estructura de la Base de Datos

### Tabla: Like

| Campo  | Tipo         | Descripción                                            |
| ------ | ------------ | ------------------------------------------------------ |
| id     | INT          | ID único del like (auto-incremental)                   |
| idPost | INT          | ID del post (foránea)                                  |
| idUser | VARCHAR(100) | ID del usuario (foránea)                               |
| date   | DATETIME     | Fecha y hora del like (por defecto: CURRENT_TIMESTAMP) |

**Restricciones:**

- Clave única: `(idPost, idUser)` - Garantiza un solo like por usuario por post
- Foránea: `idPost` → `Post(id)` con `ON DELETE CASCADE`
- Foránea: `idUser` → `User(id)` con `ON DELETE CASCADE`
