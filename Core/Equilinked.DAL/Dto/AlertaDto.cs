using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;

namespace Equilinked.DAL.Dto
{
    public class AlertaDto
    {
        public int ID { get; set; }
        public string Titulo { get; set; }
        public DateTime FechaNotificacion { get; set; }
        public string FechaNotificacionToString { get; set; }
        public string FechaNotificacionToCurrentCulture { get; set; }
        public string HoraNotificacion { get; set; }
        public int Tipo { get; set; }
        public bool Activa { get; set; }
        public string Descripcion { get; set; }
        public List<int> CaballosList { get; set; }
        public string NombreProfesional { get; set; }
        public String Ubicacion { get; set; }
        public Nullable<bool> AlertaGrupal { get; set; }
        public Nullable<DateTime> FechaFinal { get; set; }
        public string Resultado { get; set; }
        public Nullable<int> Propietario_ID { get; set; }

        public AlertaDto() { }

        public AlertaDto(Alerta alerta)
        {
            this.ID = alerta.ID;
            this.Titulo = alerta.Titulo;
            this.FechaNotificacion = alerta.FechaNotificacion;
            this.FechaNotificacionToString = alerta.FechaNotificacion.ToShortDateString();
            this.FechaNotificacionToCurrentCulture = this.ToDateToCurrentCulture(alerta.FechaNotificacion);
            this.HoraNotificacion = alerta.HoraNotificacion;
            this.Tipo = alerta.Tipo;
            this.Activa = alerta.Activa;
            this.Descripcion = alerta.Descripcion;
            this.NombreProfesional = alerta.NombreProfesional;
            this.Ubicacion = alerta.Ubicacion;
            this.AlertaGrupal = alerta.AlertaGrupal;
            this.FechaFinal = alerta.FechaFinal;
            this.Resultado = alerta.Resultado;
            this.Propietario_ID = alerta.Propietario_ID;
        }

        private string ToDateToCurrentCulture(DateTime date)
        {
            string culture = "es-AR";
            System.Globalization.CultureInfo cultureInfo = System.Globalization.CultureInfo.CreateSpecificCulture(culture);
            System.Globalization.DateTimeFormatInfo dateFormatInfo = cultureInfo.DateTimeFormat;
            return string.Format("{0}, {1} de {2} de {3}", dateFormatInfo.GetDayName(date.DayOfWeek), date.Day, dateFormatInfo.GetMonthName(date.Month), date.Year);
        }
    }
}

namespace Equilinked.DAL.Models
{
    public partial class Alerta
    {
        public ICollection<AlertaCaballo> AlertaCaballo { get; set; } = new HashSet<AlertaCaballo>();

        public Alerta(AlertaDto alertaDto)
        {
            this.ID = alertaDto.ID;
            this.Titulo = alertaDto.Titulo;
            this.FechaNotificacion = alertaDto.FechaNotificacion;
            this.HoraNotificacion = alertaDto.HoraNotificacion;
            this.Tipo = alertaDto.Tipo;
            this.Activa = alertaDto.Activa;
            this.Descripcion = alertaDto.Descripcion;
            this.NombreProfesional = alertaDto.NombreProfesional;
            this.Ubicacion = alertaDto.Ubicacion;
            this.AlertaGrupal = alertaDto.AlertaGrupal;
            this.FechaFinal = alertaDto.FechaFinal;
            this.Resultado = alertaDto.Resultado;
            this.Propietario_ID = alertaDto.Propietario_ID;
        }
    }
}
