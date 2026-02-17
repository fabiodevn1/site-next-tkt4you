export interface EventTicket {
  type: string;
  price: number;
  available: number;
}

export interface Event {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  location: string;
  address: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  description: string;
  lineup: string[];
  tickets: EventTicket[];
}

export const events: Event[] = [
  {
    id: "1",
    title: "Cosmic Night Festival",
    artist: "DJ Nebula & Friends",
    date: "15 Mar 2025",
    time: "22:00",
    location: "Arena Galaxy, São Paulo",
    address: "Av. das Estrelas, 1000 - Vila Cósmica",
    price: 150,
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    category: "Festival",
    rating: 4.8,
    description:
      "Uma noite mágica sob as estrelas com os melhores DJs do universo. Prepare-se para uma experiência sensorial única com visuais de tirar o fôlego, lasers cósmicos e muito mais!",
    lineup: ["DJ Nebula", "Aurora Beats", "Stellar Sounds", "Cosmic Wave"],
    tickets: [
      { type: "Pista", price: 150, available: 500 },
      { type: "Área VIP", price: 350, available: 100 },
      { type: "Camarote Premium", price: 800, available: 20 },
    ],
  },
  {
    id: "2",
    title: "Stellar Rock Tour",
    artist: "The Asteroids",
    date: "22 Mar 2025",
    time: "20:00",
    location: "Estádio Orbital, Rio de Janeiro",
    address: "Rua da Galáxia, 500 - Zona Sul",
    price: 180,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    category: "Rock",
    rating: 4.9,
    description:
      "A maior turnê de rock do ano! The Asteroids trazem seus maiores sucessos em uma apresentação épica que vai fazer o estádio tremer!",
    lineup: ["The Asteroids", "Meteor Crash", "Black Hole"],
    tickets: [
      { type: "Arquibancada", price: 180, available: 2000 },
      { type: "Pista", price: 280, available: 800 },
      { type: "Front Stage", price: 550, available: 150 },
    ],
  },
  {
    id: "3",
    title: "Neon Dreams",
    artist: "Aurora Beats",
    date: "30 Mar 2025",
    time: "21:00",
    location: "Centro de Eventos Cosmos, São Paulo",
    address: "Rua Nova Aurora, 200 - Centro",
    price: 120,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    category: "Eletrônica",
    rating: 4.7,
    description:
      "Uma experiência imersiva de música eletrônica com projeções neon e performances visuais incríveis.",
    lineup: ["Aurora Beats", "Neon Pulse", "Digital Wave"],
    tickets: [
      { type: "Pista", price: 120, available: 600 },
      { type: "Área VIP", price: 280, available: 80 },
    ],
  },
  {
    id: "4",
    title: "Stand-up Galáctico",
    artist: "Comediantes do Espaço",
    date: "5 Abr 2025",
    time: "20:00",
    location: "Teatro Nebulosa, Curitiba",
    address: "Av. das Constelações, 88 - Batel",
    price: 80,
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80",
    category: "Stand-up",
    rating: 4.6,
    description:
      "Uma noite de risadas com os melhores comediantes do Brasil em um show único e imperdível.",
    lineup: ["Comediantes do Espaço", "Riso Estelar"],
    tickets: [
      { type: "Plateia", price: 80, available: 300 },
      { type: "Camarote", price: 150, available: 50 },
    ],
  },
  {
    id: "5",
    title: "Sertanejo das Estrelas",
    artist: "Dupla Constelação",
    date: "12 Abr 2025",
    time: "19:00",
    location: "Arena Country, Goiânia",
    address: "Rod. dos Cometas, km 12 - Zona Rural",
    price: 200,
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    category: "Sertanejo",
    rating: 4.9,
    description:
      "O maior evento sertanejo do ano com a Dupla Constelação e convidados especiais.",
    lineup: ["Dupla Constelação", "Estrela Solitária", "Via Láctea"],
    tickets: [
      { type: "Pista", price: 200, available: 1000 },
      { type: "Área VIP", price: 400, available: 200 },
      { type: "Camarote Premium", price: 900, available: 30 },
    ],
  },
  {
    id: "6",
    title: "Jazz & Wine Night",
    artist: "Orquestra Lunar",
    date: "18 Abr 2025",
    time: "20:30",
    location: "Casa da Música, Belo Horizonte",
    address: "Rua da Harmonia, 45 - Savassi",
    price: 250,
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
    category: "Jazz",
    rating: 4.8,
    description:
      "Uma noite sofisticada de jazz acompanhada de vinhos selecionados e gastronomia refinada.",
    lineup: ["Orquestra Lunar", "Quarteto Satélite"],
    tickets: [
      { type: "Mesa Duo", price: 250, available: 60 },
      { type: "Mesa Quartet", price: 450, available: 30 },
    ],
  },
  {
    id: "7",
    title: "Pop Universe Tour",
    artist: "Marina Starlight",
    date: "25 Abr 2025",
    time: "21:00",
    location: "Ginásio Estelar, Salvador",
    address: "Av. Oceânica, 3000 - Barra",
    price: 350,
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",
    category: "Pop",
    rating: 5.0,
    description:
      "Marina Starlight apresenta sua turnê mundial com cenografia de tirar o fôlego e seus maiores hits.",
    lineup: ["Marina Starlight"],
    tickets: [
      { type: "Arquibancada", price: 350, available: 3000 },
      { type: "Pista", price: 550, available: 1000 },
      { type: "Front Stage", price: 1200, available: 100 },
    ],
  },
  {
    id: "8",
    title: "Rave do Cosmos",
    artist: "Vários DJs",
    date: "1 Mai 2025",
    time: "23:00",
    location: "Fazenda Via Láctea, Campinas",
    address: "Estrada do Universo, s/n - Zona Rural",
    price: 280,
    image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
    category: "Rave",
    rating: 4.7,
    description:
      "A rave mais aguardada do ano numa fazenda sob o céu estrelado. 12 horas de música non-stop.",
    lineup: ["DJ Cosmos", "Nebula Sound", "Stardust", "Gravity Beat"],
    tickets: [
      { type: "Ingresso Único", price: 280, available: 2000 },
      { type: "Área VIP", price: 500, available: 300 },
    ],
  },
];
