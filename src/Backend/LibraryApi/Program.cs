using LibraryApi.Services;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Rejestracja serwisu MongoDB
builder.Services.AddSingleton<BooksService>();

// Umożliwiamy przyjmowanie i zwracanie statusów jako tekst ("Available", "Borrowed")
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Konfiguracja CORS (umożliwia komunikację z Angulara)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                  "https://angulardemo.md-dev.net.pl",
                  "http://angulardemo.md-dev.net.pl",
                  "http://localhost:4200",
                  "https://localhost:4200"
              )
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();