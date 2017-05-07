using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class GrupoCaballoBLL : BLLBase, IBase<Grupo>
    {
        public List<Grupo> GetAllByPropietario(int PropietarioID)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                return db.Grupo
                    .Include("GrupoCaballo")
                    .Where(g => g.Propietario_ID == PropietarioID)
                    .OrderBy(g => g.Descripcion)
                    .ToList();
            }
            
        }

        public List<Caballo> GetAllCaballosByPropietario(int PropietarioID)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                return db.Caballo
                    .Where(c => c.Propietario_ID == PropietarioID)
                    .OrderBy(c => c.Nombre)
                    .ToList();
            }
        }

        public Propietario GetPropietarioByUser(string user)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                return db.Propietario
                    .Include("Usuario")
                    .Where(p => p.Usuario.Login == user)
                    .First();
            }
        }

        public bool DeleteById(int id)
        {
            throw new NotImplementedException();
        }

        public List<Grupo> GetAll()
        {
            throw new NotImplementedException();
        }

        public Grupo GetById(int id)
        {
            throw new NotImplementedException();
        }

        public Grupo Insert(Grupo entity)
        {
            GrupoCaballo gc;
            using (var db = this._dbContext)
            {
                ICollection<Caballo> caballos = entity.Caballo;
                entity.Caballo = null;
                db.Grupo.Add(entity);
                db.SaveChanges();
                foreach (Caballo c in caballos)
                {
                    
                    db.Database.ExecuteSqlCommand("INSERT INTO GrupoCaballo(Grupo_ID, Caballo_ID) VALUES(@GrupoId, @CaballoId)",
                        new SqlParameter("GrupoId",entity.ID),
                        new SqlParameter("CaballoId", c.ID));
                }
                
                return entity;
            }
        }
    }
}
