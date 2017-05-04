using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public bool Login(string username, string password)
        {
            Usuario user = this._dbContext.Usuario.Where(x => x.Login == username && x.Password == password).FirstOrDefault();
            return (user != null ? true : false);
        }
    }
}
