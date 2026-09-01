using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LibraryApi.Models;

public class Book
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("title")]
    public string Title { get; set; } = string.Empty;

    [BsonElement("author")]
    public string Author { get; set; } = string.Empty;

    [BsonElement("isbn")]
    public string Isbn { get; set; } = string.Empty;

    [BsonElement("publishedYear")]
    public int PublishedYear { get; set; }

    [BsonElement("category")]
    public string Category { get; set; } = string.Empty;

    [BsonElement("status")]
    [BsonRepresentation(BsonType.String)]
    public BookStatus Status { get; set; } = BookStatus.Available;

    // Dane dotyczące wypożyczenia (opcjonalne)
    [BsonElement("borrowedBy")]
    public string? BorrowedBy { get; set; }

    [BsonElement("borrowedAt")]
    public DateTime? BorrowedAt { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}