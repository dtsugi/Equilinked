using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using Equilinked.Utils;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Equilinked.BLL
{
    public class AlertaCaballoBLL : BLLBase
    {
        public void DeleteAlertasCaballosByIds(int caballoId, int[] alertasIds)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                Dictionary<int, AlertaRecordatorio> mapRecordatoriosAlerta = db.AlertaRecordatorio
                    .Where(ar => alertasIds.Contains(ar.Alerta_ID)).ToDictionary(ar => ar.Alerta_ID);

                Dictionary<int, Alerta> mapAlertas = db.Alerta.Where(a => alertasIds.Contains(a.ID)).ToDictionary(a => a.ID);
                List<AlertaGrupo> alertasGrupos = db.AlertaGrupo.Where(ag => alertasIds.Contains(ag.Alerta_ID)).ToList();
                List<AlertaCaballo> alertasCaballos = db.AlertaCaballo.Where(ac => alertasIds.Contains(ac.Alerta_ID)).ToList();
                Dictionary<int, AlertaCaballo> mapAlertaCaballo = db.AlertaCaballo.Where(ac => ac.Caballo_ID == caballoId && alertasIds.Contains(ac.Alerta_ID))
                    .ToDictionary(ac => ac.Alerta_ID);

                Alerta alerta;
                foreach(var ag in alertasGrupos)
                {
                    if(mapAlertas.TryGetValue(ag.Alerta_ID, out alerta))
                    {
                        alerta.AlertaGrupo.Add(ag);
                    }
                }

                foreach(var ac in alertasCaballos)
                {
                    if(mapAlertas.TryGetValue(ac.Alerta_ID, out alerta))
                    {
                        alerta.AlertaCaballo.Add(ac);
                    }
                }
                List<Alerta> alertas = new List<Alerta>(mapAlertas.Values);
                foreach(var a in alertas)
                {
                    AlertaCaballo ac;
                    if (mapAlertaCaballo.TryGetValue(a.ID, out ac))
                    {
                        db.AlertaCaballo.Remove(ac);//Elimino la asociacion del caballo con la alerta
                    }

                    if (a.AlertaCaballo.Count() == 1 && a.AlertaGrupo.Count() == 0) //Si solo tenia al caballo que elimine y no hay asocaiciones al grupos elimino la alerta
                    {
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

        public List<Alerta> GetAlertasByCaballo(int propietarioId, int caballoId, string inicio, string fin, int[] tipos, int orden, int cantidad, bool todosTipos)
        {
            Nullable<DateTime> inicioo = null, finn = null;
            inicioo = inicio != "" ? DateTime.Parse(inicio) : inicioo;
            finn = fin != "" ? DateTime.Parse(fin) : finn;
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Dictionary<int, int> mapAlertasCaballo = db.AlertaCaballo
                    .Where(ac => ac.Caballo_ID == caballoId).ToDictionary(ac => ac.Alerta_ID, ac => ac.Caballo_ID);
                List<int> alertasCaballoIds = new List<int>(mapAlertasCaballo.Keys);

                var query = db.Alerta
                    .Where(a => a.Propietario_ID == propietarioId && alertasCaballoIds.Contains(a.ID));

                if (!todosTipos && tipos != null)
                {
                    query = query.Where(a => tipos.Contains(a.Tipo));
                }
                if (inicio != "")
                {
                    query = query.Where(a => a.FechaNotificacion >= inicioo.Value);
                }
                if (fin != "")
                {
                    query = query.Where(a => a.FechaNotificacion <= finn.Value);
                }
                if (cantidad > 0)
                {
                    query = query.Take(cantidad);
                }
                if (orden == (int)EquilinkedEnums.OrdenamientoEnum.ASCENDENTE)
                {
                    query = query.OrderBy(a => a.FechaNotificacion);
                } else if(orden == (int)EquilinkedEnums.OrdenamientoEnum.DESCENDENTE)
                {
                    query = query.OrderByDescending(a => a.FechaNotificacion);
                }

                return query.ToList();
            }
        }

        public AlertaCaballo Insert(AlertaCaballo entity)
        {
            this._dbContext.AlertaCaballo.Add(entity);
            this._dbContext.SaveChanges();
            return entity;
        }

        public bool DeleteByAlertaId(int alertaId)
        {
            _dbContext.AlertaCaballo.RemoveRange(this._dbContext.AlertaCaballo
                .Where(x => x.Alerta_ID == alertaId).ToList());
            _dbContext.SaveChanges();
            return true;
        }

        public bool DeleteByCaballoId(int caballoId)
        {
            List<AlertaCaballo> listToRemove = this._dbContext.AlertaCaballo
                 .Where(x => x.Caballo_ID == caballoId).ToList();
            if (listToRemove != null && listToRemove.Count > 0)
            {
                _dbContext.AlertaCaballo.RemoveRange(listToRemove);
                _dbContext.SaveChanges();
            }
            return true;
        }

        public void InsertFromCaballosList(int alertaId, List<int> caballosList)
        {
            foreach (int idCaballo in caballosList)
            {
                AlertaCaballo alertaCaballo = new AlertaCaballo();
                alertaCaballo.Alerta_ID = alertaId;
                alertaCaballo.Caballo_ID = idCaballo;
                this.Insert(alertaCaballo);
                //{
                //    messageError = "Error insertando los caballos relacionados a la alerta";
                //    return false;
                //}
            }
        }

        public List<int> GetAllCaballoIdByAlertaId(int alertaId)
        {
            IQueryable<AlertaCaballo> list = this.GetAllByAlertaId(alertaId);
            return list.Select(x => x.Caballo_ID).ToList();
        }

        public IQueryable<AlertaCaballo> GetAllByAlertaId(int alertaId)
        {
            return this._dbContext.AlertaCaballo.Where(x => x.Alerta_ID == alertaId);
        }

    }
}
