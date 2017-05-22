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
    public class AlimentacionController : EquilinkedBaseController
    {
        private AlimentacionBLL _alimentacionBLL = new AlimentacionBLL();

        [HttpGet, Route("api/Alimentacion/GetByCaballoId/{idCaballo}")]
        public IHttpActionResult GetByCaballoId(int idCaballo)
        {
            try
            {
                return Ok(_alimentacionBLL.GetByCaballoId(idCaballo));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }

        [HttpPost, Route("api/Alimentacion/Save")]
        [ResponseType(typeof(Alimentacion))]
        public async Task<HttpResponseMessage> Save(Alimentacion alimentacion)
        {
            try
            {
                HttpResponseMessage response;
                if (alimentacion.ID > 0)
                {
                    _alimentacionBLL.Update(alimentacion);
                }
                else
                {
                    _alimentacionBLL.Insert(alimentacion);
                }
                response = Request.CreateResponse(HttpStatusCode.OK, alimentacion);
                return response;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible crear la alimentacion"));
            }
        }
    }
}