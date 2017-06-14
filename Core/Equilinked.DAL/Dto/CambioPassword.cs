using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.DAL.Dto
{
    public class CambioPassword
    {
        public string ContrasenaActual { get; set; }
        public string NuevaContrasena { get; set; }
        public bool StatusCambio { get; set; }
        public CambioPassword() { }
    }
}
