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
    
    public partial class Genero
    {
        public Genero()
        {
            this.Caballo = new HashSet<Caballo>();
        }
    
        public int ID { get; set; }
        public string Descripcion { get; set; }
    
        public virtual ICollection<Caballo> Caballo { get; set; }
    }
}
