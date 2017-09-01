using Equilinked.API.Models;
using Equilinked.DAL.Dto;
using Equilinked.BLL;
using Equilinked.DAL.Models;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Equilinked.API.Controllers
{
    public class UsuarioController : EquilinkedBaseController
    {

        private UsuarioBLL _usuarioBLL = new UsuarioBLL();
        private PropietarioBLL propietarioBLL = new PropietarioBLL();
        private ValidacionTokensBLL validacionTokenBLL = new ValidacionTokensBLL();

        [HttpPost, Route("api/usuario/login/token")]
        public IHttpActionResult LoginWithToken([FromBody] UserSessionDto session)
        {
            InfoUsuarioToken infoUsuarioToken = null;
            try
            {
                if (session.TipoIdentificacion == 2)//Facebook
                {
                    infoUsuarioToken = validacionTokenBLL.ValidarTokenFacebook(session.Token);
                }
                else if (session.TipoIdentificacion == 3)//Google
                {
                    infoUsuarioToken = validacionTokenBLL.ValidarTokenGoogle(session.Token);
                }

                if (infoUsuarioToken != null)
                {
                    Propietario propietario = propietarioBLL.ValidateUsuarioByToken(infoUsuarioToken);
                    if(propietario != null)
                    {
                        UserSessionDto userSession = new UserSessionDto();
                        userSession.IdUser = propietario.Usuario.ID;
                        userSession.PropietarioId = propietario.ID;
                        userSession.TipoIdentificacion = session.TipoIdentificacion;
                        userSession.UserName = propietario.Usuario.Login;
                        userSession.Password = propietario.Usuario.Password;
                        return Ok(userSession);
                    }
                    else
                    {
                        return BadRequest("No fue posible identificar al usuario");
                    }
                }
                else
                {
                    return BadRequest("El token es inválido");
                }
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al validar token de usuario"));
            }
        }

        [HttpPost, Route("api/Usuario/Login")]
        [ResponseType(typeof(UserSessionDto))]
        public async Task<HttpResponseMessage> Login(UserSessionDto session)
        {
            try
            {
                HttpResponseMessage response;
                Usuario user = _usuarioBLL.Login(session.UserName, session.Password);
                if (user != null)
                {
                    Propietario propietario = new PropietarioBLL().GetByUserId(user.ID);
                    if (propietario != null)
                    {
                        session.IdUser = user.ID;
                        session.PropietarioId = propietario.ID;
                        session.TipoIdentificacion = 1; //NO fue por face o google
                        response = Request.CreateResponse(HttpStatusCode.OK, session);
                    }
                    else
                    {
                        response = Request.CreateResponse(HttpStatusCode.PreconditionFailed, new { Message = "La cuenta no se encuentra correctamente configurada para iniciar sesion" });
                    }
                }
                else
                {
                    response = Request.CreateResponse(HttpStatusCode.PreconditionFailed, new { Message = "Nombre de usuario o password incorrectos" });
                }
                return response;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible obtener el usuario"));
            }
        }

        [HttpGet, Route("api/Usuario/GetById/{id}")]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                return Ok(_usuarioBLL.GetById(id));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible obtener el usuario"));
            }
        }

        [HttpGet, Route("api/Usuario/GetAll")]
        public IHttpActionResult GetAll()
        {
            try
            {
                return Ok(_usuarioBLL.GetAll());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible obtener el usuario"));
            }
        }

        [HttpPut, Route("api/Usuario/ChangePassword/{UsuarioId}")]
        [ResponseType(typeof(CambioPassword))]
        public IHttpActionResult ChangeUserPassword(int UsuarioId, CambioPassword Passwords)
        {
            try
            {
                return Ok(_usuarioBLL.ChangePasswordByUsuarioId(UsuarioId, Passwords));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible actualizar el password del usuario"));
            }
        }

        [HttpDelete, Route("api/Usuario/{usuarioId}")]
        [ResponseType(typeof(CuentaEliminacion))]
        public IHttpActionResult UpdateGrupo(int usuarioId, CuentaEliminacion cuenta)
        {
            try
            {
                return Ok(_usuarioBLL.DeleteAccountUser(usuarioId, cuenta));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible eliminar la cuenta del usuario"));
            }
        }
    }
}