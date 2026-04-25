// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  points: number;
  badges: Badge[];
  preferences: {
    sports: string[];
    language: 'fr' | 'en' | 'wo';
  };
  favorites: string[];
}

export interface Event {
  id: string;
  title: string;
  sport: string;
  date: string;
  time: string;
  location: string;
  venue: string;
  description: string;
  image: string;
  participants: string[];
  isLive?: boolean;
  isFeatured?: boolean;
}

export interface LiveScore {
  id: string;
  eventId: string;
  sport: string;
  team1: { name: string; country: string; score: number; flag: string };
  team2: { name: string; country: string; score: number; flag: string };
  status: 'live' | 'finished' | 'upcoming';
  time: string;
  period?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedAt?: string;
}

export interface Notification {
  id: string;
  type: 'event' | 'security' | 'reminder' | 'score';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Transaction {
  id: string;
  type: 'ticket' | 'merchandise';
  title: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Venue {
  id: string;
  name: string;
  type: 'stadium' | 'transport' | 'service' | 'food' | 'medical';
  lat: number;
  lng: number;
  address: string;
  description?: string;
}

// Mock Data
export const mockUser: User = {
  id: '1',
  name: 'Amadou Diallo',
  email: 'amadou@example.com',
  phone: '+221 77 123 4567',
  points: 2450,
  badges: [
    { id: '1', name: 'Explorateur', icon: '🏃', description: 'Visiter 5 sites', earned: true, earnedAt: '2026-01-15' },
    { id: '2', name: 'Fan #1', icon: '⭐', description: 'Assister à 10 événements', earned: true, earnedAt: '2026-01-18' },
    { id: '3', name: 'Social', icon: '🤝', description: 'Partager 5 moments', earned: false },
    { id: '4', name: 'Champion', icon: '🏆', description: 'Top 100 du classement', earned: false },
  ],
  preferences: {
    sports: ['football', 'basketball', 'athletics'],
    language: 'fr',
  },
  favorites: ['1', '3', '5'],
};

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Football - Finale',
    sport: 'Football',
    date: '2026-10-25',
    time: '18:00',
    location: 'Dakar',
    venue: 'Stade Abdoulaye Wade',
    description: 'Finale du tournoi de football des JOJ 2026. Un match épique entre les deux meilleures équipes de la compétition.',
    image: '/events/football.jpg',
    participants: ['Sénégal', 'Brésil'],
    isLive: true,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Basketball 3x3',
    sport: 'Basketball',
    date: '2026-10-24',
    time: '15:30',
    location: 'Diamniadio',
    venue: 'Arena Dakar',
    description: 'Demi-finales du basketball 3x3. Des équipes dynamiques s\'affrontent pour une place en finale.',
    image: '/events/basketball.jpg',
    participants: ['USA', 'France', 'Japon', 'Nigéria'],
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Athlétisme - 100m',
    sport: 'Athlétisme',
    date: '2026-10-26',
    time: '10:00',
    location: 'Dakar',
    venue: 'Stade Léopold Sédar Senghor',
    description: 'Finale du 100 mètres. Les athlètes les plus rapides du monde s\'affrontent.',
    image: '/events/athletics.jpg',
    participants: ['Jamaïque', 'USA', 'Sénégal', 'Kenya'],
  },
  {
    id: '4',
    title: 'Natation - 200m libre',
    sport: 'Natation',
    date: '2026-10-27',
    time: '14:00',
    location: 'Dakar',
    venue: 'Centre Aquatique',
    description: 'Série de 200m nage libre. Qualification pour les finales.',
    image: '/events/swimming.jpg',
    participants: ['Australie', 'USA', 'Chine', 'France'],
  },
  {
    id: '5',
    title: 'Breakdance',
    sport: 'Breaking',
    date: '2026-10-28',
    time: '20:00',
    location: 'Diamniadio',
    venue: 'Arena Dakar',
    description: 'Compétition de breakdance. Les meilleurs B-boys et B-girls du monde.',
    image: '/events/breaking.jpg',
    participants: ['France', 'Corée du Sud', 'USA', 'Japon'],
    isFeatured: true,
  },
  {
    id: '6',
    title: 'Volleyball de plage',
    sport: 'Beach Volley',
    date: '2026-10-29',
    time: '16:00',
    location: 'Saly',
    venue: 'Plage de Saly',
    description: 'Quarts de finale du volleyball de plage sur les magnifiques plages du Sénégal.',
    image: '/events/volleyball.jpg',
    participants: ['Brésil', 'Italie', 'Australie', 'Sénégal'],
  },
  {
    id: '7',
    title: 'Handball - Demi-finale',
    sport: 'Handball',
    date: '2026-10-30',
    time: '17:30',
    location: 'Dakar',
    venue: 'Palais des Sports',
    description: 'Demi-finale de handball des JOJ avec des équipes en pleine forme.',
    image: '/events/handball.jpg',
    participants: ['Sénégal', 'Espagne'],
  },
  {
    id: '8',
    title: 'Judo - Finale -73kg',
    sport: 'Arts martiaux',
    date: '2026-10-31',
    time: '11:00',
    location: 'Dakar',
    venue: 'Dojo National',
    description: 'Finale de judo categorie -73kg.',
    image: '/events/judo.jpg',
    participants: ['Japon', 'France'],
  },
  {
    id: '9',
    title: 'Football - Match de classement',
    sport: 'Football',
    date: '2026-11-01',
    time: '19:00',
    location: 'Diamniadio',
    venue: 'Stade Abdoulaye Wade',
    description: 'Match de classement du tournoi de football.',
    image: '/events/football-2.jpg',
    participants: ['Maroc', 'Argentine'],
  },
  {
    id: '10',
    title: 'Natation - 100m papillon',
    sport: 'Natation',
    date: '2026-11-02',
    time: '13:30',
    location: 'Dakar',
    venue: 'Centre Aquatique',
    description: 'Series du 100m papillon.',
    image: '/events/swimming-2.jpg',
    participants: ['Sénégal', 'USA', 'Italie'],
  },
];

