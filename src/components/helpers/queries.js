const usuariosBack = import.meta.env.VITE_API_USUARIOS;
const habitacionesBack = import.meta.env.VITE_API_HABITACIONES;


export const registrarUsuario = async (nuevoUsuario) => {
  try {
    const respuesta = await fetch(usuariosBack, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoUsuario),
    });
    return respuesta;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const iniciarSesion = async (usuario) => {
  try {
    const respuesta = await fetch(`${usuariosBack}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuario),
    });
    return respuesta;
  } catch (error) {
    console.log(error);
    return null;
  }
};

//crud de habitaciones-

export const crearHabitacion = async (data) => {
  try {
    // Recuperar token (manejo defensivo)
    const usuarioRaw = sessionStorage.getItem("usuarioKey");
    if (!usuarioRaw) {
      throw new Error("No hay token en la petición");
    }
    const token = JSON.parse(usuarioRaw).token;

    const respuesta = await fetch(habitacionesBack, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
      body: JSON.stringify(data),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      console.error("Error en crearHabitacion (backend):", datos);
    }

    return {
      status: respuesta.status,
      datos: datos,
      ok: respuesta.ok,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
