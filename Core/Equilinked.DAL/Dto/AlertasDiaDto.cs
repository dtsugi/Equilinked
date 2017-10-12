using System;
using System.Collections.Generic;

namespace Equilinked.DAL.Dto
{
    public class AlertasDiaDto
    {
        public DateTime Fecha { get; set; }
        public List<DetalleAlertaDto> Alertas { get; set; }

        public AlertasDiaDto(DateTime Fecha)
        {
            this.Fecha = Fecha;
            this.Alertas = new List<DetalleAlertaDto>();
        }

        public AlertasDiaDto(DateTime Fecha, List<DetalleAlertaDto> Alertas)
        {
            this.Fecha = Fecha;
            this.Alertas = Alertas;
        }
    }
}
