using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Equilinked.BLL;
using System.Web.Http.Description;
using Equilinked.DAL.Models;
using System.Web;
using Equilinked.DAL.Dto;

namespace Equilinked.API.Controllers
{
    public class MensajeContactoController : EquilinkedBaseController
    {
        private ContactoBLL ContactoBll = new ContactoBLL();

        [HttpPost, Route("api/MensajeContacto")]
        [ResponseType(typeof(MensajeContacto))]
        public IHttpActionResult InsertGrupo()
        {
            MensajeContacto Reporte;
            FileDto file0 = null, file1 = null;
            HttpRequest httpRequest = HttpContext.Current.Request;
            try
            {
                HttpPostedFile postedFile0 = httpRequest.Files["file0"];
                HttpPostedFile postedFile1 = httpRequest.Files["file1"];
                if(postedFile0 != null)
                {
                    file0 = new FileDto() { File = postedFile0.InputStream, Name = postedFile0.FileName, Length = postedFile0.ContentLength };
                }
                if(postedFile1 != null)
                {
                    file1 = new FileDto() { File = postedFile1.InputStream, Name = postedFile1.FileName, Length = postedFile1.ContentLength };

                }
                Reporte = new MensajeContacto() {
                    MotivoContacto_ID = int.Parse(httpRequest.Form["MotivoContacto_ID"]),
                    Mensaje = httpRequest.Form["Mensaje"],
                    Propietario_ID = int.Parse(httpRequest.Form["Propietario_ID"])
                    };
                return Ok(ContactoBll.Insert(Reporte, file0, file1));
            }
            catch (Exception ex)
            {
                this.LogException(ex);
                throw new HttpResponseException(Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "No fue posible guardar el reporte"));
            }
        }
    }
}