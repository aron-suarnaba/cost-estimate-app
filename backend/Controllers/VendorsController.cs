using System.Collections.Generic;
using System.Threading.Tasks;
using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class VendorsController : ControllerBase
    {
        private readonly IVendorsService _service;
        public VendorsController(IVendorsService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<VendorsResponseDto>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{vendnum}")]
        public async Task<ActionResult<VendorsResponseDto>> GetByNum(string vendnum)
        {
            var result = await _service.GetByNumAsync(vendnum);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<VendorsResponseDto>> Create([FromBody] VendorsCreateUpdateDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetByNum), new { vendnum = result.Vendnum }, result);
        }

        [HttpPut("{vendnum}")]
        public async Task<ActionResult<VendorsResponseDto>> Update(string vendnum, [FromBody] VendorsCreateUpdateDto dto)
        {
            var result = await _service.UpdateAsync(vendnum, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpDelete("{vendnum}")]
        public async Task<IActionResult> Delete(string vendnum) => await _service.DeleteAsync(vendnum) ? NoContent() : NotFound();
    }
}