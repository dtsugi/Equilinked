using Equilinked.API.helpers;
using Equilinked.BLL;
using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
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
        private const string KEY_PARAMS = "QPC";
        private CaballoBLL _caballoBLL = new CaballoBLL();

        [HttpPut, Route("api/propietarios/{propietarioId}/caballos/{caballoId}/adjuntos")]
        public IHttpActionResult UpdateAdjuntosCaballo(int propietarioId, int caballoId)
        {
            CaballoAdjuntosDto caballoAdjuntos = new CaballoAdjuntosDto();
            FileDto file = null;
            List<string> parameterNames = new List<string>();
            try
            {
                var httpRequest = HttpContext.Current.Request;
                parameterNames.AddRange(httpRequest.Form.AllKeys);
                parameterNames.AddRange(httpRequest.Files.AllKeys);

                foreach (string parameterName in parameterNames)
                {
                    HttpPostedFile postedFile = httpRequest.Files[parameterName];
                    if (postedFile != null)
                    {
                        file = new FileDto() { Name = postedFile.FileName, File = postedFile.InputStream, Length = postedFile.ContentLength };
                    }
                    else
                    {
                        file = new FileDto() { Name = httpRequest.Form[parameterName] };
                    }
                    if (parameterName == "pedigree")
                    {
                        caballoAdjuntos.Pedigree = file;
                    }
                    else
                    {
                        caballoAdjuntos.AdjuntosMarcas.Add(file);
                    }
                }
                _caballoBLL.UpdateAdjuntosCaballo(caballoId, caballoAdjuntos);
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al actualizar la foto de perfil del caballo"));
            }
        }

        [HttpGet, Route("api/propietarios/{propietarioId}/caballos/{caballoId}/adjuntos")]
        public IHttpActionResult GetAdjuntosCaballo(int propietarioId, int caballoId)
        {
            try
            {
                CaballoAdjuntosDto adjuntos = _caballoBLL.GetAdjuntosCaballo(caballoId);
                if(adjuntos.Pedigree != null)
                {
                    adjuntos.Pedigree.Base64 = createBase64(adjuntos.Pedigree.File);
                    adjuntos.Pedigree.File = null;
                }
                if(adjuntos.AdjuntosMarcas.Count > 0)
                {
                    foreach(FileDto file in adjuntos.AdjuntosMarcas)
                    {
                        file.Base64 = createBase64(file.File);
                        file.File = null;
                    }
                }
                return Ok(adjuntos);
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al obtener los adjuntos del caballo"));
            }
        }

        [HttpPut, Route("api/propietarios/{propietarioId}/caballos/{caballoId}/foto")]
        public IHttpActionResult UpdateFotoCaballo(int propietarioId, int caballoId)
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    HttpPostedFile postedFile = httpRequest.Files["file"];
                    _caballoBLL.UpdateStreamFotoCaballo(caballoId, postedFile.InputStream, postedFile.FileName, postedFile.ContentLength);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al actualizar la foto de perfil del caballo"));
            }
        }

        private string createBase64(Stream stream)
        {
            string base64String = "";
            using (Image image = Image.FromStream(stream))
            {
                using (MemoryStream m = new MemoryStream())
                {
                    image.Save(m, image.RawFormat);
                    base64String = Convert.ToBase64String(m.ToArray());
                }
            }
            stream.Close();
            return base64String;
        }

        [HttpGet, Route("api/propietarios/{propietarioId}/caballos/{caballoId}/foto")]
        public HttpResponseMessage GetFotoCaballo(int propietarioId, int caballoId)
        {
            try
            {
                Stream stream = _caballoBLL.GetStreamFotoCaballo(caballoId);
                if(stream != null)
                {
                    string base64String = "";
                    using (Image image = Image.FromStream(stream))
                    {
                        using (MemoryStream m = new MemoryStream())
                        {
                            image.Save(m, image.RawFormat);
                            base64String = Convert.ToBase64String(m.ToArray());
                        }
                    }
                    stream.Close();
                    return Request.CreateResponse(HttpStatusCode.OK, new { FotoPerfil = base64String });
                } else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { });
                }
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al obtener la foto perfil caballo"));
            }
        }

        [HttpGet, Route("api/propietario/{propietarioId}/caballos")]
        public IHttpActionResult GetCaballosPorAsociacionEstablo(int propietarioId, [FromUri] bool establo, [FromUri] bool filter)
        {
            try
            {
                return Ok(_caballoBLL.GetCaballosPorEstadoAsociacionEstablo(propietarioId, establo, filter ? ExtractParamtersFromRequest(HttpContext.Current.Request) : null));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No se pudieron obtener los caballos sin establo"));
            }
        }

        [HttpGet, Route("api/Caballo/GetAllSerializedByPropietarioId/{propietarioId}")]
        public IHttpActionResult GetAllSerializedByPropietarioId(int propietarioId, [FromUri] bool filter)
        {
            try
            {
                return Ok(_caballoBLL.GetAllSerializedByPropietarioId(propietarioId, filter ? ExtractParamtersFromRequest(HttpContext.Current.Request) : null));
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

        private Dictionary<string, string> ExtractParamtersFromRequest(HttpRequest request)
        {
            Dictionary<string, string> parameters = new Dictionary<string, string>();
            foreach (string param in request.Params)
            {
                if (param.Contains(KEY_PARAMS))
                {
                    parameters.Add(param, request.Params[param]);
                }
            }
            return parameters;
        }
    }
}