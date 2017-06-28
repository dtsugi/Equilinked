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
                } else
                {
                    query = query.OrderBy(ag => ag.Alerta.FechaNotificacion);
                }

                return query.ToList();
            }
        }

        public void Insert(AlertaGrupo alertaGrupo)
        {
            using(var db = this._dbContext)
            {
                db.Alerta.Add(alertaGrupo.Alerta);

                foreach(AlertaCaballo alertaCaballo in alertaGrupo.Alerta.AlertaCaballo)
                {
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
                alerta.Titulo = alertaGrupo.Alerta.Titulo;
                alerta.Descripcion = alertaGrupo.Alerta.Descripcion;
                alerta.NombreProfesional = alertaGrupo.Alerta.NombreProfesional;
                alerta.FechaNotificacion = alertaGrupo.Alerta.FechaNotificacion;
                alerta.HoraNotificacion = alertaGrupo.Alerta.HoraNotificacion;
                alerta.Ubicacion = alertaGrupo.Alerta.Ubicacion;

                List<AlertaCaballo> alertasCaballosInsertar = new List<AlertaCaballo>();
                List<int> idsAlertasCaballosViejas = new List<int>(); //Detectamos los ids que ya venian
                foreach(AlertaCaballo ac in alertaGrupo.Alerta.AlertaCaballo)
                {
                    if(ac.ID == 0)
                    {
                        ac.Alerta_ID = alerta.ID;
                        alertasCaballosInsertar.Add(ac);
                    }
                    else
                    {
                        idsAlertasCaballosViejas.Add(ac.ID);
                    }
                }

                List<AlertaCaballo> alertasCaballosEliminar = db.AlertaCaballo
                    .Where(ac => ac.Alerta_ID == alerta.ID)
                    .Where(ac => !idsAlertasCaballosViejas.Contains(ac.ID))
                    .ToList(); //Consultar las alertas existentes que no se encuentran en los ids detectados

                db.AlertaCaballo.RemoveRange(alertasCaballosEliminar);
                db.AlertaCaballo.AddRange(alertasCaballosInsertar);

                db.SaveChanges();
            }
        }

        public void Delete(int alertaGrupoId)
        {
            using(var db = this._dbContext)
            {
                AlertaGrupo alertaGrupo = db.AlertaGrupo
                    .Where(ag => ag.ID == alertaGrupoId)
                    .FirstOrDefault();

                Alerta alerta = db.Alerta.Where(a => a.ID == alertaGrupo.Alerta_ID).FirstOrDefault();

                List<AlertaCaballo> alertasCaballos = db.AlertaCaballo
                    .Where(ac => ac.Alerta_ID == alertaGrupo.Alerta_ID).ToList();

                db.AlertaCaballo.RemoveRange(alertasCaballos);
                db.AlertaGrupo.Remove(alertaGrupo);
                db.Alerta.Remove(alerta);

                db.SaveChanges(); //Borramos todoo 
            }
        }

        public void DeleteAlertasByIds(int[] alertaGrupoIds)
        {
            using(var db = this._dbContext)
            {
                Dictionary<int, AlertaGrupo> mapAlertasGrupo = db.AlertaGrupo
                    .Where(ag => alertaGrupoIds.Contains(ag.ID))
                    .ToDictionary(ag => ag.Alerta_ID);

                List<int> idsAlertas = new List<int>(mapAlertasGrupo.Keys);

                List<AlertaGrupo> alertasGrupo = new List<AlertaGrupo>(mapAlertasGrupo.Values);
                List<AlertaCaballo> alertasCaballo = db.AlertaCaballo
                    .Where(ac => idsAlertas.Contains(ac.Alerta_ID)).ToList();
                List<Alerta> alertas = db.Alerta.Where(a => idsAlertas.Contains(a.ID)).ToList();

                db.AlertaCaballo.RemoveRange(alertasCaballo);
                db.AlertaGrupo.RemoveRange(alertasGrupo);
                db.Alerta.RemoveRange(alertas);

                db.SaveChanges();
            }
        }
    }
}
