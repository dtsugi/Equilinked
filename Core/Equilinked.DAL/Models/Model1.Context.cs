﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class EquilinkedEntities : DbContext
    {
        public EquilinkedEntities()
            : base("name=EquilinkedEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<C__MigrationHistory> C__MigrationHistory { get; set; }
        public virtual DbSet<Alerta> Alerta { get; set; }
        public virtual DbSet<AlertaCaballo> AlertaCaballo { get; set; }
        public virtual DbSet<Alimentacion> Alimentacion { get; set; }
        public virtual DbSet<Caballo> Caballo { get; set; }
        public virtual DbSet<Criador> Criador { get; set; }
        public virtual DbSet<Establecimiento> Establecimiento { get; set; }
        public virtual DbSet<EstadoProvincia> EstadoProvincia { get; set; }
        public virtual DbSet<Evento> Evento { get; set; }
        public virtual DbSet<Genero> Genero { get; set; }
        public virtual DbSet<Grupo> Grupo { get; set; }
        public virtual DbSet<GrupoCaballo> GrupoCaballo { get; set; }
        public virtual DbSet<Mail_Establecimiento> Mail_Establecimiento { get; set; }
        public virtual DbSet<Numero_Establecimiento> Numero_Establecimiento { get; set; }
        public virtual DbSet<OtrasMarcas> OtrasMarcas { get; set; }
        public virtual DbSet<Pais> Pais { get; set; }
        public virtual DbSet<Pedigree> Pedigree { get; set; }
        public virtual DbSet<Pelaje> Pelaje { get; set; }
        public virtual DbSet<PersonaACargo> PersonaACargo { get; set; }
        public virtual DbSet<Propietario> Propietario { get; set; }
        public virtual DbSet<Tipo_Mail> Tipo_Mail { get; set; }
        public virtual DbSet<Tipo_Numero> Tipo_Numero { get; set; }
        public virtual DbSet<Usuario> Usuario { get; set; }
    
        public virtual ObjectResult<sp_GetAlertasByPropietarioId_Result> sp_GetAlertasByPropietarioId(Nullable<int> pROPIETARIO_ID)
        {
            var pROPIETARIO_IDParameter = pROPIETARIO_ID.HasValue ?
                new ObjectParameter("PROPIETARIO_ID", pROPIETARIO_ID) :
                new ObjectParameter("PROPIETARIO_ID", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<sp_GetAlertasByPropietarioId_Result>("sp_GetAlertasByPropietarioId", pROPIETARIO_IDParameter);
        }
    }
}
