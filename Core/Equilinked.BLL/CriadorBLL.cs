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
    public class CriadorBLL : BLLBase, IBase<Criador>
    {

        public List<Criador> GetAll()
        {
            return this._dbContext.Criador.ToList();
        }

        public Criador GetById(int id)
        {
            return this._dbContext.Criador.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            Criador entity = this._dbContext.Criador.Find(id);
            this._dbContext.Entry(entity).State = EntityState.Modified;
            this._dbContext.SaveChanges();
            return true;
        }

        public Criador Insert(Criador entity)
        {
            this._dbContext.Criador.Add(entity);
            this._dbContext.SaveChanges();
            return entity;
        }

        public List<ComboBoxDto> GetAllComboBox()
        {
            List<Criador> list = this.GetAll();
            List<ComboBoxDto> listCombo = new List<ComboBoxDto>();
            foreach (Criador item in list)
            {
                listCombo.Add(new ComboBoxDto(item.ID.ToString(), item.Nombre));
            }
            return listCombo;
        }
    }
}
