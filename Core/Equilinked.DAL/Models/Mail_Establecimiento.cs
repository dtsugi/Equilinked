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
    
    public partial class Mail_Establecimiento
    {
        public int ID { get; set; }
        public string MailDesc { get; set; }
        public Nullable<int> Establecimiento_ID { get; set; }
        public Nullable<int> Tipo_ID { get; set; }
    
        public virtual Establecimiento Establecimiento { get; set; }
        public virtual Tipo_Mail Tipo_Mail { get; set; }
    }
}
