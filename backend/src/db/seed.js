require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const db = require("./database");
const { initSchema } = require("./schema");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

async function seed() {
  await initSchema();

  const existing = await db("users").where({ email: "upasana.roy@email.com" }).first();
  if (existing) {
    console.log("✅ Demo user already exists. Skipping seed.");
    await db.destroy();
    return;
  }

  // Also remove old demo user if present to keep it clean
  await db("users").where({ email: "ishika.ghosh@email.com" }).delete();

  console.log("🌱 Seeding database with demo user Upasana Roy...");
  const userId = uuidv4();
  const passwordHash = await bcrypt.hash("GlobePay@123", 12);

  await db("users").insert({
    id: userId,
    name: "Upasana Roy",
    email: "upasana.roy@email.com",
    password_hash: passwordHash,
    phone: "+91 98765 43210",
    location: "Kolkata, India",
    avatar: "UR",
    is_verified: true,
  });

  const wallets = [
    { currency:"USD", symbol:"$",  flag:"🇺🇸", balance:12450.80, is_primary:true  },
    { currency:"EUR", symbol:"€",  flag:"🇪🇺", balance:8320.50,  is_primary:false },
    { currency:"GBP", symbol:"£",  flag:"🇬🇧", balance:5640.20,  is_primary:false },
    { currency:"JPY", symbol:"¥",  flag:"🇯🇵", balance:420000,   is_primary:false },
    { currency:"INR", symbol:"₹",  flag:"🇮🇳", balance:245000,   is_primary:false },
  ];
  for (const w of wallets) await db("wallets").insert({ id:uuidv4(), user_id:userId, ...w });

  const txns = [
    { type:"sent",     counterpart_name:"Sarah Chen",    counterpart_email:"sarah@design.co",  from_currency:"USD", to_currency:"USD", amount:250.00,  fee:0.88, status:"completed", created_at:new Date("2026-03-03") },
    { type:"received", counterpart_name:"Alex Rivera",   counterpart_email:"alex.r@gmail.com", from_currency:"EUR", to_currency:"EUR", amount:1200.00, fee:0,    status:"completed", created_at:new Date("2026-03-02T14:00") },
    { type:"sent",     counterpart_name:"James Wilson",  counterpart_email:"james.w@corp.com", from_currency:"GBP", to_currency:"GBP", amount:89.50,   fee:0.31, status:"pending",   created_at:new Date("2026-03-02T09:00") },
    { type:"received", counterpart_name:"Priya Sharma",  counterpart_email:"priya@tech.io",    from_currency:"INR", to_currency:"INR", amount:45000,   fee:0,    status:"completed", created_at:new Date("2026-03-01") },
    { type:"sent",     counterpart_name:"Yuki Tanaka",   counterpart_email:"yuki@jp.co",       from_currency:"JPY", to_currency:"JPY", amount:15000,   fee:52.5, status:"completed", created_at:new Date("2026-02-28") },
    { type:"received", counterpart_name:"Emma Thompson", counterpart_email:"emma@uk.io",       from_currency:"USD", to_currency:"USD", amount:350.00,  fee:0,    status:"completed", created_at:new Date("2026-02-28T08:00") },
    { type:"sent",     counterpart_name:"Carlos Mendes", counterpart_email:"carlos@eu.co",     from_currency:"EUR", to_currency:"EUR", amount:620.00,  fee:2.17, status:"failed",    created_at:new Date("2026-02-27") },
    { type:"received", counterpart_name:"Liam O'Brien",  counterpart_email:"liam@ie.co",       from_currency:"GBP", to_currency:"GBP", amount:175.00,  fee:0,    status:"completed", created_at:new Date("2026-02-27T11:00") },
  ];
  for (const tx of txns) await db("transactions").insert({ id:uuidv4(), user_id:userId, ...tx });

  const cards = [
    { type:"visa",       card_name:"Upasana Roy", number_last4:"7842", expiry:"09/28", currency:"USD", balance:8450.00,  daily_limit:5000,  color:"from-brand-600 via-purple-600 to-violet-600",   frozen:false },
    { type:"mastercard", card_name:"Upasana Roy", number_last4:"3156", expiry:"03/27", currency:"EUR", balance:3200.50,  daily_limit:3000,  color:"from-orange-500 via-pink-500 to-rose-500",      frozen:false },
    { type:"visa",       card_name:"Upasana Roy", number_last4:"9021", expiry:"12/27", currency:"GBP", balance:15640.20, daily_limit:10000, color:"from-emerald-500 via-teal-500 to-cyan-500",     frozen:true  },
  ];
  for (const c of cards) await db("virtual_cards").insert({ id:uuidv4(), user_id:userId, ...c });

  const notifs = [
    { type:"transfer", title:"Money Received",        message:"You received $1,200.00 from Alex Rivera",                       icon:"💰", is_read:false },
    { type:"security", title:"Login from new device", message:"A new login was detected from Chrome on Windows. Was this you?", icon:"🔐", is_read:false },
    { type:"promo",    title:"Zero-fee weekend!",      message:"Send money to Europe with 0% fees this weekend.",               icon:"🎉", is_read:false },
    { type:"alert",    title:"Rate Alert: USD/EUR",    message:"USD/EUR reached your target rate of 0.92.",                     icon:"📈", is_read:true  },
    { type:"transfer", title:"Transfer Complete",      message:"Your transfer of £89.50 to James Wilson is complete.",          icon:"✅", is_read:true  },
    { type:"system",   title:"Card Statement Ready",  message:"Your February 2026 statement is ready to download.",            icon:"📄", is_read:true  },
    { type:"security", title:"Password changed",      message:"Your account password was changed successfully.",               icon:"🔑", is_read:true  },
    { type:"transfer", title:"Money Sent",            message:"You sent ¥15,000 to Yuki Tanaka successfully.",                 icon:"🚀", is_read:true  },
  ];
  for (const n of notifs) await db("notifications").insert({ id:uuidv4(), user_id:userId, ...n });

  const goals = [
    { name:"Tokyo Vacation", target_amount:5000,  current_amount:2800, currency:"USD", deadline:"2026-12-01", icon:"✈️", color:"from-blue-500 to-cyan-500"   },
    { name:"Emergency Fund",  target_amount:10000, current_amount:6500, currency:"USD", deadline:null,         icon:"🛡️", color:"from-green-500 to-emerald-500" },
    { name:"New Laptop",      target_amount:2500,  current_amount:1200, currency:"USD", deadline:"2026-09-01", icon:"💻", color:"from-purple-500 to-violet-500" },
  ];
  for (const g of goals) await db("savings_goals").insert({ id:uuidv4(), user_id:userId, ...g });

  await db("rewards").insert({ id:uuidv4(), user_id:userId, points:3450, action:"total", description:"Total reward points balance" });

  console.log("✅ Database seeded successfully with Upasana Roy!");
  console.log("─────────────────────────────────────────");
  console.log("   Demo account:");
  console.log("   Name    : Upasana Roy");
  console.log("   Email   : upasana.roy@email.com");
  console.log("   Password: GlobePay@123");
  console.log("─────────────────────────────────────────");
  await db.destroy();
}

seed().catch((err) => { console.error("Seed error:", err); process.exit(1); });
