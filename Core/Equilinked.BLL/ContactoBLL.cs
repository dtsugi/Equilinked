using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Equilinked.BLL
{
    public class ContactoBLL : BLLBase, IBase<MensajeContacto>
    {

        public List<MotivoContacto> listAllMotivoContacto()
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                return db.MotivoContacto.OrderBy(mc => mc.ID).ToList();
            }
        }

        public MensajeContacto Insert(MensajeContacto entity)
        {
            using(var db = this._dbContext)
            {
                entity.Fecha = DateTime.Now;
                db.MensajeContacto.Add(entity);
                db.SaveChanges();
                return entity;
            }
        }

        public bool DeleteById(int id)
        {
            throw new NotImplementedException();
        }

        public List<MensajeContacto> GetAll()
        {
            throw new NotImplementedException();
        }

        public MensajeContacto GetById(int id)
        {
            throw new NotImplementedException();
        }

        
    }
}
