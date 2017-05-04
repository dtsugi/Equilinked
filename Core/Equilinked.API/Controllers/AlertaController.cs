using Equilinked.API.helpers;
using Equilinked.API.Models;
using Equilinked.BLL;
using Equilinked.DAL.Dto;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;

namespace Equilinked.API.Controllers
{
    public class AlertaController : EquilinkedBaseController
    {
        private AlertaBLL _alertaBLL = new AlertaBLL();

        //[HttpPost, Route("api/Alerta/Login")]
        //[ResponseType(typeof(AlertaDto))]
        //public async Task<HttpResponseMessage> Login(UserSessionDto session)
        //{
        //    try
        //    {
        //        HttpResponseMessage response;
        //        return Ok(tue);
        //    }
        //    catch (Exception ex)
        //    {
        //        this.LogException(ex);
        //        throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible obtener el usuario"));
        //    }
        //}

        [HttpGet, Route("api/Alerta/GetById/{id}")]
        public IHttpActionResult GetById(int id)
        {
            try
            {
                return Ok(_alertaBLL.GetById(id));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }

        [HttpGet, Route("api/Alerta/GetAllByUserId/{userId}")]
        public IHttpActionResult GetAllByUserId(int userId)
        {
            try
            {
                return Ok(_alertaBLL.GetAll());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }
    }
}