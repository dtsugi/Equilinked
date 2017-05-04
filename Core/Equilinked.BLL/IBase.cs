using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public interface IBase<T>
    {
        //Get All        
        List<T> GetAll();

        T GetById(int id);

        bool DeleteById(int id);

        T Insert(T entity);
    }
}
