using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.DAL.Dto
{
    public class AlertaDto
    {
        public int ID { get; set; }
        public string Titulo { get; set; }
        public DateTime FechaNotificacion { get; set; }
        public string HoraNotificacion { get; set; }
        public int Tipo { get; set; }
        public bool Activa { get; set; }
        public string Descripcion { get; set; }
        public Nullable<int> Caballo_ID { get; set; }
        public IDictionary<int, string> DictionaryCaballos { get; set; }

        public AlertaDto() { }

        public AlertaDto(Alerta alerta)
        {
            this.ID = alerta.ID;
            this.Titulo = alerta.Titulo;
            this.FechaNotificacion = alerta.FechaNotificacion;
            this.HoraNotificacion = alerta.HoraNotificacion;
            this.Tipo = alerta.Tipo;
            this.Activa = alerta.Activa;
            this.Descripcion = alerta.Descripcion;
            //if (alerta.Caballo1 != null && alerta.Caballo1.Count > 0)
            //{
            //    this.DictionaryCaballos = alerta.Caballo1.ToDictionary(x => x.ID, z => z.Nombre);
            //}
        }
    }
}
