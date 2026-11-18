import {useEffect, useState} from "react"
import "../styles/game-results.css"

const scoringRules = {
  "2048": "Pisteitä kertyy yhdistetyistä laatoista niiden arvon verran.",
  guess: "Pisteet = 10 000 ÷ arvausten määrä.",
  memory: "Pisteet = 10 000 × parien määrä ÷ siirtojen määrä.",
  mahjong: "Pisteet = 10 000 × parien määrä ÷ yritysten määrä.",
}

const GameResults = ({game, score, complete, round}) => {
  const [scores, setScores] = useState([])
  const [playerName, setPlayerName] = useState("")
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    let active = true

    fetch(`/api/scores?game=${encodeURIComponent(game)}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Tuloslistan lataaminen epäonnistui.")
        return response.json()
      })
      .then((results) => {
        if (active) setScores(results)
      })
      .catch(() => {
        if (active) setMessage("Tuloslistaa ei saatu ladattua.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [game])

  useEffect(() => {
    setPlayerName("")
    setSaved(false)
    setMessage("")
  }, [round])

  const saveScore = async (event) => {
    event.preventDefault()
    const trimmedName = playerName.trim()
    if (!trimmedName || saving) return

    setSaving(true)
    setMessage("")
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({game, playerName: trimmedName, score}),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Tuloksen tallentaminen epäonnistui.")

      setScores((currentScores) =>
        [...currentScores, result]
          .sort((first, second) => second.score - first.score)
          .slice(0, 100),
      )
      setSaved(true)
      setMessage("Tulos tallennettu.")
    } catch (error) {
      setMessage(error.message || "Tuloksen tallentaminen epäonnistui.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="game-results" aria-labelledby={`${game}-results-title`}>
      <h3 id={`${game}-results-title`}>Tuloslista</h3>
      <p className="game-results-rule">Pisteytys: {scoringRules[game]}</p>

      {complete && !saved && (
        <form className="game-results-form" onSubmit={saveScore}>
          <label htmlFor={`${game}-player-name`}>Nimi</label>
          <input
            id={`${game}-player-name`}
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            maxLength={40}
            autoComplete="name"
            required
          />
          <button type="submit" disabled={saving || !playerName.trim()}>
            {saving ? "Tallennetaan..." : `Tallenna ${score} pistettä`}
          </button>
        </form>
      )}

      {message && <p className="game-results-message" role="status">{message}</p>}

      {loading ? (
        <p>Ladataan tuloksia...</p>
      ) : scores.length === 0 ? (
        <p>Ei vielä tuloksia.</p>
      ) : (
        <ol className="game-results-list">
          {scores.map((result) => (
            <li key={result.id}>
              <span>{result.player_name}</span>
              <strong>{result.score}</strong>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default GameResults