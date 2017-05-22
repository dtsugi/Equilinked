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

        public Grupo UpdateGrupo(int GrupoId, Grupo entity)
        {
            using (var db = this._dbContext)
            {
                String updateGrupo = "UPDATE Grupo SET Descripcion = @Descripcion WHERE ID = @Id";
                String deleteGrupoCaballo = "DELETE FROM GrupoCaballo WHERE ID = @Id";
                String insertGrupoCaballo = "INSERT INTO GrupoCaballo(Grupo_ID, Caballo_ID) VALUES(@GrupoId, @CaballoId)";

                List<GrupoCaballo> caballosByPropietario = db.GrupoCaballo
                    .Include("Caballo")
                    .Where(gc => gc.Grupo_ID == GrupoId)
                    .ToList();

                db.Database.ExecuteSqlCommand(updateGrupo,
                        new SqlParameter("Descripcion", entity.Descripcion),
                        new SqlParameter("Id", GrupoId));

                //Para eliminar los que ya quito el usuario
                foreach (GrupoCaballo gc in caballosByPropietario)
                {
                    Boolean encontrado = false;
                    foreach (Caballo c in entity.Caballo)
                    {
                        encontrado = c.ID == gc.Caballo_ID;
                        if (encontrado)
                        {
                            break;
                        }
                    }
                    if (!encontrado)
                    {
                        db.Database.ExecuteSqlCommand(deleteGrupoCaballo,
                            new SqlParameter("Id", gc.ID));
                    }
                }

                //Para agregar los nuevos
                foreach (Caballo c in entity.Caballo)
                {
                    Boolean encontrado = false;
                    foreach (GrupoCaballo gc in caballosByPropietario)
                    {
                        encontrado = c.ID == gc.Caballo_ID;
                        if (encontrado)
                        {
                            break;
                        }
                    }
                    if (!encontrado)
                    {
                        db.Database.ExecuteSqlCommand(insertGrupoCaballo,
                            new SqlParameter("GrupoId", GrupoId),
                            new SqlParameter("CaballoId", c.ID));
                    }
                }

            }
            return entity;
        }

        public List<GrupoCaballo> GetGrupoCaballosByGrupoId(int GrupoID)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                return db.GrupoCaballo
                    .Include("Caballo")
                    .Where(gc => gc.Grupo_ID == GrupoID)
                    .ToList();
            }
        }

        public List<Grupo> GetAllByPropietario(int PropietarioID)
        {
            using (var db = this._dbContext)
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
            using (var db = this._dbContext)
            {
                ICollection<Caballo> caballos = entity.Caballo;
                entity.Caballo = null;
                db.Grupo.Add(entity);
                db.SaveChanges();
                foreach (Caballo c in caballos)
                {

                    db.Database.ExecuteSqlCommand("INSERT INTO GrupoCaballo(Grupo_ID, Caballo_ID) VALUES(@GrupoId, @CaballoId)",
                        new SqlParameter("GrupoId", entity.ID),
                        new SqlParameter("CaballoId", c.ID));
                }

                return entity;
            }
        }

        public bool DeleteByCaballoId(int caballoId)
        {
            List<GrupoCaballo> listToRemove = this._dbContext.GrupoCaballo
                .Where(x => x.Caballo_ID == caballoId).ToList();
            if (listToRemove != null && listToRemove.Count > 0)
            {
                _dbContext.GrupoCaballo.RemoveRange(listToRemove);
                _dbContext.SaveChanges();
            }
            return true;
        }
    }
}
