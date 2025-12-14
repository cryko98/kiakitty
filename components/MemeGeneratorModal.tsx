import React, { useState, useEffect } from 'react';
import { X, Sparkles, Download, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { PROFILE_PIC_URL } from '../constants';

interface MemeGeneratorModalProps {
  onClose: () => void;
}

const CRYPTO_QUOTES = [
  "WEN LAMBO?",
  "BUY HIGH, SELL LOW",
  "FUNDS ARE SAFU",
  "IT'S NOT A DIP, IT'S A DISCOUNT",
  "HODL UNTIL 0",
  "ONE MORE PUMP PLS",
  "JUST A MARKET CORRECTION",
  "TO THE MOON 🚀",
  "IN IT FOR THE TECH",
  "DIAMOND HANDS 💎🙌",
  "COMMUNITY TAKEOVER",
  "WAITING FOR ALT SEASON LIKE...",
  "BITCOIN FIXES THIS",
  "DEV SOLD?",
  "1 $KIA = 1 $KIA"
];

// Fallback description if image fetch fails (CORS)
const BASE_CAT_DESC = "A grumpy, stocky British Shorthair cat with bi-color fur (grey/brown patches on white). The cat has a very serious, unimpressed expression and is wearing a crisp white dress shirt with a dark navy blue silk tie. The cat looks like a business executive.";

const SCENARIOS = [
    "sitting on a massive pile of gold coins",
    "floating in outer space near the moon, digital art style",
    "looking stressed at a computer screen with a red stock chart in the background",
    "driving a red luxury sports car",
    "sitting at a mahogany desk in a high-rise office",
    "meditating while floating in the air, radiating glowing energy",
    "looking shocked with paws on face, dramatic lighting",
    "holding a green candle stick chart pattern"
];

const MemeGeneratorModal: React.FC<MemeGeneratorModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [quote, setQuote] = useState<string>("");
  const [referenceImageBase64, setReferenceImageBase64] = useState<string | null>(null);

  // Attempt to load the profile picture as a reference image for the AI
  useEffect(() => {
    const fetchProfileImage = async () => {
        try {
            const response = await fetch(PROFILE_PIC_URL);
            if (!response.ok) throw new Error("Failed to fetch profile pic");
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                // Remove the data URL prefix to get raw base64
                const base64 = result.split(',')[1];
                setReferenceImageBase64(base64);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            console.log("Could not load profile picture for reference (likely CORS). Using text description only.");
        }
    };
    fetchProfileImage();
  }, []);

  // Trigger generation once we have attempted to fetch the image (or immediately if useEffect runs)
  useEffect(() => {
     generateMeme();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const generateMeme = async () => {
    setLoading(true);
    setImageUrl(null);
    
    const randomQuote = CRYPTO_QUOTES[Math.floor(Math.random() * CRYPTO_QUOTES.length)];
    setQuote(randomQuote);
    const randomScenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let contents: any;

      if (referenceImageBase64) {
          // Use image reference for exact likeness
          contents = {
              parts: [
                  {
                      inlineData: {
                          mimeType: 'image/jpeg',
                          data: referenceImageBase64
                      }
                  },
                  {
                      text: `Generate a high-quality meme image. The main character MUST be the cat in the provided reference image. Preserve the cat's exact appearance: the bi-color fur, the grumpy expression, the white shirt, and the navy blue tie. Do not change the cat's clothes or face. Scene: ${randomScenario}. IMPORTANT: Do not render any text, words, letters, speech bubbles, or captions in the image itself. The image should be text-free so I can add my own overlay.`
                  }
              ]
          };
      } else {
          // Fallback to text description
          contents = {
              parts: [
                  { text: `${BASE_CAT_DESC} Scene: ${randomScenario}. IMPORTANT: Do not render any text, words, letters, speech bubbles, or captions in the image itself. The image should be text-free so I can add my own overlay.` }
              ]
          };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: contents
      });

      let foundImage = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64String = part.inlineData.data;
            setImageUrl(`data:image/png;base64,${base64String}`);
            foundImage = true;
            break;
          }
        }
      }
      
      if (!foundImage) {
          console.error("No image found in response");
          setImageUrl("https://picsum.photos/600/600");
      }

    } catch (error) {
      console.error("Error generating meme:", error);
      alert("Oops! The AI is sleeping. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1f1f1f] border border-gray-700 w-full max-w-md rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="text-yellow-400" size={20} />
            Meme Generator
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center">
            
            {/* Image Container */}
            <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center mb-4 group">
                {loading ? (
                    <div className="flex flex-col items-center gap-3 text-gray-400 animate-pulse">
                        <RefreshCw className="animate-spin" size={32} />
                        <span className="text-sm font-medium">Cooking up a meme...</span>
                    </div>
                ) : imageUrl ? (
                    <>
                        <img src={imageUrl} alt="AI Meme" className="w-full h-full object-cover" />
                        {/* Meme Text Overlay */}
                        <div className="absolute inset-0 flex flex-col justify-end pb-6 items-center pointer-events-none p-4">
                             <h2 className="font-['Impact'] text-4xl md:text-5xl text-white uppercase text-center tracking-wide leading-tight"
                                 style={{ 
                                     textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                     WebkitTextStroke: '2px black'
                                 }}>
                                 {quote}
                             </h2>
                        </div>
                    </>
                ) : (
                    <span className="text-gray-500">Something went wrong.</span>
                )}
            </div>

            {/* Controls */}
            <div className="flex gap-3 w-full">
                <button 
                    onClick={generateMeme} 
                    disabled={loading}
                    className="flex-1 bg-[#fe2c55] hover:bg-[#ef2950] disabled:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    {loading ? "Generating..." : "New Meme"}
                </button>
                
                {imageUrl && !loading && (
                    <a 
                        href={imageUrl} 
                        download={`kia-meme-${Date.now()}.png`}
                        className="bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                        <Download size={20} />
                    </a>
                )}
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default MemeGeneratorModal;