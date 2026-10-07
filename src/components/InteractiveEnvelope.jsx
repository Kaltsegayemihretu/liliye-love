import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw } from 'lucide-react';
import { api } from '../services/api';

export default function InteractiveEnvelope({ letterData }) {
  const [isOpen, setIsOpen] = useState(false);
  const letterRef = useRef(null);
  const hasTrackedOpen = useRef(false);

  const title = letterData?.title || 'FOR YOU';
  const subtitle = letterData?.subtitle || 'Tap to open';

  const defaultSingleLetter = [
    "Liliye,",

    "I remember the first time we met like it was yesterday. We were learning our driving license, we were walking down the stairs, and I asked you if it was boring. You replied, “No, not really.” I asked you to send me the document, but honestly, I just wanted your number.",

    "The next day, you agreed to walk with me to Imperial, and then we walked all the way to your home, talking the entire journey together. It wasn’t awkward at all. I still get chills just thinking about it. I told you that you had beautiful nails and held your bag like the gentleman I am. We started talking, and I asked you out. You said no, telling me you liked older men in their mid-30s.",

    "I ghosted you after you said no. I prayed you would text me back, and after 15 days, you finally said, “Hey.”. I’m so glad you did.",

    "We talked more, and you applied to AASTU and got accepted for the entrance exam. We decided to meet at AASTU. I couldn't stop laying my eyes on you my love. Even Halle noticed it, haha. We called a ride together and walked to the front gates, but then I got SICk, migraine  remember? I was so mad because I wanted to have lunch with you that day. I remember wanting to lay my head on your thighs because I was so tired and sick.",

    "But somehow, we went out. I waited for you at the caramel cafe and then we went to coffecology. We talked we laughed you ordered cocktail we both did actually, we didn’t like it….and we ORDERED waffles and pancakes for lunch hehehe remember. Mazi won the first spot Eqube tela.",

    "LILIYE, I LOVE YOU. PLEASE, LET’S GET BACK TOGETHER AGAIN. I WON’T MESS IT UP THIS TIME. I SWEAR TO GOD.",

    "After our first date, you told me you wanted to go out again. I had never felt so much like a man. We went to Nu Cheka Enabuka and then to Century. You were checking my Instagram the whole time, looking for other girls, which you didn’t find. Thank God there weren’t any.",

    "It was Fantu’s birthday, so we had to rush home. You were a bit sad because you wanted to spend more time together.",

    "Once we got accepted at AASTU, we started going home together. You were so funny, Liliye. GASH i had to admit that you’re funny to get back with you mtsm haha. I remember how i look at you GOD your eyes they were so beautiful…..i used to lean on the front seat of the taxi head against my forearms looking at your eyes and you would smile at me. It was the most beautiful thing in this world.",

    "You remember the day we were crossing the road, and you held my hand for a split of a second and you let me go. I still remember the rush I felt before you pulled away. Oh, and the day before, I forgot my document with you and came to your house wearing a gold necklace. You came out and gave it to me, and I texted you asking why you had put a stain on my document, i said something funny like you “did you let it eat with you”. You said, “Cute,” and made me blush.",

    "You were the first person to truly love me, Liliye, and I truly loved back. I miss you like I did in the old days. I will marry you, Liliye, no matter what.",

    "Anyway, after you held my hand, we went to Karavan and talked about where this relationship was going. You said you liked me, but you wanted friends with benefits.",

    "YOU SAID IT DON’T DENY IT, and then I agreed. I MISS THIS GUFFY FIGHTS WE HAD LIKE WHO SAID I LOVE YOU FIRST OR YOU SAID YOU WANTED TO BE FRIENDS WITH BENFITS.",

    "We started whatever that was for a week. Do you remember, Liliye, the way we used to hold hands when we sat at the basketball court? HEHEHE we we’re so corny i swear to god hahah i can’t stop laughing writing this. And Cry also…….I MENTIONED CRY BECAUSE YOU TOLD ME YOU WOULD LOVE TO SEE ME CRY AND THEN YOU WOULD COMFORT ME…..I CRIED ALOT ESKI NEYE ENA ABABYEGN.",

    "Then I told you to stop the friends-with-benefits thing and start dating seriously. You were a bit unsure. We were imperfect, and that is what made us perfect. We went to Eliana and watched movies. Then we ate at Ako, and you were wearing your cardigan. Then we went to Elaina Café, and we talked. Then we became boyfriend and girlfriend. God the walks we used to take the talks we used to talk……we counted the stars we saw crazy BEINGS, remember the time the fly won’t stop circling my head hehe. What about the kisses we were so paranoid to make out because of the guards hehehe they would shine the light on us to make sure we weren’t doing anything. I would tread everything for those moments of my love.",

    "Afripolitan and Ag used to be our home eko yene fiker, im sorry i had to ruine what we had. But i promise im truly changed matured to i can make you happier then now or ever our story shouldn’t end like this. Lets not end it liliyee benatshe. Yene fiker i miss you i love you. Even my family misses you truly. Please we can never find a love story like this. We loved each other and i believe we can love each other more. Last time we talked you you said you didn’t feel loved in our relationship…….i will make sure that will happen my love their is no deseret i wouldn’t cross for you.",

    "My love, BE EGEZIABHER YKERE BEYEGN, let’s not ruin this.",

    "We still have time. I want to be with you forever. You won’t regret a single thing, Liliye. I guarantee you that. It won’t be a risk. I’m so serious. You don’t know how seriously I want to be with you.",

    "Do you remember the food I used to cook for you?",

    "Do you remember the first time you came home?",

    "Do you remember the agelgel we brought to the hotel?",

    "Do you remember the wrestling matches we had, the showers we took together, or the time I brushed my teeth with your toothbrush?",

    "You were my everything, and you still are.",

    "I’m not joking, Liliye. I will do so many things GENA. I will do whatever it takes to get you back, yene abeba.",

    "Do you remember the time you met Hilu and Tamu?",

    "Liliye, sentun text laregew.",

    "I want you to remember and reminisce about the past we had,i want to have kids with you, and build a house together with you. Only you. Just the way you like it.",

    "I will die for you, literally.",

    "Don’t just look at the present, Liliye. Look at the past and the future with me.",

    "Yene abeba, I’m so sorry. Yeker beyegn. Aberen enehun. Ayelemedegnme yene fiker.",

    "I’m dumb. I did the dumbest thing. But this is just the start, Liliye.",

    "I will make you fall in love with me again if I have to. I would rather try a million times with you than with someone else.",

    "I get a stomach ache imagining you laughing with someone else when I’m not there to make you laugh harder.",

    "Liliye, you might find this intense or toxic, but this is love, Liliye.",

    "BE EGEZIABHER, Liliye, give me a chance.",

    "Be Mazi. Be Demese. Be Babi. Be Baby. Be Nati. Be Mother. Be Unc, who works at Ethio Telecom, who we ripped money of.",

    "Let’s work on this.",

    "I will do whatever it takes, yene fiker.",

    "I love you until death do part us.",

    "It’s not too late. No, it’s not.",

    "Let’s think about us and no one else for a second.",

    "Liliye, yene fiker, PLEASE.",

    "I LOVE YOU A MILLION, LILIYE."
  ];

  const letterParagraphs = letterData?.singleLetterText
    ? letterData.singleLetterText.split('\n\n')
    : defaultSingleLetter;

  const handleOpen = () => {
    setIsOpen(true);
    if (!hasTrackedOpen.current) {
      api.trackEvent('Envelope opened');
      hasTrackedOpen.current = true;
    } else {
      api.trackEvent('Envelope reopened');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div id="letter" className="w-full max-w-4xl mx-auto my-20 px-4 flex flex-col items-center">
      
      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900">
          A Letter For Your Heart 💌
        </h2>
      </div>

      {!isOpen ? (
        /* CLOSED ENVELOPE STATE */
        <motion.div
          onClick={handleOpen}
          whileHover={{ scale: 1.03, rotate: 1 }}
          whileTap={{ scale: 0.97 }}
          className="cursor-pointer w-full max-w-lg relative bg-gradient-to-br from-[#ff2a75] via-[#e60067] to-[#80003c] rounded-[2.5rem] p-8 md:p-12 shadow-2xl text-white overflow-hidden text-center group border-4 border-white/40"
        >
          <div className="absolute top-0 left-0 right-0 h-32 bg-white/10 backdrop-blur-sm clip-envelope-flap border-b border-white/20" style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />

          <div className="relative z-10 my-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white text-[#ff2a75] flex items-center justify-center shadow-2xl border-4 border-[#ffd0e0] group-hover:scale-110 transition-transform">
              <Heart className="w-10 h-10 fill-[#ff2a75] animate-bounce" />
            </div>

            <h3 className="font-display text-3xl md:text-4xl font-extrabold mt-6 tracking-wide">
              {title}
            </h3>

            <p className="text-sm md:text-base font-semibold text-white/90 mt-2 bg-white/20 px-5 py-2 rounded-full backdrop-blur-md">
              {hasTrackedOpen.current ? 'Tap to open again ✨' : subtitle}
            </p>
          </div>
        </motion.div>
      ) : (
        /* OPEN LETTER EXPERIENCE */
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-[#fffaf5] rounded-[2.5rem] p-6 md:p-12 shadow-2xl border-2 border-[#ffd0e0] relative text-slate-800"
        >
          {/* Floating Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-[#ffe4ec] text-[#ff2a75] hover:bg-[#ff2a75] hover:text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Fold Letter
          </button>

          {/* Scrollable Digital Paper Container */}
          <div
            ref={letterRef}
            className="max-h-[650px] overflow-y-auto pr-3 space-y-6 custom-scrollbar text-left"
          >
            <div className="text-center border-b border-[#ffd0e0] pb-6 mb-6">
              <span className="font-handwritten text-4xl text-[#ff2a75] font-extrabold">
                My Dearest Liliye,
              </span>
            </div>

            {letterParagraphs.map((para, idx) => {
              const text = para.trim();
              if (!text) return null;

              const isHighlight = text === text.toUpperCase() && text.length > 8 || text.includes('BE EGEZIABHER') || text.includes('I LOVE YOU A MILLION');

              if (isHighlight) {
                return (
                  <div key={idx} className="my-6 py-4 px-6 rounded-2xl bg-[#ffe4ec]/60 border-l-4 border-[#ff2a75] text-center shadow-sm">
                    <p className="font-display text-lg md:text-xl font-extrabold text-[#80003c] tracking-wide leading-relaxed">
                      "{text}"
                    </p>
                  </div>
                );
              }

              return (
                <p key={idx} className="text-base md:text-lg text-slate-700 leading-relaxed font-sans font-medium">
                  {text}
                </p>
              );
            })}

            {/* Letter Closing & Seal */}
            <div className="text-center pt-8 border-t border-[#ffd0e0] space-y-4">
              <p className="font-handwritten text-3xl text-[#ff2a75] font-bold">
                Forever Yours, My Love ❤️
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#ff2a75] to-[#e60067] text-white font-display font-extrabold text-sm shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                Close Letter 💖
              </button>
            </div>
          </div>
        </motion.div>
      )}

    </div>
  );
}
