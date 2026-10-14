export interface DiscData {
  id: number
  title: string
  artist: string
  genre: string
  trackName: string
  duration: string
  bpm: number
  primaryColor: string // CSS hex
  accentColor: string
  topLabel: string
  handwrittenTitle: string
  subText: string
  capacityText: string
  imagePath: string
  contractStatus: string
  bio: string
  rider: string
  textureUrl?: string
}

export const DISCS: DiscData[] = [
  {
    id: 1,
    title: 'BLUE PLAYLIST AUDIO CD',
    artist: 'ARPIT BALA',
    genre: 'Audio CD Playlist',
    trackName: '01. Bandar (Arpit Bala)',
    duration: '03:15',
    bpm: 128,
    primaryColor: '#0047bf',
    accentColor: '#ffffff',
    topLabel: 'AUDIO CD PLAYLIST',
    handwrittenTitle: 'arpit bala',
    subText: 'AUDIO CD PLAYLIST',
    capacityText: '700 MB',
    imagePath: '/cd_arpit_bala.png',
    textureUrl: '/cd_arpit_bala.png',
    contractStatus: 'Master Recording',
    bio: 'Authentic handwritten playlist audio CD by Arpit Bala.',
    rider: 'Direct optical playback.',
  },
  {
    id: 2,
    title: 'GOLDEN HOLOGRAPHIC CD-R',
    artist: 'CHAAR DIWAARI',
    genre: 'Alternative / Hip Hop',
    trackName: '02. Barood (Chaar Diwaari)',
    duration: '02:58',
    bpm: 140,
    primaryColor: '#eab308',
    accentColor: '#0f172a',
    topLabel: 'Audio Density CD-R 1.3GB',
    handwrittenTitle: 'Chaar diwaari',
    subText: '1.3GB COMPACT DISC RECORDABLE',
    capacityText: '1.3 GB',
    imagePath: '/cd_chaar_diwaari.png',
    textureUrl: '/cd_chaar_diwaari.png',
    contractStatus: 'Master Recording',
    bio: 'Authentic handwritten Golden Holographic CD-R by Chaar Diwaari.',
    rider: 'Direct optical playback.',
  },
  {
    id: 3,
    title: 'CD-R74 RED SWOOSH',
    artist: 'KARAN KANCHAN',
    genre: 'Trap / Electronic Hip Hop',
    trackName: '03. Samurai (Karan Kanchan)',
    duration: '03:05',
    bpm: 145,
    primaryColor: '#f1f5f9',
    accentColor: '#dc2626',
    topLabel: 'CD-R74 16x',
    handwrittenTitle: 'Karan Kanchan',
    subText: '16x MULTISPEED 74MIN/650MB',
    capacityText: '650 MB',
    imagePath: '/cd_karan_kanchan.png',
    textureUrl: '/cd_karan_kanchan.png',
    contractStatus: 'Master Recording',
    bio: 'Authentic handwritten CD-R74 by Karan Kanchan.',
    rider: 'Direct optical playback.',
  },
  {
    id: 4,
    title: 'HOLOGRAPHIC RED AUDIO DENSITY',
    artist: 'KARHISAB',
    genre: 'Experimental / Desi Hip Hop',
    trackName: '04. A Lot (Karhisab)',
    duration: '03:18',
    bpm: 132,
    primaryColor: '#dc2626',
    accentColor: '#ffffff',
    topLabel: 'Audio Density CD-R 1.3GB',
    handwrittenTitle: 'KARHISAB',
    subText: '1.3GB COMPACT DISC RECORDABLE',
    capacityText: '1.3 GB',
    imagePath: '/cd_karhisab.png',
    textureUrl: '/cd_karhisab.png',
    contractStatus: 'Master Recording',
    bio: 'Authentic handwritten Holographic Red CD-R by Karhisab.',
    rider: 'Direct optical playback.',
  },
]