export const mockLiveScores: LiveScore[] = [
  {
    id: '1',
    eventId: '1',
    sport: 'Football',
    team1: { name: 'Sénégal', country: 'SEN', score: 2, flag: '🇸🇳' },
    team2: { name: 'Brésil', country: 'BRA', score: 1, flag: '🇧🇷' },
    status: 'live',
    time: '67\'',
    period: '2ème mi-temps',
  },
  {
    id: '2',
    eventId: '2',
    sport: 'Basketball 3x3',
    team1: { name: 'USA', country: 'USA', score: 18, flag: '🇺🇸' },
    team2: { name: 'France', country: 'FRA', score: 15, flag: '🇫🇷' },
    status: 'live',
    time: '8:45',
  },
  {
    id: '3',
    eventId: '3',
    sport: 'Handball',
    team1: { name: 'Allemagne', country: 'GER', score: 28, flag: '🇩🇪' },
    team2: { name: 'Espagne', country: 'ESP', score: 26, flag: '🇪🇸' },
    status: 'finished',
    time: 'Terminé',
  },
  {
    id: '4',
    eventId: '4',
    sport: 'Tennis de table',
    team1: { name: 'Chine', country: 'CHN', score: 3, flag: '🇨🇳' },
    team2: { name: 'Japon', country: 'JPN', score: 2, flag: '🇯🇵' },
    status: 'live',
    time: 'Set 5',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'score',
    title: 'But! Sénégal marque!',
    message: 'Le Sénégal mène 2-1 contre le Brésil',
    time: 'Il y a 2 min',
    read: false,
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Événement dans 1 heure',
    message: 'Basketball 3x3 commence bientôt à Arena Dakar',
    time: 'Il y a 15 min',
    read: false,
  },
  {
    id: '3',
    type: 'event',
    title: 'Nouvel événement ajouté',
    message: 'Concert de clôture avec Youssou N\'Dour',
    time: 'Il y a 1 heure',
    read: true,
  },
  {
    id: '4',
    type: 'security',
    title: 'Info trafic',
    message: 'Route de Diamniadio fluide. Temps estimé: 25 min',
    time: 'Il y a 2 heures',
    read: true,
  },
];

export const mockVenues: Venue[] = [
  { id: '1', name: 'Stade Abdoulaye Wade', type: 'stadium', lat: 14.7167, lng: -17.4677, address: 'Diamniadio, Sénégal', description: 'Stade principal des JOJ' },
  { id: '2', name: 'Arena Dakar', type: 'stadium', lat: 14.7200, lng: -17.4700, address: 'Diamniadio, Sénégal', description: 'Salle multisport couverte' },
  { id: '3', name: 'Centre Aquatique', type: 'stadium', lat: 14.7180, lng: -17.4650, address: 'Diamniadio, Sénégal', description: 'Piscine olympique' },
  { id: '4', name: 'Gare TER', type: 'transport', lat: 14.7150, lng: -17.4600, address: 'Diamniadio, Sénégal' },
  { id: '5', name: 'Hôpital JOJ', type: 'medical', lat: 14.7190, lng: -17.4620, address: 'Diamniadio, Sénégal' },
  { id: '6', name: 'Village Gastronomique', type: 'food', lat: 14.7175, lng: -17.4690, address: 'Diamniadio, Sénégal' },
];

export const mockTransactions: Transaction[] = [
  { id: '1', type: 'ticket', title: 'Finale Football', amount: 15000, date: '2026-10-20', status: 'completed' },
  { id: '2', type: 'ticket', title: 'Basketball 3x3', amount: 8000, date: '2026-10-21', status: 'completed' },
  { id: '3', type: 'merchandise', title: 'T-shirt JOJ 2026', amount: 12000, date: '2026-10-22', status: 'pending' },
];

export const sportsList = [
  'Football', 'Basketball', 'Athlétisme', 'Natation', 'Breaking',
  'Beach Volley', 'Tennis de table', 'Handball', 'Arts martiaux', 'Escalade'
];

export const quickSuggestions = [
  "Que faire aujourd'hui ?",
  "Comment aller au stade ?",
  "Prochains matchs du Sénégal",
  "Restaurants à proximité",
  "Programme de demain",
  "Billets disponibles",
];
