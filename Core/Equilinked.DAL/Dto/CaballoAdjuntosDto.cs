using System.Collections.Generic;

namespace Equilinked.DAL.Dto
{
    public class CaballoAdjuntosDto
    {
        public FileDto Pedigree { get; set; }
        public List<FileDto> AdjuntosMarcas { get; set; }

        public CaballoAdjuntosDto()
        {
            AdjuntosMarcas = new List<FileDto>();
        }
    }
}
