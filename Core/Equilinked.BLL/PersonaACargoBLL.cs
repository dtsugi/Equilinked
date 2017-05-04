using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class PersonaACargoBLL : BLLBase, IBase<PersonaACargo>
    {

        public List<PersonaACargo> GetAll()
        {
            return this._dbContext.PersonaACargo.ToList();
        }

        public PersonaACargo GetById(int id)
        {
            return this._dbContext.PersonaACargo.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            try
            {
                PersonaACargo entity = this._dbContext.PersonaACargo.Find(id);
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

        public PersonaACargo Insert(PersonaACargo entity)
        {
            try
            {
                this._dbContext.PersonaACargo.Add(entity);
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
