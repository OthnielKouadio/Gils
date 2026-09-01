"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const INSCRIPTION_FEE = 25000;

export default function Resultat() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [paying, setPaying] = useState(false);

  const grammaire = 2;
  const topic = 2.5;
  const audio = 6.5;
  const total = grammaire + topic + audio; // 11
  const niveau = total >= 13 ? "Intermédiaire" : "Débutant";

  useEffect(() => {
    setNom(sessionStorage.getItem("gils_nom") ?? "");
  }, []);

  function handlePayment() {
    setPaying(true);
    // Paiement simulé : l'intégration réelle Wave / CinetPay sera branchée dès que
    // les accès marchands + le webhook de confirmation côté backend seront prêts.
    setTimeout(() => {
      sessionStorage.setItem("gils_niveau", niveau);
      sessionStorage.setItem("gils_statut", "ACTIVE");
      router.push("/mon-compte");
    }, 1500);
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white mt-10 border">
      <h1 className="text-center font-bold">GIL&apos;S ENGLISH TRAINING</h1>
      <h2 className="text-center mt-4 font-bold text-lg">RESULTAT DU TEST DE NIVEAU</h2>
      {nom && <p className="text-center text-sm text-gray-500 mt-1">Candidat(e) : {nom}</p>}
      <div className="mt-6 space-y-2">
        <p>Note Grammaire: {grammaire}/6</p>
        <p>Note Topic: {topic}/4</p>
        <p>Note Audio: {audio}/10</p>
        <p className="font-bold text-xl mt-4">Total: {total}/20 = Niveau {niveau}</p>
      </div>
      <div className="mt-8 bg-green-50 p-4 text-center">
        <p className="mb-2">Félicitations ! Vous êtes : {niveau}</p>
        <button
          onClick={handlePayment}
          disabled={paying}
          className="bg-green-600 text-white px-6 py-3 rounded inline-block font-bold disabled:opacity-60"
        >
          {paying ? "Paiement en cours..." : `Payer ${INSCRIPTION_FEE.toLocaleString("fr-FR")}F avec Wave`}
        </button>
        <p className="mt-3 text-xs text-gray-400">
          Paiement simulé pour la démo — branchement CinetPay réel à venir côté backend (OTK).
        </p>
      </div>
    </div>
  );
}
