using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class CaballoBLL : BLLBase, IBase<Caballo>
    {
        public List<Caballo> GetAll()
        {
            throw new NotImplementedException();
        }

        public Caballo GetById(int id)
        {
            return this._dbContext.Caballo.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            Caballo entity = this._dbContext.Caballo.Find(id);
            this._dbContext.Entry(entity).State = EntityState.Deleted;
            this._dbContext.SaveChanges();
            return true;
        }

        public Caballo Insert(Caballo entity)
        {
            this._dbContext.Caballo.Add(entity);
            this._dbContext.SaveChanges();

            _dbContext.Database.ExecuteSqlCommand("EXECUTE ValidarGrupoDefaultPropietario @PropietarioId",
                    new SqlParameter("PropietarioId", entity.Propietario_ID));
            return entity;
        }

        public void Update(Caballo entity)
        {
            this._dbContext.Entry(entity).State = EntityState.Modified;
            this._dbContext.SaveChanges();
        }

        public List<CaballoDto> GetAllSerializedByPropietarioId(int propietarioId)
        {
            List<CaballoDto> listSerialized = new List<CaballoDto>();
            List<Caballo> listCaballo = this.GetAllByPropietarioId(propietarioId);
            foreach (Caballo item in listCaballo)
            {
                listSerialized.Add(new CaballoDto(item));
            }
            return listSerialized;
        }

        public List<ComboBoxDto> GetAllComboBoxByPropietarioId(int propietarioId)
        {
            List<ComboBoxDto> listSerialized = new List<ComboBoxDto>();
            List<Caballo> listCaballo = this.GetAllByPropietarioId(propietarioId);
            foreach (Caballo item in listCaballo)
            {
                listSerialized.Add(new ComboBoxDto(item.ID.ToString(), item.Nombre));
            }
            return listSerialized;
        }

        private List<Caballo> GetAllByPropietarioId(int propietarioId)
        {
            return _dbContext.Caballo.Where(x => x.Propietario_ID == propietarioId).ToList();
        }

        public bool DeleteWihFKById(int caballoId, out string messageError)
        {
            messageError = string.Empty;
            AlertaCaballoBLL _alertaCaballoBLL = new AlertaCaballoBLL();
            if (_alertaCaballoBLL.DeleteByCaballoId(caballoId))
            {
                GrupoCaballoBLL _grupoCaballoBLL = new GrupoCaballoBLL();
                if (_grupoCaballoBLL.DeleteByCaballoId(caballoId))
                {
                    AlimentacionBLL _alimentacionBLL = new AlimentacionBLL();
                    if (_alimentacionBLL.DeleteByCaballoId(caballoId))
                    {
                        return this.DeleteById(caballoId);
                    }
                    else { messageError = "Error eliminando la alimentacion del caballo"; }
                }
                else { messageError = "Error eliminando los grupos del caballo"; }
            }
            else { messageError = "Error eliminando las alertas del caballo"; }
            return false;
        }

        public CaballoDto GetSerializedById(int id)
        {
            return new CaballoDto(this.GetById(id));
        }
    }
}
