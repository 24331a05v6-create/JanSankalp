import type { IVRLanguage, IVRQuestionType } from './types';

export interface IVRPrompts {
  welcome: string;
  languageInstruction: string;
  keypadMenuInstruction: string;
  pressToStart: string;
  pressToStop: string;
  pressToListen: string;
  pressToDelete: string;
  pressToRerecord: string;
  pressToNext: string;
  recordingStarted: string;
  recordingStopped: string;
  playingRecording: string;
  recordingDeleted: string;
  pleaseRerecord: string;
  movingToNext: string;
  noRecording: string;
  uploading: string;
  uploadSuccess: string;
  uploadFailed: string;
  questionPrefix: (num: number, total: number) => string;
  categoryPrompt: string;
  selectCategory: string;
  completionMessage: string;
}

const PROMPTS: Record<IVRLanguage, IVRPrompts> = {
  en: {
    welcome: 'Welcome to the Citizen Development Complaint System. Please listen carefully to the following options.',
    languageInstruction: 'To select your language, press 1 for English. Press 2 for Hindi. Press 3 for Telugu. Press 4 for Tamil. Press 5 for Kannada. Press 6 for Malayalam.',
    keypadMenuInstruction: 'Press 1 to Record. Press 2 to Stop. Press 3 to Listen. Press 4 to Delete. Press 5 to Record Again. Press 6 to Next.',
    pressToStart: 'Press 1 to start recording your complaint.',
    pressToStop: 'Press 2 to stop recording.',
    pressToListen: 'Press 3 to listen to your recorded complaint.',
    pressToDelete: 'Press 4 to delete the current recording.',
    pressToRerecord: 'Press 5 to record the complaint again.',
    pressToNext: 'Press 6 to continue to the next step.',
    recordingStarted: 'Recording started. Please speak after the beep.',
    recordingStopped: 'Recording has been stopped.',
    playingRecording: 'Playing your recorded complaint.',
    recordingDeleted: 'Your recording has been deleted.',
    pleaseRerecord: 'Please record your complaint again after the beep.',
    movingToNext: 'Moving to the next question.',
    noRecording: 'No recording found. Please press 1 to record your complaint.',
    uploading: 'Uploading your recording.',
    uploadSuccess: 'Upload completed successfully.',
    uploadFailed: 'Upload failed. Please try again.',
    questionPrefix: (num, total) => `Question ${num} of ${total}.`,
    categoryPrompt: 'Now, please select the category of your complaint.',
    selectCategory: 'Press a number key from 1 to 8 to select the category.',
    completionMessage: 'Thank you. Your complaint has been submitted successfully. Your complaint ID is being generated.',
  },
  hi: {
    welcome: 'नागरिक विकास शिकायत प्रणाली में आपका स्वागत है। कृपया निम्नलिखित विकल्पों को ध्यान से सुनें।',
    languageInstruction: 'अपनी भाषा चुनने के लिए, अंग्रेज़ी के लिए 1 दबाएं। हिंदी के लिए 2 दबाएं। तेलुगु के लिए 3 दबाएं। तमिल के लिए 4 दबाएं। कन्नड़ के लिए 5 दबाएं। मलयालम के लिए 6 दबाएं।',
    keypadMenuInstruction: 'रिकॉर्ड करने के लिए 1 दबाएं। रोकने के लिए 2 दबाएं। सुनने के लिए 3 दबाएं। हटाने के लिए 4 दबाएं। फिर से रिकॉर्ड करने के लिए 5 दबाएं। अगले चरण के लिए 6 दबाएं।',
    pressToStart: 'अपनी शिकायत दर्ज करने के लिए 1 दबाएं।',
    pressToStop: 'रिकॉर्डिंग रोकने के लिए 2 दबाएं।',
    pressToListen: 'अपनी रिकॉर्ड की गई शिकायत सुनने के लिए 3 दबाएं।',
    pressToDelete: 'वर्तमान रिकॉर्डिंग हटाने के लिए 4 दबाएं।',
    pressToRerecord: 'शिकायत फिर से रिकॉर्ड करने के लिए 5 दबाएं।',
    pressToNext: 'अगले चरण पर जाने के लिए 6 दबाएं।',
    recordingStarted: 'रिकॉर्डिंग शुरू हो गई है। कृपया बीप के बाद बोलें।',
    recordingStopped: 'रिकॉर्डिंग रोक दी गई है।',
    playingRecording: 'आपकी रिकॉर्ड की गई शिकायत चल रही है।',
    recordingDeleted: 'आपकी रिकॉर्डिंग हटा दी गई है।',
    pleaseRerecord: 'कृपया बीप के बाद अपनी शिकायत फिर से रिकॉर्ड करें।',
    movingToNext: 'अगले प्रश्न पर जा रहे हैं।',
    noRecording: 'कोई रिकॉर्डिंग नहीं मिली। कृपया अपनी शिकायत दर्ज करने के लिए 1 दबाएं।',
    uploading: 'आपकी रिकॉर्डिंग अपलोड हो रही है।',
    uploadSuccess: 'अपलोड सफलतापूर्वक पूरा हुआ।',
    uploadFailed: 'अपलोड विफल रहा। कृपया पुनः प्रयास करें।',
    questionPrefix: (num, total) => `प्रश्न ${num} ${total} में से।`,
    categoryPrompt: 'अब, कृपया अपनी शिकायत की श्रेणी चुनें।',
    selectCategory: 'श्रेणी चुनने के लिए 1 से 8 तक की संख्या दबाएं।',
    completionMessage: 'धन्यवाद। आपकी शिकायत सफलतापूर्वक जमा हो गई है। आपकी शिकायत आईडी बनाई जा रही है।',
  },
  te: {
    welcome: 'పౌర అభివృద్ధి ఫిర్యాదు వ్యవస్థకు స్వాగతం. దయచేసి ఈ క్రింది ఎంపికలను జాగ్రత్తగా వినండి.',
    languageInstruction: 'మీ భాషను ఎంచుకోవడానికి, ఇంగ్లీష్ కోసం 1 నొక్కండి. హిందీ కోసం 2 నొక్కండి. తెలుగు కోసం 3 నొక్కండి. తమిళం కోసం 4 నొక్కండి. కన్నడ కోసం 5 నొక్కండి. మలయాళం కోసం 6 నొక్కండి.',
    keypadMenuInstruction: 'రికార్డ్ చేయడానికి 1 నొక్కండి. ఆపడానికి 2 నొక్కండి. వినడానికి 3 నొక్కండి. తొలగించడానికి 4 నొక్కండి. మళ్ళీ రికార్డ్ చేయడానికి 5 నొక్కండి. తదుపరి దశకు 6 నొక్కండి.',
    pressToStart: 'మీ ఫిర్యాదు రికార్డ్ చేయడానికి 1 నొక్కండి.',
    pressToStop: 'రికార్డింగ్ ఆపడానికి 2 నొక్కండి.',
    pressToListen: 'మీ రికార్డ్ చేసిన ఫిర్యాదు వినడానికి 3 నొక్కండి.',
    pressToDelete: 'ప్రస్తుత రికార్డింగ్ తొలగించడానికి 4 నొక్కండి.',
    pressToRerecord: 'ఫిర్యాదు మళ్ళీ రికార్డ్ చేయడానికి 5 నొక్కండి.',
    pressToNext: 'తదుపరి దశకు వెళ్ళడానికి 6 నొక్కండి.',
    recordingStarted: 'రికార్డింగ్ ప్రారంభమైంది. దయచేసి బీప్ తర్వాత మాట్లాడండి.',
    recordingStopped: 'రికార్డింగ్ ఆపబడింది.',
    playingRecording: 'మీ రికార్డ్ చేసిన ఫిర్యాదు ప్లే అవుతోంది.',
    recordingDeleted: 'మీ రికార్డింగ్ తొలగించబడింది.',
    pleaseRerecord: 'దయచేసి బీప్ తర్వాత మీ ఫిర్యాదు మళ్ళీ రికార్డ్ చేయండి.',
    movingToNext: 'తదుపరి ప్రశ్నకు వెళ్తున్నాం.',
    noRecording: 'రికార్డింగ్ కనుగొనబడలేదు. దయచేసి మీ ఫిర్యాదు రికార్డ్ చేయడానికి 1 నొక్కండి.',
    uploading: 'మీ రికార్డింగ్ అప్లోడ్ అవుతోంది.',
    uploadSuccess: 'అప్లోడ్ విజయవంతంగా పూర్తయింది.',
    uploadFailed: 'అప్లోడ్ విఫలమైంది. దయచేసి మళ్ళీ ప్రయత్నించండి.',
    questionPrefix: (num, total) => `ప్రశ్న ${num} ${total} లో.`,
    categoryPrompt: 'ఇప్పుడు, దయచేసి మీ ఫిర్యాదు వర్గాన్ని ఎంచుకోండి.',
    selectCategory: 'వర్గాన్ని ఎంచుకోవడానికి 1 నుండి 8 వరకు సంఖ్య బటన్ నొక్కండి.',
    completionMessage: 'ధన్యవాదాలు. మీ ఫిర్యాదు విజయవంతంగా సమర్పించబడింది.',
  },
  ta: {
    welcome: 'குடிமக்கள் வளர்ச்சி புகார் அமைப்புக்கு வரவேற்கிறோம். தயவுசெய்து பின்வரும் விருப்பங்களை கவனமாகக் கேளுங்கள்.',
    languageInstruction: 'உங்கள் மொழியைத் தேர்ந்தெடுக்க, ஆங்கிலத்திற்கு 1 அழுத்தவும். இந்திக்கு 2 அழுத்தவும். தெலுங்குக்கு 3 அழுத்தவும். தமிழுக்கு 4 அழுத்தவும். கன்னடத்திற்கு 5 அழுத்தவும். மலையாளத்திற்கு 6 அழுத்தவும்.',
    keypadMenuInstruction: 'பதிவு செய்ய 1 அழுத்தவும். நிறுத்த 2 அழுத்தவும். கேட்க 3 அழுத்தவும். நீக்க 4 அழுத்தவும். மீண்டும் பதிவு செய்ய 5 அழுத்தவும். அடுத்த படிக்கு 6 அழுத்தவும்.',
    pressToStart: 'உங்கள் புகாரை பதிவு செய்ய 1 அழுத்தவும்.',
    pressToStop: 'பதிவை நிறுத்த 2 அழுத்தவும்.',
    pressToListen: 'பதிவு செய்யப்பட்ட புகாரைக் கேட்க 3 அழுத்தவும்.',
    pressToDelete: 'தற்போதைய பதிவை நீக்க 4 அழுத்தவும்.',
    pressToRerecord: 'புகாரை மீண்டும் பதிவு செய்ய 5 அழுத்தவும்.',
    pressToNext: 'அடுத்த படிக்குச் செல்ல 6 அழுத்தவும்.',
    recordingStarted: 'பதிவு தொடங்கியது. பீப் சத்தத்திற்குப் பிறகு பேசுங்கள்.',
    recordingStopped: 'பதிவு நிறுத்தப்பட்டது.',
    playingRecording: 'பதிவு செய்யப்பட்ட உங்கள் புகார் இயங்குகிறது.',
    recordingDeleted: 'உங்கள் பதிவு நீக்கப்பட்டது.',
    pleaseRerecord: 'பீப் சத்தத்திற்குப் பிறகு உங்கள் புகாரை மீண்டும் பதிவு செய்யுங்கள்.',
    movingToNext: 'அடுத்த கேள்விக்குச் செல்கிறோம்.',
    noRecording: 'பதிவு எதுவும் கிடைக்கவில்லை. உங்கள் புகாரைப் பதிவு செய்ய 1 அழுத்தவும்.',
    uploading: 'உங்கள் பதிவு பதிவேற்றம் செய்யப்படுகிறது.',
    uploadSuccess: 'பதிவேற்றம் வெற்றிகரமாக முடிந்தது.',
    uploadFailed: 'பதிவேற்றம் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
    questionPrefix: (num, total) => `கேள்வி ${num} ${total} இல்.`,
    categoryPrompt: 'இப்போது, உங்கள் புகாரின் வகையைத் தேர்ந்தெடுக்கவும்.',
    selectCategory: 'வகையைத் தேர்ந்தெடுக்க 1 முதல் 8 வரை எண் விசையை அழுத்தவும்.',
    completionMessage: 'நன்றி. உங்கள் புகார் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது.',
  },
  kn: {
    welcome: 'ನಾಗರಿಕ ಅಭಿವೃದ್ಧಿ ದೂರು ವ್ಯವಸ್ಥೆಗೆ ಸ್ವಾಗತ. ದಯವಿಟ್ಟು ಈ ಕೆಳಗಿನ ಆಯ್ಕೆಗಳನ್ನು ಎಚ್ಚರಿಕೆಯಿಂದ ಕೇಳಿ.',
    languageInstruction: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಲು, ಇಂಗ್ಲಿಷ್‌ಗಾಗಿ 1 ಒತ್ತಿ. ಹಿಂದಿಗಾಗಿ 2 ಒತ್ತಿ. ತೆಲುಗುಗಾಗಿ 3 ಒತ್ತಿ. ತಮಿಳುಗಾಗಿ 4 ಒತ್ತಿ. ಕನ್ನಡಕ್ಕಾಗಿ 5 ಒತ್ತಿ. ಮಲಯಾಳಿಗಾಗಿ 6 ಒತ್ತಿ.',
    keypadMenuInstruction: 'ರೆಕಾರ್ಡ್ ಮಾಡಲು 1 ಒತ್ತಿ. ನಿಲ್ಲಿಸಲು 2 ಒತ್ತಿ. ಕೇಳಲು 3 ಒತ್ತಿ. ಅಳಿಸಲು 4 ಒತ್ತಿ. ಮತ್ತೆ ರೆಕಾರ್ಡ್ ಮಾಡಲು 5 ಒತ್ತಿ. ಮುಂದಿನ ಹಂತಕ್ಕೆ 6 ಒತ್ತಿ.',
    pressToStart: 'ನಿಮ್ಮ ದೂರನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಲು 1 ಒತ್ತಿ.',
    pressToStop: 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಲು 2 ಒತ್ತಿ.',
    pressToListen: 'ನಿಮ್ಮ ರೆಕಾರ್ಡ್ ಮಾಡಿದ ದೂರನ್ನು ಕೇಳಲು 3 ಒತ್ತಿ.',
    pressToDelete: 'ಪ್ರಸ್ತುತ ರೆಕಾರ್ಡಿಂಗ್ ಅಳಿಸಲು 4 ಒತ್ತಿ.',
    pressToRerecord: 'ದೂರನ್ನು ಮತ್ತೆ ರೆಕಾರ್ಡ್ ಮಾಡಲು 5 ಒತ್ತಿ.',
    pressToNext: 'ಮುಂದಿನ ಹಂತಕ್ಕೆ ಹೋಗಲು 6 ಒತ್ತಿ.',
    recordingStarted: 'ರೆಕಾರ್ಡಿಂಗ್ ಪ್ರಾರಂಭವಾಗಿದೆ. ದಯವಿಟ್ಟು ಬೀಪ್ ನಂತರ ಮಾತನಾಡಿ.',
    recordingStopped: 'ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಲಾಗಿದೆ.',
    playingRecording: 'ನಿಮ್ಮ ರೆಕಾರ್ಡ್ ಮಾಡಿದ ದೂರು ಪ್ಲೇ ಆಗುತ್ತಿದೆ.',
    recordingDeleted: 'ನಿಮ್ಮ ರೆಕಾರ್ಡಿಂಗ್ ಅಳಿಸಲಾಗಿದೆ.',
    pleaseRerecord: 'ದಯವಿಟ್ಟು ಬೀಪ್ ನಂತರ ನಿಮ್ಮ ದೂರನ್ನು ಮತ್ತೆ ರೆಕಾರ್ಡ್ ಮಾಡಿ.',
    movingToNext: 'ಮುಂದಿನ ಪ್ರಶ್ನೆಗೆ ಹೋಗುತ್ತಿದ್ದೇವೆ.',
    noRecording: 'ಯಾವುದೇ ರೆಕಾರ್ಡಿಂಗ್ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ದೂರನ್ನು ರೆಕಾರ್ಡ್ ಮಾಡಲು 1 ಒತ್ತಿ.',
    uploading: 'ನಿಮ್ಮ ರೆಕಾರ್ಡಿಂಗ್ ಅಪ್ಲೋಡ್ ಆಗುತ್ತಿದೆ.',
    uploadSuccess: 'ಅಪ್ಲೋಡ್ ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿದೆ.',
    uploadFailed: 'ಅಪ್ಲೋಡ್ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    questionPrefix: (num, total) => `ಪ್ರಶ್ನೆ ${num} ${total} ರಲ್ಲಿ.`,
    categoryPrompt: 'ಈಗ, ದಯವಿಟ್ಟು ನಿಮ್ಮ ದೂರಿನ ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
    selectCategory: 'ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಲು 1 ರಿಂದ 8 ರವರೆಗೆ ಸಂಖ್ಯಾ ಬಟನ್ ಒತ್ತಿ.',
    completionMessage: 'ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ದೂರು ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ.',
  },
  ml: {
    welcome: 'പൗര വികസന പരാതി സംവിധാനത്തിലേക്ക് സ്വാഗതം. ദയവായി താഴെ പറയുന്ന ഓപ്ഷനുകൾ ശ്രദ്ധാപൂർവ്വം കേൾക്കുക.',
    languageInstruction: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കാൻ, ഇംഗ്ലീഷിന് 1 അമർത്തുക. ഹിന്ദിക്ക് 2 അമർത്തുക. തെലുഗിന് 3 അമർത്തുക. തമിഴിന് 4 അമർത്തുക. കന്നഡയ്ക്ക് 5 അമർത്തുക. മലയാളത്തിന് 6 അമർത്തുക.',
    keypadMenuInstruction: 'റെക്കോർഡ് ചെയ്യാൻ 1 അമർത്തുക. നിർത്താൻ 2 അമർത്തുക. കേൾക്കാൻ 3 അമർത്തുക. ഇല്ലാതാക്കാൻ 4 അമർത്തുക. വീണ്ടും റെക്കോർഡ് ചെയ്യാൻ 5 അമർത്തുക. അടുത്ത ഘട്ടത്തിലേക്ക് 6 അമർത്തുക.',
    pressToStart: 'നിങ്ങളുടെ പരാതി റെക്കോർഡ് ചെയ്യാൻ 1 അമർത്തുക.',
    pressToStop: 'റെക്കോർഡിംഗ് നിർത്താൻ 2 അമർത്തുക.',
    pressToListen: 'റെക്കോർഡ് ചെയ്ത നിങ്ങളുടെ പരാതി കേൾക്കാൻ 3 അമർത്തുക.',
    pressToDelete: 'നിലവിലെ റെക്കോർഡിംഗ് ഇല്ലാതാക്കാൻ 4 അമർത്തുക.',
    pressToRerecord: 'പരാതി വീണ്ടും റെക്കോർഡ് ചെയ്യാൻ 5 അമർത്തുക.',
    pressToNext: 'അടുത്ത ഘട്ടത്തിലേക്ക് പോകാൻ 6 അമർത്തുക.',
    recordingStarted: 'റെക്കോർഡിംഗ് ആരംഭിച്ചു. ദയവായി ബീപ്പിന് ശേഷം സംസാരിക്കുക.',
    recordingStopped: 'റെക്കോർഡിംഗ് നിർത്തി.',
    playingRecording: 'നിങ്ങളുടെ റെക്കോർഡ് ചെയ്ത പരാതി പ്ലേ ചെയ്യുന്നു.',
    recordingDeleted: 'നിങ്ങളുടെ റെക്കോർഡിംഗ് ഇല്ലാതാക്കി.',
    pleaseRerecord: 'ദയവായി ബീപ്പിന് ശേഷം നിങ്ങളുടെ പരാതി വീണ്ടും റെക്കോർഡ് ചെയ്യുക.',
    movingToNext: 'അടുത്ത ചോദ്യത്തിലേക്ക് പോകുന്നു.',
    noRecording: 'റെക്കോർഡിംഗ് കണ്ടെത്തിയില്ല. ദയവായി നിങ്ങളുടെ പരാതി റെക്കോർഡ് ചെയ്യാൻ 1 അമർത്തുക.',
    uploading: 'നിങ്ങളുടെ റെക്കോർഡിംഗ് അപ്‌ലോഡ് ചെയ്യുന്നു.',
    uploadSuccess: 'അപ്‌ലോഡ് വിജയകരമായി പൂർത്തിയായി.',
    uploadFailed: 'അപ്‌ലോഡ് പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
    questionPrefix: (num, total) => `ചോദ്യം ${num} ${total} ൽ.`,
    categoryPrompt: 'ഇപ്പോൾ, ദയവായി നിങ്ങളുടെ പരാതിയുടെ വിഭാഗം തിരഞ്ഞെടുക്കുക.',
    selectCategory: 'വിഭാഗം തിരഞ്ഞെടുക്കാൻ 1 മുതൽ 8 വരെ നമ്പർ കീ അമർത്തുക.',
    completionMessage: 'നന്ദി. നിങ്ങളുടെ പരാതി വിജയകരമായി സമർപ്പിച്ചു.',
  },
};

