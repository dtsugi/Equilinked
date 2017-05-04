//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
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
            this.AlertaCaballo = new HashSet<AlertaCaballo>();
            this.Caballo = new HashSet<Caballo>();
        }
    
        public int ID { get; set; }
        public string Nombre { get; set; }
        public string Apellido { get; set; }
        public string Mail { get; set; }
        public string Celular { get; set; }
        public System.DateTime FechaNacimiento { get; set; }
        public Nullable<int> EstadoProvincia_Id { get; set; }
        public Nullable<int> Usuario_ID { get; set; }
    
        public virtual ICollection<AlertaCaballo> AlertaCaballo { get; set; }
        public virtual ICollection<Caballo> Caballo { get; set; }
        public virtual EstadoProvincia EstadoProvincia { get; set; }
        public virtual Usuario Usuario { get; set; }
    }
}
