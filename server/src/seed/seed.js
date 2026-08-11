import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Category from '../models/Category.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import Review from '../models/Review.js'
import ContactMessage from '../models/ContactMessage.js'
import Subscriber from '../models/Subscriber.js'
import { slugify } from '../utils/helpers.js'

const CATEGORIES = [
  { name: 'زنانه', slug: 'women', description: 'رایحه‌های گلی، گلاب و میوه‌ایِ مخصوص بانوان', order: 1 },
  { name: 'مردانه', slug: 'men', description: 'رایحه‌های چوبی، خنک و کلاسیکِ آقایان', order: 2 },
  { name: 'یونیسکس', slug: 'unisex', description: 'رایحه‌هایی فراتر از جنسیت، برای همه', order: 3 },
  { name: 'عطرهای شرقی', slug: 'oriental', description: 'عود، عنبر و ادویه — گرمای خاورمیانه', order: 4 },
]

/** قالب تولید محصول */
function P({
  name, cat, price, oldPrice = 0, stock = 12, weight = 50, edition = 'ادوپرفیوم',
  family, desc, top, heart, base, longevity = 4, sillage = 4, badge = '',
  isNew = false, featured = false, sold = 0,
}) {
  return {
    name, slug: slugify(name), brand: 'رایحه', category: cat,
    price, oldPrice, stock, weight, edition, family, description: desc,
    notes: { top, heart, base }, longevity, sillage, badge,
    isNew, featured, sold,
  }
}