export function getIVRPrompt(lang: IVRLanguage, key: keyof IVRPrompts): string | ((num: number, total: number) => string) {
  return PROMPTS[lang]?.[key] || PROMPTS.en[key];
}

export function getIVRPrompts(lang: IVRLanguage): IVRPrompts {
  return PROMPTS[lang] || PROMPTS.en;
}

export function getQuestionText(questionType: IVRQuestionType, lang: IVRLanguage): string {
  const texts: Record<IVRQuestionType, Record<IVRLanguage, string>> = {
    problem: {
      en: 'What is the problem you are facing?',
      hi: 'आप किस समस्या का सामना कर रहे हैं?',
      te: 'మీరు ఎదుర్కొంటున్న సమస్య ఏమిటి?',
      ta: 'நீங்கள் சந்திக்கும் பிரச்சனை என்ன?',
      kn: 'ನೀವು ಎದುರಿಸುತ್ತಿರುವ ಸಮಸ್ಯೆ ಯಾವುದು?',
      ml: 'നിങ്ങൾ നേരിടുന്ന പ്രശ്നം എന്താണ്?',
    },
    location: {
      en: 'Where is the problem located? Please tell the area or landmark.',
      hi: 'समस्या कहाँ है? कृपया क्षेत्र या लैंडमार्क बताएं।',
      te: 'సమస్య ఎక్కడ ఉంది? దయచేసి ప్రాంతం లేదా ల్యాండ్\u200Cమార్క్ చెప్పండి.',
      ta: 'பிரச்சனை எங்கே உள்ளது? தயவுசெய்து பகுதி அல்லது அடையாளம் சொல்லுங்கள்.',
      kn: 'ಸಮಸ್ಯೆ ಎಲ್ಲಿದೆ? ದಯವಿಟ್ಟು ಪ್ರದೇಶ ಅಥವಾ ಲ್ಯಾಂಡ\u200Cಮಾರ್ಕ್ ಹೇಳಿ.',
      ml: 'പ്രശ്നം എവിടെയാണ്? ദയവായി ഏരിയ അല്ലെങ്കിൽ ലാൻഡ\u200Cമാർക്ക് പറയുക.',
    },
    category: {
      en: 'Select your complaint category.',
      hi: 'अपनी शिकायत की श्रेणी चुनें।',
      te: 'మీ ఫిర్యాదు వర్గాన్ని ఎంచుకోండి.',
      ta: 'உங்கள் புகார் வகையைத் தேர்ந்தெடுக்கவும்.',
      kn: 'ನಿಮ್ಮ ದೂರು ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      ml: 'നിങ്ങളുടെ പരാതി വിഭാഗം തിരഞ്ഞെടുക്കുക.',
    },
  };
  return texts[questionType]?.[lang] || texts[questionType].en;
}

