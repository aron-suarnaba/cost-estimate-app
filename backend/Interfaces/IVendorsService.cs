using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;

namespace backend.Interfaces
{
    public interface IVendorsService
    {
        Task<IEnumerable<VendorsResponseDto>> GetAllAsync();
        Task<VendorsResponseDto?> GetByNumAsync(string vendnum);
        Task<VendorsResponseDto> CreateAsync(VendorsCreateUpdateDto dto);
        Task<VendorsResponseDto?> UpdateAsync(string vendnum, VendorsCreateUpdateDto dto);
        Task<bool> DeleteAsync(string vendnum);
    }
}