import images from '../assets/images';
import {
  CalenderBg,
  LocationDark,
  ProfileBg,
  TicketBg,
  WalletBg,
} from '../assets/svgs';
import strings from '../i18n/strings';
import {StackNav} from '../navigation/NavigationKeys';

const OnBoardingSlide = [
  {
    text: 'We provide high quality products just for you',
    image: images.onBordingImg1,
  },
  {
    text: 'Your satisfaction is our number one priority',
    image: images.onBordingImg2,
  },
  {
    text: "Let's fulfill your daily needs with Evone right now!",
    image: images.onBordingImg3,
  },
];

const GenderData = [
  {label: 'Uomo', value: 'uomo'},
  {label: 'Donna', value: 'donna'},
  {label: 'Altro', value: 'altro'},
];

const EventType = [
  {label: strings.clubTable, value: 'tavolo'},
  {label: strings.privateEvent, value: 'evento_privato'},
];

const City = [
  {label: "Milano", value: 'milano'},
];

const Club = [
  {label: "11Clubroom", value: '11Clubroom'},
  {label: "JustMe", value: 'justme'},
  {label: "Magazzini Generali", value: 'magazzinigenerali'},
  {label: "The Club", value: 'theclub'},
  {label: "The Grace", value: 'thegrace'},
];


const CountryData = [
  {label: 'India', value: 'india'},
  {label: 'USA', value: 'usa'},
  {label: 'UK', value: 'uk'},
  {label: 'Canada', value: 'canada'},
  {label: 'Australia', value: 'australia'},
  {label: 'New Zealand', value: 'newzealand'},
  {label: 'South Africa', value: 'southafrica'},
];

const ProfileSetting = [
  {
    id: 1,
    title: strings.editProfile,
    icon: 'person-outline',
    route: StackNav.ProfileInformation,
    header: strings.editProfile,
  },
  {
    id: 2,
    title: strings.editUsername,
    icon: 'text-outline',
    route: StackNav.EditUsername,
    header: strings.editUsername,
  },

  {
    id: 4,
    title: strings.security,
    icon: 'shield-checkmark-outline',
    route: StackNav.Security,
  },
  {
    id: 5,
    title: strings.language,
    icon: 'options-outline',
    value: 'Italiano',
    route: StackNav.Language,
  },
  {
    id: 6,
    title: strings.darkMode,
    icon: 'contrast-outline',
    rightIcon: 'rightIcon',
  },
  {
    id: 7,
    title: strings.termsAndConditions,
    icon: 'lock-closed-outline',
    route: StackNav.PrivacyPolicy,
  },
  {
    id: 8,
    title: strings.helpCenter,
    icon: 'information-circle-outline',
    route: StackNav.HelpCenter,
  },
];

const contactUsData = [
  {
    id: 1,
    title: 'Customer Service',
    icon: 'headset',
  },
  {
    id: 2,
    title: 'WhatsApp',
    icon: 'whatsapp',
  },
  {
    id: 3,
    title: 'Website',
    icon: 'google-earth',
  },
  {
    id: 4,
    title: 'Facebook',
    icon: 'facebook',
  },
  {
    id: 5,
    title: 'Instagram',
    icon: 'instagram',
  },
  {
    id: 6,
    title: 'Twitter',
    icon: 'twitter',
  },
];

const helperCategoryData = [
  'General',
  'Account',
  'Payment',
  'Subscription',
  'Others',
];

