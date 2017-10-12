using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using Equilinked.Utils;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Equilinked.BLL
{
    public class AlertaBLL : BLLBase, IBase<Alerta>
    {
        public void DeleteAlertasByIds(int[] alertasIds)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                List<AlertaGrupo> alertasGrupo = db.AlertaGrupo.Where(ag => alertasIds.Contains(ag.Alerta_ID)).ToList();
                List<AlertaCaballo> alertasCaballo = db.AlertaCaballo.Where(ac => alertasIds.Contains(ac.Alerta_ID)).ToList();
                List<AlertaRecordatorio> alertasRecordatorios = db.AlertaRecordatorio.Where(ar => alertasIds.Contains(ar.Alerta_ID)).ToList();
                List<Alerta> alertas = db.Alerta.Where(a => alertasIds.Contains(a.ID)).ToList();

                db.AlertaRecordatorio.RemoveRange(alertasRecordatorios);
                db.AlertaGrupo.RemoveRange(alertasGrupo);
                db.AlertaCaballo.RemoveRange(alertasCaballo);
                db.Alerta.RemoveRange(alertas);
                db.SaveChanges();
            }
        }

        public void UpdateAlerta(Alerta alerta)
        {
            using(var db = this._dbContext)
            {
                //Actualizamos los recordatorios
                List<int> recordatoriosIds = new List<int>();
                List<int> caballosIds = new List<int>();
                List<int> gruposIds = new List<int>();
                List<AlertaRecordatorio> recordatoriosEliminar;
                List<AlertaCaballo> caballosEliminar;
                List<AlertaGrupo> gruposEliminar;

                db.Configuration.LazyLoadingEnabled = false;

                //Actualizamos la alerta
                Alerta alertaMod = db.Alerta.Where(a => a.ID == alerta.ID).FirstOrDefault();
                alertaMod.Titulo = alerta.Titulo;
                alertaMod.FechaNotificacion = alerta.FechaNotificacion;
                alertaMod.HoraNotificacion = alerta.HoraNotificacion;
                alertaMod.Activa = alerta.Activa;
                alertaMod.Descripcion = alerta.Descripcion;
                alertaMod.NombreProfesional = alerta.NombreProfesional;
                alertaMod.Ubicacion = alerta.Ubicacion;
                alertaMod.FechaFinal = alerta.FechaFinal;
                alertaMod.Resultado = alerta.Resultado;
               
                //Actualimos los recordatorios
                foreach (var ar in alerta.AlertaRecordatorio)
                {
                    if(ar.ID == 0)
                    {
                        ar.Alerta_ID = alerta.ID;
                        db.AlertaRecordatorio.Add(ar);
                    } else
                    {
                        recordatoriosIds.Add(ar.ID);
                    }
                }

                recordatoriosEliminar = db.AlertaRecordatorio
                    .Where(ar => !recordatoriosIds.Contains(ar.ID) && ar.Alerta_ID == alerta.ID).ToList();
                db.AlertaRecordatorio.RemoveRange(recordatoriosEliminar);

                //Actualizamos los caballos
                foreach(var ac in alerta.AlertaCaballo)
                {
                    if (ac.ID == 0)
                    {
                        ac.Alerta_ID = alerta.ID;
                        db.AlertaCaballo.Add(ac);
                    } 
                    else
                    {
                        caballosIds.Add(ac.ID);
                    }
                }

                caballosEliminar = db.AlertaCaballo
                    .Where(ac => !caballosIds.Contains(ac.ID) && ac.Alerta_ID == alerta.ID).ToList();
                db.AlertaCaballo.RemoveRange(caballosEliminar);

                //Actualimos los grupos
                foreach(var ag in alerta.AlertaGrupo)
                {
                    if(ag.ID == 0)
                    {
                        ag.Alerta_ID = alerta.ID;
                        db.AlertaGrupo.Add(ag);
                    }
                    else
                    {
                        gruposIds.Add(ag.ID);
                    }
                }

                gruposEliminar = db.AlertaGrupo
                    .Where(ag => !gruposIds.Contains(ag.ID) && ag.Alerta_ID == alerta.ID).ToList();
                db.AlertaGrupo.RemoveRange(gruposEliminar);

                db.SaveChanges();
            }
        }

        public Alerta SaveAlerta(Alerta alerta)
        {
            using(var db = this._dbContext)
            {
                if(alerta.AlertaGrupo != null && alerta.AlertaGrupo.Count() > 0)
                {
                    alerta.AlertaGrupal = true;
                }
                db.Alerta.Add(alerta);
                db.AlertaCaballo.AddRange(alerta.AlertaCaballo);
                db.AlertaGrupo.AddRange(alerta.AlertaGrupo);
                db.AlertaRecordatorio.AddRange(alerta.AlertaRecordatorio);
                db.SaveChanges();
            }
            return alerta;
        }

        public Alerta GetAlertaById(int propietarioId, int alertaId)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                List<AlertaCaballo> caballos = db.AlertaCaballo.Where(ac => ac.Alerta_ID == alertaId).ToList();
                Alerta alerta = db.Alerta
                    .Include("AlertaRecordatorio")
                    .Include("AlertaRecordatorio.UnidadTiempo")
                    .Include("AlertaGrupo")
                    .Where(a => a.ID == alertaId && a.Propietario_ID == propietarioId)
                    .FirstOrDefault();
                alerta.AlertaCaballo = caballos;

                if(alerta.AlertaGrupo.Count() == 1)
                {
                    AlertaGrupo alertaGrupo = alerta.AlertaGrupo.First();
                    Dictionary<int, GrupoCaballo> caballosGrupo = db.GrupoCaballo.Where(gc => gc.Grupo_ID == alertaGrupo.Grupo_ID).ToDictionary(gc => gc.Caballo_ID);
                    List<int> keysCaballos = new List<int>(caballosGrupo.Keys); //Caballos del grupo

                    List<AlertaCaballo> caballosX = db.AlertaCaballo
                        .Where(ac => ac.Alerta_ID == alertaId)
                        .Where(ac => keysCaballos.Contains(ac.Caballo_ID))
                        .ToList();
                    alerta.AllCaballos = caballosX.Count() == keysCaballos.Count(); //Estan todos los caballos?
                }

                return alerta;
            }
        }

        public List<AlertasDiaDto> GetAllAlertasByDia(int propietarioId, string inicio)
        {
            List<AlertasDiaDto> alertasDiaPropietario = new List<AlertasDiaDto>();
            DateTime inicioo = DateTime.Parse(inicio);
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                List<Alerta> alertas = db.Alerta
                    .Include("AlertaRecordatorio")
                    .Include("AlertaRecordatorio.UnidadTiempo")
                    .Where(a => a.Propietario_ID == propietarioId)
                    .Where(a => a.FechaNotificacion >= inicioo)
                    .OrderBy(a => a.FechaNotificacion)
                    .ToList();
                if(alertas != null && alertas.Count() > 0)
                {
                    Dictionary<string, AlertasDiaDto> mapAlertasDia = new Dictionary<string, AlertasDiaDto>();
                    foreach(Alerta a in alertas)
                    {
                        string fechaAlerta = a.FechaNotificacion.ToString("yyyy-MM-dd");
                        AlertasDiaDto alertasDia;
                        if(!mapAlertasDia.ContainsKey(fechaAlerta))
                        {
                            mapAlertasDia.Add(fechaAlerta, new AlertasDiaDto(DateTime.Parse(fechaAlerta)));
                        }
                        if(mapAlertasDia.TryGetValue(fechaAlerta, out alertasDia))
                        {
                            alertasDia.Alertas.Add(new DetalleAlertaDto(a));
                        }
                    }
                    alertasDiaPropietario = new List<AlertasDiaDto>(mapAlertasDia.Values);
                }
            }
            return alertasDiaPropietario;
        }

        public List<Alerta> GetAlertasByFilter(int propietarioId, string inicio, string fin, int[] tipos, int orden, int cantidad, bool todosTipos)
        {
            Nullable<DateTime> inicioo = null, finn = null;
            inicioo = inicio != "" ? DateTime.Parse(inicio) : inicioo;
            finn = fin != "" ? DateTime.Parse(fin) : finn;
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                var query = db.Alerta.Where(a => a.Propietario_ID == propietarioId);
                if(!todosTipos && tipos != null)
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
                if(orden == (int)EquilinkedEnums.OrdenamientoEnum.ASCENDENTE)
                {
                    query = query.OrderBy(a => a.FechaNotificacion);
                } else if(orden == (int) EquilinkedEnums.OrdenamientoEnum.DESCENDENTE)
                {
                    query = query.OrderByDescending(a => a.FechaNotificacion);
                }
                return query.ToList();
            }
        }

        /*
         * ********************************************************************************
         * ************************ Remover despues de visto bueno ************************
         * ********************************************************************************
         */
        public Alerta GetById(int id)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                return db.Alerta.Where(x => x.ID == id).FirstOrDefault();
            }
        }

        public bool DeleteById(int id)
        {
            try
            {
                Alerta entity = this._dbContext.Alerta.Find(id);
                if (entity != null)
                {
                    if (new AlertaCaballoBLL().DeleteByAlertaId(entity.ID))
                    {
                        this._dbContext.Alerta.Remove(entity);
                        //this._dbContext.Entry(entity).State = EntityState.Deleted;
                        this._dbContext.SaveChanges();
                        return true;
                    }
                    else
                        return false;
                }
                else
                    return false;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                return false;
            }
        }

        public List<Alerta> GetAll()
        {
            throw new NotImplementedException();
        }

        public Alerta Insert(Alerta entity)
        {
            this._dbContext.Alerta.Add(entity);
            this._dbContext.SaveChanges();
            return entity;
        }

        public bool Update(Alerta entity)
        {
            this._dbContext.Entry(entity).State = EntityState.Modified;
            this._dbContext.SaveChanges();
            return true;
        }

        public List<sp_GetAlertasByPropietarioId_Result> GetAllByPropietario(int propietarioId, bool filterByFuture)
        {
            if (filterByFuture)
            {
                return this._dbContext.sp_GetAlertasByPropietarioId(propietarioId)
                    .Where(x => x.DiffEnDias > 0)
                    .ToList();
            }
            else
            {
                return this._dbContext.sp_GetAlertasByPropietarioId(propietarioId)
                   .Where(x => x.DiffEnDias == 0)
                   .ToList();
            }
        }

        public List<ComboBoxDto> GetAllTiposAlerta()
        {
            List<ComboBoxDto> tiposAlertaList = new List<ComboBoxDto>();
            tiposAlertaList.Add(new ComboBoxDto("1", EquilinkedEnums.TipoAlertasEnum.HERRAJE.ToString()));
            tiposAlertaList.Add(new ComboBoxDto("2", EquilinkedEnums.TipoAlertasEnum.DESPARACITACION.ToString()));
            tiposAlertaList.Add(new ComboBoxDto("3", EquilinkedEnums.TipoAlertasEnum.EVENTOS.ToString()));
            tiposAlertaList.Add(new ComboBoxDto("4", EquilinkedEnums.TipoAlertasEnum.DENTISTA.ToString()));
            tiposAlertaList.Add(new ComboBoxDto("5", EquilinkedEnums.TipoAlertasEnum.NOTASVARIAS.ToString()));
            return tiposAlertaList;
        }

        public List<Alerta> GetAllByCaballoId(int caballoId, int tipoAlertasEnum)
        {
            Dictionary<int, int> listAlertaCaballo = this._dbContext.AlertaCaballo
                .Where(x => x.Caballo_ID == caballoId)
                .ToDictionary(x => x.Alerta_ID, y => y.Caballo_ID);
            List<Alerta> listAlertas = new List<Alerta>();
            foreach (var item in listAlertaCaballo)
            {
                Alerta alerta;
                if (tipoAlertasEnum > 0)
                {
                    alerta = this._dbContext.Alerta.Where(x => x.ID == item.Key && x.Tipo == tipoAlertasEnum).FirstOrDefault();
                }
                else
                {
                    alerta = this._dbContext.Alerta.Where(x => x.ID == item.Key).FirstOrDefault();
                }
                if (alerta != null)
                {
                    listAlertas.Add(alerta);
                }
            }
            return listAlertas;
        }

        public List<AlertaDto> GetAllSerializedByCaballoId(int caballoId, int tipoAlertasEnum, DateTime dateToCompare, int filterAlertaEnum)
        {
            List<Alerta> listAlerta = this.GetAllByCaballoId(caballoId, tipoAlertasEnum).OrderBy(x => x.FechaNotificacion).ToList();
            switch (filterAlertaEnum)
            {
                case (int)EquilinkedEnums.FilterAlertaEnum.HISTORY:
                    listAlerta = listAlerta
                    .Where(x => (x.FechaNotificacion - dateToCompare).Days < 0)
                    .OrderByDescending(x => x.FechaNotificacion)
                    .ToList();
                    break;
                case (int)EquilinkedEnums.FilterAlertaEnum.NEXT:
                    // Se listan las alertas proximas a la fecha actual
                    listAlerta = listAlerta
                        .Where(x => (x.FechaNotificacion - dateToCompare).Days >= 0)
                        .ToList();
                    break;
            }
            List<AlertaDto> listDto = new List<AlertaDto>();
            foreach (Alerta item in listAlerta)
            {
                listDto.Add(new AlertaDto(item));
            }
            return listDto;
        }
    }
}
