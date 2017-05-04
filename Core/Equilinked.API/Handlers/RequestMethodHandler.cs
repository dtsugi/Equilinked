using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Equilinked.API.Handlers
{
    public class RequestMethodHandler : DelegatingHandler
    {
        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (request.Headers.Contains("Origin") && request.Method == HttpMethod.Options)
            {
                var response = new HttpResponseMessage(HttpStatusCode.OK);
                //response.Headers.Add("Access-Control-Allow-Origin", "*");
                response.Headers.Add("Access-Control-Allow-Methods", "PUT, POST, DELETE, OPTIONS");
                response.Headers.Add("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

                return response;
            }
            return await base.SendAsync(request, cancellationToken);
        }
    }
}