const helperData = [
  {
    title: 'Come faccio a partecipare ad un evento?',
    description:
      'Scegli il tavolo o l\'\evento privato al quale sei interessato, paga e verrai inserito nella chat con gli altri partecipanti'
  },
  {
    title: 'Gli eventi sono organizzati in base al target di età?',
    description:
      'Tutti i tavoli e gli eventi organizzati da WayOut hanno un target di età dai 18 ai 28 anni.  Per i tavoli e gli eventi non organizzati da WayOut, l\'\organizzatore potrà indicare il target d\'\età.',
  },
  {
    title: 'In quali club verranno organizzati i tavoli?',
    description:
      'I tavoli possono essere organizzati da WayOut e da tutti gli altri utenti, in tutti i club presenti nella lista della pagina "Crea evento"',
  },
  {
    title: 'Sei un PR, un Club o un Organizzatore di eventi e vorresti collaborare con WayOut?',
    description:
      'Siamo sempre alla ricerca di nuove collaborazioni con Club, PR e Organizzatori di eventi. Contattaci all\'\email hello@wayoutapp.it',
  },
  {
    title: ' Sono interessato a partecipare ad un tavolo o ad un evento privato. Qual è la quota di partecipazione?',
    description:
      'Tutti i dettagli relativi ai tavoli e agli eventi privati,compresa la quota da partecipazione (a discrezione dell\'\organizzatore), vengono indicati nella pagina di ciascun evento.',
  },
];

const languageData = [
  {
    title: 'Language',
    data: [
      {
        lnName: 'Italiano',
      },
    ],
  },
];

const privacyPolicyData = [
  {
    title: "1. Accettazione dell'Accordo sui Termini di Utilizzo.",
    description: "Creando un evento o unendoti ad un evento con WayOut, tramite un dispositivo mobile, un'applicazione mobile o un computer (collettivamente, il Servizio), accetti di essere vincolato dai presenti Termini di Utilizzo. Qualora non accetti di essere vincolato da tutti i termini del presente Accordo, ti invitiamo a non utilizzare il Servizio. Di tanto in tanto, potremmo apportare modifiche all'Accordo e al Servizio per vari motivi, ad esempio per riflettere cambiamenti nella legislazione o obblighi di legge, nuove funzioni o nuove pratiche commerciali. La versione più recente del presente Accordo sarà pubblicata su questo sito e dovrai consultare regolarmente la versione più recente. La versione più recente è la versione applicabile.",
  },
  {
    title: "Ti ricordiamo che per usare il Servizio devi rispettare i seguenti punti:",
    description: "Devi essere maggiorenne. Devi rispettare il presente Accordo e tutte le leggi, norme e regolamenti locali, statali, nazionali e internazionali applicabili, e non aver mai subito condanne per crimini gravi o reati perseguibili (o crimini di analoga gravità), reati asfondo sessuale o qualsiasi crimine violento e di non avere l'obbligo di registrarti come responsabile di reati sessuali in appositi registri statali, federali o locali.",
  },
  {
    title: "Modifiche al Servizio e risoluzione.",
    description: "WayOut si impegna a migliorare continuamente il Servizio e a offrire a chi lo utilizza altre funzioni utili e interessanti. Questo significa che di tanto in tanto potremmo aggiungere nuove funzioni o miglioramenti oppure rimuovere alcune funzioni esistenti e, se queste azioni non incidono in modo sostanziale sui tuoi diritti o obblighi, potremmo procedere in tal senso senza previa notifica. Potremmo perfino sospendere in toto il Servizio, nel qual caso te lo comunicheremo in anticipo, a meno che non siano presenti circostanze attenuanti, come problemi di sicurezza, che ci impediscono di farlo.",
  },
  {
    title: "Sicurezza: interazioni con le altre persone su WayOut.",
    description: "WayOut non è responsabile per la condotta di ognuno all'interno o all'esterno del Servizio. Accetti di usare cautela in tutte le interazioni con le altre persone su WayOut, in particolare se decidi di partecipare ad un evento, comunicare con loro all'esterno o all’interno del Servizio e incontrarle nella vita reale. Accetti, altresì, di non fornire informazioni finanziarie (ad esempio, i dati del conto bancario o della carta di credito) né di trasferire o inviare denaro ad altre persone su WayOut. SEI L'UNICA PERSONA RESPONSABILE DELLE TUE INTERAZIONI CON LE ALTRE PERSONE SU WAYOUT. SEI CONSAPEVOLE CHE WAYOUT NON EFFETTUA CONTROLLI SUI PRECEDENTI PENALI DELLE PERSONE ISCRITTE NÉ INDAGA SUL LORO PASSATO IN ALTRI MODI. WAYOUT NON RILASCIA ALCUNA DICHIARAZIONE O GARANZIA IN MERITO ALLA CONDOTTA DEGLI UTILIZZATORI DEL SERVIZIO.",
  },
  {
    title: "Dichiarazioni di non responsabilità.",
    description: "WAYOUT FORNISCE IL SERVIZIO COSÌ COM'È E COME DISPONIBILE E, NELLA MISURA CONSENTITA DALLA LEGGE APPLICABILE, NON FORNISCE GARANZIE DI ALCUN TIPO, ESPRESSE, IMPLICITE, DI LEGGE O DI ALTRO TIPO IN RELAZIONE AL SERVIZIO (INCLUSI TUTTI I RELATIVICONTENUTI). WAYOUT NON DICHIARA NÉ GARANTISCE CHE (A) IL SERVIZIO SARÀ PRIVO DI INTERRUZIONI, SICURO O ESENTE DA ERRORI, CHE (B) EVENTUALI DIFETTI O ERRORI NEL SERVIZIO SARANNO CORRETTI O CHE (C) QUALSIASI INFORMAZIONE O CONTENUTO OTTENUTO SU O TRAMITE IL SERVIZIO SARÀ ACCURATO",
  },
  {
    title: "Accordo completo; Varie ed eventuali.",
    description: "Il presente Accordo ed eventuali termini comunicati e da te accettati rappresenta l'accordo completo tra te e WayOut in relazione all'utilizzo del Servizio. Se una clausola del presente Accordo viene ritenuta non valida, la restante parte dell'Accordo continuerà ad avere piena validità ed efficacia. Il mancato esercizio o la mancata applicazione da parte di WayOut di qualsiasi diritto o clausola del presente Accordo non costituirà una rinuncia a tale diritto o clausola. Il presente Accordo non comporta la creazione di alcun rapporto di lavoro, agenzia, partnership, joint venture, fiduciario o altro rapporto speciale e non potrai rilasciare dichiarazioni per conto di WayOut né vincolare WayOut in alcun modo.",
  }
];