const PRODUCTS = [
  // ----- زنانه -----
  P({
    name: 'گلاب قمصر', cat: 'women', price: 1850000, oldPrice: 2200000, stock: 18,
    family: 'گلی', sold: 214,
    desc: 'تقلیدناپذیرترین گلابِ ایران؛ رزِ محمدیِ قمصر که پیش از طلوع خورشید چیده می‌شود و بویِ بهار را تا عمق زمستان می‌رساند.',
    top: 'برگ گل محمدی، لیمو ترش', heart: 'گلاب قمصر، رز بلغارستان، یاس', base: 'مشک سفید، چوب صندل',
    longevity: 5, sillage: 4, featured: true, badge: 'پرفروش',
  }),
  P({
    name: 'رز ایرانی', cat: 'women', price: 2400000, stock: 10,
    family: 'گلی', isNew: true, sold: 87,
    desc: 'تک‌رزِ پرپشتِ ایرانی با لایه‌ای از عسل و بهارنارنج؛ رایحه‌ای لطیف اما فراموش‌نشدنی برای روزهای خاص.',
    top: 'بهارنارنج، هلو', heart: 'رز ایرانی، عسل', base: 'چوب صندل، وانیل',
    longevity: 4, sillage: 3,
  }),
  P({
    name: 'مهتاب', cat: 'women', price: 2150000, stock: 8,
    family: 'میوه‌ای', sold: 156,
    desc: 'نرمِ مهتاب: لطیف، شیرین و بی‌آزار. یاس شب با هلو و ترنج؛ عطری برای کسانی که از پخشِ بلند خوششان نمی‌آید.',
    top: 'ترنج، هلو', heart: 'یاس، بنفشه', base: 'مشک، وتیور',
    longevity: 3, sillage: 2,
  }),
  P({
    name: 'رایحهٔ عشق', cat: 'women', price: 3150000, oldPrice: 3600000, stock: 6,
    family: 'گلی', sold: 173,
    desc: 'گلبرگ‌های رز و گل صدتومانی که با وانیل و کهربا پیوند خورده‌اند؛ اعلام عشق، در قالب عطر.',
    top: 'لیچی، گلابی', heart: 'رز، گل صدتومانی', base: 'وانیل، کهربا',
    longevity: 4, sillage: 4, featured: true,
  }),
  P({
    name: 'بهار نارنج', cat: 'women', price: 1650000, stock: 15,
    family: 'مرکباتی', sold: 92,
    desc: 'باغِ پرتقالِ شمالِ ایران در صبح بهار؛ شاداب، زنده و پرانرژی. عطرِ آغاز روزهای خوب.',
    top: 'بهارنارنج، برگاموت', heart: 'نرولی، گاردنیا', base: 'مشک، چوب سفید',
    longevity: 3, sillage: 3,
  }),
  P({
    name: 'شبِ گل', cat: 'women', price: 2750000, stock: 7,
    family: 'شرقی', isNew: true, sold: 41,
    desc: 'گل‌های شبانه در گرمای ادویه؛ یاس شب، عنبر و عود که آرام‌آرام بر پوست می‌نشینند. رازِ شب‌های شما.',
    top: 'زعفران، توت‌فرنگی', heart: 'یاس شب، گل سرخ', base: 'عنبر، عود، چوب کاشمیر',
    longevity: 5, sillage: 4,
  }),
  P({
    name: 'عطر عروسی', cat: 'women', price: 3900000, stock: 5,
    family: 'گلی', sold: 118,
    desc: 'عطری که در روزِ مهم زندگی‌تان می‌پوشید؛ دسته‌گلِ عروس، شامپاین و یک جادوی شیرین که تا صبح می‌ماند.',
    top: 'شامپاین، گلابی', heart: 'گل‌های سفید، رز', base: 'مشک، کهربا، وانیل',
    longevity: 4, sillage: 3, featured: true, badge: 'ویژه',
  }),
  // ----- مردانه -----
  P({
    name: 'چوب صندل', cat: 'men', price: 2250000, stock: 14,
    family: 'چوبی', sold: 198,
    desc: 'چوب صندلِ خالص با پوستِ گرم و نجیب؛ رایحه‌ای آرام‌بخش که در طول روز خودش را به شما یادآوری می‌کند.',
    top: 'فلفل صورتی، هویج وحشی', heart: 'چوب صندل، اسطوخودوس', base: 'کهربا، مشک',
    longevity: 5, sillage: 3, featured: true,
  }),
  P({
    name: 'شب عاشقان', cat: 'men', price: 2950000, stock: 9,
    family: 'شرقی', sold: 145,
    desc: 'برای آن شبی که می‌خواهید فراموش نشود؛ عود، ادویه و چرم که روی پوست با حرارتِ حضور شما بیدار می‌شود.',
    top: 'زعفران، هل', heart: 'عود، گل رز تیره', base: 'چرم، عنبر',
    longevity: 5, sillage: 5,
  }),
  P({
    name: 'نسیم دریا', cat: 'men', price: 1950000, stock: 16,
    family: 'خنک', sold: 121,
    desc: 'مالدیو در یک اسپری؛ نمکِ دریا، آبِ نارگیل و نسیمی که خاطراتِ سفر را زنده می‌کند.',
    top: 'نمک دریا، برگاموت', heart: 'آب نارگیل، مریم‌گلی', base: 'مشک، چوب کهربا',
    longevity: 4, sillage: 3,
  }),
  P({
    name: 'کهن', cat: 'men', price: 2600000, stock: 7,
    family: 'چوبی', sold: 89,
    desc: 'بوی کهنه‌سنگِ کتابخانهٔ پدری؛ جلد چرمی، چوبِ کابینت و خاطرهٔ قرن گذشته. عطرِ مردانِ کم‌حرف.',
    top: 'ترنج، سیب', heart: 'چوب سرو، گل شمعدانی', base: 'چرم، وتیور، خزه',
    longevity: 4, sillage: 3,
  }),
  P({
    name: 'طوفان', cat: 'men', price: 1750000, stock: 12,
    family: 'خنک', isNew: true, sold: 67,
    desc: 'انفجارِ نعناع و لیمو در ابتدای روز؛ عطری یخی برای کسانی که صبح را با تمرین شروع می‌کنند.',
    top: 'نعناع، لیمو', heart: 'اسطوخودوس، رزماری', base: 'مشک، چوب سفید',
    longevity: 3, sillage: 3,
  }),
  P({
    name: 'عود مردانه', cat: 'men', price: 3850000, oldPrice: 4300000, stock: 4,
    family: 'شرقی', sold: 54,
    desc: 'عودِ کمریِ کمربویی که هنوز از منقل بالا می‌آید؛ عطری سنگین، خاص و نه برای هر روز. فقط برای شب‌های مهم.',
    top: 'زعفران، دارچین', heart: 'عود کمربویی', base: 'عنبر، چرم',
    longevity: 5, sillage: 5, badge: 'لوکس',
  }),
  // ----- یونیسکس -----
  P({
    name: 'سحری', cat: 'unisex', price: 2050000, stock: 11,
    family: 'گلی', sold: 76,
    desc: 'شبنمِ صبحگاهی روی گلبرگ‌ها؛ لطیف و بی‌طرف، برای کسانی که می‌خواهند بویِ «خودِ واقعی» را بدهند.',
    top: 'شبنم، گلابی', heart: 'گل‌های سفید', base: 'مشک سفید',
    longevity: 3, sillage: 2,
  }),
  P({
    name: 'عرق بیدمشک', cat: 'unisex', price: 1550000, stock: 20,
    family: 'مرکباتی', sold: 133,
    desc: 'عرقِ بیدمشکِ ایرانی با لیمو و شکر؛ خنک، شیرین و نوستالژیک. عطری که بچه‌های ایران با آن بزرگ شده‌اند.',
    top: 'بیدمشک، لیمو', heart: 'گل‌های بهاری', base: 'چوب سفید',
    longevity: 3, sillage: 2,
  }),
  P({
    name: 'تَنَفُّس', cat: 'unisex', price: 2350000, stock: 8,
    family: 'خنک', isNew: true, sold: 58,
    desc: 'هوای کوهستانِ شمال بعد از باران؛ برگ‌های نم‌خورده، خاکِ خیس و بامبو. عطرِ تنفسِ عمیق.',
    top: 'برگ‌های سبز، باران', heart: 'بامبو، چای سفید', base: 'مشک، چوب سدر',
    longevity: 4, sillage: 2,
  }),
  P({
    name: 'عطر چای', cat: 'unisex', price: 1850000, stock: 14,
    family: 'گلی', sold: 95,
    desc: 'چایِ ماسالا با هل، زنجبیل و شیرِ گرم؛ عطری دنج برای روزهای بارانی و کتاب‌خواندن‌های طولانی.',
    top: 'هل، زنجبیل', heart: 'چای سیاه، شیر', base: 'وانیل، چوب صندل',
    longevity: 4, sillage: 3,
  }),
  // ----- شرقی -----
  P({
    name: 'عود و عنبر', cat: 'oriental', price: 3450000, oldPrice: 4000000, stock: 6,
    family: 'شرقی', sold: 167,
    desc: 'دو قهرمانِ خاورمیانه در یک بطری: عودِ دودی و عنبرِ گرم. عطری که از فاصلهٔ یک متری، احترام شما را اعلام می‌کند.',
    top: 'زعفران، گل رز', heart: 'عود، عنبر', base: 'چوب کاشمیر، چرم',
    longevity: 5, sillage: 5, featured: true, badge: 'پرفروش',
  }),
  P({
    name: 'زعفران', cat: 'oriental', price: 2750000, stock: 9,
    family: 'شرقی', sold: 84,
    desc: 'طلای سرخِ ایران؛ زعفرانِ قائنات با شیرینیِ چرم و گرمای ادویه. عطری که با هیچ‌چیز دیگری قاطی نمی‌شود.',
    top: 'زعفران، گل زعفران', heart: 'چرم، رز', base: 'عنبر، وتیور',
    longevity: 4, sillage: 4,
  }),
  P({
    name: 'شب‌بوی تهران', cat: 'oriental', price: 2050000, stock: 10,
    family: 'گلی', sold: 72,
    desc: 'شب‌بویِ کوچه‌های تهران قدیم؛ گلی که بویش در شب‌های تابستان تمام محله را برمی‌داشت، حالا در شیشه.',
    top: 'شب‌بوی، گلاب', heart: 'یاس، زنبق', base: 'مشک، عنبر',
    longevity: 4, sillage: 3,
  }),
  P({
    name: 'عنبر ابیض', cat: 'oriental', price: 3200000, stock: 5,
    family: 'شرقی', isNew: true, sold: 39,
    desc: 'عنبرِ سفیدِ خالص با رایحه‌ای پودری و دریاگونه؛ عطری آرام اما عمیق، که با گذر ساعت‌ها بهتر می‌شود.',
    top: 'نمک، گل سفید', heart: 'عنبر ابیض', base: 'مشک، چوب صندل',
    longevity: 5, sillage: 3,
  }),
  P({
    name: 'بخور', cat: 'oriental', price: 1650000, stock: 13,
    family: 'چوبی', sold: 46,
    desc: 'بوی بخورِ کلیسا و آتشِ چوب؛ مریم‌گلی و کندر که فضا را مقدس و آرام می‌کنند. عطرِ مدیتیشن.',
    top: 'کندر، مریم‌گلی', heart: 'بخور، لادن', base: 'چوب صندل، عنبر',
    longevity: 3, sillage: 2,
  }),
  P({
    name: 'مرصع', cat: 'oriental', price: 4550000, stock: 3,
    family: 'شرقی', sold: 28,
    desc: 'نگینی در میان عطرها؛ ترکیبی از گلاب، عود و کهربای طلایی با ردپایی از وانیل. نسخهٔ محدود، برای کلکسیون‌ها.',
    top: 'گلاب، کهربا', heart: 'عود، رز', base: 'وانیل، عنبر',
    longevity: 5, sillage: 4, featured: true, badge: 'نسخهٔ محدود',
  }),
]

