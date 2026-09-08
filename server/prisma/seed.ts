import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. 清空舊的獎品資料（避免重複）
  await prisma.wheelReward.deleteMany({});

  // 2. 建立 6 個預設獎品
  const rewards = [
    {
      title: 'Coffee',
      categoryTag: 'Relax',
      rarity: 'Common',
      probability: 25.0,
      imageKey: 'coffee',
      isRare: false,
    },
    {
      title: 'Play games',
      categoryTag: 'Entertainment',
      rarity: 'Common',
      probability: 25.0,
      imageKey: 'play_games',
      isRare: false,
    },
    {
      title: 'Watch a movie',
      categoryTag: 'Entertainment',
      rarity: 'Rare',
      probability: 15.0,
      imageKey: 'watch_movie',
      isRare: true,
    },
    {
      title: 'Eat dessert',
      categoryTag: 'Food',
      rarity: 'Rare',
      probability: 15.0,
      imageKey: 'eat_dessert',
      isRare: true,
    },
    {
      title: 'Free time',
      categoryTag: 'Personal',
      rarity: 'Common',
      probability: 18.0,
      imageKey: 'free_time',
      isRare: false,
    },
    {
      title: '合格咖啡兌換券',
      categoryTag: 'Surprise',
      rarity: 'Legendary',
      probability: 2.0,
      imageKey: 'pass_coffee_ticket',
      isRare: true,
    },
  ];

  for (const reward of rewards) {
    await prisma.wheelReward.create({ data: reward });
  }

  console.log('✅ 成功寫入 6 個獎品至 WheelReward 資料表！');
}

main()
  .catch((e) => {
    console.error('❌ Seed 執行失敗：', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });