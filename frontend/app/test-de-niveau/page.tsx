"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, MessageCircle, Headphones, Mic, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { submitTestResult } from '@/lib/api';

const steps = [
  { id: 1, label: "Grammaire", icon: BookOpen },
  { id: 2, label: "Topic", icon: MessageCircle },
  { id: 3, label: "Audio", icon: Headphones },
];

// Notes de démo : la correction automatique des réponses vocales / de la dictée
// n'est pas encore implémentée (pas de pipeline speech-to-text). En attendant,
// on envoie des scores fixes au backend, qui calcule le total et le niveau.
const DEMO_SCORES = { grammarScore: 2, topicScore: 2.5, audioScore: 6.5 };

export default function TestDeNiveau() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFinish() {
    const studentId = sessionStorage.getItem("gils_student_id");
    if (!studentId) {
      setError("Session expirée, merci de recommencer depuis /inscription.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { student, paymentLink } = await submitTestResult(studentId, DEMO_SCORES);
      sessionStorage.setItem("gils_niveau", student.level ?? "Débutant");
      sessionStorage.setItem("gils_total", String(student.totalScore ?? 0));
      sessionStorage.setItem("gils_grammar", String(student.grammarScore ?? 0));
      sessionStorage.setItem("gils_topic", String(student.topicScore ?? 0));
      sessionStorage.setItem("gils_audio", String(student.audioScore ?? 0));
      sessionStorage.setItem("gils_payment_token", paymentLink.token);
      router.push('/resultat');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'envoyer le résultat du test.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-center text-slate-900">GIL&apos;S TEST DE NIVEAU - 30min</h1>
        <p className="text-center text-gray-500 mb-6">Total: 20 points | &gt;=13 = Intermédiaire</p>

        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                    done
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : active
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-slate-200 text-slate-300"
                  }`}
                >
                  {done ? <CheckCircle2 size={18} /> : <Icon size={18} />}
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-0.5 w-10 ${step > s.id ? "bg-emerald-500" : "bg-slate-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900">
              <BookOpen size={18} className="text-orange-500" /> Test 1: Grammaire (6 pts) - VOCAL
            </h2>
            <p className="text-sm my-2 text-slate-600">Traduisez: &quot;Je mange / Je ne mange pas / Est-ce que je mange ?&quot; etc...</p>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-slate-700">1. Present Simple: Je mange</p>
              <button className="mt-2 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600">
                <Mic size={16} /> Enregistrer ma réponse
              </button>
            </div>
            <button onClick={()=>setStep(2)} className="mt-6 flex w-full items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-medium hover:bg-slate-800">
              Suivant: Test Topic <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900">
              <MessageCircle size={18} className="text-orange-500" /> Test 2: Topic (4 pts) - VOCAL
            </h2>
            <ul className="list-disc pl-5 my-3 text-sm text-slate-600 space-y-1">
              <li>What is a hobby?</li>
              <li>What are your hobbies?</li>
              <li>How often do you do these hobbies?</li>
              <li>Do you like your hobbies? Why?</li>
            </ul>
            <button className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-600">
              <Mic size={16} /> Enregistrer mes 4 réponses
            </button>
            <button onClick={()=>setStep(3)} className="mt-6 flex w-full items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-medium hover:bg-slate-800">
              Suivant: Test Audio <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2 text-slate-900">
              <Headphones size={18} className="text-orange-500" /> Test 3: Audio Dictée (10 pts)
            </h2>
            <audio controls className="w-full my-4" src="/audio-test-niveau.mp3" />
            <p className="text-xs text-slate-500">Écoutez et tapez les 10 phrases ici :</p>
            {[1,2,3,4,5,6,7,8,9,10].map(i=>(
              <input key={i} placeholder={`Phrase ${i}`} className="w-full border border-slate-300 p-2 rounded-lg mt-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-100" />
            ))}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <button
              onClick={handleFinish}
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? "Envoi en cours..." : "TERMINER LE TEST"}
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
