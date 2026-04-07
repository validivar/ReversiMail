reversimail/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── [auth0]/route.js          (Auth0 dynamic route)
│   │   ├── gmail/
│   │   │   ├── read/route.js
│   │   │   ├── draft/route.js
│   │   │   └── send/route.js
│   │   ├── token/
│   │   │   └── revoke/route.js
│   │   └── classify/route.js
│   ├── dashboard/
│   │   └── page.jsx
│   ├── layout.jsx
│   ├── page.jsx
│   └── globals.css
├── components/
│   ├── ChatInterface.jsx
│   ├── AgentPassport.jsx
│   └── StepUpModal.jsx
├── lib/
│   ├── auth0.js
│   ├── gmail.js
│   └── tokenVault.js
├── public/
│   └── demo-screenshot.png
├── .env.local
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md