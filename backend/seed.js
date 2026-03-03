const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');

dotenv.config();

const tamilMovies = [
    {
        title: 'Leo',
        description: 'Parthiban is a mild-mannered cafe owner in Kashmir, who fends off a gang of murderous thugs and gains attention from a drug cartel claiming he was once a part of them.',
        genre: 'Action, Thriller',
        language: 'Tamil',
        duration: 164,
        releaseDate: new Date('2023-10-19'),
        posterUrl: '/leo.webp'
    },
    {
        title: 'Jailer',
        description: 'A retired jailer goes on a manhunt to find his son\'s killers. But the road leads him to a familiar, albeit a bit darker place. Can he emerge from this complex situation successfully?',
        genre: 'Action, Comedy',
        language: 'Tamil',
        duration: 168,
        releaseDate: new Date('2023-08-10'),
        posterUrl: '/jailer.jpg'
    },
    {
        title: 'Vikram',
        description: 'A special investigator discovers a case of serial killings is not what it seems to be, and leading down this path is only going to end in a war between everyone involved.',
        genre: 'Action, Thriller',
        language: 'Tamil',
        duration: 175,
        releaseDate: new Date('2022-06-03'),
        posterUrl: '/vikram.webp'
    },
    {
        title: 'Ponniyin Selvan: Part I',
        description: 'Vandiyathevan sets out to cross the Chola land to deliver a message from the Crown Prince Aditha Karikalan. Kundavai attempts to establish political peace as vassals and petty chieftains plot against the throne.',
        genre: 'Action, Drama, History',
        language: 'Tamil',
        duration: 167,
        releaseDate: new Date('2022-09-30'),
        posterUrl: '/ponniyin selvan.webp'
    },
    {
        title: 'Maharaja',
        description: 'A barber seeks vengeance after his home is burglarized, telling police his "lakshmi" has been taken, leaving them uncertain if it\'s a person or object.',
        genre: 'Action, Thriller',
        language: 'Tamil',
        duration: 142,
        releaseDate: new Date('2024-06-14'),
        posterUrl: '/maharaja.webp'
    },
    {
        title: 'Indian 2',
        description: 'Senapathy, an ex-freedom fighter turned vigilante who fights against corruption. Senapathy returns to India to aid a young man who has been exposing corrupt politicians through videos on the internet.',
        genre: 'Action, Drama, Thriller',
        language: 'Tamil',
        duration: 180,
        releaseDate: new Date('2024-07-12'),
        posterUrl: '/indian 2.jpg'
    },
    {
        title: 'Jananayagan',
        description: 'A political thriller drama tackling society issues and uncovering deep political conspiracies in an intense narrative style.',
        genre: 'Action, Drama',
        language: 'Tamil',
        duration: 155,
        releaseDate: new Date('2000-09-01'),
        posterUrl: '/jananayagan.webp'
    },
    {
        title: 'Sirai',
        description: 'A gripping social drama focusing on the harrowing experiences of a prison term and the struggle for justice and rehabilitation against all odds.',
        genre: 'Drama, Thriller',
        language: 'Tamil',
        duration: 140,
        releaseDate: new Date('1984-06-25'),
        posterUrl: '/sirai.webp'
    }
];

const venues = [
    'Sathyam Cinemas: Royapettah',
    'PVR: VR Mall, Anna Nagar',
    'Rohini Silver Screens: Koyambedu',
    'Kamala Cinemas: Vadapalani',
    'AGS Cinemas: T Nagar',
    'Luxe Cinemas: Phoenix Marketcity'
];

const times = ['10:30', '13:45', '17:00', '20:15', '22:30'];

const seedDB = async () => {
    try {
        console.log('Seeding Database with default movies and showtimes...');
        // Clear existing movies and showtimes
        await Movie.deleteMany();
        await Showtime.deleteMany();
        console.log('Cleared existing Movies and Showtimes Database');

        // Create Movies
        const createdMovies = await Movie.insertMany(tamilMovies);
        console.log('Tamil Movies Inserted!');

        // Create Showtimes for each movie
        const showtimesData = [];
        const today = new Date();

        for (const movie of createdMovies) {
            // Create showtimes for the next 3 days
            for (let day = 0; day < 3; day++) {
                const showDate = new Date(today);
                showDate.setDate(today.getDate() + day);

                // Pick 2 random venues
                const shuffledVenues = venues.sort(() => 0.5 - Math.random()).slice(0, 2);

                for (const venue of shuffledVenues) {
                    // Add 2-3 showtimes per venue per day
                    const showTimesList = times.sort(() => 0.5 - Math.random()).slice(0, 3);

                    for (const time of showTimesList) {
                        showtimesData.push({
                            movie: movie._id,
                            date: showDate,
                            time: time,
                            venue: venue,
                            price: Math.floor(Math.random() * 100) + 150, // Rs 150 to Rs 250
                            totalSeats: 120,
                            bookedSeats: [] // empty
                        });
                    }
                }
            }
        }

        await Showtime.insertMany(showtimesData);
        console.log(`Successfully generated ${showtimesData.length} live showtimes across Chennai.`);
    } catch (error) {
        console.error('Seeding Error:', error);
    }
};

module.exports = seedDB;

// If this script is run directly via `node seed.js`
if (require.main === module) {
    mongoose.connect(process.env.MONGO_URI).then(async () => {
        console.log('MongoDB Connected for Seeding...');
        await seedDB();
        console.log('Data Seeding Completed Successfully! You can close this script.');
        process.exit();
    }).catch(err => {
        console.error('Database Connection Error during Seeding:', err);
        process.exit(1);
    });
}
