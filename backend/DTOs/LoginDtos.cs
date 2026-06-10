using System.Text.Json.Serialization;

namespace backend.DTOs
{
    public class LoginRequestDto
    {
        [JsonPropertyName("username")]
        public required string Username { get; set; }

        [JsonPropertyName("password")]
        public required string Password { get; set; }
    }

    public class LoginResponseDto
    {
        public required string Token { get; set; }
        public required string Username { get; set; }
    }
}