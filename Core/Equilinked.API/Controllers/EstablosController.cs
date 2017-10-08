using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;
using Equilinked.DAL.Models;
using System.Collections.Generic;
using Equilinked.DAL.Dto;
using System.Web;

namespace Equilinked.API.Controllers
{
    public class EstablosController : EquilinkedBaseController
    {
        private const string KEY_PARAMS = "QPC";
        private EstabloBLL establosBll = new EstabloBLL();

        [HttpGet, Route("api/propietarios/{propietarioId}/establos/{establoId}/caballos")]
        public IHttpActionResult GetCaballosByEstabloAndGrupo(int propietarioId, int establoId, [FromUri] int grupoId, [FromUri] bool filter)
        {
            try
            {
                List<CaballoDto> caballos = establosBll.GetCaballosByEstabloAndGrupo(propietarioId, establoId, grupoId, filter ? ExtractParamtersFromRequest(HttpContext.Current.Request) : null);
                return Ok(caballos);
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al obtener los caballos del grupo asociados al establo"));
            }
        }

        [HttpGet, Route("api/propietarios/{propietarioId}/caballos")]
        public IHttpActionResult GetEstablosPropietario(int propietarioId, [FromUri] bool establo, [FromUri] bool filter)
        {
            try
            {
                return Ok(establosBll.GetCaballosPropietarioWithoutEstablo(propietarioId, filter ? ExtractParamtersFromRequest(HttpContext.Current.Request) : null));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los establos del propietario"));
            }
        }

        [HttpGet, Route("api/propietarios/{propietarioId}/establos")]
        public IHttpActionResult GetEstablosPropietario(int propietarioId)
        {
            try
            {
                return Ok(establosBll.GetAllEstablosByPropietarioId(propietarioId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los establos del propietario"));
            }
        }

        [HttpGet, Route("api/establos/{establoId}")]
        public IHttpActionResult GetEstablo(int establoId)
        {
            try
            {
                return Ok(establosBll.GetById(establoId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible encontrar el establo"));
            }
        }

        [HttpGet, Route("api/establos/{establoId}/caballos")]
        public IHttpActionResult GetCaballosEstablo(int establoId, [FromUri] int filtro, [FromUri] bool filter)
        {
            try
            {
                List<Caballo> caballos = new List<Caballo>();
                if(filtro == 1)
                {
                    caballos = establosBll.GetCaballosEstabloSinEstabloByEstabloId(establoId, filter ? ExtractParamtersFromRequest(HttpContext.Current.Request) : null);
                }
                else if(filtro == 2)
                {
                    caballos = establosBll.GetCaballosEstabloByEstabloId(establoId, filter ? ExtractParamtersFromRequest(HttpContext.Current.Request) : null);
                }
                return Ok(caballos);
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible encontrar el establo"));
            }
        }

        [HttpPost, Route("api/establos")]
        public IHttpActionResult SaveEstablo(Establo establo)
        {
            try
            {
                establosBll.SaveEstablo(establo);
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible guardar el establo"));
            }
        }

        [HttpPut, Route("api/establos/{establoId}")]
        public IHttpActionResult UpdateEstablo(int establoId, [FromBody] Establo establo)
        {
            try
            {
                establosBll.UpdateEstablo(establoId, establo);
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible actualizar el grupo"));
            }
        }

        [HttpDelete, Route("api/establos/{establoId}")]
        public IHttpActionResult DeleteEstablo(int establoId)
        {
            try
            {
                establosBll.DeleteEstabloById(establoId);
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible eliminar los establos"));
            }
        }



        [HttpDelete, Route("api/establos")]
        public IHttpActionResult DeteleEstablos([FromUri] int[] establosIds)
        {
            try
            {
                return Ok(establosBll.DeleteEstablosByIds(establosIds));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible eliminar los establos"));
            }
        }

        private Dictionary<string, string> ExtractParamtersFromRequest(HttpRequest request)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            foreach (string param in request.Params)
            {
                if (param.Contains(KEY_PARAMS))
                {
                    parameters.Add(param, request.Params[param]);
                }
            }
            return parameters;
        }
    }
}