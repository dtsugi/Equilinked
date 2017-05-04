using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class PelajeBLL : BLLBase, IBase<Pelaje>
    {

        public List<Pelaje> GetAll()
        {
            return this._dbContext.Pelaje.ToList();
        }

        public Pelaje GetById(int id)
        {
            return this._dbContext.Pelaje.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            try
            {
                Pelaje entity = this._dbContext.Pelaje.Find(id);
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

        public Pelaje Insert(Pelaje entity)
        {
            try
            {
                this._dbContext.Pelaje.Add(entity);
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
