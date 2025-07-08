# HashMovies 🌟

HashMovies is a full-stack movie discovery web application built using **React**, **Node.js**, **Express**, and **MongoDB**. It provides a rich user experience for exploring trending and featured movies, managing personal watchlists, liking and commenting on movies, and discovering content by genres, languages, and actors.

## Features

### 📅 Home Page

* Upon login, users land on the home page.
* Displays:

  * Trending Movies
  * Featured Movies
  * Genres
  * Languages
* Clickable movie tiles navigate to the detailed Movie Page.

### 🎬 Movie Page

* Displays detailed movie information:

  * Movie Name, Poster, Storyline
  * Genres, Release Date, Certificate
  * Duration, Language, IMDb Rating
* Right panel includes:

  * Movie Trailer (YouTube iframe)
  * Similar Movies
  * Actors in the movie (Actor Tiles)
  * Comment section
* Users can:

  * Add to Viewed
  * Add to Watchlist
  * Add to Liked

### 👨 Actor Page

* Displays:

  * Actor Name, Image, Debut Movie
  * Languages the actor works in
  * List of Famous Movies
  * List of All Movies acted by the actor

### 🎨 Genre Page

* Displays:

  * Genre Name, Image, and Description
  * Trending Movies in the Genre
  * Featured Movies in the Genre
  * All Movies in the Genre

### 🇯🇵 Language Page

* Displays a list of all movies available in the selected language.

### 🔍 Search Page

* Search movies by name
* Filter based on:

  * Genres
  * Platforms
  * Languages
  * Trending
  * Featured
* Supports OR and AND filter logic

### 📂 Sidebar Navigation

* Navigate to:

  * Liked Movies
  * Viewed Movies
  * Watchlisted Movies
* Personalized sections for:

  * Preferred Genres
  * Preferred Languages

### 👤 Profile Page

* Set/update:

  * Name
  * Email
  * Password
  * Avatar
  * Preferred Genres & Languages
* Shows liked, viewed, and watchlisted movies

### 📊 Admin Dashboard (Restricted to Admin)

* Tables for:

  * Users (Read-only)
  * Movies
  * Genres
  * Platforms
  * Actors
* Features:

  * Update, Delete for each row
  * Add new entries
  * Form-based update and add pages

## Tech Stack

* **Frontend:** React
* **Backend:** Node.js, Express
* **Database:** MongoDB

## Deployment

* **Frontend:** [Vercel](https://vercel.com)
* **Backend:** [Render](https://render.com)

## Repository

* GitHub: [https://github.com/Alvin0305/Hash-Movies](https://github.com/Alvin0305/Hash-Movies)

## Author

**Alvin A S**
Email: [alvinanildas@gmail.com](mailto:alvinanildas@gmail.com)
