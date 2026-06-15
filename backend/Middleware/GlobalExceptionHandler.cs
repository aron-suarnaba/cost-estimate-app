using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace backend.Middleware
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            _logger.LogError(exception, "An unhandled exception occurred.");

            var response = new
            {
                StatusCode = StatusCodes.Status500InternalServerError,
                Message = "An unexpected server error occured.",
                Details = exception.Message
            };

            if(exception is DbUpdateException)
            {
                response = new
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "A database integrity error occured. Check for duplicate keys or invalid data",
                    Details = exception.InnerException?.Message ?? exception.Message
                };
            }

            httpContext.Response.StatusCode = response.StatusCode;
            await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);

            return true;
        }
    }
}