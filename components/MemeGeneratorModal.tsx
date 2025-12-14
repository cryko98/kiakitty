import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Download, RefreshCw, Upload, AlertCircle, ImagePlus, Dice5 } from 'lucide-react';
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

const SCENARIOS = [
    "sitting on a throne made of golden Bitcoin coins",
    "working frantically at a trading desk with 6 monitors showing green candles",
    "driving a red luxury convertible car with the top down",
    "standing on the moon surface looking back at earth",
    "sitting in a private jet sipping milk from a crystal glass",
    "giving a presentation at a boardroom meeting with a graph going up",
    "wearing cool pixelated sunglasses (deal with it style)",
    "holding a sign that says 'BUY THE DIP'"
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

  // Trigger generation immediately on open (with random scenario, no text)
  useEffect(() => {
     generateMeme();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

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

  const generateMeme = async () => {
    setLoading(true);
    setStatusMessage("Preparing prompt...");
    
    // Determine scenario: user input OR random
    let scenarioToUse = promptInput.trim();
    if (!scenarioToUse) {
        scenarioToUse = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];
    }

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
                    <div className="flex flex-col items-center text-gray-500 gap-2">
                        <AlertCircle size={32} />
                        <span>Something went wrong.</span>
                    </div>
                )}
            </div>

            {/* Content Settings */}
            <div className="w-full space-y-3 mb-4 shrink-0">
                 {/* Prompt Input */}
                <div>
                    <label className="text-[10px] text-gray-400 mb-1.5 block uppercase font-bold tracking-wider">Prompt (Leave empty for random)</label>
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

            {/* Generate Button */}
            <div className="flex gap-3 w-full mt-auto shrink-0">
                <button 
                    onClick={generateMeme} 
                    disabled={loading}
                    className="flex-1 bg-[#fe2c55] hover:bg-[#ef2950] disabled:bg-gray-700 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    {loading ? "Generating..." : "Generate Meme"}
                </button>
                
                {imageUrl && !loading && (
                    <a 
                        href={imageUrl} 
                        download={`kia-meme-${Date.now()}.png`}
                        className="bg-[#2f2f2f] hover:bg-[#3f3f3f] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center transition-colors"
                    >
                        <Download size={22} />
                    </a>
                )}
            </div>
            
        </div>
      </div>
    </div>
  );
};

export default MemeGeneratorModal;