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
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;

namespace Equilinked.API.Controllers
{
    public class CaballoController : EquilinkedBaseController
    {
        private CaballoBLL _caballoBLL = new CaballoBLL();

        [HttpGet, Route("api/propietario/{propietarioId}/caballos")]
        public IHttpActionResult GetCaballosPorAsociacionEstablo(int propietarioId, [FromUri] bool establo)
        {
            try
            {
                return Ok(_caballoBLL.GetCaballosPorEstadoAsociacionEstablo(propietarioId, establo));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No se pudieron obtener los caballos sin establo"));
            }
        }

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

        [HttpGet, Route("api/Caballo/GetAllComboBoxByPropietarioId/{propietarioId}")]
        public IHttpActionResult GetAllComboBoxByPropietarioId(int propietarioId)
        {
            try
            {
                return Ok(_caballoBLL.GetAllComboBoxByPropietarioId(propietarioId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }

        [HttpPost, Route("api/Caballo/Save")]
        [ResponseType(typeof(CaballoDto))]
        public async Task<HttpResponseMessage> Save(CaballoDto caballoDto)
        {
            try
            {
                HttpResponseMessage response;
                Caballo caballo = new Caballo(caballoDto);
                if (caballo.ID > 0)
                {
                    _caballoBLL.Update(caballo);
                }
                else
                {
                    _caballoBLL.Insert(caballo);
                }
                response = Request.CreateResponse(HttpStatusCode.OK, caballo.ID);
                return response;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible crear el caballo"));
            }
        }

        [HttpDelete, Route("api/Caballo/Delete")]
        public async Task<HttpResponseMessage> Delete(int caballoId)
        {
            try
            {
                HttpResponseMessage response;
                string messageError;
                if (_caballoBLL.DeleteWihFKById(caballoId, out messageError))
                {
                    response = Request.CreateResponse(HttpStatusCode.OK, true);
                }
                else
                {
                    response = Request.CreateResponse(HttpStatusCode.PreconditionFailed, new { Message = messageError });
                }
                return response;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible eliminar el caballo"));
            }
        }

        [HttpGet, Route("api/Caballo/GetSerializedById/{caballoId}")]
        public IHttpActionResult GetSerializedById(int caballoId)
        {
            try
            {
                return Ok(_caballoBLL.GetSerializedById(caballoId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }
    }
}