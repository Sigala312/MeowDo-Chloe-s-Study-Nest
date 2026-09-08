export interface RewardAsset {
  image: string;
  tagBg: string;
  tagColor: string;
}

export const REWARD_ASSETS: Record<string, RewardAsset> = {
  coffee: {
    image: '/螢幕擷取畫面_2026-09-08_012331-removebg-preview.png',
    tagBg: 'bg-[#FCE3D7]',
    tagColor: 'text-[#C85A32]',
  },
  play_games: {
    image: '/badges/play-games.png',
    tagBg: 'bg-[#E8E5F7]',
    tagColor: 'text-[#6B5BB9]',
  },
  watch_movie: {
    image: '/螢幕擷取畫面_2026-09-08_012406-removebg-preview.png',
    tagBg: 'bg-[#FCE4EC]',
    tagColor: 'text-[#D81B60]',
  },
  eat_dessert: {
    image: '/螢幕擷取畫面_2026-09-08_012338-removebg-preview.png',
    tagBg: 'bg-[#FFF3E0]',
    tagColor: 'text-[#E65100]',
  },
  free_time: {
    image: '/螢幕擷取畫面_2026-09-08_012356-removebg-preview.png',
    tagBg: 'bg-[#E8F5E9]',
    tagColor: 'text-[#2E7D32]',
  },
  pass_coffee_ticket: {
    image: '/螢幕擷取畫面_2026-09-08_012412-removebg-preview.png',
    tagBg: 'bg-[#FFE8CC]',
    tagColor: 'text-[#D97706]',
  },
};