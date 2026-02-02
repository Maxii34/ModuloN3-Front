import { Button, Modal, Form } from "react-bootstrap";
import "./Modales.css";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { iniciarSesion } from "../helpers/queries";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

export const ModalLogin = ({
  showLogin,
  loginClose,
  registerShow,
  setUsuarioLogueado,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navegacion = useNavigate();
  const { loginAdmin, loginUser } = useAuth();

  const RegistrateAki = () => {
    loginClose();
    registerShow();
  };

  const onSubmit = async (data) => {
    try {
      const respuesta = await iniciarSesion(data);

      if (respuesta && respuesta.status === 200) {
        const datos = await respuesta.json();

        const usuarioData = {
          usuario: datos.usuario,
          token: datos.token,
          tipo: datos.usuario.tipo,
        };

        // Actualiza el estado local
        setUsuarioLogueado(usuarioData);

        // Guardar usuario
        sessionStorage.setItem("usuarioKey", JSON.stringify(datos.usuario));

        // Guardar token POR SEPARADO
        sessionStorage.setItem("token", datos.token);

        // Actualiza el AuthContext según el tipo de usuario
        if (datos.usuario.tipo === "admin") {
          loginAdmin(usuarioData);
        } else if (datos.usuario.tipo === "usuario") {
          loginUser(usuarioData);
        }

        loginClose();
        reset();

        await Swal.fire({
          title: `¡Bienvenido, ${datos.usuario.nombre}!`,
          text: "Has iniciado sesión correctamente.",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          toast: true,
          position: "top-end",
        });

        // Redirige según el tipo
        if (datos.usuario.tipo === "admin") {
          navegacion("/admin-dashboard");
        } else {
          navegacion("/");
        }
      } else {
        Swal.fire({
          title: "Ocurrió un error",
          text: "Credenciales incorrectas",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al conectar con el servidor",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Modal show={showLogin} onHide={loginClose}>
        <Modal.Body className="">
          <Form className="css-modal-login" onSubmit={handleSubmit(onSubmit)}>
            <div className="text-center mb-2">
              <h1 className="mb-2">Bienvenido</h1>
              <div>
                <span className="text-muted">
                  Inicie sesión con su cuenta para continuar
                </span>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="ejemplo@Email.com"
                {...register("email", {
                  required: "El email es requerido",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "El email no es válido",
                  },
                })}
              />
              {errors.email && (
                <span className="text-danger">{errors.email.message}</span>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                {...register("password", {
                  required: "El password es requerido",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{8,}$/,
                    message: "El password no es válido",
                  },
                })}
              />
              {errors.password && (
                <span className="text-danger">{errors.password.message}</span>
              )}
            </Form.Group>

            <div className="text-center mt-3 mb-3">
              <span className="text-muted">¿Aún no tienes cuenta? </span>
              <Link
                onClick={RegistrateAki}
                className="text-primary text-decoration-none fw-semibold"
              >
                Regístrate aquí
              </Link>
            </div>

            <Button variant="primary" type="submit" className="w-100">
              Iniciar Sesión
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer className="m-0 p-0">
          <Button variant="secondary" onClick={loginClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
