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

        public void DeleteAlertasGrupoByIds(int grupoId, int[] alertasIds)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Dictionary<int, AlertaRecordatorio> mapRecordatoriosAlerta = db.AlertaRecordatorio
                    .Where(ar => alertasIds.Contains(ar.Alerta_ID)).ToDictionary(ar => ar.Alerta_ID);

                List<int> caballosGrupoIds = db.GrupoCaballo.Where(gc => gc.Grupo_ID == grupoId)
                    .Select(cg => cg.Caballo_ID).ToList();

                //se obtienen las alertas
                Dictionary<int, Alerta> mapAlertas = db.Alerta.Where(a => alertasIds.Contains(a.ID)).ToDictionary(a => a.ID);
                //se obtienen las alertas de todos los caballos y solo las de caballos del grupo
                List<AlertaCaballo> alertasCaballos = db.AlertaCaballo.Where(ac => alertasIds.Contains(ac.Alerta_ID)).ToList();
                List<AlertaCaballo> alertasCaballosGrupo = db.AlertaCaballo
                    .Where(ac => alertasIds.Contains(ac.Alerta_ID) && caballosGrupoIds.Contains(ac.Caballo_ID)).ToList();
                Dictionary<int, List<AlertaCaballo>> mapAlertasCaballos = new Dictionary<int, List<AlertaCaballo>>();
                foreach(var ac in alertasCaballosGrupo)
                {
                    List<AlertaCaballo> acss;
                    if(!mapAlertasCaballos.ContainsKey(ac.Alerta_ID))
                    {
                        mapAlertasCaballos.Add(ac.Alerta_ID, new List<AlertaCaballo>());
                    }
                    if (mapAlertasCaballos.TryGetValue(ac.Alerta_ID, out acss)){
                        acss.Add(ac);
                    }
                }

                List<AlertaGrupo> alertasGrupos = db.AlertaGrupo.Where(ag => alertasIds.Contains(ag.Alerta_ID)).ToList();
                Dictionary<int, AlertaGrupo> mapAlertasGrupo = db.AlertaGrupo
                    .Where(ag => ag.Grupo_ID == grupoId && alertasIds.Contains(ag.Alerta_ID)).ToDictionary(ag => ag.Alerta_ID);

                Alerta alerta;
                foreach (var ag in alertasGrupos)
                {
                    if (mapAlertas.TryGetValue(ag.Alerta_ID, out alerta))
                    {
                        alerta.AlertaGrupo.Add(ag);
                    }
                }

                foreach (var ac in alertasCaballos)
                {
                    if (mapAlertas.TryGetValue(ac.Alerta_ID, out alerta))
                    {
                        alerta.AlertaCaballo.Add(ac);
                    }
                }
                List<Alerta> alertas = new List<Alerta>(mapAlertas.Values);
                foreach (var a in alertas)
                {
                    AlertaGrupo ag;
                    if(mapAlertasGrupo.TryGetValue(a.ID, out ag))
                    {
                        db.AlertaGrupo.Remove(ag);//Elimine la asociacion de alerta con el grupo
                    }
                    List<AlertaCaballo> acs;
                    if (mapAlertasCaballos.TryGetValue(a.ID, out acs)) {
                        db.AlertaCaballo.RemoveRange(acs); //Elimine todas las asociaciones de caballos del grupo
                    }
                    if(acs == null)
                    {
                        acs = new List<AlertaCaballo>();
                    }
                    if(a.AlertaCaballo.Count() == acs.Count() && a.AlertaGrupo.Count() == 0)//Si elimine todas las asociaiones entones elimino la alerta
                    {
                        a.AlertaGrupo = null;
                        a.AlertaCaballo = null;
                        AlertaRecordatorio recordatorio;
                        if (mapRecordatoriosAlerta.TryGetValue(a.ID, out recordatorio)) {
                            db.AlertaRecordatorio.Remove(recordatorio);
                        }
                        db.Alerta.Remove(a);
                    }
                }
                db.SaveChanges();
            }
        }

        public List<Alerta> GetAlertasByGrupo(int propietarioId, int grupoId, int tipoAlerta, int filtroAlerta, DateTime fecha, int orden, int limite)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Dictionary<int, int> mapAlertasGrupo = db.AlertaGrupo
                    .Where(ag => ag.Grupo_ID == grupoId).ToDictionary(ag => ag.Alerta_ID, ag => ag.Grupo_ID);
                List<int> alertasGruposIds = new List<int>(mapAlertasGrupo.Keys);

                var query = db.Alerta
                    .Where(a => a.Propietario_ID == propietarioId && alertasGruposIds.Contains(a.ID));

                if (tipoAlerta > 0) //de tipo x
                {
                    query = query.Where(a => a.Tipo == tipoAlerta);
                }

                if (filtroAlerta == (int)EquilinkedEnums.FilterAlertaEnum.HISTORY)//history
                {
                    query = query.Where(a => a.FechaNotificacion < fecha);
                }
                else if (filtroAlerta == (int)EquilinkedEnums.FilterAlertaEnum.NEXT || filtroAlerta == (int)EquilinkedEnums.FilterAlertaEnum.AFTER_TODAY)//next
                {
                    if (filtroAlerta == (int)EquilinkedEnums.FilterAlertaEnum.AFTER_TODAY) //Despues de la fecha (sin considerar la fecha)
                    {
                        fecha = fecha.AddDays(1);
                    }
                    query = query.Where(a => a.FechaNotificacion > fecha);
                }
                else if (filtroAlerta == (int)EquilinkedEnums.FilterAlertaEnum.TODAY) //Hoy
                {
                    query = query
                        .Where(a => a.FechaNotificacion.Day == fecha.Day)
                        .Where(a => a.FechaNotificacion.Month == fecha.Month)
                        .Where(a => a.FechaNotificacion.Year == fecha.Year);
                }
                if (limite > 0)
                {
                    query = query.Take(limite);
                }
                if (orden == (int)EquilinkedEnums.OrdenamientoEnum.ASCENDENTE)
                {
                    query = query.OrderBy(a => a.FechaNotificacion);
                }
                else if (orden == (int)EquilinkedEnums.OrdenamientoEnum.DESCENDENTE)
                {
                    query = query.OrderByDescending(a => a.FechaNotificacion);
                }

                return query.ToList();
            }
        }


        public Alerta GetAlertaGrupo(int grupoId, int alertaId)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Alerta alerta = db.Alerta
                    .Where(a => a.ID == alertaId)
                    .FirstOrDefault();//Traemos la alerta
                List<AlertaCaballo> alertasCaballos = db.AlertaCaballo.Where(ac => ac.Alerta_ID == alertaId).ToList();
                alerta.AlertaCaballo = alertasCaballos;
                
                if (alerta != null)
                {                   
                    Dictionary<int, GrupoCaballo> caballosGrupo = db.GrupoCaballo.Where(gc => gc.Grupo_ID == grupoId).ToDictionary(gc => gc.Caballo_ID);
                    List<int> keysCaballos = new List<int>(caballosGrupo.Keys); //Caballos del grupo

                    List<AlertaCaballo> caballos = db.AlertaCaballo
                        .Where(ac => ac.Alerta_ID == alertaId)
                        .Where(ac => keysCaballos.Contains(ac.Caballo_ID))
                        .ToList();
                    alerta.AllCaballos = caballos.Count() == keysCaballos.Count(); //Estan todos los caballos?
                }

                return alerta;
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
