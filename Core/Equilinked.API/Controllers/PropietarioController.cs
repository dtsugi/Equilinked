using Equilinked.API.helpers;
using Equilinked.BLL;
using Equilinked.DAL.Models;
using Equilinked.DAL.Dto;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using System.Threading.Tasks;

namespace Equilinked.API.Controllers
{
    public class PropietarioController : EquilinkedBaseController
    {
        private PropietarioBLL _propietarioBLL = new PropietarioBLL();

        [HttpPost, Route("api/propietarios")]
        public IHttpActionResult SavePropietario([FromBody] Propietario propietario)
        {
            bool usernameValid;
            try
            {
                _propietarioBLL.SavePropietarioAndUsuario(propietario, out usernameValid);
                if (usernameValid)
                {
                    return Ok(new { Mensaje = "Usuario creado con éxito" });
                }
                else
                {
                    return BadRequest("El nombre de usuario ya existe");
                }
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al crear el propietario"));
            }
        }

        [HttpGet, Route("api/propietarios/GetSerializedById/{id}")]
        public IHttpActionResult GetSerializedById(int id)
        {
            try
            {
                return Ok(_propietarioBLL.GetSerializedById(id));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }

        [HttpPut, Route("api/propietarios/{propietarioId}")]
        [ResponseType(typeof(Propietario))]
        public IHttpActionResult UpdateGrupo(int propietarioId, PropietarioDto propietario)
        {
            try
            {
                return Ok(_propietarioBLL.updatePropietario(propietarioId, propietario));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible actualizar al propietario"));
            }
        }
    }
}