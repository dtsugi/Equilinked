using Equilinked.DAL.Models;
using Equilinked.DAL.Dto;
using System.Collections.Generic;
using System.Linq;

namespace Equilinked.BLL
{
    public class UsuarioBLL : BLLBase
    {

        public Usuario GetById(int id)
        {
            return this._dbContext.Usuario.Where(x => x.ID == id).FirstOrDefault();
        }

        public List<Usuario> GetAll()
        {
            return this._dbContext.Usuario.ToList();
        }

        public Usuario Login(string username, string password)
        {
            return this._dbContext.Usuario.Where(x => x.Login == username && x.Password == password).FirstOrDefault();
        }

        public CambioPassword ChangePasswordByUsuarioId(int UsuarioId, CambioPassword Passwords)
        {
            using(var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;

                Usuario usuario = db.Usuario.Where(u => u.ID == UsuarioId).FirstOrDefault();
                if(usuario.Password == Passwords.ContrasenaActual)
                {
                    usuario.Password = Passwords.NuevaContrasena;
                    db.SaveChanges();
                    Passwords.StatusCambio = true;
                } else
                {
                    Passwords.StatusCambio = false;
                }
                Passwords.NuevaContrasena = null;
                Passwords.ContrasenaActual = null;
                return Passwords;
            }
        }
    }
}
