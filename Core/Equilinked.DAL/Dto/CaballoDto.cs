using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System;

namespace Equilinked.DAL.Dto
{ 
    public class CaballoDto : EntidadBase
    {
        public int ID { get; set; }
        public string Nombre { get; set; }
        public DateTime FechaNacimiento { get; set; }
        public string NumeroChip { get; set; }
        public int NumeroFEI { get; set; }
        public bool EstadoFEI { get; set; }
        public string Embocadura { get; set; }
        public string ExtrasDeCabezada { get; set; }
        public bool ADN { get; set; }
        public string NumeroId { get; set; }
        public int NumeroFEN { get; set; }
        public bool EstadoFEN { get; set; }
        //Alimentacion
        public int Criador_ID { get; set; }
        public int Establecimiento_ID { get; set; }
        public int EstadoProvincia_Id { get; set; }
        public int Genero_ID { get; set; }
        public int Grupo_ID { get; set; }
        public int OtrasMarcas_ID { get; set; }
        public int Pedigree_ID { get; set; }
        public int Pelaje_ID { get; set; }
        public int PersonaACargo_ID { get; set; }
        public int Propietario_ID { get; set; }
        public string Observaciones { get; set; }
        public Nullable<int> Establo_ID { get; set; }
        public string NombrePropietario { get; set; }
        public string Marcas { get; set; }
        public Nullable<int> Protector_ID { get; set; }
        public Protector Protector { get; set; }
        public GenealogiaCaballo GenealogiaCaballo { get; set; }
        public CriadorCaballo CriadorCaballo { get; set; }
        public ResponsableCaballo ResponsableCaballo { get; set; }
        public Establo Establo { get; set; }

        public CaballoDto() { }

        public CaballoDto(Caballo caballo)
        {
            ID = caballo.ID;
            Nombre = caballo.Nombre;
            FechaNacimiento = this.ValidateDateParam(caballo.FechaNacimiento);
            NumeroChip = caballo.NumeroChip;
            NumeroFEI = this.ValidateIntParam(caballo.NumeroFEI);
            EstadoFEI = this.ValidateBoolParam(caballo.EstadoFEI);
            Embocadura = caballo.Embocadura;
            ExtrasDeCabezada = caballo.ExtrasDeCabezada;
            ADN = this.ValidateBoolParam(caballo.ADN);
            NumeroId = caballo.NumeroId;
            NumeroFEN = this.ValidateIntParam(caballo.NumeroFEN);
            EstadoFEN = this.ValidateBoolParam(caballo.EstadoFEN);
            Criador_ID = this.ValidateIntParam(caballo.Criador_ID);
            Establecimiento_ID = this.ValidateIntParam(caballo.Establecimiento_ID);
            EstadoProvincia_Id = this.ValidateIntParam(caballo.EstadoProvincia_Id);
            Genero_ID = caballo.Genero_ID;
            Grupo_ID = this.ValidateIntParam(caballo.Grupo_ID);
            OtrasMarcas_ID = this.ValidateIntParam(caballo.OtrasMarcas_ID);
            Pedigree_ID = this.ValidateIntParam(caballo.Pedigree_ID);
            Pelaje_ID = caballo.Pelaje_ID;
            PersonaACargo_ID = this.ValidateIntParam(caballo.PersonaACargo_ID);
            Propietario_ID = this.ValidateIntParam(caballo.Propietario_ID);
            Observaciones = caballo.Observaciones;
            Establo_ID = caballo.Establo_ID;
            Protector_ID = caballo.Protector_ID;
            NombrePropietario = caballo.NombrePropietario;
            Marcas = caballo.Marcas;
            Protector = caballo.Protector;
            GenealogiaCaballo = caballo.GenealogiaCaballo;
            CriadorCaballo = caballo.CriadorCaballo;
            ResponsableCaballo = caballo.ResponsableCaballo;
        }
    }
}

namespace Equilinked.DAL.Models
{
    public partial class Caballo : EntidadBase
    {
        public Caballo(CaballoDto caballoDto)
        {
            ID = caballoDto.ID;
            Nombre = caballoDto.Nombre;
            FechaNacimiento = caballoDto.FechaNacimiento;
            NumeroChip = caballoDto.NumeroChip;
            NumeroFEI = caballoDto.NumeroFEI;
            EstadoFEI = caballoDto.EstadoFEI;
            Embocadura = caballoDto.Embocadura;
            ExtrasDeCabezada = caballoDto.ExtrasDeCabezada;
            ADN = caballoDto.ADN;
            NumeroId = caballoDto.NumeroId;
            NumeroFEN = caballoDto.NumeroFEN;
            EstadoFEN = caballoDto.EstadoFEN;
            Criador_ID = this.ValidateIntParamToEF(caballoDto.Criador_ID);
            Establecimiento_ID = this.ValidateIntParamToEF(caballoDto.Establecimiento_ID);
            EstadoProvincia_Id = this.ValidateIntParamToEF(caballoDto.EstadoProvincia_Id);
            Genero_ID = caballoDto.Genero_ID;
            Grupo_ID = this.ValidateIntParamToEF(caballoDto.Grupo_ID);
            OtrasMarcas_ID = this.ValidateIntParamToEF(caballoDto.OtrasMarcas_ID);
            Pedigree_ID = this.ValidateIntParamToEF(caballoDto.Pedigree_ID);
            Pelaje_ID = caballoDto.Pelaje_ID;
            PersonaACargo_ID = this.ValidateIntParamToEF(caballoDto.PersonaACargo_ID);
            Propietario_ID = this.ValidateIntParamToEF(caballoDto.Propietario_ID);
            Observaciones = caballoDto.Observaciones;
            Establo_ID = caballoDto.Establo_ID;
            Protector_ID = caballoDto.Protector_ID;
            NombrePropietario = caballoDto.NombrePropietario;
            Marcas = caballoDto.Marcas;
            Protector = caballoDto.Protector;
            GenealogiaCaballo = caballoDto.GenealogiaCaballo;
            CriadorCaballo = caballoDto.CriadorCaballo;
            ResponsableCaballo = caballoDto.ResponsableCaballo;
        }
    }
}
