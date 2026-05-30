// functions/redirect.js
// Netlify Function — recebe /r/CODIGO e redireciona para a URL original

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Inicializa Firebase Admin (apenas uma vez)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: "encurtador-957e6",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

exports.handler = async (event) => {
  const path = event.path; // ex: /.netlify/functions/redirect/abc123
  const parts = path.split('/');
  const codigo = parts[parts.length - 1];

  if (!codigo || codigo.length !== 6) {
    return {
      statusCode: 400,
      body: 'Código inválido.',
    };
  }

  try {
    const snap = await db.collection('links').doc(codigo).get();

    if (!snap.exists) {
      return {
        statusCode: 404,
        body: '🔗 Link não encontrado ou expirado.',
      };
    }

    const { url } = snap.data();

    return {
      statusCode: 302,
      headers: { Location: url },
      body: '',
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: 'Erro interno.',
    };
  }
};
