
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.DAL.Dto
{
    public class EntidadBase
    {
        protected int ValidateIntParam(int? value)
        {
            return (value.HasValue ? value.Value : 0);
        }

        protected DateTime ValidateDateParam(DateTime? value)
        {
            return (value.HasValue ? value.Value : DateTime.Now);
        }

        protected bool ValidateBoolParam(bool? value)
        {
            return (value.HasValue ? value.Value : false);
        }

        protected int? ValidateIntParamToEF(int value)
        {
            if (value > 0)
            {
                return value;
            }
            else
            {
                return null;
            }
        }
    }
}
