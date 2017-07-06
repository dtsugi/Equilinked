using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Equilinked.BLL
{
    public class EstabloBLL : BLLBase
    {
        /*
         * Lista los establos asociados al propietario
         */
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

        /*
         * Obtiene la lista de caballos asociados al establo 
         */
        public List<Caballo> GetCaballosEstabloByEstabloId(int establoId)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                return db.Caballo
                    .Include("Establo")
                    .Where(c => c.Establo_ID == establoId)
                    .OrderBy(c => c.Nombre)
                    .ToList();
            }
        }

        public List<Caballo> GetCaballosPropietarioWithoutEstablo(int propietarioId)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                return db.Caballo
                    .Where(c => c.Propietario_ID == propietarioId && c.Establo_ID == null)
                    .ToList();
            }
        }

        /*
         * Obtiene la lista de caballos asociados a un establo y aquellos caballos
         * que no cuentan con una asociacion.
         */
        public List<Caballo> GetCaballosEstabloSinEstabloByEstabloId(int establoId)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                Establo est = db.Establo.Where(e => e.ID == establoId).FirstOrDefault();
                return db.Caballo
                    .Include("Establo")
                    .Where(c => c.Propietario_ID == est.Propietario_ID)
                    .Where(c => c.Establo_ID == establoId || c.Establo_ID == null)
                    .OrderBy(c => c.Nombre)
                    .ToList();
            }
        }

        /*
         * Permite guardar un nuevo establo, sus correos, telefonos
         * y asociar los caballos que se ubican en el.
         */
        public void SaveEstablo(Establo establo)
        {
            using(var db = this._dbContext)
            {
                List<int> idsCaballos = new List<int>(establo.Caballo.Count());
                foreach (Caballo c in establo.Caballo)
                {
                    idsCaballos.Add(c.ID);
                }
                establo.Caballo = null; //Como medida!

                db.Establo.Add(establo); //Guardamos el establo

                foreach (var telefono in establo.EstabloTelefono) //Guaradmos telefonos
                {
                    telefono.Establo_ID = establo.ID;
                    this._dbContext.EstabloTelefono.Add(telefono);
                }

                foreach (var correo in establo.EstabloCorreo) //guardamos correos
                {
                    correo.Establo_ID = establo.ID;
                    this._dbContext.EstabloCorreo.Add(correo);
                }

               
                List<Caballo> caballos = db.Caballo
                    .Where(c => idsCaballos.Contains(c.ID))
                    .ToList();
                foreach(Caballo c in caballos) //Asociamos los caballos al establo
                {
                    c.Establo_ID = establo.ID;
                }
                db.SaveChanges();
            }
        }

        /*
         * Permite actualizar la información del establo, eliminar y agregar nuevos telefonos, correos
         * asi como eliminar la asociacion de caballos o agregar nuevas.
         */ 
        public void UpdateEstablo(int establoId, Establo establo)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Establo est = db.Establo
                    .Include("Caballo")
                    .Include("EstabloCorreo")
                    .Include("EstabloTelefono")
                    .Where(e => e.ID == establoId)
                    .First();

                //Actualizamos informacion de establo
                est.Nombre = establo.Nombre;
                est.Manager = establo.Manager;
                est.Direccion = establo.Direccion;

                List<EstabloTelefono> telefonosEliminar = new List<EstabloTelefono>();
                List<EstabloTelefono> telefonosInsertar = new List<EstabloTelefono>();
                List<EstabloCorreo> correosEliminar = new List<EstabloCorreo>();
                List<EstabloCorreo> correosInsertar = new List<EstabloCorreo>();

                List<int> idsCaballos = new List<int>();
                List<int> idsNuevosCaballos = new List<int>();
                Dictionary<int, EstabloCorreo> mapCorreos = new Dictionary<int, EstabloCorreo>();
                Dictionary<int, EstabloTelefono> mapTelefonos = new Dictionary<int, EstabloTelefono>();

                foreach(var c in establo.Caballo)
                {
                    if(c.Establo_ID == null)
                    {
                        idsNuevosCaballos.Add(c.ID);
                    }
                    else
                    {
                        idsCaballos.Add(c.ID);
                    }
                }
                foreach(var c in establo.EstabloCorreo)
                {
                    if (c.ID == 0)
                    {
                        c.Establo_ID = establoId;
                        correosInsertar.Add(c); //Guardar nuevo establoCorreo!
                    }
                    else
                    {
                        mapCorreos.Add(c.ID, c);
                    }
                }
                foreach(var t in establo.EstabloTelefono)
                {
                    if(t.ID == 0)
                    {
                        t.Establo_ID = establoId;
                        telefonosInsertar.Add(t);
                    }
                    else
                    {
                        mapTelefonos.Add(t.ID, t);
                    }
                }

                /*
                 * Administrar caballos (quitar o agregar)
                 */
                List<Caballo> caballosEliminar = est.Caballo
                    .Where(c => !idsCaballos.Contains(c.ID)).ToList();
                foreach (var c in caballosEliminar)
                {
                    c.Establo_ID = null; //Con esto marcamos como "eliminados"
                }
                List<Caballo> nuevosCaballos = db.Caballo
                    .Where(c => idsNuevosCaballos.Contains(c.ID)).ToList();
                foreach (var c in nuevosCaballos)
                {
                    c.Establo_ID = establoId; //con esto marcamos como "asociado al establo"
                }

                /*
                 * Actualizar correos
                 */
                EstabloCorreo establoCorreo;
                foreach(var ec in est.EstabloCorreo)
                {
                    mapCorreos.TryGetValue(ec.ID, out establoCorreo);
                    if(establoCorreo != null)
                    { //Actualizamos correo
                        ec.CorreoElectronico = establoCorreo.CorreoElectronico;
                    }
                }
                
                EstabloTelefono establoTelefono;
                foreach (var te in est.EstabloTelefono)
                {
                    mapTelefonos.TryGetValue(te.ID, out establoTelefono);
                    if(establoTelefono != null)
                    { //Actualizamos los numeros telefonicos
                        te.Numero = establoTelefono.Numero; 
                        te.Tipo_Numero_ID = establoTelefono.Tipo_Numero_ID;
                    }
                }

                List<int> ids = new List<int>(mapTelefonos.Keys);
                telefonosEliminar = est.EstabloTelefono.Where(et => !ids.Contains(et.ID)).ToList();
                ids = new List<int>(mapCorreos.Keys);
                correosEliminar = est.EstabloCorreo.Where(ec => !ids.Contains(ec.ID)).ToList();

                db.EstabloCorreo.AddRange(correosInsertar);
                db.EstabloCorreo.RemoveRange(correosEliminar); //Eliminamos los correos 
                db.EstabloTelefono.AddRange(telefonosInsertar);
                db.EstabloTelefono.RemoveRange(telefonosEliminar); //Eliminamos los telefonos

                db.SaveChanges();
            }
        }

        /*
         * Elimina un establo por id
         */
        public void DeleteEstabloById(int establoId)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Establo establo = db.Establo
                    .Include("Caballo")
                    .Include("EstabloCaballo")
                    .Include("EstabloCorreo")
                    .Include("EstabloTelefono")
                    .Where(e => e.ID == establoId)
                    .SingleOrDefault();

                db.EstabloCaballo.RemoveRange(establo.EstabloCaballo);
                db.EstabloCorreo.RemoveRange(establo.EstabloCorreo);
                db.EstabloTelefono.RemoveRange(establo.EstabloTelefono);

                foreach (var caballo in establo.Caballo)
                {
                    caballo.Establo_ID = null; //Eliminamos la asociacion
                }

                db.Establo.Remove(establo);
                _dbContext.SaveChanges();
            }
        }

        /*
         * Eliminar lista de establos por ids
         */
        public bool DeleteEstablosByIds(int[] EstablosIds)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                List<Establo> Establos = db.Establo
                    .Include("Caballo")
                    .Include("EstabloCaballo")
                    .Include("EstabloCorreo")
                    .Include("EstabloTelefono")
                    .Where(e => EstablosIds.Contains(e.ID)).ToList();

                foreach(var establo in Establos)
                {
                    db.EstabloCaballo.RemoveRange(establo.EstabloCaballo);
                    db.EstabloCorreo.RemoveRange(establo.EstabloCorreo);
                    db.EstabloTelefono.RemoveRange(establo.EstabloTelefono);

                    foreach(var caballo in establo.Caballo)
                    {
                        caballo.Establo_ID = null; //Eliminamos la asociacion
                    }
                }

                db.Establo.RemoveRange(Establos);
                _dbContext.SaveChanges();
            }
            return true;
        }

        /*
         * Consultar toda la informacion del establo
         */
        public Establo GetById(int id)
        {
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                return db.Establo
                    .Include("Caballo")
                    .Include("EstabloCaballo")
                    .Include("EstabloCorreo")
                    .Include("EstabloTelefono")
                    .Include("EstabloTelefono.Tipo_Numero")
                    .Where(e => e.ID == id)
                    .First();
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
