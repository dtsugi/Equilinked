using Equilinked.API.helpers;
using Equilinked.BLL;
using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

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
        public IHttpActionResult GetAlertasByCaballo(int propietarioId, int caballoId, [FromUri] int tipoAlerta = 0, [FromUri] int filtroAlerta = 1, [FromUri] string fecha = "", [FromUri] int limite = 0, [FromUri] int orden = 0)
        {
            try
            {
                DateTime fechaAjustada = DateTime.Parse(fecha);
                return Ok(_alertaCaballoBLL.GetAlertasByCaballo(propietarioId, caballoId, tipoAlerta, filtroAlerta, fechaAjustada, orden, limite));
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