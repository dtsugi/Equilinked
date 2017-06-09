using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class TipoNumeroBLL : BLLBase, IBase<Tipo_Numero>
    {
        public bool DeleteById(int id)
        {
            throw new NotImplementedException();
        }

        public List<Tipo_Numero> GetAll()
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                return db.Tipo_Numero
                    .Where(tn => tn.Descripcion != null)
                    .OrderBy(tn => tn.Descripcion)
                    .ToList();
            }
        }

        public Tipo_Numero GetById(int id)
        {
            throw new NotImplementedException();
        }

        public Tipo_Numero Insert(Tipo_Numero entity)
        {
            throw new NotImplementedException();
        }
    }
}