export const CATEGORY_VOICE: Record<IVRLanguage, string> = {
  en: 'Press 1 for Health. Press 2 for Education. Press 3 for Roads. Press 4 for Water. Press 5 for Sanitation. Press 6 for Electricity. Press 7 for Employment. Press 8 for Other.',
  hi: 'स्वास्थ्य के लिए 1 दबाएं। शिक्षा के लिए 2 दबाएं। सड़क के लिए 3 दबाएं। पानी के लिए 4 दबाएं। स्वच्छता के लिए 5 दबाएं। बिजली के लिए 6 दबाएं। रोजगार के लिए 7 दबाएं। अन्य के लिए 8 दबाएं।',
  te: 'ఆరోగ్యం కోసం 1 నొక్కండి. విద్య కోసం 2 నొక్కండి. రోడ్ల కోసం 3 నొక్కండి. నీటి కోసం 4 నొక్కండి. పారిశుధ్యం కోసం 5 నొక్కండి. విద్యుత్ కోసం 6 నొక్కండి. ఉపాధి కోసం 7 నొక్కండి. ఇతర కోసం 8 నొక్కండి.',
  ta: 'சுகாதாரத்திற்கு 1 அழுத்தவும். கல்விக்கு 2 அழுத்தவும். சாலைகளுக்கு 3 அழுத்தவும். தண்ணீருக்கு 4 அழுத்தவும். சுகாதாரத்திற்கு 5 அழுத்தவும். மின்சாரத்திற்கு 6 அழுத்தவும். வேலைவாய்ப்புக்கு 7 அழுத்தவும். மற்றவைகளுக்கு 8 அழுத்தவும்.',
  kn: 'ಆರೋಗ್ಯಕ್ಕಾಗಿ 1 ಒತ್ತಿ. ಶಿಕ್ಷಣಕ್ಕಾಗಿ 2 ಒತ್ತಿ. ರಸ್ತೆಗಳಿಗಾಗಿ 3 ಒತ್ತಿ. ನೀರಿಗಾಗಿ 4 ಒತ್ತಿ. ಸ್ವಚ್ಛತೆಗಾಗಿ 5 ಒತ್ತಿ. ವಿದ್ಯುತ್ತಿಗಾಗಿ 6 ಒತ್ತಿ. ಉದ್ಯೋಗಕ್ಕಾಗಿ 7 ಒತ್ತಿ. ಇತರೆಗಾಗಿ 8 ಒತ್ತಿ.',
  ml: 'ആരോഗ്യത്തിന് 1 അമർത്തുക. വിദ്യാഭ്യാസത്തിന് 2 അമർത്തുക. റോഡുകൾക്ക് 3 അമർത്തുക. വെള്ളത്തിന് 4 അമർത്തുക. ശുചിത്വത്തിന് 5 അമർത്തുക. വൈദ്യുതിക്ക് 6 അമർത്തുക. തൊഴിലിന് 7 അമർത്തുക. മറ്റുള്ളവയ്ക്ക് 8 അമർത്തുക.',
};

export { PROMPTS };
