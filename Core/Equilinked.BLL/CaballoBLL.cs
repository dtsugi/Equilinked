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
