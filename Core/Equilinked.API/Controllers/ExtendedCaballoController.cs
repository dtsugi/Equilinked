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
    public class ExtendedCaballoController : EquilinkedBaseController
    {
        private GeneroBLL _generoBLL = new GeneroBLL();
        private PelajeBLL _pelajeBLL = new PelajeBLL();

        [HttpGet, Route("api/ExtendedCaballo/GetAllGeneroComboBox")]
        public IHttpActionResult GetAllGeneroComboBox()
        {
            try
            {
                return Ok(_generoBLL.GetAllComboBox());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }

        [HttpGet, Route("api/ExtendedCaballo/GetAllPelajeComboBox")]
        public IHttpActionResult GetAllPelajeComboBox()
        {
            try
            {
                return Ok(_pelajeBLL.GetAllComboBox());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                //throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
    }
}