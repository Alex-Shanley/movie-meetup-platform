# Movie Meetup Platform

🎬 **Live Site**: https://movie-meetup-platform.onrender.com/

I built this full-stack web application to bring movie enthusiasts together. With this platform, I enable users to discover movies, rate them, and organize meetups to watch films together.

## Features

### User Authentication
- I implemented secure user registration with password hashing
- I added login/logout functionality with JWT authentication
- I created customizable user profiles

### Movie Features
- I integrated The Movie Database (TMDB) API to let users browse popular movies
- I built search functionality for finding movies
- I designed detailed movie information pages with cast, reviews, and recommendations
- I display TMDB ratings and reviews from the community

### Meetup Features
- I created a meetup system that lets users organize movie watch parties at specific locations and times
- I designed beautiful poster card layouts for browsing upcoming meetups
- I implemented join/leave functionality for meetups
- I added participant list views
- I built a commenting system for meetup discussions
- I included maximum participant limits with visual full meetup indicators
- I gave organizers the ability to edit and delete their meetups
- I added filtering options for upcoming/all meetups
- I designed visual meetup cards with movie posters, dates, and attendee avatars

### Additional Features
- I built a responsive design that works on mobile, tablet, and desktop
- I created a personalized user dashboard with:
  - Profile statistics and quick links
  - Upcoming meetups tab with visual cards
  - Hosting tab to manage your own meetups
  - Past meetups history
  - Edit and delete functionality for hosted meetups
- I implemented real-time participant tracking
- I built full CRUD operations for all resources
- I integrated with the TMDB external movie database
- I wrote an automated testing suite
- I designed a modern UI with hero sections and filtering
- I created a LinkedIn-inspired dashboard layout

## Tech Stack

I built this application using:

### Backend
- **Framework**: Django 4.2.7
- **API**: Django REST Framework 3.14.0
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: PostgreSQL
- **External API**: The Movie Database (TMDB)

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.2
- **Styling**: Custom CSS with responsive design

## Project Structure

```
movie-meetup-platform/
├── backend/
│   ├── moviemeetup/          # Django project settings
│   ├── accounts/             # User authentication app
│   ├── movies/               # Movies and ratings app
│   ├── meetups/              # Meetups app
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── utils/            # Utility functions
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- TMDB API Key (get one at https://www.themoviedb.org/settings/api)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

5. Update the `.env` file with your credentials:
   - Set a secure `SECRET_KEY`
   - Configure your PostgreSQL database credentials
   - Add your TMDB API key

6. Create the PostgreSQL database:
```bash
createdb moviemeetup_db
```

7. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

8. Create a superuser (optional):
```bash
python manage.py createsuperuser
```

9. Run the development server:
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/accounts/register/` - Register new user
- `POST /api/accounts/login/` - Login user
- `POST /api/accounts/logout/` - Logout user
- `GET /api/accounts/profile/` - Get user profile
- `PATCH /api/accounts/profile/update/` - Update profile

### Movies
- `GET /api/movies/tmdb/search/?q=query` - Search TMDB movies
- `GET /api/movies/tmdb/popular/` - Get popular movies
- `GET /api/movies/tmdb/{id}/` - Get movie details from TMDB
- `GET /api/movies/tmdb/{id}/recommendations/` - Get movie recommendations
- `GET /api/movies/tmdb/{id}/reviews/` - Get movie reviews

### Meetups
- `GET /api/meetups/` - List all meetups
- `GET /api/meetups/{id}/` - Get meetup details
- `POST /api/meetups/` - Create meetup
- `PUT /api/meetups/{id}/` - Update meetup (organizer only)
- `DELETE /api/meetups/{id}/` - Delete meetup (organizer only)
- `POST /api/meetups/{id}/join/` - Join meetup
- `POST /api/meetups/{id}/leave/` - Leave meetup
- `POST /api/meetups/{id}/comment/` - Add comment

## Running Tests

### Backend Tests
```bash
cd backend
python manage.py test
```

## Deployment

I deployed this application to Render.com with:
- Backend: Gunicorn server with PostgreSQL database
- Frontend: Static build deployed alongside the backend
- Environment variables configured for production security

## Environment Variables

### Backend (.env)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (True/False)
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `TMDB_API_KEY` - The Movie Database API key

## Key Features I'm Proud Of

**Dashboard Design**: I designed a LinkedIn-inspired dashboard that shows users their upcoming meetups, the meetups they're hosting, and their past events. The profile section lets users edit their information and see quick stats.

**Meetup Management**: I built full CRUD functionality so organizers can create, edit, and delete their meetups. Users can join meetups with an optional message to the organizer, leave meetups they've joined, and comment on event pages.

**Movie Integration**: I integrated the TMDB API to provide rich movie data including cast information, community reviews, ratings, and recommendations for similar films.

**Responsive Design**: I ensured the entire application works seamlessly across mobile, tablet, and desktop devices with a modern, clean interface.

