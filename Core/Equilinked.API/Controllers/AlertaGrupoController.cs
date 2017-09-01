using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;
using Equilinked.DAL.Models;

namespace Equilinked.API.Controllers
{
    public class AlertaGrupoController : EquilinkedBaseController
    {
        private AlertaGrupoBLL alertaGrupoBll = new AlertaGrupoBLL();

        [HttpDelete, Route("api/propietario/{propietarioId}/grupos/{grupoId}/alertas")]
        public IHttpActionResult DeleteAlertasByIds(int propietarioId, int grupoId, [FromUri] int[] alertasIds)
        {
            try
            {
                alertaGrupoBll.DeleteAlertasGrupoByIds(grupoId, alertasIds);
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al eliminar las alertas"));
            }
        }

        [HttpGet, Route("api/propietarios/{propietarioId}/grupos/{grupoId}/alertas")]
        public IHttpActionResult GetAlertasByCaballo(int propietarioId, int grupoId, [FromUri] int[] tipos, [FromUri] string inicio = "", [FromUri] string fin = "", [FromUri] int orden = 1, [FromUri] int cantidad = 0)
        {
            try
            {
                return Ok(alertaGrupoBll.GetAlertasByGrupo(propietarioId, grupoId, inicio, fin, tipos, orden, cantidad));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible obtener las alertas del grupo"));
            }
        }


        [HttpGet, Route("api/grupos/{grupoId}/alertas/{alertaId}")]
        public IHttpActionResult GetAlertaGrupoById(int grupoId, int alertaId)
        {
            try
            {
                return Ok(alertaGrupoBll.GetAlertaGrupo(grupoId, alertaId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible consultar la alerta del grupo"));
            }
        }

        [HttpGet, Route("api/grupos/{grupoId}/alertas")]
        public IHttpActionResult GetAllAlertasByGrupoId(int grupoId, [FromUri]int tipoAlerta = 0, [FromUri] int filtroAlerta = 1)
        {
            try
            {
                return Ok(alertaGrupoBll.GetAllAlertaGrupo(grupoId, tipoAlerta, filtroAlerta, DateTime.Now));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar las alertas del grupo"));
            }
        }

        [HttpPost, Route("api/grupos/{grupoId}/alertas")]
        public IHttpActionResult InsertAlertaGrupo(int grupoId, [FromBody] AlertaGrupo alertaGrupo)
        {
            try
            {
                alertaGrupo.Grupo_ID = grupoId;
                alertaGrupoBll.Insert(alertaGrupo);
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible guardar la alerta para el grupo"));
            }
        }

        [HttpPut, Route("api/grupos/{grupoId}/alertas/{alertaGrupoId}")]
        public IHttpActionResult UpdateAlertaGrupo(int grupoId, int alertaGrupoId, [FromBody] AlertaGrupo alertaGrupo)
        {
            try
            {
                alertaGrupoBll.Update(alertaGrupo);
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible actualizar la alerta para el grupo"));
            }
        }

        [HttpDelete, Route("api/grupos/{grupoId}/alertas/{alertaGrupoId}")]
        public IHttpActionResult DeleteAlertaGrupo(int grupoId, int alertaGrupoId)
        {
            try
            {
                alertaGrupoBll.Delete(alertaGrupoId);
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible eliminar la alerta para el grupo"));
            }
        }

        [HttpDelete, Route("api/grupos/{grupoId}/alertas")]
        public IHttpActionResult DeleteAlertasByIds(int grupoId, [FromUri] int[] alertaGrupoId)
        {
            try
            {
                alertaGrupoBll.DeleteAlertasByIds(alertaGrupoId);
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible eliminar la alertas del grupo"));
            }
        }
    }
}