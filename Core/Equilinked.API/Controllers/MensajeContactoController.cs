using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;
using System.Web.Http.Description;
using Equilinked.DAL.Models;

namespace Equilinked.API.Controllers
{
    public class MensajeContactoController : EquilinkedBaseController
    {
        private ContactoBLL ContactoBll = new ContactoBLL();

        [HttpPost, Route("api/MensajeContacto")]
        [ResponseType(typeof(MensajeContacto))]
        public IHttpActionResult InsertGrupo(MensajeContacto Reporte)
        {
            try
            {
                return Ok(ContactoBll.Insert(Reporte));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible guardar el reporte"));
            }
        }
    }
}