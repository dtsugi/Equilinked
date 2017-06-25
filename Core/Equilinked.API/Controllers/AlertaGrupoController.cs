using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;
using System.Web.Http.Description;
using Equilinked.DAL.Models;

namespace Equilinked.API.Controllers
{
    public class AlertaGrupoController : EquilinkedBaseController
    {
        private AlertaGrupoBLL alertaGrupoBll = new AlertaGrupoBLL();

        [HttpGet, Route("api/grupos/{grupoId}/alertas/{alertaGrupoId}")]
        public IHttpActionResult GetAlertaGrupoById(int grupoId, int alertaGrupoId)
        {
            try
            {
                return Ok(alertaGrupoBll.GetAlertaGrupo(grupoId, alertaGrupoId));
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
    }
}