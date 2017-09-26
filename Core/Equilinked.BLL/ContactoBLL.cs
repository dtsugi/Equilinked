using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Equilinked.BLL
{
    public class ContactoBLL : BLLBase
    {
        private FTPBLL ftpbll = new FTPBLL();

        public List<MotivoContacto> listAllMotivoContacto()
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                return db.MotivoContacto.OrderBy(mc => mc.ID).ToList();
            }
        }

        public MensajeContacto Insert(MensajeContacto entity, FileDto file0, FileDto file1)
        {
            string fileName0 = Guid.NewGuid().ToString(), fileName1 = Guid.NewGuid().ToString();
            using (var db = this._dbContext)
            {
                entity.Fecha = DateTime.Now;
                if(file0 != null)
                {
                    fileName0 = fileName0 + Path.GetExtension(file0.Name);
                    entity.Image1 = fileName0;
                }
                if(file1 != null)
                {
                    fileName1 = fileName1 + Path.GetExtension(file1.Name);
                    entity.Image2 = fileName1;
                }
                db.MensajeContacto.Add(entity);
                db.SaveChanges();
            }
            if (file0 != null)
            {
                ftpbll.SaveStreamImage(file0.File, "/contacto/" + fileName0, file0.Length);
            }
            if (file1 != null)
            {
                ftpbll.SaveStreamImage(file1.File, "/contacto/" + fileName1, file1.Length);
            }
            return entity;
        }
    }
}
