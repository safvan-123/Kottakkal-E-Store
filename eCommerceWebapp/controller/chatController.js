// import Product from "../models/ProductModel.js";
// import User from "../models/userModel.js";
// import Order from "../models/Order.js";
// import dotenv from "dotenv";
// import jwt from "jsonwebtoken";

// dotenv.config();

// export const handleChat = async (req, res) => {
//   const { message } = req.body;
//   console.log("📩 Incoming message:", message);

//   const authHeader = req.headers.authorization;
//   console.log("🔐 Authorization Header:", authHeader);

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     console.log("❌ Missing or invalid token format");
//     return res.status(401).json({ reply: "❌ ടോകണ്‍ ലഭ്യമായില്ല." });
//   }

//   const token = authHeader.split(" ")[1];
//   console.log("🔑 Extracted Token:", token);

//   let decoded;
//   try {
//     decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("✅ Token Decoded:", decoded);
//   } catch (err) {
//     console.error("❌ Token Verification Failed:", err.message);
//     return res.status(403).json({ reply: "❌ അസാധുവായ ടോകണ്‍." });
//   }

//   const userId = decoded.id || decoded._id;
//   console.log("🙋 User ID from token:", userId);

//   let user;
//   try {
//     user = await User.findById(userId).lean();
//     if (!user) {
//       console.log("❌ User not found in database.");
//       return res
//         .status(404)
//         .json({ reply: "❌ ഉപഭോക്താവിനെ കണ്ടെത്താനായില്ല." });
//     }
//     console.log("✅ User found:", user.name);
//   } catch (err) {
//     console.error("❌ Error fetching user:", err.message);
//     return res.status(500).json({
//       reply: "⚠️ ഉപഭോക്തൃ വിവരങ്ങള്‍ വായിക്കുന്നതില്‍ പിശക് ഉണ്ടായി.",
//     });
//   }

//   try {
//     // Products
//     const products = await Product.find(
//       {},
//       "name sizes price discountPrice description masterCategory subCategory"
//     );
//     console.log(`📦 Found ${products.length} products`);

//     const productContext = products
//       .map((p) => {
//         const sizes =
//           p.sizes?.length > 0 ? p.sizes.join(", ") : "Sizes not specified";
//         const category =
//           p.subCategory?.name || p.masterCategory?.name || "General";
//         return `🛍️ ${p.name} (${category})\n - Price: ₹${p.price}${
//           p.discountPrice ? ` (Discounted: ₹${p.discountPrice})` : ""
//         }\n - Sizes: ${sizes}\n - Description: ${
//           p.description || "No description"
//         }\n`;
//       })
//       .join("\n");

//     // User Info
//     const userDetails = `
// 🙍‍♂️ Name: ${user.name || "Not Provided"}
// 📧 Email: ${user.email || "Not Provided"}
// 📞 Phone: ${user.phone || "Not Provided"}
// 🏠 Address: ${user.address || "Not Provided"}
// `;

//     // Orders
//     const orders = await Order.find({ user: userId })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .lean();
//     console.log(`📑 Found ${orders.length} recent orders`);

//     const orderContext = orders
//       .map((order) => {
//         const items = order.items
//           .map(
//             (item) =>
//               `• ${item.product.name} (Qty: ${item.quantity}, Size: ${
//                 item.size || "-"
//               }, Color: ${item.color || "-"})`
//           )
//           .join("\n");
//         const returns =
//           order.returnRequests?.length > 0
//             ? order.returnRequests
//                 .map(
//                   (ret) =>
//                     `🔁 Return for ${
//                       ret.productId?.name || "Product"
//                     } - Reason: ${ret.reason} (${
//                       ret.isDelivered ? "Delivered" : "Pending"
//                     })`
//                 )
//                 .join("\n")
//             : "❌ No returns requested.";

//         return `📦 Order #${order.orderId} (${order.status})
// Date: ${new Date(order.createdAt).toLocaleDateString()}
// Total: ₹${order.totalAmount}
// Items:\n${items}
// Returns:\n${returns}`;
//       })
//       .join("\n\n");

//     // Static Info
//     const storePolicies = `
// 📦 Shipping: Free for orders above ₹300.
// 🔄 Returns: Accepted within 7 days.
// 🚚 Delivery: 1–2 days within Kerala.
// 💳 Payment: Cash on Delivery and Online Payments.
// `;

//     const siteInfo = `
// 🛒 Welcome to Kottakkal E-Store – Premium fashion at your fingertips.
// 📍 Serving all of Malappuram with fast delivery and trusted support.
// `;

//     const customerCare = `
// 📞 Customer Care:
//  - Phone: +91 7560929242
//  - Email: kottakalestore@gmailcom
//  - Timing: 9 AM – 8 PM (Every days available)
// `;

//     // Full context
//     const fullContext = `🙋‍♂️ Customer Info:\n${customerCare}\n\n🏬 Store Info:\n${siteInfo}\n\n🧾 Products:\n${productContext}\n\n📋 Policies:\n${storePolicies}\n\n📑 Recent Orders:\n${
//       orderContext || "No recent orders found."
//     }\n\n🤝 Support:\n${customerCare}`;

