using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class BLLBase : IDisposable
    {
        protected EquilinkedEntities _dbContext { get; set; }

        public BLLBase()
        {
            this._dbContext = new EquilinkedEntities();
        }

        protected void LogException(Exception ex)
        {

        }

        void IDisposable.Dispose()
        {
            this._dbContext.Dispose();
        }        

    }
}
