using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;
using System.Web.Http.Description;
using Equilinked.DAL.Models;

namespace Equilinked.API.Controllers
{
    public class EstablosController : EquilinkedBaseController
    {

        private EstabloBLL EstablosBll = new EstabloBLL();

        [HttpDelete, Route("api/Establo/DeleteByIds")]
        public IHttpActionResult DeleteEstablosByIds([FromUri] int[] EstablosIds)
        {
            try
            {
                return Ok(EstablosBll.DeleteEstablosByIds(EstablosIds));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible eliminar los establos"));
            }
        }

        [HttpGet, Route("api/Establo/GetAllEstabloCaballoByEstabloId/{EstabloId}")]
        public IHttpActionResult GetAllEstabloCaballoByEstabloId(int EstabloId)
        {
            try
            {
                return Ok(EstablosBll.getAllEstabloCaballoByEstabloId(EstabloId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los caballos del establo"));
            }
        }

        [HttpGet, Route("api/Establo/GetAllByPropietarioId/{PropietarioId}")]
        public IHttpActionResult GetAllByPropietarioId(int PropietarioId)
        {
            try
            {
                return Ok(EstablosBll.GetAllEstablosByPropietarioId(PropietarioId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los establos del propietario"));
            }
        }

        [HttpGet, Route("api/Establo/GetById/{EstabloId}")]
        public IHttpActionResult GetEstabloById(int EstabloId)
        {
            try
            {
                return Ok(EstablosBll.GetById(EstabloId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible encontrar el establo"));
            }
        }

        [HttpPost, Route("api/Establo")]
        [ResponseType(typeof(Establo))]
        public IHttpActionResult InsertGrupo(Establo establo)
        {
            try
            {
                return Ok(EstablosBll.Insert(establo));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible guardar el establo"));
            }
        }

        [HttpPut, Route("api/Establo/{EstabloId}")]
        [ResponseType(typeof(Establo))]
        public IHttpActionResult UpdateGrupo(int establoId, Establo establo)
        {
            try
            {
                return Ok(EstablosBll.update(establoId, establo));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible actualizar el grupo"));
            }
        }

    }
}