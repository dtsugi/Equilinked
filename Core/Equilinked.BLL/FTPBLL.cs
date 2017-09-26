using System.IO;
using System.Net;

namespace Equilinked.BLL
{
    public class FTPBLL
    {
        /*
        private string SERVER_FTP = "ftp://127.0.0.1";
        private string USER = "JAST";
        private string PASSWORD = "chucho25";
        */
        private string SERVER_FTP = "ftp://waws-prod-bn1-007.ftp.azurewebsites.windows.net/equilinked-data";
        private string USER = "FiVet2\\$FiVet2";
        private string PASSWORD = "3plhX55YlpvFEGcyrXkFAyh3pCjAXTllEu162F3a1uhQfk2uX0T1g4ca6foj";

        public Stream GetStreamImage(string pathImage)
        {
            FtpWebRequest request = (FtpWebRequest)FtpWebRequest.Create(SERVER_FTP + pathImage);
            request.Credentials = new NetworkCredential(USER, PASSWORD);
            request.UseBinary = true;
            request.Method = WebRequestMethods.Ftp.DownloadFile;

            FtpWebResponse response = (FtpWebResponse)request.GetResponse();
            Stream ftpStream = response.GetResponseStream();
            return ftpStream;
        }

        public void DeleteStreamImage(string pathImage)
        {
            FtpWebRequest request = (FtpWebRequest)FtpWebRequest.Create(SERVER_FTP + pathImage);
            request.Credentials = new NetworkCredential(USER, PASSWORD);
            request.Method = WebRequestMethods.Ftp.DeleteFile;
            var response = (FtpWebResponse)request.GetResponse();
            response.Close();
        }

        public void SaveStreamImage(Stream image, string pathImage, long contentLength)
        {
            FtpWebRequest request = (FtpWebRequest)FtpWebRequest.Create(SERVER_FTP + pathImage);
            request.Credentials = new NetworkCredential(USER, PASSWORD);
            request.Method = WebRequestMethods.Ftp.UploadFile;

            request.UsePassive = true;
            request.UseBinary = true;
            request.KeepAlive = true;
            request.ContentLength = contentLength;
            using (Stream streamRequest = request.GetRequestStream())
            {
                image.CopyTo(streamRequest);
                streamRequest.Close();
            }
            var response = (FtpWebResponse)request.GetResponse();
            response.Close();
        }
    }
}
