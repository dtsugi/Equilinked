using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;

namespace Equilinked.API.Controllers
{
    public class MotivoContactoController : EquilinkedBaseController
    {
        private ContactoBLL ContactoBll = new ContactoBLL();

        [HttpGet, Route("api/MotivoContacto")]
        public IHttpActionResult GetAllMotivoContacto()
        {
            try
            {
                return Ok(ContactoBll.listAllMotivoContacto());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los motivos de contacto"));
            }
        }
    }
}