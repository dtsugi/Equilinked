using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class AlimentacionBLL : BLLBase, IBase<Alimentacion>
    {

        public List<Alimentacion> GetAll()
        {
            return this._dbContext.Alimentacion.ToList();
        }

        public Alimentacion GetById(int id)
        {
            return this._dbContext.Alimentacion.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            try
            {
                Alimentacion entity = this._dbContext.Alimentacion.Find(id);
                this._dbContext.Entry(entity).State = EntityState.Modified;
                this._dbContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                return false;
            }

        }

        public Alimentacion Insert(Alimentacion entity)
        {
            try
            {
                this._dbContext.Alimentacion.Add(entity);
                this._dbContext.SaveChanges();
                return entity;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                return null;
            }
        }
    }
}
