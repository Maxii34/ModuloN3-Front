// URL base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://modulo-n-3-backend.vercel.app/api";

/**
 * Realiza una petición fetch con manejo de errores
 */
const realizarPeticion = async (url, opciones = {}) => {
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
  return realizarPeticion("/usuarios/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
};

/**
 * Crea un nuevo usuario
 */
export const crearUsuario = async (datosUsuario) => {
  return realizarPeticion("/usuarios", {
    method: "POST",
    body: JSON.stringify(datosUsuario),
  });
};


export const listarUsuarios = async (token) => {
  return realizarPeticion("/usuarios", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ELIMINAR USUARIO
export const eliminarUsuario = async (id, token) => {
  return realizarPeticion(`/usuarios/${id}`, {
    method: "DELETE",
    headers: {
      "x-token": token,
    },
  });
};

// OBTENER USUARIO POR ID (opcional)
export const obtenerUsuarioPorId = async (id, token) => {
  return realizarPeticion(`/usuarios/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const asignarHabitacionUsuario = async (
  idUsuario,
  idHabitacion,
  token
) => {
  return realizarPeticion(`/usuarios/${idUsuario}`, {
    method: "PUT",
    headers: {
      "x-token": token,
    },
    body: JSON.stringify({
      habitacionAsignada: idHabitacion,
    }),
  });
};