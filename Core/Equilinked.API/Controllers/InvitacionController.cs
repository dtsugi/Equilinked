using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;
using System.Web.Http.Description;
using Equilinked.DAL.Models;

namespace Equilinked.API.Controllers
{
    public class InvitacionController : EquilinkedBaseController
    {

        private InvitacionBLL invitacionBll = new InvitacionBLL();
        private EnvioCorreoInvitacionBLL envioCorreoBll = new EnvioCorreoInvitacionBLL();

        [HttpPost, Route("api/InvitacionAmigo")]
        [ResponseType(typeof(InvitacionAmigo))]
        public IHttpActionResult InsertGrupo(InvitacionAmigo invitacion)
        {
            try
            {
                envioCorreoBll.sendInvitation(invitacionBll.Insert(invitacion));
                return Ok(invitacion);
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al enviar la invitación"));
            }
        }

    }
}