using Equilinked.DAL.Models;
using Equilinked.Utils;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class AlertaGrupoBLL : BLLBase
    {

        public AlertaGrupo GetAlertaGrupo(int grupoId, int alertaGrupoId)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                AlertaGrupo alertaGrupo = db.AlertaGrupo
                    .Include("Alerta")
                    .Where(ag => ag.ID == alertaGrupoId)
                    .FirstOrDefault();//Traemos la alerta

                if (alertaGrupo != null)
                {                    //Obtemos los caballos del grupo
                    Dictionary<int, GrupoCaballo> caballosGrupo = db.GrupoCaballo.Where(gc => gc.Grupo_ID == grupoId).ToDictionary(gc => gc.Caballo_ID);
                    List<int> keysCaballos = new List<int>(caballosGrupo.Keys);

                    List<AlertaCaballo> caballos = db.AlertaCaballo
                        .Where(ac => ac.Alerta_ID == alertaGrupo.Alerta_ID)
                        .Where(ac => keysCaballos.Contains(ac.Caballo_ID))
                        .ToList();
                    alertaGrupo.AllCaballos = caballos.Count() == keysCaballos.Count(); //Estan todos los caballos?

                    alertaGrupo.Alerta.AlertaCaballo = caballos;
                }

                return alertaGrupo;
            }
        }

        public List<AlertaGrupo> GetAllAlertaGrupo(int grupoId, int tipoAlerta, int filtroAlerta, DateTime fecha)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                var query = db.AlertaGrupo
                   .Include("Alerta")
                   .Where(ag => ag.Grupo_ID == grupoId);

                if(tipoAlerta > 0) //de tipo x
                {
                    query = query.Where(ag => ag.Alerta.Tipo == tipoAlerta);
                }

                if (filtroAlerta == 2)//history
                {
                    query = query.Where(ag => ag.Alerta.FechaNotificacion < fecha)
                        .OrderByDescending(ag => ag.Alerta.FechaNotificacion);
                }
                else if(filtroAlerta == 3)//next
                {
                    query = query.Where(ag => ag.Alerta.FechaNotificacion > fecha)
                        .OrderBy(ag => ag.Alerta.FechaNotificacion);
                }

                return query.ToList();
            }
        }

        public void Insert(AlertaGrupo alertaGrupo)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                List<GrupoCaballo> caballos = db.GrupoCaballo
                    .Where(gc => gc.Grupo_ID == alertaGrupo.Grupo_ID)
                    .ToList();

                db.Alerta.Add(alertaGrupo.Alerta);

                AlertaCaballo alertaCaballo;
                foreach(GrupoCaballo gc in caballos)
                {
                    alertaCaballo = new AlertaCaballo();
                    alertaCaballo.Caballo_ID = gc.Caballo_ID;
                    alertaCaballo.Alerta_ID = alertaGrupo.Alerta.ID;

                    db.AlertaCaballo.Add(alertaCaballo);
                }

                alertaGrupo.ID = alertaGrupo.Alerta.ID;
                alertaGrupo.Alerta = null;
                db.AlertaGrupo.Add(alertaGrupo);

                db.SaveChanges();
            }
        }

        public void Update(AlertaGrupo alertaGrupo)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Alerta alerta = db.Alerta.Where(a => a.ID == alertaGrupo.Alerta.ID).FirstOrDefault();
                alerta.NombreProfesional = alertaGrupo.Alerta.NombreProfesional;
                alerta.FechaNotificacion = alertaGrupo.Alerta.FechaNotificacion;
                alerta.HoraNotificacion = alertaGrupo.Alerta.HoraNotificacion;
                alerta.Descripcion = alertaGrupo.Alerta.Descripcion;

                db.SaveChanges();
            }
        }
    }
}
