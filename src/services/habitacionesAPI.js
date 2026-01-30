const API_URL = import.meta.env.VITE_API_HABITACIONES;

/*

Obtiene todas las habitaciones del backend
@returns {Promise} Lista de habitaciones
*/
export const obtenerHabitaciones = async () => {
try {
const response = await fetch(API_URL);
if (!response.ok) {
throw new Error('Error al obtener las habitaciones');
}
const data = await response.json();
return data;
} catch (error) {
console.error('Error en obtenerHabitaciones:', error);
throw error;
}
};
/**

Obtiene una habitación por su ID
@param {string} id - ID de la habitación
@returns {Promise} Datos de la habitación
*/
export const obtenerHabitacionPorId = async (id) => {
try {
const response = await fetch(`${API_URL}/${id}`);
if (!response.ok) {
throw new Error('Error al obtener la habitación');
}
const data = await response.json();
return data;
} catch (error) {
console.error('Error en obtenerHabitacionPorId:', error);
throw error;
}
};
/*

Actualiza una habitación existente

@param {string} id - ID de la habitación

@param {Object} habitacionData - Datos actualizados de la habitación

@returns {Promise} Respuesta del servidor
*/
export const actualizarHabitacion = async (id, habitacionData) => {
try {
// Recuperar token desde sessionStorage (igual que otras consultas que requieren auth)
const usuarioRaw = sessionStorage.getItem("usuarioKey");
if (!usuarioRaw) {
throw new Error("No hay token en la petición");
}
const token = JSON.parse(usuarioRaw).token;

const response = await fetch(`${API_URL}/${id}`, {
method: 'PUT',
headers: {
'Content-Type': 'application/json',
'x-token': token,
},
body: JSON.stringify(habitacionData),
});

if (!response.ok) {
const errorData = await response.json();
throw new Error(errorData.mensaje || 'Error al actualizar la habitación');
}

const data = await response.json();
return data;
} catch (error) {
console.error('Error en actualizarHabitacion:', error);
throw error;
}
};

/**

Crea una nueva habitación

@param {Object} habitacionData - Datos de la habitación

@returns {Promise} Respuesta del servidor
*/
export const crearHabitacion = async (habitacionData) => {
try {
const response = await fetch(API_URL, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify(habitacionData),
});

if (!response.ok) {
const errorData = await response.json();
throw new Error(errorData.mensaje || 'Error al crear la habitación');
}

const data = await response.json();
return data;
} catch (error) {
console.error('Error en crearHabitacion:', error);
throw error;
}
};

/**

Elimina una habitación por su ID

@param {string} id - ID de la habitación a eliminar

@returns {Promise} Respuesta del servidor
*/
export const eliminarHabitacion = async (id) => {
try {
const response = await fetch(`${API_URL}/${id}`, {
method: 'DELETE',
headers: {
'Content-Type': 'application/json',
"x-token": JSON.parse(sessionStorage.getItem("usuarioKey")).token,
},
});

// Retornamos el objeto response para poder validar el status en el componente
return response;
} catch (error) {
console.error('Error en eliminarHabitacion:', error);
return null;
}
};