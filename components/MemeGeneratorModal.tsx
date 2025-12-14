import React, { useState, useRef } from 'react';
import { X, Sparkles, Download, RefreshCw, Upload, ImagePlus, Dice5, Zap } from 'lucide-react';
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

// Detailed description of the specific Kia Kitty Cat image provided
const KIA_KITTY_DESC = "A photo-realistic meme of a specific cat character: A chubby, grumpy-looking British Shorthair cat with white and grey/brown bicolor fur. The cat is wearing a white collared business shirt and a dark navy blue silk tie. The cat has a very serious, unimpressed, corporate executive expression. The cat looks like a boss.";

// Dynamic prompts components
const TRADER_ACTIONS = [
    "panic selling everything", "buying the absolute top", "staring at a 90% loss", 
    "watching a coin pump 1000%", "drawing random lines on technical charts", "ignoring a margin call",
    "explaining crypto to a confused grandma", "checking portfolio every 5 seconds", "fomoing into a rugpull",
    "celebrating a $5 profit", "eating instant noodles", "praying to the green candle god",
    "fighting bear market demons", "hunting for the next 100x gem", "auditing a smart contract with a magnifying glass",
    "losing seed phrase", "finding an old wallet with bitcoin", "getting liquidated", "yelling at the wifi router",
    "running a node on a toaster", "minting a worthless NFT", "reading the whitepaper upside down"
];

const TRADER_EMOTIONS = [
    "sweating nervously", "with laser eyes", "crying tears of joy", "looking dead inside",
    "grinning like a maniac", "looking completely confused", "looking like a genius", "wearing cool pixelated shades",
    "screaming internally", "looking suspicious", "with a smug face", "looking exhausted", "feeling euphoric",
    "looking angry at the screen", "looking surprisingly calm", "drooling slightly"
];

const TRADER_LOCATIONS = [
    "in a messy bedroom full of monitors", "on a luxury yacht", "at a mcdonalds kitchen", "on the moon surface",
    "at a high-tech wall street desk", "under a cardboard box bridge", "in a lamborghini driver seat", "at a boring day job office",
    "in a burning room", "at a crypto conference stage", "inside the matrix", "on a rollercoaster",
    "in a supermarket aisle", "at a family dinner table", "in a private jet", "on a tropical beach"
];

