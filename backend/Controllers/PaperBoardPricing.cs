using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaperBoardPricingController : ControllerBase
    {
        private readonly IPaperBoardPricingService _service;
        public PaperBoardPricingController(IPaperBoardPricingService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaperBoardPricingResponseDto>>> GetAll() => Ok(await _service.GetAllAsync());

        // Standardized composite key queries using descriptive path segments
        [HttpGet("{itemCode}/{vendor}/{ptype}")]
        public async Task<ActionResult<PaperBoardPricingResponseDto>> GetByKey(string itemCode, string vendor, string ptype)
        {
            var result = await _service.GetByKeyAsync(itemCode, vendor, ptype);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<PaperBoardPricingResponseDto>> Create([FromBody] PaperBoardPricingCreateUpdateDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetByKey), new { itemCode = result.ItemCode, vendor = result.Vendor, ptype = result.PType }, result);
        }

        [HttpPut("{itemCode}/{vendor}/{ptype}")]
        public async Task<ActionResult<PaperBoardPricingResponseDto>> Update(string itemCode, string vendor, string ptype, [FromBody] PaperBoardPricingCreateUpdateDto dto)
        {
            var result = await _service.UpdateAsync(itemCode, vendor, ptype, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpDelete("{itemCode}/{vendor}/{ptype}")]
        public async Task<IActionResult> Delete(string itemCode, string vendor, string ptype)
            => await _service.DeleteAsync(itemCode, vendor, ptype) ? NoContent() : NotFound();
    }
}