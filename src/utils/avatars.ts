export type AvatarStyle = 'comic' | 'pixel' | 'anime' | 'photo';

export const OFFICIAL_LEADER_PHOTOS: Record<string, string> = {
  'sam-altman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sam_Altman_crop.jpg/800px-Sam_Altman_crop.jpg',
  'demis-hassabis': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Demis_Hassabis_Royal_Society.jpg/800px-Demis_Hassabis_Royal_Society.jpg',
  'jensen-huang': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Jensen_Huang_Computex_2023_%28cropped%29.jpg/800px-Jensen_Huang_Computex_2023_%28cropped%29.jpg',
  'elon-musk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/800px-Elon_Musk_Royal_Society_%28crop2%29.jpg',
  'satya-nadella': 'https://upload.wikimedia.org/wikipedia/commons/1/18/Satya_Nadella_2017.jpg',
  'yann-lecun': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Yann_LeCun_in_2018.jpg/800px-Yann_LeCun_in_2018.jpg',
  'andrew-ng': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Andrew_Ng_at_the_Global_Artificial_Intelligence_Summit_2020.jpg/800px-Andrew_Ng_at_the_Global_Artificial_Intelligence_Summit_2020.jpg',
  'geoffrey-hinton': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Geoffrey_Hinton_in_2018.jpg/800px-Geoffrey_Hinton_in_2018.jpg'
};

export const LEADER_AVATARS: Record<string, Record<AvatarStyle, string>> = {
  'sam-altman': {
    comic: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SamAltmanComic&skinColor=ffdbac&top=shortCurly&hairColor=2c1b18&facialHairProbability=0&clothing=hoodie&clothesColor=10a37f',
    pixel: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=SamAltmanPixel&skinColor=ffdbac&backgroundColor=10a37f',
    anime: 'https://api.dicebear.com/9.x/adventurer/svg?seed=SamAltmanAnime&skinColor=f2d6c1&hair=short01&hairColor=2c1b18&backgroundColor=10a37f',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sam_Altman_crop.jpg/800px-Sam_Altman_crop.jpg'
  },
  'demis-hassabis': {
    comic: 'https://api.dicebear.com/9.x/avataaars/svg?seed=DemisHassabisComic&skinColor=edb98a&top=shortFlat&hairColor=2c1b18&facialHairProbability=0&accessories=prescription02&accessoriesProbability=100&clothing=shirtVNeck&clothesColor=4285f4',
    pixel: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=DemisHassabisPixel&skinColor=edb98a&backgroundColor=4285f4',
    anime: 'https://api.dicebear.com/9.x/adventurer/svg?seed=DemisHassabisAnime&skinColor=edb98a&hair=short03&hairColor=1a1a1a&backgroundColor=4285f4',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Demis_Hassabis_Royal_Society.jpg/800px-Demis_Hassabis_Royal_Society.jpg'
  },
  'jensen-huang': {
    comic: 'https://api.dicebear.com/9.x/avataaars/svg?seed=JensenHuangComic&skinColor=f8d25c&top=shortFlat&hairColor=4a4a4a&facialHairProbability=0&clothing=overall&clothesColor=262626',
    pixel: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=JensenHuangPixel&skinColor=f8d25c&backgroundColor=76b900',
    anime: 'https://api.dicebear.com/9.x/adventurer/svg?seed=JensenHuangAnime&skinColor=f2d6c1&hair=short01&hairColor=4a4a4a&backgroundColor=76b900',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Jensen_Huang_Computex_2023_%28cropped%29.jpg/800px-Jensen_Huang_Computex_2023_%28cropped%29.jpg'
  },
  'elon-musk': {
    comic: 'https://api.dicebear.com/9.x/avataaars/svg?seed=ElonMuskComic&skinColor=fdc9b4&top=shortWaved&hairColor=724133&facialHairProbability=0&clothing=blazerAndShirt',
    pixel: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=ElonMuskPixel&skinColor=fdc9b4&backgroundColor=e82127',
    anime: 'https://api.dicebear.com/9.x/adventurer/svg?seed=ElonMuskAnime&skinColor=f2d6c1&hair=short02&hairColor=724133&backgroundColor=e82127',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/800px-Elon_Musk_Royal_Society_%28crop2%29.jpg'
  },
  'satya-nadella': {
    comic: 'https://api.dicebear.com/9.x/avataaars/svg?seed=SatyaNadellaMale&skinColor=d08b5b&top=noHair&facialHairProbability=0&accessories=prescription01&accessoriesProbability=100&clothing=collarAndSweater&clothesColor=00a4ef',
    pixel: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=SatyaNadellaPixelMale&skinColor=d08b5b&backgroundColor=00a4ef',
    anime: 'https://api.dicebear.com/9.x/adventurer/svg?seed=SatyaNadellaAnime&skinColor=edb98a&hair=short04&hairColor=1a1a1a&backgroundColor=00a4ef',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/1/18/Satya_Nadella_2017.jpg'
  },
  'yann-lecun': {
    comic: 'https://api.dicebear.com/9.x/avataaars/svg?seed=YannLeCunComic&skinColor=ffdbac&top=shortFlat&hairColor=2c1b18&facialHairProbability=0&accessories=prescription02&accessoriesProbability=100&clothing=blazerAndSweater',
    pixel: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=YannLeCunPixel&skinColor=ffdbac&backgroundColor=0668e1',
    anime: 'https://api.dicebear.com/9.x/adventurer/svg?seed=YannLeCunAnime&skinColor=f2d6c1&hair=short01&hairColor=2c1b18&backgroundColor=0668e1',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Yann_LeCun_in_2018.jpg/800px-Yann_LeCun_in_2018.jpg'
  },
  'andrew-ng': {
    comic: 'https://api.dicebear.com/9.x/avataaars/svg?seed=AndrewNgComic&skinColor=f8d25c&top=shortFlat&hairColor=2c1b18&facialHairProbability=0',
    pixel: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=AndrewNgPixel&skinColor=f8d25c&backgroundColor=ff6f00',
    anime: 'https://api.dicebear.com/9.x/adventurer/svg?seed=AndrewNgAnime&skinColor=f2d6c1&hair=short01&hairColor=2c1b18&backgroundColor=ff6f00',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Andrew_Ng_at_the_Global_Artificial_Intelligence_Summit_2020.jpg/800px-Andrew_Ng_at_the_Global_Artificial_Intelligence_Summit_2020.jpg'
  },
  'geoffrey-hinton': {
    comic: 'https://api.dicebear.com/9.x/avataaars/svg?seed=GeoffreyHintonComic&skinColor=fdc9b4&top=shortFlat&hairColor=e8e8e8&facialHairProbability=0&clothing=blazerAndShirt',
    pixel: 'https://api.dicebear.com/9.x/pixel-art/svg?seed=GeoffreyHintonPixel&skinColor=fdc9b4&backgroundColor=9c27b0',
    anime: 'https://api.dicebear.com/9.x/adventurer/svg?seed=GeoffreyHintonAnime&skinColor=f2d6c1&hair=short01&hairColor=b1b1b1&backgroundColor=9c27b0',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Geoffrey_Hinton_in_2018.jpg/800px-Geoffrey_Hinton_in_2018.jpg'
  }
};

export function getLeaderAvatarUrl(leaderId: string, style: AvatarStyle = 'comic', fallbackUrl?: string): string {
  const leaderEntry = LEADER_AVATARS[leaderId];
  if (leaderEntry && leaderEntry[style]) {
    return leaderEntry[style];
  }
  return fallbackUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${leaderId}`;
}

