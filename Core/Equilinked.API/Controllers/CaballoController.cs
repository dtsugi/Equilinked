using Equilinked.API.helpers;
using Equilinked.BLL;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Equilinked.API.Controllers
{
    public class CaballoController : EquilinkedBaseController
    {
        private CaballoBLL _caballoBLL = new CaballoBLL();

        [HttpGet, Route("api/Caballo/GetAllSerializedByPropietarioId/{propietarioId}")]
        public IHttpActionResult GetAllSerializedByPropietarioId(int propietarioId)
        {
            try
            {
                return Ok(_caballoBLL.GetAllSerializedByPropietarioId(propietarioId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }
    }
}