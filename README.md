# 📚 AngularDemo – System Zarządzania Biblioteką

Nowoczesna aplikacja webowa typu Full-Stack do zarządzania katalogiem bibliotecznym oraz obsługi procesu wypożyczeń książek.

---

## 🚀 Technologie

### Backend
* **.NET 10** – ASP.NET Core Web API (Controllers, Dependency Injection, Swagger/OpenAPI)
* **MongoDB** – Baza danych NoSQL (oficjalny sterownik `MongoDB.Driver`)
* **C# 14 / C# 13**

### Frontend
* **Angular** (najnowsza wersja: Standalone Components, Signals, Reactive Forms)
* **Tailwind CSS** lub **Angular Material** – responsywny interfejs użytkownika
* **TypeScript & RxJS**

### Infrastruktura & Hosting
* **Azure App Service / Container Apps** – hosting backendu API
* **MongoDB Atlas** – zarządzana baza danych w chmurze
* **TheCamels DNS** – konfiguracja domeny / subdomeny (`api.twojadomena.pl`)

---

## 🎯 Główne Funkcjonalności

1. **Zarządzanie katalogiem (CRUD):**
   * Dodawanie nowej książki (tytuł, autor, ISBN, rok wydania, kategoria, okładka).
   * Edycja szczegółów istniejącej pozycji.
   * Usuwanie książki z bazy.
   * Przeglądanie listy z wyszukiwarką i filtrowaniem.

2. **System Wypożyczeń (Workflow statusów):**
   * Zmiana stanu książki: `Dostępna (Available)` ➔ `Wypożyczona (Borrowed)` ➔ `W renowacji (Maintenance)`.
   * Rejestracja daty wypożyczenia i osoby wypożyczającej.
   * Zwrot książki (przywrócenie statusu do *Dostępna*).

---

## 📂 Struktura Projektu

```text
AngularDemo/
├── .gitignore
├── README.md
├── src/
│   ├── Backend/
│   │   └── LibraryApi/             # Projekt .NET 10 Web API
│   │       ├── Controllers/        # Kontrolery API (Books, Borrowing)
│   │       ├── Models/             # Modele domenowe i DTO
│   │       ├── Services/           # Logika biznesowa i integracja z MongoDB
│   │       └── Program.cs
│   └── Frontend/
│       └── library-ui/             # Aplikacja Angular
│           ├── src/
│           │   ├── app/
│           │   │   ├── components/ # Komponenty (BookList, BookForm, BookCard)
│           │   │   ├── services/   # Komunikacja z API (HttpClient, Signals)
│           │   │   └── models/     # Interfejsy TypeScript
```

---

## 🛠️ Uruchomienie lokalne

### Wymagania wstępne
* [.NET 10 SDK](https://dotnet.microsoft.com/)
* [Node.js (LTS)](https://nodejs.org/) & npm
* [Angular CLI](https://angular.dev/) (`npm install -g @angular/cli`)
* [Visual Studio 2026 / Visual Studio Code](https://visualstudio.microsoft.com/)
* Dostęp do instancji MongoDB (lokalna lub MongoDB Atlas)

---

### 1. Klonowanie repozytorium
```bash
git clone https://github.com/mdlutek/AngularDemo.git
cd AngularDemo
```

### 2. Uruchomienie Backend (.NET 10)
```bash
cd src/Backend/LibraryApi

# Skonfiguruj Connection String do bazy MongoDB w appsettings.Development.json:
# "ConnectionStrings": { "MongoDb": "mongodb+srv://<user>:<password>@cluster.mongodb.net/LibraryDb" }

dotnet restore
dotnet run
```
> Swagger API dostępny pod adresem: `https://localhost:7001/swagger`

---

### 3. Uruchomienie Frontend (Angular)
```bash
cd src/Frontend/library-ui

npm install
ng serve -o
```
> Aplikacja uruchomi się pod adresem: `http://localhost:4200`

---

## 📄 Licencja
Projekt stworzony w celach demonstracyjnych i portfolio.