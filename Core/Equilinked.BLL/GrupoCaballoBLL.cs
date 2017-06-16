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
                db.Configuration.LazyLoadingEnabled = false;
                    
                Grupo grupoo = db.Grupo //Actualizamos el grupo
                    .Where(g => g.ID == GrupoId).FirstOrDefault();
                grupoo.Descripcion = entity.Descripcion;

                List<int> idsCaballosAct = new List<int>(); // los ids actuales
                List<int> idsCaballosMod = new List<int>(); //los nuevo ids
                foreach (var c in entity.Caballo)
                {
                    idsCaballosMod.Add(c.ID);
                }

                foreach(var c in db.GrupoCaballo.Where(gc => gc.Grupo_ID == grupoo.ID).ToList())
                {
                    idsCaballosAct.Add(c.Caballo_ID);
                }

                List<Caballo> caballosNuevos = db.Caballo.Where(c =>
                c.Propietario_ID == grupoo.Propietario_ID &&
                !idsCaballosAct.Contains(c.ID) &&
                idsCaballosMod.Contains(c.ID)
                 ).ToList();

                if(caballosNuevos != null && caballosNuevos.Count() > 0)
                {
                    GrupoCaballo gcc;
                    foreach(var c in caballosNuevos) //Agregamos los nuevos
                    {
                        gcc = new GrupoCaballo();
                        gcc.Caballo_ID = c.ID;
                        gcc.Grupo_ID = grupoo.ID;
                        db.GrupoCaballo.Add(gcc);
                    }
                }

                List<GrupoCaballo> caballosEliminar = db.GrupoCaballo
                    .Where(gc => gc.Grupo_ID == grupoo.ID && !idsCaballosMod.Contains(gc.Caballo_ID))
                    .ToList();

                if(caballosEliminar != null && caballosEliminar.Count() > 0)
                {
                    db.GrupoCaballo.RemoveRange(caballosEliminar);//Eliminamos los que no están
                }
                db.SaveChanges();
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
                //Mandamos a validar lo del grupo por default "Todos mis caballos"
                db.Database.ExecuteSqlCommand("EXECUTE ValidarGrupoDefaultPropietario @PropietarioId",
                    new SqlParameter("PropietarioId", PropietarioID));

                //Listamos los grupos
                return db.Grupo
                    .Include("GrupoCaballo")
                    .Where(g => g.Propietario_ID == PropietarioID)
                    .OrderBy(g => g.Descripcion)
                    .ToList(); //1.3 Listar todos los grupos
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
                db.Grupo.Add(entity);
                foreach(var gc in entity.GrupoCaballo)
                {
                    gc.Grupo_ID = entity.ID;
                    db.GrupoCaballo.Add(gc);
                }
                db.SaveChanges();
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