const userDetail = [
  {
    name: 'Dracel Steward',
    description: 'arianacooper | 24.5M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    name: 'John Doe',
    description: 'johndoe | 10M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Jane Smith',
    description: 'janesmith | 5M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fHVzZXIlMjBwcm9maWxlJTIwd2l0aCUyMGJhY2tncm91bmR8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Bob Johnson',
    description: 'bobjohnson | 2M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Sara Wilson',
    description: 'sarawilson | 1M followers',
    imgUrl:
      'https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Tom Wilson',
    description: 'tomwilson | 500K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjl8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Alice Brown',
    description: 'alicebrown | 250K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzZ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Emily Davis',
    description: 'emilydavis | 100K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Mark Lee',
    description: 'marklee | 50K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTN8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
  {
    name: 'Laura Lee',
    description: 'lauralee | 10K followers',
    imgUrl:
      'https://images.unsplash.com/photo-1610737241336-371badac3b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTJ8fHVzZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60',
  },
];

const chatData = [
  {
    id: 1,
    message: 'Hi Theresa, good morning 😄',
    time: '12:00',
    type: 'sender',
  },
  {
    id: 2,
    message: 'Hi there, good morning! How are you?',
    time: '12:01',
    type: 'receiver',
  },
  {
    id: 3,
    message: 'I am doing well, thanks for asking 😊',
    time: '12:02',
    type: 'sender',
  },
  {
    id: 4,
    message: "That's great to hear! What are your plans for the day?",
    time: '12:03',
    type: 'receiver',
  },
  {
    id: 5,
    message:
      'I have a few meetings scheduled, but otherwise just working from home. How about you?',
    time: '12:04',
    type: 'sender',
  },
  {
    id: 1,
    message: 'Hi Theresa, good morning 😄',
    time: '12:00',
    type: 'sender',
  },
  {
    id: 2,
    message: 'Hi there, good morning! How are you?',
    time: '12:01',
    type: 'receiver',
  },
  {
    id: 3,
    message: 'I am doing well, thanks for asking 😊',
    time: '12:02',
    type: 'sender',
  },
  {
    id: 4,
    message: "That's great to hear! What are your plans for the day?",
    time: '12:03',
    type: 'receiver',
  },
  {
    id: 5,
    message:
      'I have a few meetings scheduled, but otherwise just working from home. How about you?',
    time: '12:04',
    type: 'sender',
  },
  {
    id: 1,
    message: 'Hi Theresa, good morning 😄',
    time: '12:00',
    type: 'sender',
  },
  {
    id: 2,
    message: 'Hi there, good morning! How are you?',
    time: '12:01',
    type: 'receiver',
  },
  {
    id: 3,
    message: 'I am doing well, thanks for asking 😊',
    time: '12:02',
    type: 'sender',
  },
  {
    id: 4,
    message: "That's great to hear! What are your plans for the day?",
    time: '12:03',
    type: 'receiver',
  },
  {
    id: 5,
    message:
      'I have a few meetings scheduled, but otherwise just working from home. How about you?',
    time: '12:04',
    type: 'sender',
  },
];

const walletData = [
  {
    id: 1,
    product: 'Suga Leather Shoes',
    price: '$100',
    date: 'Dec 15, 2024 | 12:00 PM',
    status: strings.orders,
    productImage: images.shoes1,
  },
  {
    id: 2,
    product: strings.topUpWallet,
    price: '$150',
    date: 'Jan 05, 2023 | 12:50 PM',
    status: strings.topUp,
  },
  {
    id: 3,
    product: 'Werolla Cardigans',
    price: '$385',
    date: 'Dec 14, 2024 | 11:34 PM',
    status: strings.orders,
    productImage: images.clothe3,
  },
  {
    id: 4,
    product: 'Mini Leather Bag',
    price: '$653',
    date: 'Dec 13, 2024 | 03:23 AM',
    status: strings.orders,
    productImage: images.bag1,
  },
  {
    id: 5,
    product: strings.topUpWallet,
    price: '$600',
    date: 'Dec 12, 2024 | 02:50 AM',
    status: strings.topUp,
  },
  {
    id: 6,
    product: 'Puma Leather Shoes',
    price: '$356',
    date: 'Dec 03, 2024 | 02:34 PM',
    status: strings.orders,
    productImage: images.shoes2,
  },
  {
    id: 7,
    product: 'Sony Microphone',
    price: '$354',
    date: 'Aug 07, 2023 | 05:40 PM ',
    status: strings.orders,
    productImage: images.mic1,
  },
  {
    id: 8,
    product: 'Gucci Leather Bag',
    price: '$100',
    date: 'Jul 15, 2023 | 12:00 PM',
    status: strings.orders,
    productImage: images.bag2,
  },
  {
    id: 9,
    product: strings.topUpWallet,
    price: '$560',
    date: 'Jan 05, 2023 | 12:50 PM',
    status: strings.topUp,
  },
];

const mostPopularData = [
  '✅ All',
  '🎵 Music',
  '💼 Workshops',
  '🎨 Art',
  '🍕 Food & Drink',
  '🧥 Fashion',
];

const notificationData = [
  {
    id: 1,
    image: <CalenderBg />,
    title: 'Booking Successful!',
    description: '20 Dec, 2022 | 20:49 PM',
    desc: "You have successfully booked the Art Workshops. The event will be held on Sunday, December 22, 2022, 13.00 - 14.00 PM. Don't forget to activate your reminder. Enjoy the event!",
    isNew: true,
  },
  {
    id: 2,
    image: <CalenderBg />,
    title: 'Booking Successful!',
    description: '19 Dec, 2022 | 12:00 PM',
    desc: "You have successfully booked the National Music Festival. The event will be held on Monday, December 24, 2022, 18.00 - 23.00 PM. Don't forget to activate your reminder. Enjoy the event!",
    isNew: true,
  },
  {
    id: 3,
    image: <TicketBg />,
    title: 'New Services Available!',
    description: '14 Dec, 2022 | 12:00 PM',
    desc: 'You can now make multiple book events at once. You can also cancel your booking.',
  },
  {
    id: 4,
    image: <WalletBg />,
    title: 'Credit Card Connected!',
    description: '12 Dec, 2022 | 12:00 PM',
    desc: 'Your credit card has been successfully linked with Eveno. Enjoy our service.',
  },
  {
    id: 5,
    image: <ProfileBg />,
    title: 'Account Setup Successful!',
    description: '12 Dec, 2022 | 12:00 PM',
    desc: 'Your account creation is successful, you can now experience our services.',
  },
];

const reviewsData = [
  {
    id: 1,
    name: 'John Duew',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',

    rating: 5,
    review:
      'The item is very good, my son likes it very much and plays every day 💯💯💯',
    like: 352,
    time: '6 days ago',
  },
  {
    id: 2,
    name: 'Jane Doe',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',

    rating: 4,
    review:
      'The item is good, but it could be better. My son likes it, but he has some complaints about it.',
    like: 100,
    time: '2 days ago',
  },
  {
    id: 3,
    name: 'Bob Smith',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',

    rating: 3,
    review:
      'The item is okay, but it could be better. My son likes it, but he has some complaints about it.',
    like: 50,
    time: '1 day ago',
  },
  {
    id: 4,
    name: 'Alice Johnson',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',

    rating: 2,
    review:
      'The item is not very good. My son does not like it very much and does not play with it often.',
    like: 10,
    time: '1 hour ago',
  },
  {
    id: 5,
    name: 'Tom Hanks',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',

    rating: 1,
    review:
      'The item is terrible. My son hates it and does not play with it at all.',
    like: 1,
    time: '1 minute ago',
  },
  {
    id: 6,
    name: 'Megan Fox',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',

    rating: 5,
    review:
      'The item is very good, my son likes it very much and plays every day 💯💯💯',
    like: 352,
    time: '6 days ago',
  },
  {
    id: 7,
    name: 'Samantha Smith',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',

    rating: 4,
    review:
      'The item is good, but it could be better. My daughter likes it, but she has some complaints about it.',
    like: 200,
    time: '3 days ago',
  },
  {
    id: 8,
    name: 'David Johnson',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',

    rating: 3,
    review:
      'The item is okay, but it could be better. My daughter likes it, but she has some complaints about it.',
    like: 100,
    time: '2 days ago',
  },
  {
    id: 9,
    name: 'Emily Brown',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',

    rating: 2,
    review:
      'The item is not very good. My daughter does not like it very much and does not play with it often.',
    like: 20,
    time: '1 day ago',
  },
  {
    id: 10,
    name: 'Olivia Davis',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',

    rating: 1,
    review:
      'The item is terrible. My daughter hates it and does not play with it at all.',
    like: 2,
    time: '1 hour ago',
  },
  {
    id: 11,
    name: 'Sophia Wilson',
    image: 'https://randomuser.me/api/portraits/women/7.jpg',

    rating: 5,
    review:
      'The item is very good, my daughter likes it very much and plays every day 💯💯💯',
    like: 352,
    time: '6 days ago',
  },
];

const EventData = [
  {
    id: 1,
    image: images.concert1,
    title: 'Nome evento',
    time: '07/10/2023',
    address: 'Old Fashion',
  },
  {
    id: 2,
    image: images.concert2,
    title: 'Saturday Night',
    time: '07/10/2023',
    address: 'Old Fashion',
  },

  {
    id: 3,
    image: images.concert3,
    title: 'Saturday Night',
    time: '07/10/2023',
    address: 'Old Fashion',
  },
];

const UserData = [
  {
    id: 1,
    name: 'Matteo',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    id: 2,
    name: 'Marco',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    id: 3,
    name: 'Pasquale',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    id: 4,
    name: 'Paola',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    id: 5,
    name: 'Francesca',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    id: 6,
    name: 'Maria',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
  {
    id: 7,
    name: 'Domenico',
    image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
  },
];

const concertImageData = [
  {
    id: 1,
    imageUrl:
      'https://images.unsplash.com/photo-1481886756534-97af88ccb438?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80',
  },
  {
    id: 2,
    imageUrl:
      'https://images.unsplash.com/photo-1473261422289-ece70cf625d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 3,
    imageUrl:
      'https://images.unsplash.com/photo-1519736927049-de9d69a15bb3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
  },
  {
    id: 4,
    imageUrl:
      'https://images.unsplash.com/photo-1428992992979-aaeb02b6960c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
  },
  {
    id: 5,
    imageUrl:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 6,
    imageUrl:
      'https://images.unsplash.com/uploads/1411160110892ab555b6f/80b0d25e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
  },
  {
    id: 7,
    imageUrl:
      'https://images.unsplash.com/photo-1556340346-5e30da977c4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDIwfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 8,
    imageUrl:
      'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 9,
    imageUrl:
      'https://images.unsplash.com/photo-1507901747481-84a4f64fda6d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60',
  },
  {
    id: 10,
    imageUrl:
      'https://images.unsplash.com/photo-1442504028989-ab58b5f29a4a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 11,
    imageUrl:
      'https://images.unsplash.com/17/unsplash_5252bb51404f8_1.JPG?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1506026667107-3350a4c8eca6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    id: 13,
    imageUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
];


const bookedData = [
  {
    id: 1,
    image: 'https://www.timeoutdubai.com/cloud/timeoutdubai/2022/11/22/LSB-HERO-IMAGE-22.jpg',
    title: 'Coffee Tasting',
    time: 'Ciao',
    address: 'The Roastery, Portland',
    isFree: true,
  },
  {
    id: 2,
    image: 'https://www.timeoutdubai.com/cloud/timeoutdubai/2022/11/22/LSB-HERO-IMAGE-22.jpg',
    title: 'Film Screening',
    time: 'Ciao, come stai???',
    address: 'Cinema Paradiso, San Francisco',
  },
  {
    id: 3,
    image: 'https://www.timeoutdubai.com/cloud/timeoutdubai/2022/11/22/LSB-HERO-IMAGE-22.jpg',
    title: 'Fashion Show',
    time: 'Grande serata questa seraaaaaaaaaaaa',
    address: 'Fashion Institute of Technology, New York',
  },
  {
    id: 4,
    image: 'https://www.timeoutdubai.com/cloud/timeoutdubai/2022/11/22/LSB-HERO-IMAGE-22.jpg',
    title: 'Street Art Festival',
    time: 'Malcom il patataro',
    address: 'Wynwood Walls, Miami',
    isFree: true,
  },
  {
    id: 5,
    image: 'https://www.timeoutdubai.com/cloud/timeoutdubai/2022/11/22/LSB-HERO-IMAGE-22.jpg',
    title: 'Comedy Night',
    time: 'Oooohhhhhh ciaoooo',
    address: 'The Comedy Store, Los Angeles',
  },
];


const popularEventData = [
  {
    id: 1,
    image: images.concert1,
    title: 'Saturday Night',
    time: '07/10/2023',
    address: 'Old Fashion',
    isFree: true,
  },
  {
    id: 2,
    image: images.concert2,
    title: 'Saturday Night',
    time: '07/10/2023',
    address: 'Old Fashion',
  },

  {
    id: 3,
    image: images.concert3,
    title: 'Saturday Night',
    time: '07/10/2023',
    address: 'Old Fashion',
  },

  {
    id: 4,
    image: images.concert4,
    title: 'Saturday Night',
    time: '07/10/2023',
    address: 'Old Fashion',
    isFree: true,
  },

  {
    id: 5,
    image: images.concert5,
    title: 'Saturday Night',
    time: '07/10/2023',
    address: 'Old Fashion',
  },

  {
    id: 6,
    image: images.concert6,
    title: 'Saturday Night',
    time: '07/10/2023',
    address: 'Old Fashion',
  },
];

export {
  ProfileSetting,
  GenderData,
  OnBoardingSlide,
  contactUsData,
  helperCategoryData,
  helperData,
  languageData,
  privacyPolicyData,
  userDetail,
  chatData,
  walletData,
  mostPopularData,
  notificationData,
  reviewsData,
  EventData,
  CountryData,
  concertImageData,
  bookedData,
  EventType,
  City,
  Club,
  UserData,
  popularEventData,
};
