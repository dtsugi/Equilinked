using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class ProtectorBLL : BLLBase
    {

        public List<Protector> GetAllProtector()
        {
            return this._dbContext.Protector.ToList();
        }

    }
}
