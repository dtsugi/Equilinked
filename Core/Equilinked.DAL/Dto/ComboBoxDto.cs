using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.DAL.Dto
{
     public class ComboBoxDto
    {
        public string Key { get; set; }
        public string Value { get; set; }        

        public ComboBoxDto() { }

        public ComboBoxDto(string key,string value)
        {
            this.Key = key;
            this.Value = value;
        }
     }
}
