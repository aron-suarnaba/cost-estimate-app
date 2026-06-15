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
    public class PtypeController : ControllerBase
    {
        private readonly IPtypeService _service;
        public PtypeController(IPtypeService service) => _service = service;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PtypeResponseDto>>> GetAll() => Ok(await _service.GetAllAsync());

        [HttpGet("{ptypeCode}")]
        public async Task<ActionResult<PtypeResponseDto>> GetByCode(string ptypeCode)
        {
            var result = await _service.GetByCodeAsync(ptypeCode);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<PtypeResponseDto>> Create([FromBody] PtypeCreateUpdateDto dto)
        {
            var result = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetByCode), new { ptypeCode = result.PType }, result);
        }

        [HttpPut("{ptypeCode}")]
        public async Task<ActionResult<PtypeResponseDto>> Update(string ptypeCode, [FromBody] PtypeCreateUpdateDto dto)
        {
            var result = await _service.UpdateAsync(ptypeCode, dto);
            return result == null ? NotFound() : Ok(result);
        }

        [HttpDelete("{ptypeCode}")]
        public async Task<IActionResult> Delete(string ptypeCode) => await _service.DeleteAsync(ptypeCode) ? NoContent() : NotFound();
    }
}