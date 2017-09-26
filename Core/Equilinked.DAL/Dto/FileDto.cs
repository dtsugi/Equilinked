using System.IO;

namespace Equilinked.DAL.Dto
{
    public class FileDto
    {
        public Stream File { get; set; }
        public string Name { get; set; }
        public long Length { get; set; }
        public string Base64 { get; set; }
    }
}
