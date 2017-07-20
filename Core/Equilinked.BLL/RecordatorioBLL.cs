using Equilinked.DAL.Models;
using System.Collections.Generic;
using System.Linq;

namespace Equilinked.BLL
{
    public class RecordatorioBLL : BLLBase
    {
        public List<Recordatorio> GetAllRecordatorios()
        {
            return this._dbContext.Recordatorio.ToList();
        }

        public List<UnidadTiempo> GetAllUnidadesTiempo()
        {
            return this._dbContext.UnidadTiempo.ToList();
        }
    }
}
