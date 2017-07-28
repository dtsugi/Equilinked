using Equilinked.DAL.Dto;
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

        public List<Grupo> GetAllGruposByPropietarioId(int propietarioId)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                db.Database.ExecuteSqlCommand("EXECUTE ValidarGrupoDefaultPropietario @PropietarioId",
                    new SqlParameter("PropietarioId", propietarioId));

                return db.Grupo
                    .Where(g => g.Propietario_ID == propietarioId)
                    .OrderBy(g => g.Descripcion)
                    .ToList();
            }
        }

        public List<CaballoDto> GetCaballosByGruposIds(int propietarioId, int[] gruposIds)
        {
            List<CaballoDto> caballos = new List<CaballoDto>();
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                List<int> idsCaballos = new List<int>();
                Dictionary<int, Establo> mapEstablos = db.Establo
                    .Where(e => e.Propietario_ID == propietarioId)
                    .ToDictionary(e => e.ID);

                List<int> caballosIds = db.GrupoCaballo.Where(gc => gruposIds.Contains(gc.Grupo_ID))
                    .Select(gc => gc.Caballo_ID).Distinct().ToList();

                List<Caballo> caballoos = db.Caballo.Where(c => caballosIds.Contains(c.ID)).ToList();
                Establo establo;
                foreach (Caballo caballo in caballoos)
                {
                    if (caballo.Establo_ID != null)
                    {
                        if (mapEstablos.TryGetValue(caballo.Establo_ID.Value, out establo))
                        {
                            caballo.Establo = establo;
                        }
                    }
                    caballos.Add(new CaballoDto(caballo));
                }
            }

            return caballos;
        }

        public Grupo GetGrupoById(int grupoId)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                return db.Grupo
                    .Include("GrupoCaballo")
                    .Where(g => g.ID == grupoId)
                    .FirstOrDefault();
            }
        }

        public Grupo UpdateGrupo(int GrupoId, Grupo entity)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                    
                Grupo grupoo = db.Grupo //Actualizamos el grupo
                    .Where(g => g.ID == GrupoId).FirstOrDefault();
                grupoo.Descripcion = entity.Descripcion;

                List<int> idsExistentes = new List<int>();
                List<GrupoCaballo> insertar = new List<GrupoCaballo>(); //lista de los nuevos
                foreach(var gc in entity.GrupoCaballo)
                {
                    if(gc.ID == 0)
                    {
                        gc.Grupo_ID = GrupoId;
                        insertar.Add(gc);
                    }
                    else
                    {
                        idsExistentes.Add(gc.ID);
                    }
                }

                List<GrupoCaballo> eliminar = db.GrupoCaballo //lista de las asignaciones por eliminar
                    .Where(gc => gc.Grupo_ID == GrupoId)
                    .Where(gc => !idsExistentes.Contains(gc.ID))
                    .ToList();

                db.GrupoCaballo.AddRange(insertar);
                db.GrupoCaballo.RemoveRange(eliminar);

                db.SaveChanges();
            }
            return entity;
        }

        public List<CaballoDto> GetGrupoCaballosByGrupoId(int GrupoID)
        {
            List<CaballoDto> caballosDtos = new List<CaballoDto>();
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Dictionary<int, GrupoCaballo> mapGrupoCaballos = db.GrupoCaballo
                    .Where(gc => gc.Grupo_ID == GrupoID).ToDictionary(gc => gc.Caballo_ID);
                List<int> caballosIds = new List<int>(mapGrupoCaballos.Keys);
                Grupo grupo = db.Grupo.Where(g => g.ID == GrupoID).FirstOrDefault();
                Dictionary<int, Establo> mapEstablos = db.Establo.Where(e => e.Propietario_ID == grupo.Propietario_ID)
                    .ToDictionary(e => e.ID);

                List<Caballo> caballos = db.Caballo
                    .Include("GenealogiaCaballo")
                    .Include("CriadorCaballo")
                    .Include("ResponsableCaballo")
                    .Include("Genero")
                    .Include("Pelaje")
                    .Include("Protector")
                    .Where(c => caballosIds.Contains(c.ID))
                    .ToList();

                Establo est = null;
                foreach(var c in caballos)
                {
                    if(c.Establo_ID != null)
                    {
                        mapEstablos.TryGetValue(c.Establo_ID.Value, out est);
                    }
                    c.Establo = est;
                    caballosDtos.Add(new CaballoDto(c));
                }

                return caballosDtos;
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
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Grupo grupo = db.Grupo
                    .Include("GrupoCaballo")
                    .Include("AlertaGrupo")
                    .Where(g => g.ID == id)
                    .FirstOrDefault();

                db.AlertaGrupo.RemoveRange(grupo.AlertaGrupo);
                db.GrupoCaballo.RemoveRange(grupo.GrupoCaballo);
                db.Grupo.Remove(grupo);

                db.SaveChanges();
                return true;
            }
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

        public void DeleteGrupoCaballoByIds(int grupoId, int[] caballosIds)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                List<GrupoCaballo> caballosGrupo = db.GrupoCaballo
                    .Where(gc => gc.Grupo_ID == grupoId && caballosIds.Contains(gc.Caballo_ID))
                    .ToList();

                db.GrupoCaballo.RemoveRange(caballosGrupo);
                db.SaveChanges();
            }
        }
    }
}
