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
                    .Include("EstabloCorreo")
                    .Include("EstabloTelefono")
                    .Where(e => e.ID == establoId)
                    .First();

                //Actualizamos informacion de establo
                est.Nombre = establo.Nombre;
                est.Manager = establo.Manager;
                est.Direccion = establo.Direccion;
                est.Latitud = establo.Latitud;
                est.Longitud = establo.Longitud;

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
                List<Caballo> caballosEliminar = db.Caballo
                    .Where(c => c.Establo_ID == est.ID)
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
                    .Include("EstabloCorreo")
                    .Include("EstabloTelefono")
                    .Where(e => e.ID == establoId)
                    .SingleOrDefault();

                List<Caballo> caballos = db.Caballo
                    .Where(c => c.Establo_ID == establo.ID).ToList();

                foreach (var caballo in caballos)
                {
                    caballo.Establo_ID = null; //Eliminamos la asociacion
                }

                db.EstabloCorreo.RemoveRange(establo.EstabloCorreo);
                db.EstabloTelefono.RemoveRange(establo.EstabloTelefono);
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
                    .Include("EstabloCorreo")
                    .Include("EstabloTelefono")
                    .Where(e => EstablosIds.Contains(e.ID)).ToList();

                List<Caballo> caballitos = db.Caballo.Where(c => c.Establo_ID != null && EstablosIds.Contains(c.Establo_ID.Value)).ToList();
                if(caballitos != null)
                {
                    foreach(var caballo in caballitos)
                    {
                        caballo.Establo_ID = null; //Adios establo!
                    }
                }
                foreach(var establo in Establos)
                {
                    db.EstabloCorreo.RemoveRange(establo.EstabloCorreo);
                    db.EstabloTelefono.RemoveRange(establo.EstabloTelefono);
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

                Establo establo = db.Establo
                    .Include("EstabloCorreo")
                    .Include("EstabloTelefono")
                    .Include("EstabloTelefono.Tipo_Numero")
                    .Where(e => e.ID == id)
                    .First();

                List<Caballo> caballos = db.Caballo.Where(c => c.Establo_ID == establo.ID).OrderBy(c => c.Nombre).ToList();
                establo.Caballo = caballos;

                return establo;
            }
        }
    }
}
