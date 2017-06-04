using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;

using Equilinked.API.helpers;
using System.Web.Http.Description;
using Equilinked.DAL.Models;

namespace Equilinked.API.Controllers
{
    public class EstablosController : EquilinkedBaseController
    {

        private EstabloBLL EstablosBll = new EstabloBLL();

        
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
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los grupos del propietario"));
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

    }
}