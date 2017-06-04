using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.Utils
{
    public class EquilinkedEnums
    {
        public enum TipoAlertasEnum
        {
            HERRAJE = 1,
            DESPARACITACION = 2,
            EVENTOS = 3,
            DENTISTA = 4,
            NOTASVARIAS = 5
        }

        public enum FilterAlertaEnum
        {
            ALL = 1,
            HISTORY = 2,
            NEXT = 3
        }
    }
}
