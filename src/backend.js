// Ponte entre o app e o banco Firebase (Firestore) — empacotado em www/backend.js
import { initializeApp, deleteApp } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, signInAnonymously } from 'firebase/auth';
import {
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
  collection, doc, onSnapshot, setDoc, deleteDoc, arrayUnion,
} from 'firebase/firestore';

let app = null, db = null, unsub = null;

async function start(config, team, onData, onStatus) {
  await stop();
  app = initializeApp(config, 'proc-' + Date.now());
  const auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] });
  try {
    db = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) });
  } catch (e) {
    db = initializeFirestore(app, {});
  }
  onStatus({ state: 'conectando' });
  await signInAnonymously(auth);
  const col = collection(db, 'equipes', team, 'processos');
  unsub = onSnapshot(col, { includeMetadataChanges: true }, snap => {
    const list = snap.docs.map(d => ({ ...d.data(), id: d.id }));
    onData(list);
    onStatus({
      state: snap.metadata.fromCache ? 'offline' : 'online',
      pending: snap.metadata.hasPendingWrites,
    });
  }, err => onStatus({ state: 'erro', message: err.code || err.message }));
}

async function stop() {
  if (unsub) { unsub(); unsub = null; }
  if (app) { try { await deleteApp(app); } catch (e) {} app = null; db = null; }
}

// grava só os campos alterados (merge) para não apagar o que outra pessoa mudou ao mesmo tempo
function save(team, id, patch, note) {
  const data = { ...patch };
  if (note) data.notas = arrayUnion(note);
  return setDoc(doc(db, 'equipes', team, 'processos', id), data, { merge: true });
}

function remove(team, id) {
  return deleteDoc(doc(db, 'equipes', team, 'processos', id));
}

window.FirebaseBackend = { start, stop, save, remove };
