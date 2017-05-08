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
        public Alerta GetById(int id)
        {
            return this._dbContext.Alerta.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            try
            {
                Alerta entity = this._dbContext.Alerta.Find(id);
                if (entity != null)
                {
                    if (new AlertaCaballoBLL().DeleteByAlertaId(entity.ID))
                    {
                        this._dbContext.Alerta.Remove(entity);
                        //this._dbContext.Entry(entity).State = EntityState.Deleted;
                        this._dbContext.SaveChanges();
                        return true;
                    }
                    else
                        return false;
                }
                else
                    return false;
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

        public List<sp_GetAlertasByPropietarioId_Result> GetAllByPropietario(int propietarioId, bool filterByFuture)
        {
            if (filterByFuture)
            {
                return this._dbContext.sp_GetAlertasByPropietarioId(propietarioId)
                    .Where(x => x.DiffEnDias > 0)
                    .ToList();
            }
            else
            {
                return this._dbContext.sp_GetAlertasByPropietarioId(propietarioId)
                   .Where(x => x.DiffEnDias == 0)
                   .ToList();
            }
        }
    }
}
