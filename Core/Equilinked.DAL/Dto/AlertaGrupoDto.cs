using Equilinked.DAL.Models;
using System;

namespace Equilinked.DAL.Dto
{
    public class AlertaGrupoDto : AlertaGrupo
    {
    }
}

namespace Equilinked.DAL.Models
{
    public partial class AlertaGrupo
    {
        public Nullable<bool> AllCaballos { get; set; }

        public AlertaGrupo() {
            
        }
    }
}
