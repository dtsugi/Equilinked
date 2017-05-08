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
    public class CaballoBLL : BLLBase, IBase<Caballo>
    {
        public List<Caballo> GetAll()
        {
            throw new NotImplementedException();
        }

        public Caballo GetById(int id)
        {
            throw new NotImplementedException();
        }

        public bool DeleteById(int id)
        {
            throw new NotImplementedException();
        }

        public Caballo Insert(Caballo entity)
        {
            throw new NotImplementedException();
        }        

        public List<CaballoDto> GetAllSerializedByPropietarioId(int propietarioId)
        {
            List<CaballoDto> listSerialized = new List<CaballoDto>();
            List<Caballo> listCaballo = this.GetAllByPropietarioId(propietarioId);
            foreach (Caballo item in listCaballo)
            {
                listSerialized.Add(new CaballoDto(item));
            }
            return listSerialized;
        }

        private List<Caballo> GetAllByPropietarioId(int propietarioId)
        {
            return _dbContext.Caballo.Where(x => x.Propietario_ID == propietarioId).ToList();
        }
    }
}
