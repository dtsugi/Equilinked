using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;

namespace Equilinked.API.Controllers
{
    public class PaisController : EquilinkedBaseController
    {

        private PaisBLL paisBll = new PaisBLL();
  
        [HttpGet, Route("api/paises")]
        public IHttpActionResult GetAllPaises()
        {
            try
            {
                return Ok(paisBll.GetAll());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los paises"));
            }
        }

        [HttpGet, Route("api/paises/{paisId}/estados")]
        public IHttpActionResult GetAllEstadosByPaisId(int paisId)
        {
            try
            {
                return Ok(paisBll.GetAllEstadoProvinciaByPaisId(paisId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los estados/provincias del pais"));
            }
        }

    }
}