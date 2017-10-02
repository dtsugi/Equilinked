using Equilinked.API.helpers;
using Equilinked.BLL;
using Equilinked.DAL.Models;
using Equilinked.DAL.Dto;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using System.IO;
using System.Drawing;
using System.Web;

namespace Equilinked.API.Controllers
{
    public class PropietarioController : EquilinkedBaseController
    {
        private PropietarioBLL _propietarioBLL = new PropietarioBLL();

        [HttpPut, Route("api/propietarios/{propietarioId}/foto")]
        public IHttpActionResult UpdateFotoPerfil(int propietarioId)
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    HttpPostedFile postedFile = httpRequest.Files["file"];
                    _propietarioBLL.UpdateStreamFotoPerfilPropietario(propietarioId, postedFile.InputStream, postedFile.FileName, postedFile.ContentLength);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al actualizar la foto de perfil del propietario"));
            }
        }

        [HttpGet, Route("api/propietarios/{propietarioId}/foto")]
        public HttpResponseMessage GetFotoPerfilPropietario(int propietarioId)
        {
            try
            {
                Stream stream = _propietarioBLL.GetStreamFotoPerfilPropietario(propietarioId);
                string base64String = "";
                if(stream != null)
                {
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
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { });
                }
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al obtener foto perfil propietario"));
            }
        }

        [HttpPost, Route("api/propietarios")]
        public IHttpActionResult SavePropietario([FromBody] Propietario propietario)
        {
            bool usernameValid, emailValid;
            try
            {
                _propietarioBLL.SavePropietarioAndUsuario(propietario, out usernameValid, out emailValid);
                if(!usernameValid)
                {
                    return BadRequest("1");
                } else if(!emailValid)
                {
                    return BadRequest("2");
                } else
                {
                    return Ok(new { Mensaje = "Usuario creado con éxito" });
                }
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al crear el propietario"));
            }
        }

        [HttpGet, Route("api/propietarios/GetSerializedById/{id}")]
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

        [HttpPut, Route("api/propietarios/{propietarioId}")]
        [ResponseType(typeof(Propietario))]
        public IHttpActionResult UpdateGrupo(int propietarioId, PropietarioDto propietario)
        {
            try
            {
                return Ok(_propietarioBLL.updatePropietario(propietarioId, propietario));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible actualizar al propietario"));
            }
        }
    }
}