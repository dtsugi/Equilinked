using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System.Collections.Generic;

namespace Equilinked.DAL.Dto
{
    public class EstabloDto
    {
        public int ID { get; set; }
        public string Nombre { get; set; }
        public string Manager { get; set; }
        public string Direccion { get; set; }
        public int Propietario_ID { get; set; }
        public ICollection<EstabloTelefono> EstabloTelefono { get; set; }
        public ICollection<EstabloCorreo> EstabloCorreo { get; set; }

        public EstabloDto(Establo establo)
        {
            ID = establo.ID;
            Nombre = establo.Nombre;
            Manager = establo.Manager;
            Direccion = establo.Direccion;
            Propietario_ID = establo.Propietario_ID;
            EstabloTelefono = establo.EstabloTelefono;
            EstabloCorreo = establo.EstabloCorreo;
        }
    }
}

namespace Equilinked.DAL.Models
{
    public partial class Establo
    {
        public ICollection<Caballo> Caballo { get; set; }

        public Establo(EstabloDto establoDto)
        {
            ID = establoDto.ID;
            Nombre = establoDto.Nombre;
            Manager = establoDto.Manager;
            Direccion = establoDto.Direccion;
            Propietario_ID = establoDto.Propietario_ID;
            EstabloTelefono = establoDto.EstabloTelefono;
            EstabloCorreo = establoDto.EstabloCorreo;
        }
    }
}