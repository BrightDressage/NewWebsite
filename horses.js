/* HORSES FOR SALE
   One entry per horse. To add a horse, copy an entry, change the details and upload its photos
   to /horses/<slug>/. Each horse also needs its share page at /sales/<slug>.html.
   status: 'available', 'under-offer' or 'sold'
   price: e.g. '£45,000', or 'POA' for price on application
   video: { youtube: 'VIDEO_ID' } or { vimeo: 'VIDEO_ID' } or { file: '/horses/<slug>/video.mp4' }
   The first photo is the main photo. */
window.BD_HORSES = [
  {
    slug: 'finnleigh-gold',
    name: 'Finnleigh Gold',
    status: 'available',
    price: '£16,000',
    headline: 'A super honest young horse with the breeding to match',
    born: 2021,
    sex: 'Gelding',
    height: '16.3hh',
    colour: 'Black',
    studbook: 'Hanoverian',
    level: 'Backed',
    location: 'Kent, UK',
    breeding: { sire: 'Flammengold', dam: 'Ella Von Roon', damSire: 'Elroon' },
    highlights: [
      'Fantastic pedigree',
      'Three elastic gaits with a super walk',
      'Clean limbed and ready to progress'
    ],
    description: [
      'A super honest young horse with the breeding to match. He has been in the same home since 5 months old and has been well handled and cared for.',
      'He was given time to mature and, due to the owner\'s work commitments, was only started under saddle this summer.',
      'Throughout the backing process he has shown how kind and honest he is, and this incredible temperament means we think he would suit an ambitious amateur to progress to the top of the sport.'
    ],
    vetting: 'X-rays and vetting have not yet been carried out.',
    photos: [
      { src: '/horses/finnleigh-gold/1.jpg', alt: 'Finnleigh Gold in canter under Joseph Bright' },
      { src: '/horses/finnleigh-gold/2.jpg', alt: 'Finnleigh Gold in trot under Joseph Bright' },
      { src: '/horses/finnleigh-gold/3.jpg', alt: 'Finnleigh Gold standing side on in the field' },
      { src: '/horses/finnleigh-gold/4.jpg', alt: 'Head shot of Finnleigh Gold' },
      { src: '/horses/finnleigh-gold/5.jpg', alt: 'Finnleigh Gold looking towards the camera' },
      { src: '/horses/finnleigh-gold/6.jpg', alt: 'Finnleigh Gold head and shoulders' }
    ],
    video: null
  }
];
