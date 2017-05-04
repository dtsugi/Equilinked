using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class GeneroBLL : BLLBase, IBase<Genero>
    {

        public List<Genero> GetAll()
        {
            return this._dbContext.Genero.ToList();
        }

        public Genero GetById(int id)
        {
            return this._dbContext.Genero.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            try
            {
                Genero entity = this._dbContext.Genero.Find(id);
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

        public Genero Insert(Genero entity)
        {
            try
            {
                this._dbContext.Genero.Add(entity);
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
