using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Equilinked.BLL
{
    public class InvitacionBLL : BLLBase, IBase<InvitacionAmigo>
    {
        public InvitacionAmigo Insert(InvitacionAmigo entity)
        {
            using(var db = this._dbContext)
            {
                entity.FechaEnvio = DateTime.Now;
                db.InvitacionAmigo.Add(entity);
                db.SaveChanges();
                return entity;
            }
        }

        public bool DeleteById(int id)
        {
            throw new NotImplementedException();
        }

        public List<InvitacionAmigo> GetAll()
        {
            throw new NotImplementedException();
        }

        public InvitacionAmigo GetById(int id)
        {
            throw new NotImplementedException();
        }
    }
}
