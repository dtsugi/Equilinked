using Equilinked.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Equilinked.BLL
{
    public class EnvioCorreoInvitacionBLL: BLLBase
    {

        private const int ID_PLANTILLA_INVITACION = 1;

        public void sendInvitation(InvitacionAmigo Invitacion)
        {
            PlantillaCorreo plantilla;
            Propietario propietario;
            using (var db = this._dbContext)
            {
                db.Configuration.LazyLoadingEnabled = false;
                plantilla = db.PlantillaCorreo
                    .Include("ConfiguracionCorreo")
                    .Where(pc => pc.ID == ID_PLANTILLA_INVITACION)
                    .FirstOrDefault();
                propietario = db.Propietario
                    .Where(p => p.ID == Invitacion.Propietario_ID)
                    .FirstOrDefault();
            }
            
            String template = plantilla.Contenido;
            template = template.Replace("{{NombreRemitente}}", propietario.Nombre);
            template = template.Replace("{{Mensaje}}", Invitacion.Mensaje);

            //Armar el correo!
            MailMessage email = new MailMessage();
            email.To.Add(new MailAddress(Invitacion.CorreoDestinatario));
            email.From = new MailAddress(plantilla.ConfiguracionCorreo.Correo);
            email.Subject = plantilla.Asunto;
            email.Body = template;
            email.IsBodyHtml = true;
            email.Priority = MailPriority.High;

            SmtpClient smtp = new SmtpClient();
            ConfiguracionCorreo configuracion = plantilla.ConfiguracionCorreo;
            smtp.Host = plantilla.ConfiguracionCorreo.Host;
            smtp.Port = Int32.Parse(plantilla.ConfiguracionCorreo.Puerto);
            smtp.EnableSsl = plantilla.ConfiguracionCorreo.EnableSsl;
            smtp.UseDefaultCredentials = plantilla.ConfiguracionCorreo.UseDefaultCredentials;
            smtp.Credentials = new NetworkCredential(configuracion.Correo, configuracion.Contrasena);

            smtp.Send(email);
            email.Dispose();
        }
    }
}
