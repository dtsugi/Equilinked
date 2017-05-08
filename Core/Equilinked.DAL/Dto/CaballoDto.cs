using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.DAL.Dto
{

    public class CaballoDto
    {
        public int ID { get; set; }
        public string Nombre { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public string NumeroChip { get; set; }
        public int? NumeroFEI { get; set; }
        public bool EstadoFEI { get; set; }
        public string Protector { get; set; }
        public string Embocadura { get; set; }
        public string ExtrasDeCabezada { get; set; }
        public string Agrupamiento { get; set; }
        public string NumeroId { get; set; }
        public int? NumeroFEN { get; set; }
        public bool EstadoFEN { get; set; }
        public bool? ADN { get; set; }
        //public GeneroDTO Genero { get; set; }
        //public PelajeDTO Pelaje { get; set; }
        //public EstadoProvinciaDTO EstadoProvincia { get; set; }
        //public GrupoDTO Grupo { get; set; }
        //public PedigreeDTO Pedigree { get; set; }
        //public PropietarioDTO Propietario { get; set; }
        //public CriadorDTO Criador { get; set; }
        //public OtrasMarcasDTO OtrasMarcas { get; set; }
        //public EstablecimientoDTO Establecimiento { get; set; }
        //public string Alimentacion { get; set; }
        //public PersonaACargoDTO PersonaACargo { get; set; }


        public CaballoDto() { }

        public CaballoDto(Caballo caballo)
        {
            ID = caballo.ID;
            Nombre = caballo.Nombre;
            FechaNacimiento = caballo.FechaNacimiento;
            NumeroChip = caballo.NumeroChip;
            NumeroFEI = caballo.NumeroFEI;
            EstadoFEI = caballo.EstadoFEI.Value;
            NumeroFEN = caballo.NumeroFEN;
            NumeroId = caballo.NumeroId;
            EstadoFEN = caballo.EstadoFEN.Value;
            Protector = caballo.Protector;
            Embocadura = caballo.Embocadura;
            ExtrasDeCabezada = caballo.ExtrasDeCabezada;
            ADN = caballo.ADN;
        }
    }
}