using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;

namespace Equilinked.API.Controllers
{
    public class PreguntaFrecuenteController : EquilinkedBaseController
    {
        private PreguntaFrecuenteBLL preguntaFrecuenteBll = new PreguntaFrecuenteBLL();

        [HttpGet, Route("api/PreguntasFrecuentes")]
        public IHttpActionResult GetAllFrecuentaFrecuente()
        {
            try
            {
                return Ok(preguntaFrecuenteBll.GetAll());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar las preguntas frecuentes"));
            }
        }
    }
}