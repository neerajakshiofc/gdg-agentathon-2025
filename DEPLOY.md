Switch to Render (Fast & Free)
Render is also a Cloud platform, and it handles Node.js apps perfectly.

NO credit card needed.
NO billing errors.
Live in 3 minutes.# Budget Beacon Backend

## Quick Deploy to Cloud Run

### Prerequisites
1. Install Google Cloud CLI: https://cloud.google.com/sdk/docs/install
2. Authenticate: `gcloud auth login`
3. Set project: `gcloud config set project budget-beacon-ai-2025`

### Deploy Commands

```bash
# Navigate to backend directory
cd c:\Users\kbhar\GDG_Agentathon-2025\bb\backend

# Build and deploy to Cloud Run
gcloud run deploy budget-beacon-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGO_URI=your_mongodb_atlas_uri,JWT_SECRET=BudgetBeaconBB2,NEWS_API_KEY=pub_7867194728dbccb9aeeba7c883c83f3efe554,GOOGLE_API_KEY=AIzaSyAQftb5dnBEbTBrn_b9LbVnxAr1_srjxs4
```

### Important Notes
- Replace `your_mongodb_atlas_uri` with your actual MongoDB Atlas connection string
- The command will automatically build the Docker image and deploy
- You'll get a URL like: `https://budget-beacon-backend-xxxxx-uc.a.run.app`
