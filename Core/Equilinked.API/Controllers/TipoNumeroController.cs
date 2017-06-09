using System;
using Equilinked.BLL;
using System.Web.Http;
using System.Net;
using System.Net.Http;

namespace Equilinked.API.Controllers
{
    public class TipoNumeroController : EquilinkedBaseController
    {
        private TipoNumeroBLL tipoNumeroBll = new TipoNumeroBLL();

        [HttpGet, Route("api/TipoNumero/GetAll")]
        public IHttpActionResult GetAllByPropietarioId()
        {
            try
            {
                return Ok(tipoNumeroBll.GetAll());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los grupos del propietario"));
            }
        }

    }
}