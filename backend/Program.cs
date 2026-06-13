using System.Text;
using backend.Data;
using backend.Interfaces;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using backend.Middleware;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// 1. JWT AUTHENTICATION CONFIGURATION
// ============================================================================


var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKeyString = jwtSettings["Secret"] ?? "SuperSecretBackupKeyThatIsAtLeast32BytesLong123!";
var secretKey = Encoding.UTF8.GetBytes(secretKeyString);

var issuer = jwtSettings["Issuer"] ?? "http://localhost:7282";
var audience = jwtSettings["Audience"] ?? "http://localhost:5173";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(secretKey),
        ClockSkew = TimeSpan.Zero
    };
});

// ============================================================================
// 2. DATA STORAGE & DATABASE CONFIGURATION
// ============================================================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

builder.Services.AddDbContext<CostEstimateDbContext>(options => 
    options.UseSqlServer(connectionString));

// ============================================================================
// 3. SECURITY & CROSS-ORIGIN RESOURCE SHARING (CORS)
// ============================================================================
var costEstimateCorsPolicy = "_CostEstimateCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: costEstimateCorsPolicy,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()  
                  .AllowAnyMethod()  
                  .AllowCredentials(); 
        });
});

// ============================================================================
// 4. DEPENDENCY INJECTION (APPLICATION SERVICES)
// ============================================================================
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddScoped<IPtypeService, PtypeService>();
builder.Services.AddScoped<IVendorsService, VendorsService>();
builder.Services.AddScoped<IPaperBoardPricingService, PaperBoardPricingService>();

// ============================================================================
// 5. CORE CONTROLLER & API FRAMEWORKS
// ============================================================================
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddControllers(options =>
{
    options.Filters.Add(new AuthorizeFilter());
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

// ============================================================================
// 6. HTTP REQUEST PIPELINE (MIDDLEWARE REQUISITE ORDER)
// ============================================================================
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseExceptionHandler();

// 1. Apply CORS boundary limits first
app.UseCors(costEstimateCorsPolicy);

// 2. CRITICAL FIX: Tell ASP.NET Core to decode and validate incoming JWT strings!
app.UseAuthentication(); 

// 3. Evaluate if the verified user identities match your [Authorize] requirements
app.UseAuthorization();

app.MapControllers();

app.Run();