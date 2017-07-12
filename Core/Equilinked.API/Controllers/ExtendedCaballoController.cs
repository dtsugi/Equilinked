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
        private GeneroBLL _generoBLL;
        private PelajeBLL _pelajeBLL;
        private CriadorBLL _criadorBLL;
        private OtrasMarcasBLL _otrasMarcasBLL;
        private ProtectorBLL protectorBll;
        private PaisBLL paisBll;

        [HttpGet, Route("api/ExtendedCaballo/GetAllPaises")]
        public IHttpActionResult GetAllPaises()
        {
            try
            {
                paisBll = new PaisBLL();
                return Ok(paisBll.GetAll());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No se pudo obtener la lista de paises"));
            }
        }

        [HttpGet, Route("api/ExtendedCaballo/GetAllProtector")]
        public IHttpActionResult GetAllProtector()
        {
            try
            {
                protectorBll = new ProtectorBLL();
                return Ok(protectorBll.GetAllProtector());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No se pudo obtener la lista de protectores"));
            }
        }

        [HttpGet, Route("api/ExtendedCaballo/GetAllGeneroComboBox")]
        public IHttpActionResult GetAllGeneroComboBox()
        {
            try
            {
                _generoBLL = new GeneroBLL();
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
                _pelajeBLL = new PelajeBLL();
                return Ok(_pelajeBLL.GetAllComboBox());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                //throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }

        [HttpGet, Route("api/ExtendedCaballo/GetAllCriadorComboBox")]
        public IHttpActionResult GetAllCriadorComboBox()
        {
            try
            {
                _criadorBLL = new CriadorBLL();
                return Ok(_criadorBLL.GetAllComboBox());
            }
            catch (Exception ex)
            {
                this.LogException(ex);                
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }

        [HttpGet, Route("api/ExtendedCaballo/GetAllOtrasMarcasComboBox")]
        public IHttpActionResult GetAllOtrasMarcasComboBox()
        {
            try
            {
                _otrasMarcasBLL = new OtrasMarcasBLL();
                return Ok(_otrasMarcasBLL.GetAllComboBox());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message));
            }
        }
    }
}