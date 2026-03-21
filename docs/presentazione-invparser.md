# InvParser — contenuti per presentazione

Usa questo file come **scaletta**: ogni `---` separa una diapositiva.  
**Google Slides:** Nuova presentazione → incolla titolo e punti elenco per slide.  
**PowerPoint:** Stesso procedimento, oppure *Home → Nuova diapositiva → Layout titolo e contenuto*.

**Suggerimento visivo:** 1 slide = 1 blocco sotto; massimo 5–6 bullet per slide.

---

## Slide 1 — Titolo

**InvParser**  
*Estrazione e gestione dati da fatture PDF*

Sottotitolo (facoltativo): Progetto full-stack · AI + validazione · Dashboard

---

## Slide 2 — Il problema

- Le fatture in PDF richiedono spesso **inserimento manuale** in fogli o gestionali  
- Errori di copia, tempi lunghi, difficoltà a **centralizzare** fornitori e scadenze  
- Serve uno strumento che **estragga struttura** (importi, IVA, date) in modo ripetibile  

---

## Slide 3 — La soluzione (InvParser)

- **Upload** di PDF fattura (drag & drop, anche multipli)  
- **Classificazione** del tipo documento e sottotipo (es. professionista, standard, reverse charge)  
- **Estrazione strutturata** con OpenAI + suggerimenti da regex sul testo  
- **Dashboard** e lista documenti con filtri, tag, export  

---

## Slide 4 — Architettura (high level)

| Componente | Tecnologia |
|------------|------------|
| Frontend | React 19, Vite, Tailwind, Redux |
| Backend | Node.js, Express 5 |
| Dati | MySQL 8 |
| Coda elaborazione | BullMQ + Redis |
| AI | OpenAI API (classificazione + parsing semantico) |

---

## Slide 5 — Flusso elaborazione PDF

1. Estrazione **testo** dal PDF (`pdf-parse`)  
2. **Regex** per hint (importi, date, P.IVA, …)  
3. **OpenAI**: tipo documento + JSON con campi e **confidence**  
4. **Regole di validazione** (coerenza aritmetica, contesto fiscale)  
5. Salvataggio risultato, fornitore, tag scadenze, notifica utente  

---

## Slide 6 — Funzionalità utente

- **Autenticazione**: email/password, Google OAuth, verifica email  
- **Documenti**: stato (pending / processing / done / failed), retry, eliminazione bulk  
- **Alert**: categorie (tipo documento, coerenza importi, qualità dati, incertezza modello)  
- **Fornitori** e **tag** (es. scadenze, pagato)  
- **Export** CSV / Excel con link al documento  

---

## Slide 7 — Qualità e affidabilità

- Validazione **deterministica** su totali, IVA, ritenute (per sottotipo)  
- Nessun “aliquota IVA italiana = unica verità” per non penalizzare fatture estere  
- Controllo **firma file** `%PDF` in upload  
- **Health check** `GET /api/health` (MySQL + Redis) per monitoraggio  
- Header di sicurezza con **Helmet** sull’API  

---

## Slide 8 — Limiti noti (onestà tecnica)

- PDF **solo immagine** (scanner senza OCR): poco testo → estrazione debole (avviso in app)  
- Dipendenza da **OpenAI** (chiave, quota, rete); fallback esplicito e flag “extraction failed”  
- Antivirus sui file upload non incluso (come molte web app; hardening opzionale)  

---

## Slide 9 — Test e repository

- Test **Vitest** su backend (validazione, PDF magic) e frontend (utility)  
- Migrazione DB unificata in `backend/migrations/db.sql`  
- Documentazione API in `docs/API.md`  
- Deploy orientato a **Railway** (Nixpacks) + frontend statico (es. Vite build)  

---

## Slide 10 — Conclusioni / Q&A

- InvParser riduce il lavoro manuale su **fatture PDF** con pipeline **AI + regole**  
- Progetto **estendibile**: nuovi sottotipi, export, integrazioni  
- **MIT License** · Repository: *github.com/brandijsen/invParser*  

**Grazie — domande?**

---

### Note per il presentatore

- Durata consigliata: **10–15 minuti** (salta Slide 8 in pitch “commerciale”).  
- Demo live: caricare una fattura di test e mostrare dashboard + alert categorizzati.  
- Se l’audience è non tecnica, riduci Slide 4–5 a un solo schema “PDF → cloud → dati in tabella”.
