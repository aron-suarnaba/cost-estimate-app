using backend.Data;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class VendorsService : IVendorsService
    {
        private readonly CostEstimateDbContext _context;
        public VendorsService(CostEstimateDbContext context) => _context = context;

        public async Task<IEnumerable<VendorsResponseDto>> GetAllAsync()
        {
            return await _context.Vendors.Select(v => new VendorsResponseDto
            {
                Vendnum = v.Vendnum,
                Group = v.Group,
                Name = v.Name,
                Currcode = v.Currcode,
                CreateDate = v.CreateDate,
                CreatedBy = v.CreatedBy
            }).ToListAsync();
        }

        public async Task<VendorsResponseDto?> GetByNumAsync(string vendnum)
        {
            var v = await _context.Vendors.FindAsync(vendnum);
            return v == null ? null : new VendorsResponseDto { Vendnum = v.Vendnum, Group = v.Group, Name = v.Name, Currcode = v.Currcode, CreateDate = v.CreateDate, CreatedBy = v.CreatedBy };
        }

        public async Task<VendorsResponseDto> CreateAsync(VendorsCreateUpdateDto dto)
        {
            var v = new Vendors { Vendnum = dto.Vendnum, Group = dto.Group, Name = dto.Name, Currcode = dto.Currcode, CreateDate = DateTime.Now, CreatedBy = "SYSTEM" };
            _context.Vendors.Add(v);
            await _context.SaveChangesAsync();
            return new VendorsResponseDto { Vendnum = v.Vendnum, Group = v.Group, Name = v.Name, Currcode = v.Currcode, CreateDate = v.CreateDate, CreatedBy = v.CreatedBy };
        }

        public async Task<VendorsResponseDto?> UpdateAsync(string vendnum, VendorsCreateUpdateDto dto)
        {
            var v = await _context.Vendors.FindAsync(vendnum);
            if (v == null) return null;
            v.Group = dto.Group; v.Name = dto.Name; v.Currcode = dto.Currcode;
            await _context.SaveChangesAsync();
            return new VendorsResponseDto { Vendnum = v.Vendnum, Group = v.Group, Name = v.Name, Currcode = v.Currcode, CreateDate = v.CreateDate, CreatedBy = v.CreatedBy };
        }

        public async Task<bool> DeleteAsync(string vendnum)
        {
            var v = await _context.Vendors.FindAsync(vendnum);
            if (v == null) return false;
            _context.Vendors.Remove(v);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}