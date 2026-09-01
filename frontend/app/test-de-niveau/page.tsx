"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestDeNiveau() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-center">GIL&apos;S TEST DE NIVEAU - 30min</h1>
        <p className="text-center text-gray-500 mb-6">Total: 20 points | &gt;=13 = Intermédiaire</p>

        {step === 1 && (
          <div>
            <h2 className="font-bold text-lg">Test 1: Grammaire (6 pts) - VOCAL</h2>
            <p className="text-sm my-2">Traduisez: &quot;Je mange / Je ne mange pas / Est-ce que je mange ?&quot; etc...</p>
            <div className="bg-blue-50 p-3 rounded">
              <p>1. Present Simple: Je mange</p>
              <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded-full">🎤 Enregistrer ma réponse</button>
            </div>
            <button onClick={()=>setStep(2)} className="mt-6 w-full bg-black text-white py-3 rounded">Suivant: Test Topic -&gt;</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-bold text-lg">Test 2: Topic (4 pts) - VOCAL</h2>
            <ul className="list-disc pl-5 my-3 text-sm">
              <li>What is a hobby?</li>
              <li>What are your hobbies?</li>
              <li>How often do you do these hobbies?</li>
              <li>Do you like your hobbies? Why?</li>
            </ul>
            <button className="bg-red-500 text-white px-4 py-2 rounded-full">🎤 Enregistrer mes 4 réponses</button>
            <button onClick={()=>setStep(3)} className="mt-6 w-full bg-black text-white py-3 rounded">Suivant: Test Audio -&gt;</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-bold text-lg">Test 3: Audio Dictée (10 pts)</h2>
            <audio controls className="w-full my-4" src="/audio-test-niveau.mp3" />
            <p className="text-xs">Écoutez et tapez les 10 phrases ici :</p>
            {[1,2,3,4,5,6,7,8,9,10].map(i=>(
              <input key={i} placeholder={`Phrase ${i}`} className="w-full border p-2 rounded mt-2" />
            ))}
            <button onClick={()=>router.push('/resultat')} className="mt-6 w-full bg-green-600 text-white py-3 rounded font-bold">TERMINER LE TEST ✅</button>
          </div>
        )}
      </div>
    </div>
  )
}
