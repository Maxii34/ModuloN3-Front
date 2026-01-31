// URL base de la API (usuarios)
const API_BASE_URL =
  import.meta.env.VITE_API_USUARIOS || "http://localhost:3000/api/usuarios";

/**
 * Realiza una petición fetch con manejo de errores
 */
const realizarPeticion = async (url = "", opciones = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...opciones.headers,
  };

  const config = {
    ...opciones,
    headers,
  };

  try {
    const respuesta = await fetch(`${API_BASE_URL}${url}`, config);
    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw new Error(datos.mensaje || datos.message || "Error en la petición");
    }

    return datos;
  } catch (error) {
    console.error("Error en la petición:", error);
    throw error;
  }
};

/**
 * Inicia sesión de un usuario
 */
export const iniciarSesion = async (email, password) => {
  return realizarPeticion("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

/**
 * Crea un nuevo usuario
 */
export const crearUsuario = async (datosUsuario) => {
  return realizarPeticion("", {
    method: "POST",
    body: JSON.stringify(datosUsuario),
  });
};

/**
 * Lista usuarios 
 */
export const listarUsuarios = async (token) => {
  return realizarPeticion("", {
    method: "GET",
    headers: {
      "x-token": token,
    },
  });
};

/**
 * Eliminar usuario
 */
export const eliminarUsuario = async (id, token) => {
  return realizarPeticion(`/${id}`, {
    method: "DELETE",
    headers: {
      "x-token": token,
    },
  });
};

/**
 * Obtener usuario por ID
 */
export const obtenerUsuarioPorId = async (id, token) => {
  return realizarPeticion(`/${id}`, {
    method: "GET",
    headers: {
      "x-token": token,
    },
  });
};

/**
 * Asignar habitación a usuario
 */
export const asignarHabitacionUsuario = async (
  idUsuario,
  idHabitacion,
  token,
) => {
  return realizarPeticion(`/${idUsuario}`, {
    method: "PUT",
    headers: {
      "x-token": token,
    },
    body: JSON.stringify({
      habitacionAsignada: idHabitacion,
    }),
  });
};
