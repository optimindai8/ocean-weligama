import { db } from "./src/index.js";
import { faqs } from "./src/schema/faq.js";

const FAQ_DATA = [
  {
    category: "The Stay",
    items: [
      {
        question: "What is the check-in and check-out time?",
        answer: "Check-in begins at 2:00 PM, and check-out is by 11:00 AM. We understand travel schedules can vary, so if you need an earlier check-in or a later check-out, please contact our concierge in advance and we will do our absolute best to accommodate you based on availability."
      },
      {
        question: "Is breakfast included in the room rate?",
        answer: "Yes, most of our direct bookings and packages include a complimentary, freshly prepared breakfast. You can choose between a hearty traditional Sri Lankan breakfast or a healthy Continental option, served daily in our ocean-view dining area."
      },
      {
        question: "Do you have high-speed Wi-Fi available?",
        answer: "Absolutely. We provide complimentary high-speed fiber-optic Wi-Fi throughout the entire property, including all rooms, common areas, and the restaurant, making it perfect for remote workers or sharing your vacation moments."
      },
      {
        question: "Are all rooms air-conditioned?",
        answer: "Yes, every room at Ocean Weligama is fully air-conditioned and features ceiling fans, ensuring you have a cool and comfortable sanctuary to return to after a long day in the tropical sun."
      },
      {
        question: "Can I request a late check-out?",
        answer: "Late check-outs are subject to room availability on the day of your departure. A half-day charge may apply for check-outs past 2:00 PM. We also offer secure luggage storage and access to our lounge and shower facilities if you have a late flight."
      }
    ]
  },
  {
    category: "Surf & Wellness",
    items: [
      {
        question: "How far is the beach from the guest house?",
        answer: "Ocean Weligama is located just a stone's throw away from Weligama beach. A short, beautiful 2-minute walk is all it takes to feel the sand between your toes and paddle out to the lineup."
      },
      {
        question: "Are surfing lessons suitable for complete beginners?",
        answer: "Yes! Weligama is globally renowned as one of the best and safest bays for beginner surfers. Our ISA-certified instructors provide personalized, step-by-step guidance ensuring you catch your very first wave safely and confidently."
      },
      {
        question: "Do I need to bring my own surfboard?",
        answer: "Not at all. We have a comprehensive quiver of high-quality surfboards for rent, ranging from soft-top longboards for beginners to performance shortboards for advanced riders. You can rent them daily or include them in your package."
      },
      {
        question: "Are yoga classes included in my stay?",
        answer: "Yoga sessions are included if you book our specialized 'Yoga & Surf Retreat Package'. For guests on room-only or surf-only packages, you can easily add morning or sunset yoga sessions as an optional 'Experience' during or after booking."
      },
      {
        question: "Do you offer packages for advanced surfers?",
        answer: "Yes, we offer an 'Advanced Surf Package' tailored for experienced surfers. Instead of basic lessons, this package includes guided surf trips to hidden reef breaks around the south coast (like Mirissa, Midigama, and Ram's) with our local surf guides."
      }
    ]
  },
  {
    category: "Bookings & Payments",
    items: [
      {
        question: "How does the deposit and payment system work?",
        answer: `Payment Policy
To confirm your reservation at Ocean Air, full payment is required in advance.

Once you send us your reservation request, we will send you a secure payment link with all booking details to complete your reservation confirmation.`
      },
      {
        question: "What is your cancellation policy?",
        answer: `Payment Policy
To confirm your reservation at Ocean Air, full payment is required in advance.

Once you send us your reservation request, we will send you a secure payment link with all booking details to complete your reservation confirmation.

Cancellation & Modification Policy
• 30+ Days Before Arrival
Cancellations or booking modifications made 30 days or more before arrival are fully refundable.

• Within 30 Days of Arrival
Cancellations or modifications made within 30 days of arrival will be charged the total reservation amount.

• No-Show
In case of a no-show, the full booking amount will be charged.

We appreciate your understanding and support, as every reservation helps us continue growing and providing the best experience for our guests.`
      },
      {
        question: "Can I customize my package with different add-ons?",
        answer: "Absolutely. Our booking engine allows you to first select your preferred Surf or Yoga package, and then independently add specific 'Experiences' such as Whale Watching, Safari Trips, Cookery Classes, or Scooter Rentals to create your perfect bespoke itinerary."
      }
    ]
  },
  {
    category: "The Journey",
    items: [
      {
        question: "Do you offer airport transfers from Colombo (CMB)?",
        answer: "Yes, we provide seamless, private, air-conditioned airport transfers directly from Bandaranaike International Airport (CMB) to Ocean Weligama. You can seamlessly add this to your booking during checkout by providing your flight details."
      },
      {
        question: "What other activities can I do around Weligama?",
        answer: "Beyond surfing and yoga, the south coast is vibrant and full of adventure! We can arrange whale watching tours in Mirissa, Udawalawe National Park safaris, local Sri Lankan cookery classes, and scooter rentals to explore hidden beaches."
      }
    ]
  }
];

async function seed() {
  console.log("Seeding FAQs...");
  for (const group of FAQ_DATA) {
    let order = 0;
    for (const item of group.items) {
      await db.insert(faqs).values({
        category: group.category,
        question: item.question,
        answer: item.answer,
        sortOrder: order++,
      });
    }
  }
  console.log("Done seeding FAQs!");
  process.exit(0);
}

seed().catch(console.error);
