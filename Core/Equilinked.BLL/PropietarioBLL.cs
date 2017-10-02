using Equilinked.DAL.Dto;
using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;

namespace Equilinked.BLL
{
    public class PropietarioBLL : BLLBase, IBase<Propietario>
    {

        private FTPBLL ftpBLL = new FTPBLL();

        public void UpdateStreamFotoPerfilPropietario(int propietarioId, Stream foto, string name, long length)
        {
            string newFileName = Guid.NewGuid().ToString() + Path.GetExtension(name);
            ftpBLL.SaveStreamImage(foto, "/foto-perfil/usuario/" + newFileName, length);
            string fotoEliminar;
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                Propietario propietario = db.Propietario.Where(p => p.ID == propietarioId).FirstOrDefault();
                fotoEliminar = propietario.Image;
                propietario.Image = newFileName;
                db.SaveChanges();
            }
            if(fotoEliminar != null)
            {
                ftpBLL.DeleteStreamImage("/foto-perfil/usuario/" + fotoEliminar);
            }
        }

        public Stream GetStreamFotoPerfilPropietario(int propietarioId)
        {
            Propietario propietario = null;
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                propietario = db.Propietario.Where(p => p.ID == propietarioId).FirstOrDefault();
            }
            if(propietario != null && propietario.Image != null)
            {
                string imagePath = "/foto-perfil/usuario/" + propietario.Image;//esta se debe sacar de base de datos
                return ftpBLL.GetStreamImage(imagePath);
            }
            else
            {
                return null;
            }
        }

        public void SavePropietarioAndUsuario(Propietario propietario, out bool usernameValid, out bool emailValid)
        {
            usernameValid = false;
            emailValid = false;
            Usuario usuario = propietario.Usuario;
            propietario.Usuario = null;
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                usernameValid = db.Usuario.Where(u => u.Login.ToLower() == usuario.Login.ToLower()).FirstOrDefault() == null;
                emailValid = db.Propietario.Where(p => p.Mail.ToLower() == propietario.Mail.ToLower()).FirstOrDefault() == null;
                if (usernameValid && emailValid)
                {
                    //El usuario ya trae el "login" y "password"
                    usuario.SignInDate = DateTime.Now;
                    usuario.Activo = true;
                    db.Usuario.Add(usuario);

                    //El propietario solo trae "correo"
                    propietario.FechaNacimiento = DateTime.Now;
                    propietario.Usuario_ID = usuario.ID;

                    db.Propietario.Add(propietario);
                    db.SaveChanges();
                }
            }
        }

        public Propietario ValidateUsuarioByToken(InfoUsuarioToken infoUsuarioToken)
        {
            string user = null;
            Usuario usuario;
            Propietario propietario;
            if(infoUsuarioToken.TipoIdentificacion == 2)//Face
            {
                user = "fb_" + infoUsuarioToken.Correo;
            } else if(infoUsuarioToken.TipoIdentificacion == 3)//google
            {
                user = "gg_" + infoUsuarioToken.Correo;
            }
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                     usuario = db.Usuario
                    .Where(u => u.Login == user).FirstOrDefault();
                if(usuario == null)
                {
                    string uuid = System.Guid.NewGuid().ToString();
                    usuario = new Usuario();
                    usuario.Login = user;
                    usuario.Password = uuid.Substring(uuid.Length - 10);
                    usuario.SignInDate = DateTime.Now;
                    usuario.Activo = true;
                    db.Usuario.Add(usuario);

                    propietario = new Propietario();
                    propietario.Nombre = infoUsuarioToken.Nombre;
                    propietario.Mail = infoUsuarioToken.Correo;
                    propietario.Usuario_ID = usuario.ID;
                    propietario.FechaNacimiento = DateTime.Now;
                    db.Propietario.Add(propietario);

                    db.SaveChanges();
                    propietario.Usuario = usuario;
                } else
                {
                    propietario = db.Propietario
                        .Include("Usuario")
                        .Where(p => p.Usuario_ID == usuario.ID)
                        .FirstOrDefault();
                }
            }
            return propietario;
        }

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
                    .Include("Usuario")
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
