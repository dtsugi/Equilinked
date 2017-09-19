using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.DAL.Dto
{
    public class PropietarioDto
    {
        public int ID { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string NombreCompleto { get; set; }
        public string Mail { get; set; }
        public string Celular { get; set; }
        public System.DateTime FechaNacimiento { get; set; }
        public Nullable<int> EstadoProvincia_Id { get; set; }
        public Nullable<int> Pais_ID { get; set; }
        public string EstadoProvincia_Nombre { get; set; }
        public string PaisNombre { get; set; }
        public Nullable<int> Usuario_ID { get; set; }
        public List<PropietarioTelefono> PropietarioTelefono { get; set; }
        public Usuario Usuario { get; set; }

        public PropietarioDto() { }

        public PropietarioDto(Propietario propietario)
        {
            this.ID = propietario.ID;
            this.Nombre = propietario.Nombre;
            this.Apellido = propietario.Apellido;
            this.NombreCompleto = string.Format("{0} {1}", propietario.Nombre, propietario.Apellido);
            this.Mail = propietario.Mail;
            this.Celular = propietario.Celular;
            this.FechaNacimiento = propietario.FechaNacimiento;
            this.EstadoProvincia_Id = propietario.EstadoProvincia_Id;
            if (propietario.EstadoProvincia != null)
            {
                this.EstadoProvincia_Nombre = propietario.EstadoProvincia.Nombre;
                this.Pais_ID = propietario.EstadoProvincia.Pais_ID;
                this.PaisNombre = propietario.EstadoProvincia.Pais.Descripcion;
            }
            this.Usuario_ID = propietario.Usuario_ID;
            this.PropietarioTelefono = new List<PropietarioTelefono>(propietario.PropietarioTelefono);
            this.Usuario = propietario.Usuario;
        }
    }
}
