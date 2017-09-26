//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Equilinked.DAL.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Propietario
    {
        public Propietario()
        {
            this.Caballo = new HashSet<Caballo>();
            this.Grupo = new HashSet<Grupo>();
            this.Establo = new HashSet<Establo>();
            this.MensajeContacto = new HashSet<MensajeContacto>();
            this.InvitacionAmigo = new HashSet<InvitacionAmigo>();
            this.PropietarioTelefono = new HashSet<PropietarioTelefono>();
        }
    
        public int ID { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Mail { get; set; }
        public string Celular { get; set; }
        public System.DateTime FechaNacimiento { get; set; }
        public Nullable<int> EstadoProvincia_Id { get; set; }
        public Nullable<int> Usuario_ID { get; set; }
        public string Image { get; set; }
    
        public virtual ICollection<Caballo> Caballo { get; set; }
        public virtual EstadoProvincia EstadoProvincia { get; set; }
        public virtual Usuario Usuario { get; set; }
        public virtual ICollection<Grupo> Grupo { get; set; }
        public virtual ICollection<Establo> Establo { get; set; }
        public virtual ICollection<MensajeContacto> MensajeContacto { get; set; }
        public virtual ICollection<InvitacionAmigo> InvitacionAmigo { get; set; }
        public virtual ICollection<PropietarioTelefono> PropietarioTelefono { get; set; }
    }
}
