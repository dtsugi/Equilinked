using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class EstabloBLL : BLLBase, IBase<Establo>
    {
        public List<Establo> GetAllEstablosByPropietarioId(int PropietarioId)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                return db.Establo
                    .Include("EstabloCaballo")
                    .Where(e => e.Propietario_ID == PropietarioId)
                    .OrderBy(e => e.Nombre)
                    .ToList();
            }
        }

        public bool DeleteById(int id)
        {
            throw new NotImplementedException();
        }

        public List<Establo> GetAll()
        {
            throw new NotImplementedException();
        }

        public Establo GetById(int id)
        {
            throw new NotImplementedException();
        }

        public Establo Insert(Establo entity)
        {
            this._dbContext.Establo.Add(entity);
            foreach(var establoCaballo in entity.EstabloCaballo)
            {
                establoCaballo.Establo_ID = entity.ID;
                this._dbContext.EstabloCaballo.Add(establoCaballo);
            }
            this._dbContext.SaveChanges();
            return entity;
        }
    }
}
