using MongoDB.Driver;
using LibraryApi.Models;

namespace LibraryApi.Services;

public class BooksService
{
    private readonly IMongoCollection<Book> _booksCollection;

    public BooksService(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("MongoDb");
        var mongoUrl = MongoUrl.Create(connectionString);
        var mongoClient = new MongoClient(mongoUrl);
        var database = mongoClient.GetDatabase(mongoUrl.DatabaseName ?? "LibraryDb");

        _booksCollection = database.GetCollection<Book>("Books");
    }

    // Pobierz wszystkie książki
    public async Task<List<Book>> GetAllAsync() =>
        await _booksCollection.Find(_ => true).ToListAsync();

    // Pobierz jedną książkę po ID
    public async Task<Book?> GetByIdAsync(string id) =>
        await _booksCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    // Dodaj nową książkę (CRUD: Create)
    public async Task CreateAsync(Book newBook) =>
        await _booksCollection.InsertOneAsync(newBook);

    // Edytuj dane książki (CRUD: Update)
    public async Task UpdateAsync(string id, Book updatedBook) =>
        await _booksCollection.ReplaceOneAsync(x => x.Id == id, updatedBook);

    // Usuń książkę (CRUD: Delete)
    public async Task RemoveAsync(string id) =>
        await _booksCollection.DeleteOneAsync(x => x.Id == id);

    // Akcja: Wypożycz książkę
    public async Task<bool> BorrowBookAsync(string id, string borrowerName)
    {
        var book = await GetByIdAsync(id);
        if (book == null || book.Status != BookStatus.Available)
            return false;

        var update = Builders<Book>.Update
            .Set(b => b.Status, BookStatus.Borrowed)
            .Set(b => b.BorrowedBy, borrowerName)
            .Set(b => b.BorrowedAt, DateTime.UtcNow);

        var result = await _booksCollection.UpdateOneAsync(b => b.Id == id, update);
        return result.ModifiedCount > 0;
    }

    // Akcja: Zwróć książkę
    public async Task<bool> ReturnBookAsync(string id)
    {
        var book = await GetByIdAsync(id);
        if (book == null || book.Status != BookStatus.Borrowed)
            return false;

        var update = Builders<Book>.Update
            .Set(b => b.Status, BookStatus.Available)
            .Set(b => b.BorrowedBy, null)
            .Set(b => b.BorrowedAt, null);

        var result = await _booksCollection.UpdateOneAsync(b => b.Id == id, update);
        return result.ModifiedCount > 0;
    }
}