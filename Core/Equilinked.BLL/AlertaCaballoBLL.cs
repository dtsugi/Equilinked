using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class AlertaCaballoBLL : BLLBase, IBase<AlertaCaballo>
    {
        public List<AlertaCaballo> GetAll()
        {
            throw new NotImplementedException();
        }

        public AlertaCaballo GetById(int id)
        {
            throw new NotImplementedException();
        }

        public bool DeleteById(int id)
        {
            throw new NotImplementedException();
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
