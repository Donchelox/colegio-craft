import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { playSound, speakChileanExpressive, stopSpeaking } from '../../services/audioService';

export default function MinigameModal() {
  const { currentMinigameData, closeModals, addXP, addCoins, showToast } = useGame();

  const [score, setScore] = useState(0);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  // Estados para Memorice
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);

  // Estados para ¿Dónde quedó? (Shell game)
  const [shellRevealed, setShellRevealed] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(1);

  const game = currentMinigameData;

  useEffect(() => {
    if (!game) return;
    setScore(0);
    setCurrentRoundIdx(0);
    setFeedback(null);
    setIsFinished(false);

    if (game.instructions) {
      speakChileanExpressive(game.instructions);
    }

    // Inicializar Memorice si aplica
    if (game.type === 'memory_pairs' && game.pairs) {
      const cards = [];
      game.pairs.forEach(p => {
        cards.push({ ...p, uniqueId: `${p.id}_1` });
        cards.push({ ...p, uniqueId: `${p.id}_2` });
      });
      // Barajar
      cards.sort(() => Math.random() - 0.5);
      setShuffledCards(cards);
      setFlippedCards([]);
      setMatchedPairs([]);
    }

    if (game.type === 'shell_game') {
      setPrizeIndex(Math.floor(Math.random() * 3));
      setShellRevealed(false);
    }
  }, [game]);

  if (!game) return null;

  // Lógica de Odd One Out (El Intruso)
  const handleSelectOdd = (item) => {
    if (feedback) return;

    if (item.isIntruder) {
      playSound('success');
      const newScore = score + 10;
      setScore(newScore);
      setFeedback({ type: 'success', text: item.reason || '¡Correcto! Encontraste al intruso.' });

      setTimeout(() => {
        setFeedback(null);
        if (game.rounds && currentRoundIdx + 1 < game.rounds.length) {
          setCurrentRoundIdx(currentRoundIdx + 1);
        } else {
          finishGame(newScore + 20);
        }
      }, 1800);
    } else {
      playSound('wrong');
      setFeedback({ type: 'error', text: '¡Ese elemento sí pertenece! Intenta con otro.' });
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  // Lógica de Fill in the blank (Completar oración)
  const handleSelectWord = (sentence, option) => {
    if (feedback) return;

    if (option === sentence.answer) {
      playSound('success');
      const newScore = score + 10;
      setScore(newScore);
      setFeedback({ type: 'success', text: '¡Exacto! Esa palabra completa perfectamente la oración.' });

      setTimeout(() => {
        setFeedback(null);
        if (game.sentences && currentRoundIdx + 1 < game.sentences.length) {
          setCurrentRoundIdx(currentRoundIdx + 1);
        } else {
          finishGame(newScore + 20);
        }
      }, 1600);
    } else {
      playSound('wrong');
      setFeedback({ type: 'error', text: 'Esa palabra no calza aquí. ¡Prueba otra!' });
      setTimeout(() => setFeedback(null), 1400);
    }
  };

  // Lógica de Memorice
  const handleFlipCard = (index, card) => {
    if (flippedCards.length >= 2 || flippedCards.includes(index) || matchedPairs.includes(card.id)) return;

    playSound('click');
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const firstCard = shuffledCards[newFlipped[0]];
      const secondCard = shuffledCards[newFlipped[1]];

      if (firstCard.id === secondCard.id) {
        playSound('success');
        const newMatched = [...matchedPairs, firstCard.id];
        setMatchedPairs(newMatched);
        setFlippedCards([]);
        setScore(score + 15);

        if (newMatched.length === (game.pairs?.length || 4)) {
          finishGame(score + 40);
        }
      } else {
        playSound('wrong');
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Lógica de Shell Game (¿Dónde quedó?)
  const handlePickShell = (idx) => {
    if (shellRevealed) return;
    setShellRevealed(true);

    if (idx === prizeIndex) {
      playSound('success');
      setScore(score + 30);
      setFeedback({ type: 'success', text: game.fact || '¡Lo encontraste! ¡Excelente observación!' });
      finishGame(score + 30);
    } else {
      playSound('wrong');
      setFeedback({ type: 'error', text: '¡Estaba en otro lugar! Vuelve a intentarlo.' });
    }
  };

  const finishGame = (finalScore) => {
    setIsFinished(true);
    addXP(finalScore);
    addCoins(Math.floor(finalScore / 2));
    showToast('🏆', `¡Mini-Juego completado! Ganaste ${finalScore} XP`);
    speakChileanExpressive(`¡Felicitaciones! Has completado el mini-juego con éxito. Ganaste ${finalScore} puntos de experiencia.`);
  };

  return (
    <div className="mc-dialog-overlay select-none animate-fadeIn">
      <div className="mc-panel w-full max-w-xl max-h-[92vh] flex flex-col p-4 sm:p-5 shadow-2xl">
        {/* Cabecera */}
        <div className="mc-header-wood p-2.5 rounded flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{game.emoji || '🎮'}</span>
            <div>
              <h2 className="pixel-font text-xs sm:text-sm text-amber-200 font-extrabold tracking-tight">
                {game.title}
              </h2>
              <div className="text-[10px] text-amber-300/80 font-bold">
                {game.mechanicName || 'Mini-Juego Educativo'} • Puntos: {score}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              stopSpeaking();
              playSound('click');
              closeModals();
            }}
            className="mc-btn mc-btn-red text-xs px-2.5 py-1 rounded font-extrabold"
          >
            ✕
          </button>
        </div>

        {/* Instrucciones */}
        <div className="mc-parchment p-2.5 rounded text-xs text-stone-900 mb-3 font-medium">
          {game.instructions}
        </div>

        {/* Feedback dinámico */}
        {feedback && (
          <div
            className={`p-2 rounded text-xs font-bold mb-3 ${
              feedback.type === 'success'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-400'
                : 'bg-rose-100 text-rose-900 border border-rose-400'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* CUERPO DEL JUEGO SEGÚN TIPO */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {isFinished ? (
            <div className="text-center py-6 space-y-4">
              <span className="text-5xl block animate-bounce">🏆</span>
              <h3 className="pixel-font text-sm text-amber-950 font-extrabold">
                ¡DESAFÍO COMPLETADO!
              </h3>
              <p className="text-xs text-stone-700">
                Puntaje obtenido: <strong>{score} Puntos</strong>
              </p>
              <button
                onClick={() => {
                  stopSpeaking();
                  playSound('click');
                  closeModals();
                }}
                className="mc-btn mc-btn-green py-2 px-6 rounded pixel-font text-xs font-extrabold"
              >
                ¡VOLVER AL MUNDO 3D!
              </button>
            </div>
          ) : (
            <>
              {/* 1. ODD ONE OUT */}
              {game.type === 'odd_one_out' && game.rounds && (
                <div>
                  <div className="pixel-font text-[10px] text-stone-800 font-bold mb-2">
                    {game.rounds[currentRoundIdx]?.prompt}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {game.rounds[currentRoundIdx]?.items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOdd(item)}
                        className="mc-btn mc-btn-stone p-3 rounded flex flex-col items-center justify-center gap-1.5 hover:scale-[1.02] transition-transform"
                      >
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="text-[11px] font-bold text-center leading-tight">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. MEMORY PAIRS */}
              {game.type === 'memory_pairs' && (
                <div className="grid grid-cols-4 gap-2">
                  {shuffledCards.map((card, idx) => {
                    const isFlipped = flippedCards.includes(idx) || matchedPairs.includes(card.id);
                    return (
                      <button
                        key={card.uniqueId}
                        onClick={() => handleFlipCard(idx, card)}
                        className={`h-20 sm:h-24 rounded flex flex-col items-center justify-center p-1 transition-all ${
                          isFlipped
                            ? 'bg-amber-100 border-2 border-amber-500 shadow-md scale-95'
                            : 'mc-panel-dark hover:border-amber-400 border border-stone-700'
                        }`}
                      >
                        {isFlipped ? (
                          <>
                            <span className="text-2xl">{card.emoji}</span>
                            <span className="text-[9px] font-bold text-stone-900 text-center leading-tight mt-1">
                              {card.text}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl opacity-60">❓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. FILL IN THE BLANK */}
              {game.type === 'fill_blank' && game.sentences && (
                <div className="space-y-3">
                  <div className="mc-parchment p-3 rounded text-xs font-semibold leading-relaxed">
                    {game.sentences[currentRoundIdx]?.before}{' '}
                    <span className="bg-amber-200 px-2 py-0.5 rounded border border-amber-500 text-amber-950 font-bold">
                      [ ________ ]
                    </span>{' '}
                    {game.sentences[currentRoundIdx]?.after}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {game.sentences[currentRoundIdx]?.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSelectWord(game.sentences[currentRoundIdx], opt)}
                        className="mc-btn mc-btn-stone p-2 rounded text-xs font-bold hover:scale-105"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. SHELL GAME */}
              {game.type === 'shell_game' && (
                <div className="space-y-4 text-center py-2">
                  <p className="text-xs font-bold text-stone-800">
                    ¿En cuál de estos 3 toldos costeros se esconde la balsa?
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[0, 1, 2].map(idx => (
                      <button
                        key={idx}
                        onClick={() => handlePickShell(idx)}
                        className="mc-panel-dark h-28 rounded flex flex-col items-center justify-center p-2 hover:border-amber-400 border border-stone-700"
                      >
                        {shellRevealed ? (
                          idx === prizeIndex ? (
                            <>
                              <span className="text-3xl animate-bounce">{game.prizeEmoji || '🦭'}</span>
                              <span className="text-[10px] text-amber-300 font-bold mt-1">¡Aquí estaba!</span>
                            </>
                          ) : (
                            <span className="text-2xl opacity-40">💨 Vacío</span>
                          )
                        ) : (
                          <>
                            <span className="text-3xl">⛺</span>
                            <span className="text-[10px] text-slate-300 font-bold mt-1">Toldo {idx + 1}</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
