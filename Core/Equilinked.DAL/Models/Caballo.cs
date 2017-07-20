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
    
    public partial class Caballo
    {
        public Caballo()
        {
            this.Alimentacion1 = new HashSet<Alimentacion>();
        }
    
        public int ID { get; set; }
        public string Nombre { get; set; }
        public Nullable<System.DateTime> FechaNacimiento { get; set; }
        public string NumeroChip { get; set; }
        public Nullable<int> NumeroFEI { get; set; }
        public Nullable<bool> EstadoFEI { get; set; }
        public string Embocadura { get; set; }
        public string ExtrasDeCabezada { get; set; }
        public Nullable<bool> ADN { get; set; }
        public string NumeroId { get; set; }
        public Nullable<int> NumeroFEN { get; set; }
        public Nullable<bool> EstadoFEN { get; set; }
        public Nullable<int> Criador_ID { get; set; }
        public Nullable<int> Establecimiento_ID { get; set; }
        public Nullable<int> EstadoProvincia_Id { get; set; }
        public int Genero_ID { get; set; }
        public Nullable<int> Grupo_ID { get; set; }
        public Nullable<int> OtrasMarcas_ID { get; set; }
        public Nullable<int> Pedigree_ID { get; set; }
        public int Pelaje_ID { get; set; }
        public Nullable<int> PersonaACargo_ID { get; set; }
        public Nullable<int> Propietario_ID { get; set; }
        public string Observaciones { get; set; }
        public Nullable<int> Establo_ID { get; set; }
        public string NombrePropietario { get; set; }
        public string Marcas { get; set; }
        public Nullable<int> Protector_ID { get; set; }
    
        public virtual ICollection<Alimentacion> Alimentacion1 { get; set; }
        public virtual Genero Genero { get; set; }
        public virtual Grupo Grupo { get; set; }
        public virtual Pelaje Pelaje { get; set; }
        public virtual Propietario Propietario { get; set; }
        public virtual Establo Establo { get; set; }
        public virtual Protector Protector { get; set; }
        public virtual GenealogiaCaballo GenealogiaCaballo { get; set; }
        public virtual CriadorCaballo CriadorCaballo { get; set; }
        public virtual ResponsableCaballo ResponsableCaballo { get; set; }
    }
}