//     const payload = {
//       model: "moonshotai/Kimi-K2-Instruct:novita",
//       messages: [
//         {
//           role: "system",
//           content: `You are a helpful Malayalam-speaking assistant for Kottakkal E-Store.
// Always respond in Malayalam, include the user's name, and use this context to answer all questions clearly.

// Context:
// ${fullContext}`,
//         },
//         {
//           role: "user",
//           content: message,
//         },
//       ],
//     };

//     console.log("🧠 Sending payload to Hugging Face...");

//     const response = await fetch(
//       "https://router.huggingface.co/v1/chat/completions",
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     const result = await response.json();
//     console.log("🤖 HF Response:", JSON.stringify(result, null, 2));

//     const reply = result?.choices?.[0]?.message?.content;

//     res.json({
//       reply: reply || "⚠️ AI മോഡലില്‍ നിന്നു ശരിയായ പ്രതികരണം ലഭിച്ചില്ല.",
//     });
//   } catch (err) {
//     console.error("❌ Error in processing:", err.message);
//     res.status(500).json({
//       reply: "⚠️ നിങ്ങളുടെ അഭ്യര്‍ത്ഥന പ്രോസസ്സ് ചെയ്യുന്നതില്‍ പിശക് ഉണ്ടായി.",
//     });
//   }
// };

