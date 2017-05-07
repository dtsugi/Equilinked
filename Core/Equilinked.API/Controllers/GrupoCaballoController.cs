﻿using Equilinked.API.helpers;
using Equilinked.BLL;
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Description;
using Equilinked.DAL.Models;
using System.Threading.Tasks;

namespace Equilinked.API.Controllers
{
    public class GrupoCaballoController: EquilinkedBaseController
    {
        private GrupoCaballoBLL GrupoCaballoBLL = new GrupoCaballoBLL();

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