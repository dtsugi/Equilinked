using Equilinked.BLL;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Equilinked.DAL.Models;

namespace Equilinked.API.Controllers
{
    public class GrupoCaballoController: EquilinkedBaseController
    {
        private GrupoCaballoBLL GrupoCaballoBLL = new GrupoCaballoBLL();

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
    }
}