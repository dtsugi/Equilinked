using Equilinked.API.helpers;
using Equilinked.BLL;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Equilinked.API.Controllers
{
    public class AlertaCaballoController : EquilinkedBaseController
    {
        private AlertaCaballoBLL _alertaCaballoBLL = new AlertaCaballoBLL();

        [HttpDelete, Route("api/propietarios/{propietarioId}/caballos/{caballoId}/alertas")]
        public IHttpActionResult DeleteAlertasByIds(int propietarioId, int caballoId, [FromUri] int[] alertasIds)
        {
            try
            {
                _alertaCaballoBLL.DeleteAlertasCaballosByIds(caballoId, alertasIds);
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al eliminar las alertas"));
            }
        }

        [HttpGet, Route("api/propietarios/{propietarioId}/caballos/{caballoId}/alertas")]
        public IHttpActionResult GetAlertasByCaballo(int propietarioId, int caballoId, [FromUri] int[] tipos, [FromUri] string inicio = "", [FromUri] string fin = "", [FromUri] int orden = 1, [FromUri] int cantidad = 0, [FromUri] bool todosTipos = false)
        {
            try
            {
                return Ok(_alertaCaballoBLL.GetAlertasByCaballo(propietarioId, caballoId, inicio, fin, tipos, orden, cantidad, todosTipos));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible obtener las alertas del caballo"));
            }
        }

        [HttpGet, Route("api/AlertaCaballo/GetAllCaballoIdByAlertaId/{alertaId}")]
        public IHttpActionResult GetAllCaballoIdByAlertaId(int alertaId)
        {
            try
            {
                return Ok(_alertaCaballoBLL.GetAllCaballoIdByAlertaId(alertaId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }
    }
}