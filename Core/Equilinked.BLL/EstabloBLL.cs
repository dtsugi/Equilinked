using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Equilinked.BLL
{
    public class EstabloBLL : BLLBase, IBase<Establo>
    {
        public List<Establo> GetAllEstablosByPropietarioId(int PropietarioId)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                return db.Establo
                    .Where(e => e.Propietario_ID == PropietarioId)
                    .OrderBy(e => e.Nombre)
                    .ToList();
            }
        }

        public List<EstabloCaballo> getAllEstabloCaballoByEstabloId(int establoId)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                return db.EstabloCaballo
                    .Include("Caballo")
                    .Where(ec => ec.Establo_ID == establoId)
                    .OrderBy(ec => ec.Caballo.Nombre)
                    .ToList();
            }
        }

        public bool DeleteEstablosByIds(int[] EstablosIds)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                List<Establo> Establos = db.Establo
                    .Include("EstabloCaballo")
                    .Include("EstabloCorreo")
                    .Include("EstabloTelefono")
                    .Where(e => EstablosIds.Contains(e.ID)).ToList();

                foreach(var establo in Establos)
                {
                    db.EstabloCaballo.RemoveRange(establo.EstabloCaballo);
                    db.EstabloCorreo.RemoveRange(establo.EstabloCorreo);
                    db.EstabloTelefono.RemoveRange(establo.EstabloTelefono);
                }

                db.Establo.RemoveRange(Establos);
                _dbContext.SaveChanges();
            }
            return true;
        }

        public bool DeleteById(int id)
        {
            throw new NotImplementedException();
        }

        public List<Establo> GetAll()
        {
            throw new NotImplementedException();
        }

        public Establo GetById(int id)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                return db.Establo
                    .Include("EstabloCaballo")
                    .Include("EstabloCorreo")
                    .Include("EstabloTelefono")
                    .Include("EstabloTelefono.Tipo_Numero")
                    .Where(e => e.ID == id)
                    .First();
            }
        }

        public Establo Insert(Establo entity)
        {
            this._dbContext.Establo.Add(entity);
            //Guardamos los caballos asociados
            foreach (var establoCaballo in entity.EstabloCaballo)
            {
                establoCaballo.Establo_ID = entity.ID;
                this._dbContext.EstabloCaballo.Add(establoCaballo);
            }

            //Guardamos los telefonos
            foreach (var telefono in entity.EstabloTelefono)
            {
                telefono.Establo_ID = entity.ID;
                this._dbContext.EstabloTelefono.Add(telefono);
            }

            //Guardamos los correos
            foreach (var correo in entity.EstabloCorreo)
            {
                correo.Establo_ID = entity.ID;
                this._dbContext.EstabloCorreo.Add(correo);
            }

            this._dbContext.SaveChanges();
            return entity;
        }

        public Establo update(int establoId, Establo establo)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                //Editamos el establo
                Establo est = db.Establo
                    .Where(e => e.ID == establoId)
                    .First();

                est.Nombre = establo.Nombre;
                est.Manager = establo.Manager;
                est.Direccion = establo.Direccion;

                //Ahora vamos a buscar los correos
                List<EstabloCorreo> correosActual = db.EstabloCorreo
                    .Where(c => c.Establo_ID == establoId).ToList();
                Dictionary<int, EstabloCorreo> mapCorreos = new Dictionary<int, EstabloCorreo>();
                foreach (var correo in establo.EstabloCorreo)
                {
                    if (correo.ID == 0)
                    {
                        correo.Establo_ID = establoId;
                        db.EstabloCorreo.Add(correo); //Guardamos los nuevos
                    }
                    else
                    {
                        mapCorreos.Add(correo.ID, correo);//Mapeo los que ya vienen
                    }
                }

                foreach (var correo in correosActual)
                {
                    EstabloCorreo ec;
                    mapCorreos.TryGetValue(correo.ID, out ec);
                    if (ec != null)
                    {
                        //Actualizco
                        correo.CorreoElectronico = ec.CorreoElectronico;
                    }
                    else
                    {
                        db.EstabloCorreo.Remove(correo);
                    }
                }

                //Ahora los telefonos
                List<EstabloTelefono> telefonosActuales = db.EstabloTelefono
                    .Where(t => t.Establo_ID == establoId).ToList();
                Dictionary<int, EstabloTelefono> mapTelefonos = new Dictionary<int, EstabloTelefono>();
                foreach (var telefono in establo.EstabloTelefono)
                {
                    if (telefono.ID == 0)
                    {
                        telefono.Establo_ID = establoId;
                        db.EstabloTelefono.Add(telefono);
                    }
                    else
                    {
                        mapTelefonos.Add(telefono.ID, telefono);
                    }
                }
                foreach (var telefono in telefonosActuales)
                {
                    EstabloTelefono et;
                    mapTelefonos.TryGetValue(telefono.ID, out et);
                    if (et != null)
                    {
                        telefono.Numero = et.Numero;
                        telefono.Tipo_Numero_ID = et.Tipo_Numero_ID;
                    }
                    else
                    {
                        db.EstabloTelefono.Remove(telefono);
                    }
                }

                //Ahora los caballos
                List<EstabloCaballo> caballosActuales = db.EstabloCaballo
                    .Where(c => c.Establo_ID == establoId).ToList();
                Dictionary<int, EstabloCaballo> mapCaballos = new Dictionary<int, EstabloCaballo>();
                foreach (var caballo in establo.EstabloCaballo)
                {
                    if (caballo.ID == 0)
                    {
                        caballo.Establo_ID = establoId;
                        db.EstabloCaballo.Add(caballo);
                    }
                    else
                    {
                        mapCaballos.Add(caballo.ID, caballo);
                    }
                }
                foreach (var caballo in caballosActuales)
                {
                    EstabloCaballo ec;
                    mapCaballos.TryGetValue(caballo.ID, out ec);
                    if (ec == null)
                    {
                        db.EstabloCaballo.Remove(caballo);
                    }
                }

                db.SaveChanges();
                establo = est;
            }

            return establo;
        }
    }
}
