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
    
    public partial class Recordatorio
    {
        public int ID { get; set; }
        public string Descripcion { get; set; }
        public Nullable<int> ValorTiempo { get; set; }
        public Nullable<int> UnidadTiempo_ID { get; set; }
    
        public virtual UnidadTiempo UnidadTiempo { get; set; }
    }
}
