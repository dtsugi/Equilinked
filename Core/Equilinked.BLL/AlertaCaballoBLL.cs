using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class AlertaCaballoBLL : BLLBase, IBase<AlertaCaballo>
    {
        public List<AlertaCaballo> GetAll()
        {
            throw new NotImplementedException();
        }

        public AlertaCaballo GetById(int id)
        {
            throw new NotImplementedException();
        }

        public bool DeleteById(int id)
        {
            throw new NotImplementedException();
        }

        public AlertaCaballo Insert(AlertaCaballo entity)
        {
            try
            {
                this._dbContext.AlertaCaballo.Add(entity);
                this._dbContext.SaveChanges();
                return entity;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                return null;
            }
        }

        public bool DeleteByAlertaId(int alertaId)
        {
            _dbContext.AlertaCaballo.RemoveRange(this._dbContext.AlertaCaballo
                .Where(x => x.Alerta_ID == alertaId).ToList());
            _dbContext.SaveChanges();
            return true;

        }
    }
}
