using backend.Data;
using backend.Interfaces;
using backend.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ============================================================================
// 1. DATA STORAGE & DATABASE CONFIGURATION
// ============================================================================

// Extract the connection string from appsettings.json.
// Throws a fail-fast exception if the connection string is completely missing.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

// Register the Entity Framework Core Database Context to use Microsoft SQL Server.
builder.Services.AddDbContext<CostEstimateDbContext>(options => 
    options.UseSqlServer(connectionString));

// ============================================================================
// 2. SECURITY & CROSS-ORIGIN RESOURCE SHARING (CORS)
// ============================================================================

// Defined key name for the specific Cross-Origin browser security policy
var costEstimateCorsPolicy = "_CostEstimateCorsPolicy";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: costEstimateCorsPolicy,
        policy =>
        {
            // Restrict access explicitly to the local Vite/React development port
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()  // Allow any HTTP headers (e.g., Content-Type, Authorization)
                  .AllowAnyMethod()  // Allow all HTTP verbs (GET, POST, PUT, DELETE, etc.)
                  .AllowCredentials(); // Permit cross-origin requests to pass credentials/cookies
        });
});

// ============================================================================
// 3. DEPENDENCY INJECTION (APPLICATION SERVICES)
// ============================================================================

// Services are registered with a 'Scoped' lifetime. 
// Meaning: A single instance is created per incoming HTTP request and disposed of at the end of that request.
builder.Services.AddScoped<IItemService, ItemService>();
builder.Services.AddScoped<IPtypeService, PtypeService>();
builder.Services.AddScoped<IVendorsService, VendorsService>();
builder.Services.AddScoped<IPaperBoardPricingService, PaperBoardPricingService>();

// ============================================================================
// 4. CORE CONTROLLER & API FRAMEWORKS
// ============================================================================

// Register Controller support for the MVC routing system
builder.Services.AddControllers();

// Register the modern .NET OpenAPI engine for automated API endpoint documentation
builder.Services.AddOpenApi();

// Build the application configuration into a concrete executable WebApplication instance
var app = builder.Build();

// ============================================================================
// 5. HTTP REQUEST PIPELINE (MIDDLEWARE REQUISITE ORDER)
// ============================================================================

// Expose OpenAPI documentation metadata endpoints (*.json) ONLY during local development cycles
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Intercept unencrypted HTTP requests and automatically redirect clients to secure HTTPS (SSL/TLS)
app.UseHttpsRedirection();

// Enforce the CORS policy. Must be invoked BEFORE Routing, Authentication, and Endpoint mapping.
app.UseCors(costEstimateCorsPolicy);

// Evaluate security claims and access token rules before running target Controller logic
app.UseAuthorization();

// Map route definitions found in Controller classes (e.g., [Route("api/[controller]")])
app.MapControllers();

// ============================================================================
// 6. APPLICATION START
// ============================================================================

// Run the web application, block the main execution thread, and start listening to incoming network requests.
app.Run();