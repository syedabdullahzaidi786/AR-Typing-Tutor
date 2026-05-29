import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const paragraphs = [
  // English
  { language: "english", difficulty: "beginner", content: "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet. Practice typing this sentence to improve your speed and accuracy." },
  { language: "english", difficulty: "intermediate", content: "Technology has transformed the way we communicate, work, and live our daily lives. From smartphones to artificial intelligence, innovations continue to reshape our world in profound ways that were unimaginable just decades ago." },
  { language: "english", difficulty: "advanced", content: "The implementation of sophisticated algorithms in modern computing systems requires a comprehensive understanding of data structures, computational complexity, and the fundamental principles of software engineering and computer science." },
  // Urdu
  { language: "urdu", difficulty: "beginner", content: "پاکستان ایک خوبصورت ملک ہے۔ یہاں کے لوگ بہت مہمان نواز ہیں۔ پاکستان کی ثقافت بہت امیر اور متنوع ہے۔" },
  { language: "urdu", difficulty: "intermediate", content: "علم حاصل کرنا ہر مسلمان مرد اور عورت پر فرض ہے۔ تعلیم انسان کو ترقی کی راہ پر گامزن کرتی ہے اور معاشرے کو بہتر بناتی ہے۔" },
  { language: "urdu", difficulty: "advanced", content: "جدید ٹیکنالوجی نے انسانی زندگی کو بالکل بدل دیا ہے۔ کمپیوٹر اور انٹرنیٹ کی بدولت دنیا ایک گلوبل ویلج بن گئی ہے جہاں معلومات کا تبادلہ لمحوں میں ممکن ہے۔" },
  // Arabic
  { language: "arabic", difficulty: "beginner", content: "اللغة العربية لغة جميلة وغنية. هي لغة القرآن الكريم والحضارة الإسلامية. تعلم اللغة العربية يفتح أبواباً كثيرة للمعرفة." },
  { language: "arabic", difficulty: "intermediate", content: "التعليم هو أساس التقدم والازدهار في أي مجتمع. يجب على كل إنسان أن يسعى للحصول على العلم والمعرفة طوال حياته لتحقيق النجاح." },
  { language: "arabic", difficulty: "advanced", content: "التكنولوجيا الحديثة غيرت وجه العالم بشكل جذري. أصبح بإمكاننا التواصل مع أي شخص في أي مكان من العالم في غضون ثوانٍ معدودة بفضل الإنترنت." },
  // Sindhi
  { language: "sindhi", difficulty: "beginner", content: "سنڌ هڪ خوبصورت صوبو آهي. هتي جا ماڻهو تمام مهمان نواز آهن. سنڌي ثقافت تمام امير ۽ متنوع آهي." },
  { language: "sindhi", difficulty: "intermediate", content: "علم حاصل ڪرڻ هر انسان جو فرض آهي. تعليم انسان کي ترقي جي رستي تي وجهي ٿي ۽ سماج کي بهتر بڻائي ٿي." },
  { language: "sindhi", difficulty: "advanced", content: "جديد ٽيڪنالاجي انساني زندگي کي بلڪل بدلائي ڇڏيو آهي. ڪمپيوٽر ۽ انٽرنيٽ جي مدد سان دنيا هڪ گلوبل ويلج بڻجي وئي آهي." },
];

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@artyping.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@artyping.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email);

  // Create test user
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@artyping.com" },
    update: {},
    create: {
      name: "Test User",
      email: "user@artyping.com",
      password: userPassword,
      role: "USER",
    },
  });
  console.log("Test user created:", user.email);

  // Seed paragraphs
  for (const p of paragraphs) {
    await prisma.typingParagraph.create({
      data: {
        language: p.language as "english" | "urdu" | "arabic" | "sindhi",
        difficulty: p.difficulty as "beginner" | "intermediate" | "advanced",
        content: p.content,
        isActive: true,
      },
    });
  }
  console.log(`${paragraphs.length} paragraphs seeded`);

  // Create test config
  await prisma.testConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      minWpm: 35,
      minAccuracy: 90,
      maxMistakes: 10,
    },
  });
  console.log("Test config created");

  console.log("\n✅ Seed complete!");
  console.log("Admin: admin@artyping.com / admin123");
  console.log("User:  user@artyping.com / user123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
