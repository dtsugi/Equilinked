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
            Alimentacion entity = this._dbContext.Alimentacion.Find(id);
            this._dbContext.Entry(entity).State = EntityState.Deleted;
            this._dbContext.SaveChanges();
            return true;
        }

        public Alimentacion Insert(Alimentacion entity)
        {
            this._dbContext.Alimentacion.Add(entity);
            this._dbContext.SaveChanges();
            return entity;
        }

        public Alimentacion Update(Alimentacion entity)
        {
            this._dbContext.Entry(entity).State = EntityState.Modified;
            this._dbContext.SaveChanges();
            return entity;
        }
        public Alimentacion GetByCaballoId(int idCaballo)
        {
            return this._dbContext.Alimentacion.Where(x => x.Caballo_ID == idCaballo).FirstOrDefault();
        }

        public bool DeleteByCaballoId(int caballoId)
        {
            Alimentacion entity = this._dbContext.Alimentacion.Where(x => x.Caballo_ID == caballoId).FirstOrDefault();
            if (entity != null)
            {
                this._dbContext.Entry(entity).State = EntityState.Deleted;
                this._dbContext.SaveChanges();
            }
            return true;
        }
    }
}
