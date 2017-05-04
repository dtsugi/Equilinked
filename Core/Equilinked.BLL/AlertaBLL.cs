using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class AlertaBLL : BLLBase, IBase<Alerta>
    {

        public List<Alerta> GetAllByPropietario(int propietarioId)
        {            
                return null;
        }

        public Alerta GetById(int id)
        {
            return this._dbContext.Alerta.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            try
            {
                Alerta entity = this._dbContext.Alerta.Find(id);
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

        public Alerta Insert(Alerta entity)
        {
            try
            {
                this._dbContext.Alerta.Add(entity);
                this._dbContext.SaveChanges();
                return entity;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                return null;
            }
        }


        public List<Alerta> GetAll()
        {
            throw new NotImplementedException();
        }
    }
}
