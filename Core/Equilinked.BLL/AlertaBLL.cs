using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using Equilinked.Utils;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class AlertaBLL : BLLBase, IBase<Alerta>
    {
        private AlertaCaballoBLL _alertaCaballoBLL;

        public Alerta GetById(int id)
        {
            return this._dbContext.Alerta.Where(x => x.ID == id).FirstOrDefault();
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
                if (tipoAlertasEnum != null)
                {
                    alerta = this._dbContext.Alerta.Where(x => x.ID == item.Key && x.Tipo == tipoAlertasEnum).FirstOrDefault();
                }
                else
                {
                    alerta = this._dbContext.Alerta.Where(x => x.ID == item.Key).FirstOrDefault();
                }
                if (alerta != null)
                {
                    //List<int> caballosList = this._dbContext.AlertaCaballo
                    //    .Select(c => c.Caballo_ID)
                    //    .Where(x=>x.)
                    //    .ToList();
                    //AlertaDto alertaDto = new AlertaDto(alerta);
                    //alertaDto.CaballosList = caballosList;
                    listAlertas.Add(alerta);
                }
            }
            return listAlertas;
        }
    }
}
