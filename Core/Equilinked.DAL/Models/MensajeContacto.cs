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
    
    public partial class MensajeContacto
    {
        public int ID { get; set; }
        public int MotivoContacto_ID { get; set; }
        public string Mensaje { get; set; }
        public System.DateTime Fecha { get; set; }
        public int Propietario_ID { get; set; }
        public string Image1 { get; set; }
        public string Image2 { get; set; }
    
        public virtual MotivoContacto MotivoContacto { get; set; }
        public virtual Propietario Propietario { get; set; }
    }
}
