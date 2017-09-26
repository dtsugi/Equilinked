using Equilinked.BLL;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Equilinked.DAL.Models;
using System.Web;
using System.IO;
using System.Drawing;

namespace Equilinked.API.Controllers
{
    public class GrupoCaballoController: EquilinkedBaseController
    {
        private GrupoCaballoBLL GrupoCaballoBLL = new GrupoCaballoBLL();

        [HttpPut, Route("api/propietarios/{propietarioId}/grupos/{grupoId}/foto")]
        public IHttpActionResult UpdateFotoCaballo(int propietarioId, int grupoId)
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                if (httpRequest.Files.Count > 0)
                {
                    HttpPostedFile postedFile = httpRequest.Files["file"];
                    GrupoCaballoBLL.UpdateStreamFotoGrupo(grupoId, postedFile.InputStream, postedFile.FileName, postedFile.ContentLength);
                }
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al actualizar la foto de perfil del grupo"));
            }
        }

        [HttpGet, Route("api/propietarios/{propietarioId}/grupos/{grupoId}/foto")]
        public HttpResponseMessage GetFotoCaballo(int propietarioId, int grupoId)
        {
            try
            {
                Stream stream = GrupoCaballoBLL.GetStreamFotoGrupo(grupoId);
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
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al obtener la foto perfil grupo"));
            }
        }

        [HttpGet, Route("api/propietarios/{propietarioId}/grupos/{grupoId}/caballos")]
        public IHttpActionResult GetCaballosByGrupoAndStatusEstablo(int propietarioId, int grupoId, [FromUri] bool tieneEstablo)
        {
            try
            {
                return Ok(GrupoCaballoBLL.GetCaballosByGrupoAndStatusEstablo(propietarioId, grupoId, tieneEstablo));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al obtener los caballos sin establo del grupo"));
            }
        }

        [HttpGet, Route("api/propietarios/{propietarioId}/grupos")]
        public IHttpActionResult GetAllGruposByPropietarioId(int propietarioId)
        {
            try
            {

                return Ok(GrupoCaballoBLL.GetAllGruposByPropietarioId(propietarioId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al obtener los grupos del propietario"));
            }
        }

        [HttpGet, Route("api/propietarios/{propietarioId}/grupos/caballos")]
        public IHttpActionResult GetAllCaballosFromGruposIds([FromUri] int[] gruposIds, int propietarioId)
        {
            try
            {

                return Ok(GrupoCaballoBLL.GetCaballosByGruposIds(propietarioId, gruposIds));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Error al obtener los caballos de los grupos"));
            }
        }


        [HttpDelete, Route("api/Grupo/{grupoId}")]
        public IHttpActionResult DeleteGrupoById(int grupoId)
        {
            try
            {
                
                return Ok(GrupoCaballoBLL.DeleteById(grupoId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible eliminar el grupo"));
            }
        }

        [HttpGet, Route("api/Grupo/{grupoId}")]
        public IHttpActionResult GetGrupoById(int grupoId)
        {
            try
            {
                return Ok(GrupoCaballoBLL.GetGrupoById(grupoId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible obtener el grupo"));
            }
        }

        [HttpPut, Route("api/Grupo/{GrupoId}")]
        [ResponseType(typeof(Grupo))]
        public IHttpActionResult UpdateGrupo(int GrupoId, Grupo grupo)
        {
            try
            {
                return Ok(GrupoCaballoBLL.UpdateGrupo(GrupoId, grupo));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible actualizar el grupo"));
            }
        }

        [HttpGet, Route("api/Grupo/GetAllByPropietarioId/{PropietarioId}")]
        public IHttpActionResult GetAllByPropietarioId(int PropietarioId)
        {
            try
            {
                return Ok(GrupoCaballoBLL.GetAllByPropietario(PropietarioId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los grupos del propietario"));
            }
        }

        [HttpGet, Route("api/Grupo/GetAllGrupoCaballoByGrupoId/{GrupoId}")]
        public IHttpActionResult GetAllGrupoCaballoByGrupoId(int GrupoId)
        {
            try
            {
                return Ok(GrupoCaballoBLL.GetGrupoCaballosByGrupoId(GrupoId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los caballos asociados al grupo"));
            }
        }

        [HttpGet, Route("api/Grupo/GetAllCaballosByPropietarioId/{PropietarioId}")]
        public IHttpActionResult GetAllCaballosByPropietarioId(int PropietarioId)
        {
            try
            {
                return Ok(GrupoCaballoBLL.GetAllCaballosByPropietario(PropietarioId));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible listar los grupos del propietario"));
            }
        }

        [HttpPost, Route("api/Grupo")]
        [ResponseType(typeof(Grupo))]
        public IHttpActionResult InsertGrupo(Grupo grupo)
        {
            try
            {
                return Ok(GrupoCaballoBLL.Insert(grupo));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible guardar el grupo"));
            }
        }

        [HttpDelete, Route("api/grupo/{grupoId}/caballos")]
        public IHttpActionResult DeleteGruposCaballosByIds(int grupoId, [FromUri] int[] caballosIds)
        {
            try
            {
                GrupoCaballoBLL.DeleteGrupoCaballoByIds(grupoId, caballosIds);
                return Ok();
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible eliminar la asignación de caballos al grupo"));
            }
        }
    }
}