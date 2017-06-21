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
    public class PropietarioBLL : BLLBase, IBase<Propietario>
    {

        public List<Propietario> GetAll()
        {
            return this._dbContext.Propietario.ToList();
        }

        public Propietario GetById(int id)
        {
            return this._dbContext.Propietario.Where(x => x.ID == id).FirstOrDefault();
        }

        public bool DeleteById(int id)
        {
            try
            {
                Propietario entity = this._dbContext.Propietario.Find(id);
                this._dbContext.Entry(entity).State = EntityState.Modified;
                this._dbContext.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                return false;
            }

        }

        public Propietario Insert(Propietario entity)
        {
            try
            {
                this._dbContext.Propietario.Add(entity);
                this._dbContext.SaveChanges();
                return entity;
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                return null;
            }
        }

        public Propietario GetByUserId(int userId)
        {
            return this._dbContext.Propietario.Where(x => x.Usuario_ID == userId).FirstOrDefault();
        }

        public PropietarioDto GetSerializedById(int id)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                return new PropietarioDto(this._dbContext.Propietario
                    .Include("EstadoProvincia")
                    .Include("EstadoProvincia.Pais")
                    .Include("PropietarioTelefono")
                    .Include("PropietarioTelefono.Tipo_Numero")
                    .Where(x => x.ID == id)
                    .FirstOrDefault()
                    );
            }
        }

        public PropietarioDto updatePropietario(int propietarioId, PropietarioDto propietario)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Propietario prop = db.Propietario
                    .Include("PropietarioTelefono")
                    .Where(p => p.ID == propietarioId).FirstOrDefault();

                //Act propietario!
                prop.Nombre = propietario.Nombre;
                prop.Mail = propietario.Mail;
                prop.EstadoProvincia_Id = propietario.EstadoProvincia_Id;
                Dictionary<int, PropietarioTelefono> mapTelefonos = new Dictionary<int, PropietarioTelefono>();
                List<PropietarioTelefono> telefonosInsertar = new List<PropietarioTelefono>();
                foreach (var propTelefono in propietario.PropietarioTelefono)
                {
                    if(propTelefono.ID == 0)
                    {
                        propTelefono.Propietario_ID = propietarioId;
                        telefonosInsertar.Add(propTelefono);
                    }
                    else
                    {
                        mapTelefonos.Add(propTelefono.ID, propTelefono);
                    }
                }

                List<PropietarioTelefono> telefonosEliminar = new List<PropietarioTelefono>();
                foreach(var propTelefono in prop.PropietarioTelefono)
                {
                    PropietarioTelefono pt;
                    mapTelefonos.TryGetValue(propTelefono.ID, out pt);
                    if (pt != null)
                    {
                        propTelefono.Numero = pt.Numero;
                        propTelefono.TipoNumero_ID = pt.TipoNumero_ID;
                    }
                    else
                    {
                        telefonosEliminar.Add(propTelefono);
                    }
                }

                db.PropietarioTelefono.RemoveRange(telefonosEliminar);
                db.PropietarioTelefono.AddRange(telefonosInsertar);

                db.SaveChanges();
                return propietario;
            }
        }
    }
}
