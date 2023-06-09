using Timer.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();

builder.Services.AddCors(
    options =>
    {
        options.AddPolicy("ClientPermission", policy =>
        {
            policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000")
            .AllowCredentials();
        });
    }
);

builder.Services.AddHostedService<TimerUpdater>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapHub<TimerHub>("/timer");

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("ClientPermission");

app.MapControllers();

app.Run();
