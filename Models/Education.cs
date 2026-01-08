using System.Text.Json.Serialization;

namespace MyPortfolio.Models
{
    public class Education
    {
        [JsonPropertyName("institution")]
        public required string Institution { get; set; }

        [JsonPropertyName("startDate")]
        public required string StartDate { get; set; }

        [JsonPropertyName("endDate")]
        public required string EndDate { get; set; }

        [JsonPropertyName("degree")]
        public required string Degree { get; set; }

        [JsonPropertyName("skills")]
        public required List<string> Skills { get; set; }
    }
}