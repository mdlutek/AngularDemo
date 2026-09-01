using Microsoft.AspNetCore.Mvc;
using LibraryApi.Models;
using LibraryApi.Services;

namespace LibraryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly BooksService _booksService;

    public BooksController(BooksService booksService)
    {
        _booksService = booksService;
    }

    // GET: api/books
    [HttpGet]
    public async Task<ActionResult<List<Book>>> GetAll() =>
        Ok(await _booksService.GetAllAsync());

    // GET: api/books/{id}
    [HttpGet("{id:length(24)}")]
    public async Task<ActionResult<Book>> GetById(string id)
    {
        var book = await _booksService.GetByIdAsync(id);
        if (book is null) return NotFound(new { message = "Książka nie została znaleziona." });
        return Ok(book);
    }

    // POST: api/books (Dodawanie)
    [HttpPost]
    public async Task<IActionResult> Create(Book newBook)
    {
        await _booksService.CreateAsync(newBook);
        return CreatedAtAction(nameof(GetById), new { id = newBook.Id }, newBook);
    }

    // PUT: api/books/{id} (Edycja)
    [HttpPut("{id:length(24)}")]
    public async Task<IActionResult> Update(string id, Book updatedBook)
    {
        var book = await _booksService.GetByIdAsync(id);
        if (book is null) return NotFound(new { message = "Książka nie istnieje." });

        updatedBook.Id = book.Id;
        await _booksService.UpdateAsync(id, updatedBook);
        return NoContent();
    }

    // DELETE: api/books/{id} (Usuwanie)
    [HttpDelete("{id:length(24)}")]
    public async Task<IActionResult> Delete(string id)
    {
        var book = await _booksService.GetByIdAsync(id);
        if (book is null) return NotFound(new { message = "Książka nie istnieje." });

        await _booksService.RemoveAsync(id);
        return NoContent();
    }

    // POST: api/books/{id}/borrow (Wypożyczenie)
    [HttpPost("{id:length(24)}/borrow")]
    public async Task<IActionResult> Borrow(string id, [FromBody] BorrowRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.BorrowerName))
            return BadRequest(new { message = "Imię i nazwisko wypożyczającego jest wymagane." });

        var success = await _booksService.BorrowBookAsync(id, request.BorrowerName);
        if (!success)
            return BadRequest(new { message = "Nie można wypożyczyć tej książki (może być już wypożyczona lub nie istnieje)." });

        return Ok(new { message = "Książka została pomyślnie wypożyczona." });
    }

    // POST: api/books/{id}/return (Zwrot)
    [HttpPost("{id:length(24)}/return")]
    public async Task<IActionResult> Return(string id)
    {
        var success = await _booksService.ReturnBookAsync(id);
        if (!success)
            return BadRequest(new { message = "Nie można zwrócić tej książki (nie jest wypożyczona lub nie istnieje)." });

        return Ok(new { message = "Książka została pomyślnie zwrócona." });
    }
}