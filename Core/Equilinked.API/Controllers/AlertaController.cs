﻿using Equilinked.API.helpers;
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
    public class AlertaController : EquilinkedBaseController
    {
        private AlertaBLL _alertaBLL = new AlertaBLL();

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

        [HttpGet, Route("api/Alerta/GetAllByPropietarioId/{propietarioId}/{filterByFuture}")]
        public IHttpActionResult GetAllByPropietarioId(int propietarioId, bool filterByFuture)
        {
            try
            {
                List<sp_GetAlertasByPropietarioId_Result> listAlertas = _alertaBLL.GetAllByPropietario(propietarioId, filterByFuture);
                return Ok(listAlertas);
                //throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.NoContent, EquilinkedConstants.ERR_WITHOUT_DATA));                
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }

        [HttpGet, Route("api/Alerta/GetCurrentDate/{year}/{month}/{day}/{culture}")]
        public IHttpActionResult GetCurrentDate(string year, string month, string day, string culture = "es-AR")
        {
            try
            {
                if (string.IsNullOrEmpty(culture)) { culture = "es-AR"; }
                string dateString = string.Format("{0}-{1}-{2}", year, month, day);
                CultureInfo cultureInfo = System.Globalization.CultureInfo.CreateSpecificCulture(culture);
                DateTime date = DateTime.ParseExact(dateString, "yyyy-MM-dd", null);
                DateTimeFormatInfo dateFormatInfo = cultureInfo.DateTimeFormat;
                return Ok(string.Format("{0}, {1} de {2} de {3}", dateFormatInfo.GetDayName(date.DayOfWeek), date.Day, dateFormatInfo.GetMonthName(date.Month), date.Year));
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.ToString()));
            }
        }

        [HttpGet, Route("api/Alerta/GetCurrentDate/{stringDate}/{culture}")]
        public IHttpActionResult GetCurrentDate(string stringDate, string culture = "es-AR")
        {
            try
            {
                if (string.IsNullOrEmpty(culture)) { culture = "es-AR"; }
                CultureInfo cultureInfo = System.Globalization.CultureInfo.CreateSpecificCulture(culture);
                DateTime date = DateTime.Parse(stringDate);
                DateTimeFormatInfo dateFormatInfo = cultureInfo.DateTimeFormat;
                return Ok(string.Format("{0}, {1} de {2} de {3}", dateFormatInfo.GetDayName(date.DayOfWeek), date.Day, dateFormatInfo.GetMonthName(date.Month), date.Year));
            }
            catch (Exception ex)
            {
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.ToString()));
            }
        }

        [HttpPost, Route("api/Alerta/Save")]
        [ResponseType(typeof(AlertaDto))]
        public async Task<HttpResponseMessage> Save(AlertaDto alertaDto)
        {
            try
            {
                HttpResponseMessage response;
                AlertaCaballoBLL _alertaCaballoBLL = new AlertaCaballoBLL();                
                Alerta alerta = new Alerta(alertaDto);
                if (alertaDto.ID <= 0)
                {
                    _alertaBLL.Insert(alerta);
                    _alertaCaballoBLL.InsertFromCaballosList(alerta.ID, alertaDto.CaballosList);
                    response = Request.CreateResponse(HttpStatusCode.OK, alerta);
                }
                else
                {
                    _alertaBLL.Update(alerta);
                    _alertaCaballoBLL.DeleteByAlertaId(alerta.ID);
                    _alertaCaballoBLL.InsertFromCaballosList(alerta.ID, alertaDto.CaballosList);
                    response = Request.CreateResponse(HttpStatusCode.OK, alerta);
                }
                return response;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible crear la notificacion"));
            }
        }

        [HttpDelete, Route("api/Alerta/Delete")]
        public async Task<HttpResponseMessage> Delete(int alertaId)
        {
            try
            {
                HttpResponseMessage response;
                if (_alertaBLL.DeleteById(alertaId))
                {
                    response = Request.CreateResponse(HttpStatusCode.OK, true);
                }
                else
                {
                    response = Request.CreateResponse(HttpStatusCode.PreconditionFailed, new { Message = EquilinkedConstants.MSG_ERROR_DELETE });
                }
                return response;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible crear la notificacion"));
            }
        }

        [HttpGet, Route("api/Alerta/GetAllTiposAlerta")]
        public IHttpActionResult GetAllTiposAlerta()
        {
            try
            {
                return Ok(_alertaBLL.GetAllTiposAlerta());
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }

        [HttpGet, Route("api/Alerta/GetAllByCaballoId/{caballoId}/{tipoAlertasEnum}")]
        public IHttpActionResult GetAllByCaballoId(int caballoId, int tipoAlertasEnum = 0)
        {
            try
            {
                return Ok(_alertaBLL.GetAllByCaballoId(caballoId, tipoAlertasEnum));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, EquilinkedConstants.MSG_ERROR_SELECT));
            }
        }
    }
}