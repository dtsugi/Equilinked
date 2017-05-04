using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Equilinked.API.Models
{
    public class UserSessionDto
    {
        public int IdUser { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }        
    }
}