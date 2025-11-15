import { NextRequest, NextResponse } from 'next/server';

// Simple function to detect if text is primarily English
function isEnglish(text: string): boolean {
  // Check if text contains mostly English characters
  const englishPattern = /^[a-zA-Z0-9\s.,!?'"()-]+$/;
  const hindiPattern = /[\u0900-\u097F]/; // Devanagari script range
  
  // If it contains Hindi characters, it's not English
  if (hindiPattern.test(text)) {
    return false;
  }
  
  // If it matches English pattern, it's English
  return englishPattern.test(text.trim());
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();
    
    // If empty or already Hindi, return as is
    if (!trimmedText || !isEnglish(trimmedText)) {
      return NextResponse.json({ translated: trimmedText, original: trimmedText });
    }

    // Use Google Translate REST API (free, no API key needed for basic use)
    // Note: This uses the public Google Translate endpoint
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(trimmedText)}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      }
    );

    if (!response.ok) {
      // Fallback: return original text if translation fails
      return NextResponse.json({ translated: trimmedText, original: trimmedText });
    }

    const data = await response.json();
    
    // Extract translated text from the response
    let translated = trimmedText;
    if (data && data[0] && Array.isArray(data[0])) {
      translated = data[0]
        .map((item: any[]) => item[0])
        .filter(Boolean)
        .join('');
    }

    // If translation failed or returned same text, try to handle partial words
    // For common partial words, provide better translations
    if (translated === trimmedText || !translated) {
      // Handle common partial words
      const partialWordMap: { [key: string]: string } = {
        'mahav': 'महावीर',
        'jain': 'जैन',
        'dharm': 'धर्म',
        'bhag': 'भगवान',
        'swam': 'स्वामी',
      };

      const lowerQuery = trimmedText.toLowerCase();
      for (const [partial, fullHindi] of Object.entries(partialWordMap)) {
        if (lowerQuery.includes(partial)) {
          translated = fullHindi;
          break;
        }
      }
    }

    return NextResponse.json({
      translated: translated || trimmedText,
      original: trimmedText,
    });
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback: return original text on error
    const { text } = await request.json();
    return NextResponse.json({
      translated: text || '',
      original: text || '',
    });
  }
}

