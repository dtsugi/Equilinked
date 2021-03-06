﻿using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class GeneroBLL : BLLBase, IBase<Genero>
    {

        public List<Genero> GetAll()
        {
            return this._dbContext.Genero.ToList();
        }

        public Genero GetById(int id)
        {
            return this._dbContext.Genero.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            Genero entity = this._dbContext.Genero.Find(id);
            this._dbContext.Entry(entity).State = EntityState.Modified;
            this._dbContext.SaveChanges();
            return true;
        }

        public Genero Insert(Genero entity)
        {
            this._dbContext.Genero.Add(entity);
            this._dbContext.SaveChanges();
            return entity;
        }

        public List<ComboBoxDto> GetAllComboBox()
        {
            List<Genero> list = this.GetAll();
            List<ComboBoxDto> listCombo = new List<ComboBoxDto>();
            foreach (Genero item in list)
            {
                listCombo.Add(new ComboBoxDto(item.ID.ToString(), item.Descripcion));
            }
            return listCombo;
        }
    }
}
