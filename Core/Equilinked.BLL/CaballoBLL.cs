using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class CaballoBLL : BLLBase, IBase<Caballo>
    {

        private FTPBLL ftpBLL = new FTPBLL();

        public void UpdateAdjuntosCaballo(int caballoId, CaballoAdjuntosDto adjuntos)
        {
            List<FileDto> nuevosAdjuntosFtp = new List<FileDto>();
            List<CaballoAdjunto> adjuntosAgregar = new List<CaballoAdjunto>();
            List<CaballoAdjunto> adjuntosEliminar = null;
            List<string> adjuntosEliminarFtp = new List<string>();
            GenealogiaCaballo geneaologia = null;
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                //ajustar la imagen de pedigree en bd
                geneaologia = db.GenealogiaCaballo.Where(gc => gc.Caballo_ID == caballoId).FirstOrDefault();
                //si ya viene imagen de pedigree (la eliminaron) o ya es otra hay que mandar a remover la que estaba en el ftp
                if ((geneaologia.ImagePedigree != null && adjuntos.Pedigree == null) 
                    || (geneaologia.ImagePedigree != null && adjuntos.Pedigree != null && adjuntos.Pedigree.Name != geneaologia.ImagePedigree))
                {
                    adjuntosEliminarFtp.Add(geneaologia.ImagePedigree);
                }
                if (adjuntos.Pedigree == null)
                {
                    geneaologia.ImagePedigree = null;
                } else if ((geneaologia.ImagePedigree == null && adjuntos.Pedigree != null) 
                    || (adjuntos.Pedigree != null && geneaologia.ImagePedigree != null && adjuntos.Pedigree.Name != geneaologia.ImagePedigree))
                {
                    adjuntos.Pedigree.Name = Guid.NewGuid().ToString() + Path.GetExtension(adjuntos.Pedigree.Name);
                    geneaologia.ImagePedigree = adjuntos.Pedigree.Name;
                    nuevosAdjuntosFtp.Add(adjuntos.Pedigree);
                }

                //ajustamos ahora las marcas adjuntadas...
                List<string> namesAdjuntos = db.CaballoAdjunto.Where(ca => ca.Caballo_ID == caballoId).Select(ca => ca.Image).ToList();
                List<string> adjuntosAsignados = adjuntos.AdjuntosMarcas.Select(am => am.Name).ToList();
                foreach(FileDto fa in adjuntos.AdjuntosMarcas)
                {
                    if(!namesAdjuntos.Contains(fa.Name))
                    {
                        fa.Name = Guid.NewGuid().ToString() + Path.GetExtension(fa.Name);
                        nuevosAdjuntosFtp.Add(fa);
                        adjuntosAgregar.Add(new CaballoAdjunto() { Caballo_ID = caballoId, Image = fa.Name });
                    }
                }
                adjuntosEliminar = db.CaballoAdjunto.Where(ca => ca.Caballo_ID == caballoId).ToList();
                foreach(var adjuntooo in adjuntosEliminar)
                {
                    if(!adjuntosAsignados.Contains(adjuntooo.Image))
                    {
                        adjuntosEliminarFtp.Add(adjuntooo.Image);
                        db.CaballoAdjunto.Remove(adjuntooo);
                    }
                }
                if(adjuntosAgregar.Count() > 0)
                {
                    db.CaballoAdjunto.AddRange(adjuntosAgregar);
                }
                db.SaveChanges();
            }
            //Ahora eliminamos los archivos en el ftp que ya no se usan
            if(adjuntosEliminarFtp.Count() > 0)
            {
                foreach(string file in adjuntosEliminarFtp)
                {
                    ftpBLL.DeleteStreamImage("/datos-caballos/" + file);
                }
            }
            //agregamos nuevos archivos al ftp
            if(nuevosAdjuntosFtp.Count() > 0)
            {
                foreach(FileDto file in nuevosAdjuntosFtp)
                {
                    ftpBLL.SaveStreamImage(file.File, "/datos-caballos/" + file.Name, file.Length);
                }
            }
        }

        public CaballoAdjuntosDto GetAdjuntosCaballo(int caballoId)
        {
            CaballoAdjuntosDto caballoAdjuntos = new CaballoAdjuntosDto();
            GenealogiaCaballo geneaologia = null;
            List<CaballoAdjunto> adjuntos = null;
            Stream file;
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                geneaologia = db.GenealogiaCaballo.Where(gc => gc.Caballo_ID == caballoId).FirstOrDefault();
                adjuntos = db.CaballoAdjunto.Where(ca => ca.Caballo_ID == caballoId).ToList();
            }
            if(geneaologia.ImagePedigree != null)
            {
                file = ftpBLL.GetStreamImage("/datos-caballos/" + geneaologia.ImagePedigree);
                caballoAdjuntos.Pedigree = new FileDto() { File = file, Name = geneaologia.ImagePedigree };
            }
            if(adjuntos != null && adjuntos.Count() > 0)
            {
                foreach(CaballoAdjunto ca in adjuntos) {
                    file = ftpBLL.GetStreamImage("/datos-caballos/" + ca.Image);
                    caballoAdjuntos.AdjuntosMarcas.Add(new FileDto() { File = file, Name = ca.Image });
                }
            }
            return caballoAdjuntos;
        }

        public void UpdateStreamFotoCaballo(int caballoId, Stream foto, string name, long length)
        {
            string newFileName = Guid.NewGuid().ToString() + Path.GetExtension(name);
            ftpBLL.SaveStreamImage(foto, "/foto-perfil/caballo/" + newFileName, length);
            string fotoEliminar;
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                Caballo caballo = db.Caballo.Where(c => c.ID == caballoId).FirstOrDefault();
                fotoEliminar = caballo.Image;
                caballo.Image = newFileName;
                db.SaveChanges();
            }
            if (fotoEliminar != null)
            {
                ftpBLL.DeleteStreamImage("/foto-perfil/caballo/" + fotoEliminar);
            }
        }

        public Stream GetStreamFotoCaballo(int caballoId)
        {
            Caballo caballo = null;
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                caballo = db.Caballo.Where(c => c.ID == caballoId).FirstOrDefault();
            }
            if (caballo != null)
            {
                string imagePath = "/foto-perfil/caballo/" + caballo.Image;
                return ftpBLL.GetStreamImage(imagePath);
            }
            else
            {
                throw new Exception("No hay imagen para el caballo");
            }
        }

        public List<Caballo> GetAll()
        {
            throw new NotImplementedException();
        }

        public List<CaballoDto> GetCaballosPorEstadoAsociacionEstablo(int propietarioId, bool establo)
        {
            List<CaballoDto> listSerialized = new List<CaballoDto>();
            using (var db = this._dbContext)
            {

                List<Caballo> caballos = db.Caballo
                    .Include("Protector")
                    .Include("GenealogiaCaballo")
                    .Include("CriadorCaballo")
                    .Include("ResponsableCaballo")
                    .Where(c => c.Propietario_ID == propietarioId)
                    .Where(c => establo ? c.Establo_ID != null : c.Establo_ID == null)
                    .OrderBy(c => c.Nombre)
                    .ToList();

                CaballoDto caballo;
                foreach (Caballo item in caballos)
                {
                    caballo = new CaballoDto(item);
                    listSerialized.Add(caballo);
                }
            }

            return listSerialized;
        }

        public Caballo GetById(int id)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Caballo caballo = db.Caballo
                    .Include("GenealogiaCaballo")
                    .Include("CriadorCaballo")
                    .Include("ResponsableCaballo")
                    .Include("Genero")
                    .Include("Pelaje")
                    .Include("Protector")
                    .Where(x => x.ID == id).FirstOrDefault();

                if (caballo.Establo_ID != null)
                {
                    caballo.Establo = db.Establo.Where(e => e.ID == caballo.Establo_ID).FirstOrDefault();
                }

                return caballo;
            }
        }

        public bool DeleteById(int id)
        {
            Caballo entity = this._dbContext.Caballo.Find(id);
            this._dbContext.Entry(entity.ResponsableCaballo).State = EntityState.Deleted;
            this._dbContext.Entry(entity.GenealogiaCaballo).State = EntityState.Deleted;
            this._dbContext.Entry(entity.CriadorCaballo).State = EntityState.Deleted;
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
            using(var db = this._dbContext)
            {
                Caballo caballo = db.Caballo.Where(c => c.ID == entity.ID).FirstOrDefault();

                caballo.Nombre = entity.Nombre;
                caballo.NombrePropietario = entity.NombrePropietario;
                caballo.Genero_ID = entity.Genero_ID;
                caballo.Pelaje_ID = entity.Pelaje_ID;
                caballo.FechaNacimiento = entity.FechaNacimiento;
                caballo.GenealogiaCaballo.Padre = entity.GenealogiaCaballo.Padre;
                caballo.GenealogiaCaballo.Madre = entity.GenealogiaCaballo.Madre;
                caballo.CriadorCaballo.Nombre = entity.CriadorCaballo.Nombre;
                caballo.CriadorCaballo.Pais_ID = entity.CriadorCaballo.Pais_ID;
                caballo.ADN = entity.ADN;
                caballo.NumeroChip = entity.NumeroChip;
                caballo.NumeroId = entity.NumeroId;
                caballo.Marcas = entity.Marcas;
                caballo.EstadoFEN = entity.EstadoFEN;
                caballo.NumeroFEN = entity.NumeroFEN;
                caballo.EstadoFEI = entity.EstadoFEI;
                caballo.NumeroFEI = entity.NumeroFEI;
                caballo.Protector_ID = entity.Protector_ID;
                caballo.Observaciones = entity.Observaciones;
                caballo.Embocadura = entity.Embocadura;
                caballo.ExtrasDeCabezada = entity.ExtrasDeCabezada;
                caballo.ResponsableCaballo.Nombre = entity.ResponsableCaballo.Nombre;
                caballo.ResponsableCaballo.Telefono = entity.ResponsableCaballo.Telefono;
                caballo.ResponsableCaballo.CorreoElectronico = entity.ResponsableCaballo.CorreoElectronico;

                db.SaveChanges();
            }
        }

        public List<CaballoDto> GetAllSerializedByPropietarioId(int propietarioId)
        {
            //List<Establo> establos = this._dbContext.Establo.
            List<CaballoDto> listSerialized = new List<CaballoDto>();
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                Dictionary<int, Establo> mapEstablos = db.Establo
                    .Where(e => e.Propietario_ID == propietarioId)
                    .ToDictionary(e => e.ID);

                List<Caballo> caballos = db.Caballo
                    .Include("Protector")
                    .Include("GenealogiaCaballo")
                    .Include("CriadorCaballo")
                    .Include("ResponsableCaballo")
                    .Where(c => c.Propietario_ID == propietarioId)
                    .OrderBy(c => c.Nombre)
                    .ToList();

                CaballoDto caballo;
                Establo establo;
                foreach (Caballo item in caballos)
                {
                    caballo = new CaballoDto(item);
                    if(item.Establo_ID != null)
                    {
                        if(mapEstablos.TryGetValue(item.Establo_ID.Value, out establo))
                        {
                            caballo.Establo = establo;
                        }
                    }
                    listSerialized.Add(caballo);
                }
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
