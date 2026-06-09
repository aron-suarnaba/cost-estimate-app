using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class PtypeService : IPtypeService
    {
        private readonly CostEstimateDbContext _context;
        public PtypeService(CostEstimateDbContext context) => _context = context;

        public async Task<IEnumerable<PtypeResponseDto>> GetAllAsync()
        {
            return await _context.Ptype.Select(p => new PtypeResponseDto
            {
                PType = p.PType, PtypeDesc = p.PtypeDesc, DescLabel = p.DescLabel, CreateDate = p.CreateDate, CreatedBy = p.CreatedBy
            }).ToListAsync();
        }

        public async Task<PtypeResponseDto?> GetByCodeAsync(string ptypeCode)
        {
            var p = await _context.Ptype.FindAsync(ptypeCode);
            return p == null ? null : new PtypeResponseDto { PType = p.PType, PtypeDesc = p.PtypeDesc, DescLabel = p.DescLabel, CreateDate = p.CreateDate, CreatedBy = p.CreatedBy };
        }

        public async Task<PtypeResponseDto> CreateAsync(PtypeCreateUpdateDto dto)
        {
            var p = new Ptype { PType = dto.PType, PtypeDesc = dto.PtypeDesc, DescLabel = dto.DescLabel, CreateDate = DateTime.Now, CreatedBy = "SYSTEM" };
            _context.Ptype.Add(p);
            await _context.SaveChangesAsync();
            return new PtypeResponseDto { PType = p.PType, PtypeDesc = p.PtypeDesc, DescLabel = p.DescLabel, CreateDate = p.CreateDate, CreatedBy = p.CreatedBy };
        }

        public async Task<PtypeResponseDto?> UpdateAsync(string ptypeCode, PtypeCreateUpdateDto dto)
        {
            var p = await _context.Ptype.FindAsync(ptypeCode);
            if (p == null) return null;
            p.PtypeDesc = dto.PtypeDesc; p.DescLabel = dto.DescLabel;
            await _context.SaveChangesAsync();
            return new PtypeResponseDto { PType = p.PType, PtypeDesc = p.PtypeDesc, DescLabel = p.DescLabel, CreateDate = p.CreateDate, CreatedBy = p.CreatedBy };
        }

        public async Task<bool> DeleteAsync(string ptypeCode)
        {
            var p = await _context.Ptype.FindAsync(ptypeCode);
            if (p == null) return false;
            _context.Ptype.Remove(p);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}