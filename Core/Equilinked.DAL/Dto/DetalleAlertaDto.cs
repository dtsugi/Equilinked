using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;

namespace Equilinked.DAL.Dto
{
    public class DetalleAlertaDto
    {
        public int ID { get; set; }
        public string Titulo { get; set; }
        public DateTime FechaNotificacion { get; set; }
        public string Descripcion { get; set; }
        public Nullable<bool> AlertaGrupal { get; set; }
        public Nullable<int> Propietario_ID { get; set; }

        public ICollection<AlertaRecordatorio> AlertaRecordatorio { get; set; }

        public DetalleAlertaDto(Alerta alerta)
        {
            this.ID = alerta.ID;
            this.Titulo = alerta.Titulo;
            this.FechaNotificacion = alerta.FechaNotificacion;
            this.Descripcion = alerta.Descripcion;
            this.AlertaGrupal = alerta.AlertaGrupal;
            this.Propietario_ID = alerta.Propietario_ID;
            this.AlertaRecordatorio = alerta.AlertaRecordatorio;
        }
    }
}
