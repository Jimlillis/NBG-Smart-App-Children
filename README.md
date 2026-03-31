# NBG-Smart-App-Children

## Γρήγορο run (Dev)

### 1) Backend (FastAPI)

Σε ένα terminal:

```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

Έλεγχος: άνοιξε `http://localhost:8000/` και πρέπει να δεις `{ "status": "ok" ... }`.

### 2) Frontend (Vite)

Σε άλλο terminal:

```powershell
cd frontend
npm install
npm run dev
```

Το frontend κάνει calls μέσω proxy στο backend με prefix `/api` (δες `frontend/vite.config.ts`).