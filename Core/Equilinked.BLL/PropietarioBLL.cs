using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class PropietarioBLL : BLLBase, IBase<Propietario>
    {

        public List<Propietario> GetAll()
        {
            return this._dbContext.Propietario.ToList();
        }

        public Propietario GetById(int id)
        {
            return this._dbContext.Propietario.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            try
            {
                Propietario entity = this._dbContext.Propietario.Find(id);
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

        public Propietario Insert(Propietario entity)
        {
            try
            {
                this._dbContext.Propietario.Add(entity);
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
