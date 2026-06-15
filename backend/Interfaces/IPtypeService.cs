using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;

namespace backend.Interfaces
{
    public interface IPtypeService
    {
        Task<IEnumerable<PtypeResponseDto>> GetAllAsync();
        Task<PtypeResponseDto?> GetByCodeAsync(string ptypeCode);
        Task<PtypeResponseDto> CreateAsync(PtypeCreateUpdateDto dto);
        Task<PtypeResponseDto?> UpdateAsync(string ptypeCode, PtypeCreateUpdateDto dto);
        Task<bool> DeleteAsync(string ptypeCode);
    }
}