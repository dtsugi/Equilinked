using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class PreguntaFrecuenteBLL : BLLBase, IBase<PreguntaFrecuente>
    {
        public bool DeleteById(int id)
        {
            throw new NotImplementedException();
        }

        public List<PreguntaFrecuente> GetAll()
        {
            return this._dbContext.PreguntaFrecuente.OrderBy(pf => pf.Orden).ToList();
        }

        public PreguntaFrecuente GetById(int id)
        {
            throw new NotImplementedException();
        }

        public PreguntaFrecuente Insert(PreguntaFrecuente entity)
        {
            throw new NotImplementedException();
        }
    }
}
