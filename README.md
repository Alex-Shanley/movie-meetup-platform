# Movie Meetup Platform

A full-stack web application that allows users to discover movies, rate them, and organize meetups to watch films together with other movie enthusiasts.

## Features

### User Authentication
- User registration with secure password hashing
- Login/logout functionality with JWT authentication
- User profiles with customizable information

### Movie Features
- Browse popular movies from The Movie Database (TMDB) API
- Search for movies
- View detailed movie information
- Rate and review movies
- Add movies to favorites

### Meetup Features
- Create movie meetups at specific locations and times using TMDB movie selection
- Browse upcoming meetups with beautiful poster card layouts
- Join/leave meetups
- View participant lists
- Add comments to meetups
- Maximum participant limits with full meetup indicators
- Edit and delete meetups (for organizers)
- Filter meetups by upcoming/all
- Visual meetup cards with movie posters, dates, and attendee avatars

### Additional Features
- Responsive design for mobile, tablet, and desktop
- Personalized user dashboard with:
  - Profile statistics and quick links
  - Upcoming meetups tab with visual cards
  - Hosting tab to manage your own meetups
  - Past meetups history
  - Edit and delete functionality for hosted meetups
- Real-time participant tracking
- CRUD operations for all resources
- API integration with external movie database (TMDB)
- Automated testing suite
- Modern UI with hero sections and filtering
- LinkedIn-inspired dashboard layout

## Tech Stack

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
- `GET /api/movies/` - List all movies
- `GET /api/movies/{id}/` - Get movie details
- `POST /api/movies/` - Create movie
- `GET /api/movies/tmdb/search/?q=query` - Search TMDB
- `GET /api/movies/tmdb/popular/` - Get popular movies
- `POST /api/movies/ratings/` - Rate a movie
- `GET /api/movies/favorites/` - Get user favorites
- `POST /api/movies/favorites/` - Add favorite

### Meetups
- `GET /api/meetups/` - List all meetups
- `GET /api/meetups/{id}/` - Get meetup details
- `POST /api/meetups/` - Create meetup (accepts TMDB movie IDs)
- `PUT /api/meetups/{id}/` - Update meetup (organizer only)
- `DELETE /api/meetups/{id}/` - Delete meetup (organizer only)
- `POST /api/meetups/{id}/join/` - Join meetup
- `POST /api/meetups/{id}/leave/` - Leave meetup
- `GET /api/meetups/{id}/participants/` - Get participants
- `POST /api/meetups/{id}/comment/` - Add comment
- `GET /api/meetups/{id}/comments/` - Get comments
- `GET /api/meetups/my-meetups/` - Get meetups organized by current user

## Running Tests

### Backend Tests
```bash
cd backend
python manage.py test
```

## Deployment

### Backend Deployment
1. Set `DEBUG=False` in production
2. Configure `ALLOWED_HOSTS`
3. Set up a production database
4. Collect static files: `python manage.py collectstatic`
5. Use a production server like Gunicorn
6. Set up nginx as a reverse proxy

### Frontend Deployment
1. Build the production bundle:
```bash
npm run build
```
2. Deploy the `dist` folder to your hosting service

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

## Recent Updates

### December 2025
- **Dashboard Improvements**: Complete redesign with LinkedIn-inspired layout
  - Added "Hosting" tab with poster cards for meetups you organize
  - Implemented edit and delete functionality for hosted meetups
  - Enhanced visual design with movie poster thumbnails
  - Added "Manage" button for quick meetup editing
  
- **Meetup Management**: Full CRUD operations
  - Organizers can now edit meetup details via modal interface
  - Added delete confirmation for meetup removal
  - Backend API endpoints for PUT and DELETE operations
  - Automatic redirect after meetup creation
  
- **UI/UX Enhancements**:
  - Fixed CSS specificity issues between Dashboard and Meetups pages
  - Restored proper padding on Meetups listing page
  - Improved responsive design for all screen sizes
  - Enhanced meetup cards with better visual hierarchy
  
- **API Improvements**:
  - Added `my-meetups/` endpoint to fetch user-organized meetups
  - Meetup creation now accepts TMDB movie IDs directly
  - Enhanced meetup response to include full movie poster URLs
  - Improved error handling and validation

## Future Enhancements
- Email notifications for meetup updates
- Social login (Google, Facebook)
- Movie recommendations based on user preferences
- Advanced search and filtering
- User messaging system
- Meetup reminders
- Photo uploads for meetup events
- Integration with movie ticket booking platforms
- Calendar view for meetups
- Meetup categories and tags

## License
MIT

## Contributors
- Alex Shanley

## Support
For issues or questions, please open an issue on the GitHub repository.
