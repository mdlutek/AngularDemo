namespace LibraryApi.Models;

public enum BookStatus
{
    Available = 0,    // Dostępna
    Borrowed = 1,     // Wypożyczona
    Maintenance = 2   // W konserwacji / zniszczona
}