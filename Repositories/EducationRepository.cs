using System.Text.Json;
using MyPortfolio.Models;

namespace MyPortfolio.Repositories
{
    public class EducationRepository
    {
        private readonly string _filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "json", "education.json");

        public IEnumerable<Education> GetAllEducation()
        {
            var jsonData = File.ReadAllText(_filePath);
            var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
            return JsonSerializer.Deserialize<IEnumerable<Education>>(jsonData, options) ?? Enumerable.Empty<Education>();
        }
    }
}