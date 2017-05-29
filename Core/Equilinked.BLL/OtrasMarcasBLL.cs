using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class OtrasMarcasBLL : BLLBase, IBase<OtrasMarcas>
    {

        public List<OtrasMarcas> GetAll()
        {
            return this._dbContext.OtrasMarcas.ToList();
        }

        public OtrasMarcas GetById(int id)
        {
            return this._dbContext.OtrasMarcas.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            OtrasMarcas entity = this._dbContext.OtrasMarcas.Find(id);
            this._dbContext.Entry(entity).State = EntityState.Modified;
            this._dbContext.SaveChanges();
            return true;
        }

        public OtrasMarcas Insert(OtrasMarcas entity)
        {
            this._dbContext.OtrasMarcas.Add(entity);
            this._dbContext.SaveChanges();
            return entity;
        }

        public List<ComboBoxDto> GetAllComboBox()
        {
            List<OtrasMarcas> listOtrasMarcas = this.GetAll();
            List<ComboBoxDto> listCombo = new List<ComboBoxDto>();
            foreach (OtrasMarcas item in listOtrasMarcas)
            {
                listCombo.Add(new ComboBoxDto(item.ID.ToString(), item.Descripcion));
            }
            return listCombo;
        }

    }
}