const REVIEWS = [
  ['گلاب قمصر', 'نگار محمدی', 5, 'مثل گلابِ خانهٔ مادربزرگ، اما با ظرافتی بیشتر. ماندگاری‌اش روی لباس تا فرداش هم هست!'],
  ['گلاب قمصر', 'سارا کریمی', 4, 'رایحهٔ اصیل و طبیعی. کاش کمی پخش بوی بیشتری داشت ولی ارزش هر تومانش را دارد.'],
  ['عود و عنبر', 'امیرحسین رضایی', 5, 'بسته‌بندی‌اش خودش یک هدیه است. عود و عنبرش واقعاً لوکس و سنگین است.'],
  ['عود و عنبر', 'رضا محمدی', 5, 'برای شب عروسی‌ام خریدم؛ تا صبح روی کتم بود. ممنون از رایحه.'],
  ['چوب صندل', 'مهدی کریمی', 4, 'خنک و شیک، برای محل کار عالی است. ارسال هم همان‌روز رسید.'],
  ['عطر عروسی', 'الهام نادری', 5, 'عطر عروسی‌ام را اینجا خریدم؛ همه مهمان‌ها درباره‌اش پرسیدند!'],
  ['رایحهٔ عشق', 'زهرا احمدی', 5, 'هدیه‌ای که شوهرم گرفت؛ حالا عطر امضای ماست.'],
  ['مرصع', 'علی قاسمی', 5, 'نسخهٔ محدود واقعاً خاص است. جعبه‌اش آنقدر زیباست که نگهش داشتم.'],
]

