using Equilinked.API.helpers;
using Equilinked.BLL;
using Equilinked.DAL.Dto;
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
    public class AlertaCaballoController : EquilinkedBaseController
    {
        private AlertaCaballoBLL _alertaCaballoBLL = new AlertaCaballoBLL();

        [HttpGet, Route("api/AlertaCaballo/GetAllCaballoIdByAlertaId/{alertaId}")]
        public IHttpActionResult GetAllCaballoIdByAlertaId(int alertaId)
        {
            try
            {
                return Ok(_alertaCaballoBLL.GetAllCaballoIdByAlertaId(alertaId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }
    }
}