const MemeGeneratorModal: React.FC<MemeGeneratorModalProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  // Inputs
  const [promptInput, setPromptInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  
  // Reference handling
  const [useProfileRef, setUseProfileRef] = useState(true);
  const [customRefImage, setCustomRefImage] = useState<string | null>(null); // Base64 of uploaded image
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [statusMessage, setStatusMessage] = useState("");

  // Handle File Upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setCustomRefImage(reader.result as string);
            setUseProfileRef(false); // Disable auto-profile fetch if custom image is set
        };
        reader.readAsDataURL(file);
    }
  };

  const handleRandomCaption = () => {
      const random = CRYPTO_QUOTES[Math.floor(Math.random() * CRYPTO_QUOTES.length)];
      setCaptionInput(random);
  };

  const handleRandomKiaMeme = () => {
      // Generate a dynamic prompt
      const action = TRADER_ACTIONS[Math.floor(Math.random() * TRADER_ACTIONS.length)];
      const emotion = TRADER_EMOTIONS[Math.floor(Math.random() * TRADER_EMOTIONS.length)];
      const location = TRADER_LOCATIONS[Math.floor(Math.random() * TRADER_LOCATIONS.length)];
      
      const dynamicPrompt = `${action} ${location} ${emotion}`;
      setPromptInput(dynamicPrompt);
      generateMeme(dynamicPrompt);
  };

  // Helper to fetch image and convert to base64
  const getBase64FromUrl = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.warn("CORS restricted access to profile pic.");
      return null;
    }
  };

  const generateMeme = async (overridePrompt?: string) => {
    // Determine prompt: override (random button) > input > fallback
    let scenarioToUse = overridePrompt || promptInput.trim();
    
    if (!scenarioToUse) {
        alert("Please enter a prompt or click the Random button!");
        return;
    }

    setLoading(true);
    setStatusMessage("Preparing prompt...");

    try {
      // @ts-ignore process.env.API_KEY is injected by Vite define plugin
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let promptParts: any[] = [];
      let base64Image: string | null = null;

      // 1. Determine which image source to use
      if (customRefImage) {
          base64Image = customRefImage;
          setStatusMessage("Using uploaded reference image...");
      } else if (useProfileRef) {
          setStatusMessage("Fetching profile picture...");
          base64Image = await getBase64FromUrl(PROFILE_PIC_URL);
      }

      // 2. Construct the prompt
      const promptText = `Here is the character reference. Create a new photo-realistic image of THIS CAT character ${scenarioToUse}. Maintain the exact look of the cat (fur pattern, shirt, tie). IMPORTANT: Do NOT include any text inside the image.`;
      
      const textOnlyPrompt = `${KIA_KITTY_DESC} \n\nScene: ${scenarioToUse}. \n\nIMPORTANT INSTRUCTION: Generate a single image. Do NOT include any text, captions, speech bubbles, or words inside the generated image. The image must be completely text-free.`;

      if (base64Image) {
          // If we have a valid image (Uploaded or Fetched)
          const base64Data = base64Image.split(',')[1];
          promptParts = [
              { 
                  inlineData: { 
                      data: base64Data, 
                      mimeType: 'image/jpeg' 
                  } 
              },
              { 
                  text: promptText
              }
          ];
      } else {
          // Fallback to text description
          if (useProfileRef) setStatusMessage("Could not access profile image (CORS). Using description...");
          else setStatusMessage("Generating from description...");
          
          promptParts = [
              { text: textOnlyPrompt }
          ];
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: promptParts }
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
      alert("Oops! The AI is sleeping or the key is missing. Try again.");
    } finally {
      setLoading(false);
      setStatusMessage("");
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
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center custom-scrollbar">
            
            {/* Image Container */}
            <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden border border-gray-800 flex items-center justify-center mb-4 group shrink-0">
                {loading ? (
                    <div className="flex flex-col items-center gap-3 text-gray-400 animate-pulse text-center px-4">
                        <RefreshCw className="animate-spin" size={32} />
                        <span className="text-sm font-medium">Cooking up a meme...</span>
                        <span className="text-xs text-gray-500">{statusMessage}</span>
                    </div>
                ) : imageUrl ? (
                    <>
                        <img src={imageUrl} alt="AI Meme" className="w-full h-full object-cover" />
                        {/* Meme Text Overlay - Only if text exists */}
                        {captionInput && (
                            <div className="absolute inset-0 flex flex-col justify-end pb-6 items-center pointer-events-none p-4">
                                <h2 className="font-['Impact'] text-4xl md:text-5xl text-white uppercase text-center tracking-wide leading-tight drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] break-words w-full"
                                    style={{ 
                                        textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                        WebkitTextStroke: '1px black'
                                    }}>
                                    {captionInput}
                                </h2>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center text-gray-500 gap-2 text-center p-6">
                        <div className="w-16 h-16 bg-[#2f2f2f] rounded-full flex items-center justify-center mb-2">
                            <Sparkles size={32} className="text-yellow-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Ready to create!</h3>
                        <p className="text-sm text-gray-400">Enter a prompt below or hit the Random button for a surprise.</p>
                    </div>
                )}
            </div>

            {/* Content Settings */}
            <div className="w-full space-y-3 mb-4 shrink-0">
                 {/* Prompt Input */}
                <div>
                    <label className="text-[10px] text-gray-400 mb-1.5 block uppercase font-bold tracking-wider">Prompt</label>
                    <input 
                        type="text"
                        value={promptInput}
                        onChange={(e) => setPromptInput(e.target.value)}
                        placeholder="e.g. Eating pizza on Mars..."
                        className="w-full bg-[#2f2f2f] border border-gray-700 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-yellow-400 placeholder-gray-500 transition-colors"
                    />
                </div>

                {/* Caption Input */}
                <div>
                    <label className="text-[10px] text-gray-400 mb-1.5 block uppercase font-bold tracking-wider">Caption (Optional)</label>
                    <div className="flex gap-2">
                        <input 
                            type="text"
                            value={captionInput}
                            onChange={(e) => setCaptionInput(e.target.value)}
                            placeholder="Text overlay..."
                            className="w-full bg-[#2f2f2f] border border-gray-700 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-yellow-400 placeholder-gray-500 font-bold tracking-wide transition-colors"
                        />
                        <button 
                            onClick={handleRandomCaption}
                            className="bg-[#2f2f2f] hover:bg-[#3f3f3f] border border-gray-700 text-white p-2.5 rounded-lg transition-colors flex items-center justify-center min-w-[44px]"
                            title="Random Crypto Quote"
                        >
                            <Dice5 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Reference Settings */}
            <div className="w-full mb-5 space-y-2 shrink-0 border-t border-gray-800 pt-3">
                <label className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider">Reference Image</label>
                
                {/* Custom Upload */}
                <div className="flex items-center gap-2">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs md:text-sm border border-dashed transition-all ${
                            customRefImage 
                            ? 'border-green-500 bg-green-500/10 text-green-400' 
                            : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'
                        }`}
                    >
                        {customRefImage ? (
                            <>
                                <ImagePlus size={16} />
                                Custom Image Uploaded
                            </>
                        ) : (
                            <>
                                <Upload size={16} />
                                Upload Reference Photo
                            </>
                        )}
                    </button>
                    {customRefImage && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); setCustomRefImage(null); setUseProfileRef(true); }}
                            className="p-2.5 rounded-lg bg-[#2f2f2f] text-gray-400 hover:text-red-400 hover:bg-[#3f3f3f] transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                 {/* Profile Toggle (Only show if no custom image) */}
                 {!customRefImage && (
                    <button 
                        onClick={() => setUseProfileRef(!useProfileRef)}
                        className={`flex items-center justify-center gap-2 py-1 text-xs transition-colors w-full ${useProfileRef ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <div className={`w-3 h-3 rounded-[3px] border flex items-center justify-center ${useProfileRef ? 'bg-green-400 border-green-400' : 'border-gray-600'}`}>
                            {useProfileRef && <svg viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" className="w-2 h-2"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                        </div>
                        Use Profile Picture
                    </button>
                 )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full mt-auto shrink-0">
                <div className="flex gap-2">
                     <button 
                        onClick={handleRandomKiaMeme} 
                        disabled={loading}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-700 disabled:text-gray-500 text-black font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                        {loading ? <RefreshCw size={20} className="animate-spin" /> : <Zap size={20} />}
                        <span className="text-sm md:text-base">RANDOMIZE</span>
                    </button>
                    
                    <button 
                        onClick={() => generateMeme()} 
                        disabled={loading}
                        className="flex-1 bg-[#fe2c55] hover:bg-[#ef2950] disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                        {loading ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} />}
                        <span className="text-sm md:text-base">Generate</span>
                    </button>
                </div>

                {imageUrl && !loading && (
                    <a 
                        href={imageUrl} 
                        download={`kia-meme-${Date.now()}.png`}
                        className="bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors w-full border border-gray-700"
                    >
                        <Download size={20} />
                        Download Meme
                    </a>
                )}
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default MemeGeneratorModal;