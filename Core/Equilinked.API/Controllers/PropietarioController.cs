using Equilinked.API.helpers;
using Equilinked.BLL;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Equilinked.API.Controllers
{
    public class PropietarioController : EquilinkedBaseController
    {
        private PropietarioBLL _propietarioBLL = new PropietarioBLL();

        [HttpGet, Route("api/Propietario/GetSerializedById/{id}")]
        public IHttpActionResult GetSerializedById(int id)
        {
            try
            {
                return Ok(_propietarioBLL.GetSerializedById(id));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }
    }
}