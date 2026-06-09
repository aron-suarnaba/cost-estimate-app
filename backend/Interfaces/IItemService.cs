using backend.DTOs;

namespace backend.Interfaces
{
    public interface IItemService
    {
        Task<IEnumerable<ItemResponseDto>> GetAllItemsAsync();
        Task<ItemResponseDto?> GetItemsByIdAsync(string itemCode); // Changed to string
        Task<ItemResponseDto> CreateItemsAsync(ItemCreateUpdateDto dto);
        Task<ItemResponseDto?> UpdateItemsAsync(string itemCode, ItemCreateUpdateDto dto); // Changed to string
        Task<bool> DeleteItemsAsync(string itemCode); // Changed to string
    }
}