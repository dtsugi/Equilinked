using Equilinked.API.Models;
using Equilinked.DAL.Dto;
using Equilinked.BLL;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public IHttpActionResult UpdateGrupo(int UsuarioId, CambioPassword Passwords)
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
    }
}