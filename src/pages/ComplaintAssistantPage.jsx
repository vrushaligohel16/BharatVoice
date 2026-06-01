import { useState } from 'react';
import {
  Navbar,
  Footer,
  HeroSection,
  LanguageSelector,
  TextInput,
  SampleComplaintButtons,
  ProcessingLoader,
  ComplaintPreview,
  DepartmentCard,
  DocumentChecklist,
  SubmissionGuide,
  PDFDownloadButton,
  WhatsAppShareButton,
} from '../components/complaint-assistant';
import { DEFAULT_GENERATED_COMPLAINT, DEPARTMENT_INFO } from '../constants/samples';

const PROCESSING_MS = 2800;

export default function ComplaintAssistantPage() {
  const [language, setLanguage] = useState('en');
  const [inputText, setInputText] = useState('');
  const [hasRecording, setHasRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [complaintText, setComplaintText] = useState('');

  const canGenerate = inputText.trim().length > 0 || hasRecording;

  const handleRecordingComplete = () => {
    setHasRecording(true);
    if (!inputText.trim()) {
      setInputText(
        '[Voice recording captured] My ration card has not been updated for six months despite multiple visits to the PDS office.'
      );
    }
  };

  const handleGenerate = () => {
    if (!canGenerate || isProcessing) return;
    setIsProcessing(true);
    setShowResults(false);

    setTimeout(() => {
      const base = inputText.trim() || DEFAULT_GENERATED_COMPLAINT;
      setComplaintText(base.length > 120 ? `${DEFAULT_GENERATED_COMPLAINT}\n\n---\nYour input:\n${base}` : DEFAULT_GENERATED_COMPLAINT);
      setIsProcessing(false);
      setShowResults(true);
      requestAnimationFrame(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }, PROCESSING_MS);
  };

  return (
    <div className="min-h-screen bg-cream">
      <div className="pointer-events-none fixed right-0 top-0 z-0 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-0 z-0 h-72 w-72 rounded-full bg-[#D4A8C7]/20 blur-3xl" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-page space-y-10 px-6 py-8 lg:px-8 lg:py-10">
        <HeroSection
          onRecordingComplete={handleRecordingComplete}
          voiceDisabled={isProcessing}
        />

        <LanguageSelector value={language} onChange={setLanguage} />

        <section id="input-section" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <TextInput value={inputText} onChange={setInputText} />
            <div className="flex flex-col justify-between gap-4">
              <SampleComplaintButtons onSelect={setInputText} />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate || isProcessing}
                className={`w-full cursor-pointer rounded-full py-4 text-base font-medium text-white transition-all duration-200 ${
                  canGenerate && !isProcessing
                    ? 'bg-heading hover:scale-[1.01] hover:bg-[#2D2018] hover:shadow-lg'
                    : 'cursor-not-allowed bg-heading opacity-45'
                }`}
              >
                {isProcessing ? 'Processing…' : 'Generate Complaint →'}
              </button>
            </div>
          </div>
        </section>

        {isProcessing && <ProcessingLoader />}

        {showResults && !isProcessing && (
          <div id="results-section" className="assistant-results-enter space-y-8">
            <ComplaintPreview value={complaintText} onChange={setComplaintText} />
            <DepartmentCard department={DEPARTMENT_INFO} />
            <div className="grid gap-6 lg:grid-cols-2">
              <DocumentChecklist />
              <SubmissionGuide />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <PDFDownloadButton />
              <WhatsAppShareButton />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