export async function seedIfEmpty() {
  const count = await Product.countDocuments()
  if (count > 0) {
    console.log(`⇢ Database already seeded (${count} products)`)
    return
  }
  console.log('⇢ Seeding database…')

  const catMap = {}
  for (const c of CATEGORIES) {
    const doc = await Category.create(c)
    catMap[c.slug] = doc._id
  }

  const products = await Promise.all(
    PRODUCTS.map((p) => Product.create({ ...p, category: catMap[p.category] }))
  )
  console.log(`⇢ ${products.length} products created`)

  // مدیر
  const admin = await User.create({
    name: 'مدیر رایحه',
    email: process.env.ADMIN_EMAIL || 'admin@rayeheh.com',
    phone: '09120000000',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
  })
  // یک مشتری نمونه
  const customer = await User.create({
    name: 'مشتری نمونه',
    email: 'demo@rayeheh.com',
    phone: '09121112233',
    password: 'demo1234',
  })
  console.log(`⇢ Admin: ${admin.email} / ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`)
  console.log(`⇢ Demo:  ${customer.email} / demo1234`)

  // نظرات — برای هر نظرگذار یک حساب ساخته می‌شود تا نام واقعی نمایش داده شود
  // و به‌صورت قطعی (بدون تصادف) به نظرها تخصیص می‌یابد — ایندکس یکتا رعایت می‌شود
  const reviewerNames = [...new Set(REVIEWS.map(([, n]) => n))]
  const reviewers = {}
  for (const n of reviewerNames) {
    reviewers[n] = await User.create({ name: n, email: `${slugify(n)}@rayeheh.com`, password: 'reviewer123' })
  }
  for (const [pName, userName, rating, comment] of REVIEWS) {
    const product = products.find((p) => p.name === pName)
    const user = reviewers[userName]
    if (product && user) {
      await Review.create({ user: user._id, product: product._id, rating, comment })
    }
  }
  // به‌روزرسانی امتیازها
  for (const p of products) {
    await Product.recalcRating(p._id)
  }

  // یک سفارش نمونه
  const sample = products.find((p) => p.name === 'گلاب قمصر') || products[0]
  await Order.create({
    ref: 'RY-DEMO01',
    user: customer._id,
    items: [{ product: sample._id, name: sample.name, price: sample.price, qty: 2 }],
    customer: {
      fullName: 'مشتری نمونه',
      phone: '09121112233',
      province: 'تهران',
      city: 'تهران',
      address: 'خیابان ولیعصر، مجتمع عطرستان، واحد ۱۲',
      postalCode: '1968811111',
    },
    shippingFee: 0,
    paymentMethod: 'online',
    status: 'delivered',
    trackingCode: 'R4477123',
  })

  // اعضای خبرنامه و پیام نمونه
  await Subscriber.create([{ email: 'sara@example.com' }, { email: 'ali@example.com' }])
  await ContactMessage.create({
    name: 'نگار محمدی',
    email: 'negar@example.com',
    phone: '09120001122',
    topic: 'مشاورهٔ عطر',
    message: 'سلام، برای هدیهٔ تولد همسرم دنبال یک عطر چوبی خاص می‌گردم. عود مردانه پیشنهاد می‌دهید؟',
  })

  console.log('✓ Seed completed')
}

/** اجرای مستقل: node src/seed/seed.js --fresh */
if (process.argv[1]?.endsWith('seed.js')) {
  const fresh = process.argv.includes('--fresh')
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rayeheh'

  const run = async () => {
    await mongoose.connect(uri)
    if (fresh) {
      await Promise.all([
        User.deleteMany({}),
        Category.deleteMany({}),
        Product.deleteMany({}),
        Order.deleteMany({}),
        Review.deleteMany({}),
        ContactMessage.deleteMany({}),
        Subscriber.deleteMany({}),
      ])
      console.log('⇢ Database cleared')
    }
    await seedIfEmpty()
    await mongoose.disconnect()
    process.exit(0)
  }
  run().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
