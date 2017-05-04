using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class PaisBLL : BLLBase, IBase<Pais>
    {

        public List<Pais> GetAll()
        {
            return this._dbContext.Pais.ToList();
        }

        public Pais GetById(int id)
        {
            return this._dbContext.Pais.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            try
            {
                Pais entity = this._dbContext.Pais.Find(id);
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

        public Pais Insert(Pais entity)
        {
            try
            {
                this._dbContext.Pais.Add(entity);
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