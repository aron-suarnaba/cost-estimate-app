using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;

namespace backend.Interfaces
{
    public interface IPaperBoardPricingService
    {
        Task<IEnumerable<PaperBoardPricingResponseDto>> GetAllAsync();
        // Composite keys lookups require all 3 key parameters
        Task<PaperBoardPricingResponseDto?> GetByKeyAsync(string itemCode, string vendor, string ptype);
        Task<PaperBoardPricingResponseDto> CreateAsync(PaperBoardPricingCreateUpdateDto dto);
        Task<PaperBoardPricingResponseDto?> UpdateAsync(string itemCode, string vendor, string ptype, PaperBoardPricingCreateUpdateDto dto);
        Task<bool> DeleteAsync(string itemCode, string vendor, string ptype);
    }
}