import Product from "../models/ProductModel.js";
import User from "../models/userModel.js";
import Order from "../models/Order.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const handleChat = async (req, res) => {
  const { message } = req.body;
  console.log("📩 ഉപഭോക്താവിന്റെ ചോദ്യം:", message);

  const authHeader = req.headers.authorization;
  console.log("🔐 അടയാളപ്പെടുത്തല്‍ തലക്കെട്ട്:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ ടോകൺ ലഭ്യമല്ല അല്ലെങ്കിൽ തെറ്റായ രൂപം");
    return res
      .status(401)
      .json({ reply: "❌ ടോകൺ ലഭ്യമല്ല. ദയവായി വീണ്ടും ലോഗിൻ ചെയ്യൂ." });
  }

  const token = authHeader.split(" ")[1];
  console.log("🔑 ലഭിച്ച ടോകൺ:", token);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ ടോകൺ ശരിയായി പരിശോധിച്ചു:", decoded);
  } catch (err) {
    console.error("❌ ടോകൺ പരിശോധിക്കുന്നതിൽ പിശക്:", err.message);
    return res
      .status(403)
      .json({ reply: "❌ അസാധുവായ ടോകൺ. വീണ്ടും ലോഗിൻ ചെയ്യൂ." });
  }

  const userId = decoded.id || decoded._id;
  console.log("🙋‍♂️ ഉപഭോക്തൃ ഐഡി:", userId);

  let user;
  try {
    user = await User.findById(userId).lean();
    if (!user) {
      console.log("❌ ഉപഭോക്താവ് കണ്ടെത്തിയില്ല.");
      return res.status(404).json({
        reply: "❌ ഉപഭോക്താവിനെ കണ്ടെത്താനായില്ല. ദയവായി വീണ്ടും ലോഗിൻ ചെയ്യൂ.",
      });
    }
    console.log("✅ ഉപഭോക്താവ് കണ്ടെത്തി:", user.name);
  } catch (err) {
    console.error("❌ ഉപഭോക്താവിനെ തിരയുമ്പോൾ പിശക്:", err.message);
    return res.status(500).json({
      reply:
        "⚠️ ഉപഭോക്തൃ വിവരങ്ങൾ ലഭ്യമാക്കുന്നതിൽ പിശക് സംഭവിച്ചു. ക്ഷമിക്കണം.",
    });
  }

  try {
    const products = await Product.find(
      {},
      "name sizes price discountPrice description masterCategory subCategory"
    );
    console.log(`📦 ${products.length} ഉല്‍പ്പന്നങ്ങള്‍ കണ്ടെത്തി`);

    const productContext = products
      .map((p) => {
        const sizes =
          p.sizes?.length > 0
            ? p.sizes.join(", ")
            : "ലഭ്യമായ സൈസുകള്‍ വ്യക്തമല്ല";
        const category =
          p.subCategory?.name || p.masterCategory?.name || "വിഭാഗം വ്യക്തമല്ല";
        return `🛍️ ${p.name} (${category})\n - വില: ₹${p.price}${
          p.discountPrice ? ` (ഡിസ്‌ക്കൗണ്ട് വില: ₹${p.discountPrice})` : ""
        }\n - സൈസുകള്‍: ${sizes}\n - വിവരണം: ${
          p.description || "വിവരണം ലഭ്യമല്ല"
        }\n`;
      })
      .join("\n");

    const userDetails = `
🙍‍♂️ പേര്: ${user.name || "ലഭ്യമല്ല"}
📧 ഇമെയിൽ: ${user.email || "ലഭ്യമല്ല"}
📞 ഫോൺ: ${user.phone || "ലഭ്യമല്ല"}
🏠 വിലാസം: ${user.address || "വിലാസം ചേർക്കിട്ടില്ല"}
`;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    console.log(`📑 ${orders.length} ഓർഡറുകൾ ലഭിച്ചു`);

    const orderContext = orders
      .map((order) => {
        const items = order.items
          .map(
            (item) =>
              `• ${item.product.name} (അളവ്: ${item.size || "-"}, നിറം: ${
                item.color || "-"
              }, എണ്ണം: ${item.quantity})`
          )
          .join("\n");
        const returns =
          order.returnRequests?.length > 0
            ? order.returnRequests
                .map(
                  (ret) =>
                    `🔁 ${
                      ret.productId?.name || "ഉൽപ്പന്നം"
                    } റിട്ടേൺ അപേക്ഷിച്ചിട്ടുണ്ട് - കാരണം: ${ret.reason} (${
                      ret.isDelivered
                        ? "ഡെലിവർ ചെയ്‌തു"
                        : "ഇനിയും ഡെലിവർ ചെയ്തിട്ടില്ല"
                    })`
                )
                .join("\n")
            : "❌ റിട്ടേൺ അപേക്ഷയില്ല.";

        return `📦 ഓർഡർ #${order.orderId} (${order.status})
📅 തീയതി: ${new Date(order.createdAt).toLocaleDateString()}
💰 മൊത്തം: ₹${order.totalAmount}
🧾 ഉല്‍പ്പന്നങ്ങള്‍:\n${items}
🔄 റിട്ടേൺ വിവരങ്ങൾ:\n${returns}`;
      })
      .join("\n\n");

    const storePolicies = `
📦 ഷിപ്പിംഗ്: ₹300-ന് മുകളിലുള്ള ഓർഡറുകൾക്ക് സൗജന്യ ഡെലിവറി.
🔁 റിട്ടേൺ: 7 ദിവസത്തിനകം സ്വീകരിക്കാം.
🚚 ഡെലിവറി: കേരളത്തിനുള്ളിൽ 1–2 ദിവസത്തിനകം.
💳 പേയ്‌മെന്റ്: ഓൺലൈൻ/കാഷ് ഓൺ ഡെലിവറി.
`;

    const siteInfo = `
🛒 കൊട്ടക്കൽ ഈ-സ്റ്റോർ - മികച്ച ക്ലോത്തിംഗ് & ആക്സസറികൾ ഇവിടെ!
📍 മലപ്പുറത്തിന്റെ എല്ലാ കോണുകളിലും ഫാസ്റ്റ് ഡെലിവറി ലഭ്യമാണ്.
`;

    const customerCare = `
📞 ഉപഭോക്തൃ സേവനം:
📱 ഫോൺ: +91 7560929242
📧 ഇമെയിൽ: kottakalestore@gmail.com
🕘 സമയം: എല്ലാ ദിവസവും രാവിലെ 9 മുതല്‍ രാത്രി 8 വരെ.
`;

    const fullContext = `🙋‍♂️ ഉപഭോക്തൃ വിവരങ്ങൾ:\n${userDetails}
\n📞 കസ്റ്റമർ കെയർ:\n${customerCare}
\n🏬 സ്റ്റോർ വിവരങ്ങൾ:\n${siteInfo}
\n🧾 ഉല്‍പ്പന്നങ്ങൾ:\n${productContext}
\n📋 നയം:\n${storePolicies}
\n📑 Order History:\n${orderContext || "📭 ഓർഡറുകൾ കണ്ടെത്തിയില്ല."}`;

    const payload = {
      model: "moonshotai/Kimi-K2-Instruct:novita",
      messages: [
        {
          role: "system",
          content: `നീ ഒരു സഹായകമായ മലയാളം സംസാരിക്കുന്ന അസിസ്റ്റന്റാണ് Kottakkal E-Store-നായി.

ഉപഭോക്താവിന്റെ പേര് ഉപയോഗിച്ച് മലയാളത്തിൽ സൗഹൃദപരമായി മറുപടി നൽകുക. സാധ്യമായതത്രയും ഉപയോക്താവിന് വ്യക്തത നൽകുക.

Context:
${fullContext}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    };

    console.log("🧠 Hugging Face API-യിലേക്ക് സന്ദേശം അയയ്ക്കുന്നു...");

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log("🤖 Hugging Face പ്രതികരണം:", JSON.stringify(result, null, 2));

    const reply = result?.choices?.[0]?.message?.content;

    res.json({
      reply:
        reply ||
        "⚠️ മാപ്പ്, നിലവിൽ ശരിയായ മറുപടി ലഭ്യമല്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    });
  } catch (err) {
    console.error("❌ പ്രോസസ്സിങ്ങിൽ പിശക്:", err.message);
    res.status(500).json({
      reply:
        "⚠️ ചാറ്റ് കൈകാര്യം ചെയ്യുന്നതിനിടെ ഒരു പിശക് സംഭവിച്ചു. ദയവായി കുറച്ച് നേരം കഴിഞ്ഞ് വീണ്ടും ശ്രമിക്കുക.",
    });
  }
};
