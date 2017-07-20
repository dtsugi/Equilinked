using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;
using Equilinked.API.Controllers;

namespace Equilinked.API
{
    public class RecordatorioController : EquilinkedBaseController
    {
        private RecordatorioBLL recordatorioBll = new RecordatorioBLL();

        [HttpGet, Route("api/recordatorios")]
        public IHttpActionResult GetAllRecordatorios()
        {
            try
            {
                return Ok(recordatorioBll.GetAllRecordatorios());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible obtener el catalogo de recordatorios"));
            }
        }

        [HttpGet, Route("api/unidadestiempo")]
        public IHttpActionResult GetAllUnidadesTiempo()
        {
            try
            {
                return Ok(recordatorioBll.GetAllUnidadesTiempo());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible obtener el catalogo de unides de tiempo"));
            }
        }
    }
}