using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.DAL.Dto
{
    public class CuentaEliminacion
    {
        public CuentaEliminacion() { }

        public string Correo { set; get; }
        public string Password { set; get; }
        public bool Status { set; get; }
    }
}
