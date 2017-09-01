using System;
using System.Net.Http;
using System.Web;
using Newtonsoft.Json;
using Equilinked.DAL.Dto;

namespace Equilinked.BLL
{
    public class ValidacionTokensBLL
    {
        private string API_GOOGLE = "https://www.googleapis.com";
        private string API_FACEBOOK = "https://graph.facebook.com";

        private string FACEBOOK_CLIENT_ID = "667340546803671";
        private string FACEBOOK_CLIENT_SECRET = "b55afbc690277839d08b283bfc8b998e";

        private HttpClient client;

        private string ObtenerTokenApp(string clientId, string clientSecret)
        {
            string tokenApp = null;
            client = new HttpClient();
            var builder = new UriBuilder(API_FACEBOOK + "/oauth/access_token");
            builder.Port = -1;
            var query = HttpUtility.ParseQueryString(builder.Query);
            query["client_id"] = clientId;
            query["client_secret"] = clientSecret;
            query["grant_type"] = "client_credentials";

            builder.Query = query.ToString();

            HttpResponseMessage response = client.GetAsync(builder.ToString()).Result;
            if (response.IsSuccessStatusCode)
            {
                dynamic responseJSON = JsonConvert.DeserializeObject(response.Content.ReadAsStringAsync().Result);
                tokenApp = responseJSON["access_token"];
            }

            return tokenApp;
        }

        public bool ObtenerEstadoTokenFacebook(string token)
        {
            bool tokenOk = false;
            client = new HttpClient();

            var builder = new UriBuilder(API_FACEBOOK + "/debug_token");
            builder.Port = -1;
            var query = HttpUtility.ParseQueryString(builder.Query);
            query["input_token"] = token;
            query["access_token"] = ObtenerTokenApp(FACEBOOK_CLIENT_ID, FACEBOOK_CLIENT_SECRET);
            builder.Query = query.ToString();

            HttpResponseMessage response = client.GetAsync(builder.ToString()).Result;
            if (response.IsSuccessStatusCode)
            {
                dynamic responseJSON = JsonConvert.DeserializeObject(response.Content.ReadAsStringAsync().Result);
                string isValid = responseJSON["data"]["is_valid"];
                tokenOk = isValid.ToLower() == "true";
            }
            return tokenOk;
        }

        public InfoUsuarioToken ValidarTokenFacebook(string token)
        {
            InfoUsuarioToken infoUsuarioToken = null;
            client = new HttpClient();
            var builder = new UriBuilder(API_FACEBOOK + "/me");
            builder.Port = -1;
            var query = HttpUtility.ParseQueryString(builder.Query);
            query["access_token"] = token;
            query["fields"] = "name,email";
            builder.Query = query.ToString();

            HttpResponseMessage response = client.GetAsync(builder.ToString()).Result;
            if (response.IsSuccessStatusCode)
            {
                dynamic responseJSON = JsonConvert.DeserializeObject(response.Content.ReadAsStringAsync().Result);
                infoUsuarioToken = new InfoUsuarioToken();
                infoUsuarioToken.Nombre = responseJSON["name"];
                infoUsuarioToken.Correo = responseJSON["email"];
                infoUsuarioToken.TipoIdentificacion = 2;
            }
            return infoUsuarioToken;
        }

        public InfoUsuarioToken ValidarTokenGoogle(string token)
        {
            InfoUsuarioToken infoUsuarioToken = null;
            client = new HttpClient();

            var builder = new UriBuilder(API_GOOGLE + "/oauth2/v3/tokeninfo");
            builder.Port = -1;
            var query = HttpUtility.ParseQueryString(builder.Query);
            query["id_token"] = token;
            builder.Query = query.ToString();

            client.DefaultRequestHeaders.Clear();
            HttpResponseMessage response = client.GetAsync(builder.ToString()).Result;
            if (response.IsSuccessStatusCode)
            {
                dynamic responseJSON = JsonConvert.DeserializeObject(response.Content.ReadAsStringAsync().Result);
                infoUsuarioToken = new InfoUsuarioToken();
                infoUsuarioToken.Nombre = responseJSON["name"];
                infoUsuarioToken.Correo = responseJSON["email"];
                infoUsuarioToken.TipoIdentificacion = 3;
            }
            return infoUsuarioToken;
        }

    }
}
