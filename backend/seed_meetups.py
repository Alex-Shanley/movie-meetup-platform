import os
import django
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'moviemeetup.settings')
django.setup()

from meetups.models import Meetup
from movies.models import Movie
from accounts.models import User
from datetime import datetime, timedelta

def create_sample_meetups():
    user = User.objects.first()
    if not user:
        print("No users found. Please create a user first.")
        return
    
    meetups_data = [
        {
            'title': 'Dune Part Two Desert Watch Party',
            'tmdb_id': 693134,
            'movie_title': 'Dune: Part Two',
            'release_date': '2024-03-01',
            'location': 'AMC Lincoln Square, New York',
            'description': 'Experience the epic conclusion on the biggest screen possible! Join fellow Fremen as we witness Paul\'s journey.',
            'days_from_now': 5,
            'max_participants': 25
        },
        {
            'title': 'Oppenheimer IMAX Experience',
            'tmdb_id': 872585,
            'movie_title': 'Oppenheimer',
            'release_date': '2023-07-21',
            'location': 'IMAX Theater, London',
            'description': 'Watch this masterpiece the way it was meant to be seen - in 70mm IMAX. Discussion to follow.',
            'days_from_now': 7,
            'max_participants': 30
        },
        {
            'title': 'Barbie Pink Party Screening',
            'tmdb_id': 346698,
            'movie_title': 'Barbie',
            'release_date': '2023-07-21',
            'location': 'The Grove Cinema, Los Angeles',
            'description': 'Dress in pink and join us for a fun rewatch! Photo ops and themed snacks included.',
            'days_from_now': 10,
            'max_participants': 40
        },
        {
            'title': 'Spider-Man: Across the Spider-Verse Animation Night',
            'tmdb_id': 569094,
            'movie_title': 'Spider-Man: Across the Spider-Verse',
            'release_date': '2023-06-02',
            'location': 'Alamo Drafthouse, Austin',
            'description': 'Celebrating the art of animation with fellow Spider-fans. We\'ll discuss the revolutionary animation techniques.',
            'days_from_now': 12,
            'max_participants': 35
        },
        {
            'title': 'Guardians of the Galaxy Vol. 3 Singalong',
            'tmdb_id': 447365,
            'movie_title': 'Guardians of the Galaxy Vol. 3',
            'release_date': '2023-05-05',
            'location': 'Hollywood Theater, Portland',
            'description': 'Sing along to an awesome soundtrack! Costumes encouraged.',
            'days_from_now': 14,
            'max_participants': 50
        },
        {
            'title': 'The Batman Noir Edition Watch',
            'tmdb_id': 414906,
            'movie_title': 'The Batman',
            'release_date': '2022-03-04',
            'location': 'Regal Cinemas, Chicago',
            'description': 'Three hours of dark, gritty Gotham. Perfect for Batman fans who love detective stories.',
            'days_from_now': 15,
            'max_participants': 20
        },
        {
            'title': 'Everything Everywhere All At Once Multiverse Meetup',
            'tmdb_id': 545611,
            'movie_title': 'Everything Everywhere All at Once',
            'release_date': '2022-03-25',
            'location': 'Landmark Theatre, Toronto',
            'description': 'Celebrate this Oscar winner with fellow multiverse travelers. Bagel-themed discussions welcome!',
            'days_from_now': 18,
            'max_participants': 30
        },
        {
            'title': 'Top Gun: Maverick Flight Club',
            'tmdb_id': 361743,
            'movie_title': 'Top Gun: Maverick',
            'release_date': '2022-05-27',
            'location': 'Navy Pier Cinema, San Diego',
            'description': 'Feel the need for speed! Aviation enthusiasts and Tom Cruise fans unite.',
            'days_from_now': 20,
            'max_participants': 45
        },
        {
            'title': 'Avatar: The Way of Water Ocean Lovers Screening',
            'tmdb_id': 76600,
            'movie_title': 'Avatar: The Way of Water',
            'release_date': '2022-12-16',
            'location': 'IMAX Aquarium Theater, Sydney',
            'description': 'Dive into Pandora\'s oceans in stunning 3D IMAX. Marine biology students welcome!',
            'days_from_now': 22,
            'max_participants': 35
        },
        {
            'title': 'Killers of the Flower Moon History Discussion',
            'tmdb_id': 466420,
            'movie_title': 'Killers of the Flower Moon',
            'release_date': '2023-10-20',
            'location': 'Landmark Sunshine, Seattle',
            'description': 'Scorsese\'s epic with post-screening discussion on Osage history and representation.',
            'days_from_now': 25,
            'max_participants': 25
        },
        {
            'title': 'John Wick: Chapter 4 Action Marathon',
            'tmdb_id': 603692,
            'movie_title': 'John Wick: Chapter 4',
            'release_date': '2023-03-24',
            'location': 'Alamo Drafthouse, Denver',
            'description': 'Three hours of pure action! Stunt choreography breakdown after the film.',
            'days_from_now': 28,
            'max_participants': 40
        },
        {
            'title': 'The Super Mario Bros Movie Gaming Night',
            'tmdb_id': 502356,
            'movie_title': 'The Super Mario Bros. Movie',
            'release_date': '2023-04-05',
            'location': 'GameWorks Cinema, Las Vegas',
            'description': 'Movie screening followed by Mario Kart tournament. Bring your A-game!',
            'days_from_now': 30,
            'max_participants': 50
        },
        {
            'title': 'Asteroid City Wes Anderson Fan Meetup',
            'tmdb_id': 572802,
            'movie_title': 'Asteroid City',
            'release_date': '2023-06-23',
            'location': 'Angelika Film Center, New York',
            'description': 'For fans of symmetry, pastel colors, and quirky storytelling. Dress in Anderson-core style!',
            'days_from_now': 32,
            'max_participants': 20
        },
        {
            'title': 'Mission: Impossible Dead Reckoning Watch',
            'tmdb_id': 575264,
            'movie_title': 'Mission: Impossible - Dead Reckoning Part One',
            'release_date': '2023-07-12',
            'location': 'BFI IMAX, London',
            'description': 'Witness Tom Cruise\'s insane stunts on the biggest screen. No AI allowed.',
            'days_from_now': 35,
            'max_participants': 30
        },
        {
            'title': 'The Little Mermaid Underwater Sing-Along',
            'tmdb_id': 447277,
            'movie_title': 'The Little Mermaid',
            'release_date': '2023-05-26',
            'location': 'Disney Theater, Orlando',
            'description': 'Under the sea screening with singalong subtitles. Families welcome!',
            'days_from_now': 37,
            'max_participants': 60
        },
        {
            'title': 'Creed III Boxing Fans Unite',
            'tmdb_id': 677179,
            'movie_title': 'Creed III',
            'release_date': '2023-03-03',
            'location': 'Main Event Cinema, Philadelphia',
            'description': 'Rocky legacy continues! Boxing gym members get discount tickets.',
            'days_from_now': 40,
            'max_participants': 35
        },
        {
            'title': 'Ant-Man and the Wasp: Quantumania MCU Marathon',
            'tmdb_id': 640146,
            'movie_title': 'Ant-Man and the Wasp: Quantumania',
            'release_date': '2023-02-17',
            'location': 'Marcus Cinema, Milwaukee',
            'description': 'Kicking off Phase 5! MCU theories and Kang discussion after.',
            'days_from_now': 42,
            'max_participants': 40
        },
        {
            'title': 'Cocaine Bear Wild Night Out',
            'tmdb_id': 804150,
            'movie_title': 'Cocaine Bear',
            'release_date': '2023-02-24',
            'location': 'Alamo Drafthouse, Austin',
            'description': 'The wildest movie of the year. 21+ only. Bear costumes encouraged.',
            'days_from_now': 45,
            'max_participants': 30
        },
        {
            'title': 'The Flash DC Comics Fan Gathering',
            'tmdb_id': 298618,
            'movie_title': 'The Flash',
            'release_date': '2023-06-16',
            'location': 'Regal Cinemas, Baltimore',
            'description': 'Fastest man alive on screen! DC Comics collectors meetup before showing.',
            'days_from_now': 48,
            'max_participants': 25
        },
        {
            'title': 'Elemental Pixar Animation Celebration',
            'tmdb_id': 884605,
            'movie_title': 'Elemental',
            'release_date': '2023-06-16',
            'location': 'El Capitan Theatre, Los Angeles',
            'description': 'Pixar\'s latest masterpiece. Animation students and families welcome!',
            'days_from_now': 50,
            'max_participants': 45
        }
    ]
    
    created_count = 0
    for data in meetups_data:
        movie, _ = Movie.objects.get_or_create(
            tmdb_id=data['tmdb_id'],
            defaults={
                'title': data['movie_title'],
                'description': '',
                'release_date': data['release_date']
            }
        )
        
        meetup_date = datetime.now() + timedelta(days=data['days_from_now'])
        
        Meetup.objects.create(
            title=data['title'],
            movie=movie,
            organizer=user,
            meetup_datetime=meetup_date,
            location=data['location'],
            description=data['description'],
            max_participants=data['max_participants']
        )
        created_count += 1
        print(f"Created: {data['title']}")
    
    print(f"\n✅ Successfully created {created_count} meetups!")

if __name__ == '__main__':
    print("Creating sample meetups...")
    create_sample_meetups()
