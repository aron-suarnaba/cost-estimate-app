using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemController(IItemService itemService)
        {
            _itemService = itemService;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemResponseDto>>> GetAllItems()
        {
            var items = await _itemService.GetAllItemsAsync();
            return Ok(items);
        }

        // Changed parameter from 'int id' to 'string itemCode' to match your model's [Key]
        [HttpGet("{itemCode}")]
        public async Task<ActionResult<ItemResponseDto>> GetItemsByCode(string itemCode)
        {
            var item = await _itemService.GetItemsByIdAsync(itemCode);
            if (item == null) return NotFound($"Item with code '{itemCode}' not found.");
            
            return Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<ItemResponseDto>> CreateItems([FromBody] ItemCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var createdItem = await _itemService.CreateItemsAsync(dto);
            
            // Fixed the incomplete CreatedAtAction return block
            return CreatedAtAction(
                nameof(GetItemsByCode), 
                new { itemCode = createdItem.ItemCode }, 
                createdItem
            );
        }

        [HttpPut("{itemCode}")]
        public async Task<ActionResult<ItemResponseDto>> UpdateItems(string itemCode, [FromBody] ItemCreateUpdateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updatedItem = await _itemService.UpdateItemsAsync(itemCode, dto);
            if (updatedItem == null) return NotFound($"Item with code '{itemCode}' not found.");

            return Ok(updatedItem);
        }

        [HttpDelete("{itemCode}")]
        public async Task<IActionResult> DeleteItems(string itemCode)
        {
            var deleted = await _itemService.DeleteItemsAsync(itemCode);
            if (!deleted) return NotFound($"Item with code '{itemCode}' not found.");

            return NoContent(); // 204 No Content is standard for successful deletions
        }
    }
}