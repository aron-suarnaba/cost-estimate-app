using System;
using System.Text.Json.Serialization;

namespace backend.DTOs
{
    public class PtypeCreateUpdateDto
    {
        [JsonPropertyName("pType")]
        // Adding 'required' ensures this property must be provided during initialization
        public required string PType { get; set; }

        [JsonPropertyName("ptypeDesc")]
        public string? PtypeDesc { get; set; }

        [JsonPropertyName("descLabel")]
        public string? DescLabel { get; set; }
    }

    public class PtypeResponseDto
    {
        [JsonPropertyName("pType")]
        public string PType { get; set; } = string.Empty;

        [JsonPropertyName("ptypeDesc")]
        public string? PtypeDesc { get; set; }

        [JsonPropertyName("descLabel")]
        public string? DescLabel { get; set; }

        [JsonPropertyName("createDate")]
        public DateTime? CreateDate { get; set; }

        [JsonPropertyName("createdBy")]
        public string? CreatedBy { get; set; }
    }
}