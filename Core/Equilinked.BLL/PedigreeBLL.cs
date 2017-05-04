using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class PedigreeBLL : BLLBase, IBase<Pedigree>
    {

        public List<Pedigree> GetAll()
        {
            return this._dbContext.Pedigree.ToList();
        }

        public Pedigree GetById(int id)
        {
            return this._dbContext.Pedigree.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            try
            {
                Pedigree entity = this._dbContext.Pedigree.Find(id);
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

        public Pedigree Insert(Pedigree entity)
        {
            try
            {
                this._dbContext.Pedigree.Add(entity);
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
