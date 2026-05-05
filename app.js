import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs, updateDoc, addDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCoZWGE0KSklSC_lt4TSCChu0-JsY2-_s8",
    authDomain: "reseller-oktshop17-b36dd.firebaseapp.com",
    projectId: "reseller-oktshop17-b36dd",
    storageBucket: "reseller-oktshop17-b36dd.firebasestorage.app",
    messagingSenderId: "1023487903691",
    appId: "1:1023487903691:web:5d19a6331c9ed5ac43984e",
    measurementId: "G-56NK05F5E4"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 1. Fungsi Login ---
window.login = async () => {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        alert("Login Gagal: " + error.message);
    }
};

// --- 2. Cek Status Login & Role ---
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('user-name-display').innerText = `Hi, ${userData.nama}`;

        if (userData.role === 'admin') {
            document.getElementById('admin-view').classList.remove('hidden');
        } else {
            document.getElementById('reseller-view').classList.remove('hidden');
            document.getElementById('reseller-points').innerText = `${userData.points} Poin`;
            loadCatalog();
        }
    } else {
        document.getElementById('login-page').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }
});

// --- 3. Fungsi Katalog & Poin ---
async function loadCatalog() {
    const querySnapshot = await getDocs(collection(db, "products"));
    const catalogDiv = document.getElementById('catalog-list');
    catalogDiv.innerHTML = '';
    
    querySnapshot.forEach((doc) => {
        const item = doc.data();
        catalogDiv.innerHTML += `
            <div class="product-card">
                <img src="${item.image}" width="100%">
                <h4>${item.nama}</h4>
                <p>Rp ${item.harga}</p>
                <button onclick="pesan(${item.harga})">Beli</button>
                <button onclick="tanyaStok('${item.nama}')">Tanya Stok</button>
            </div>
        `;
    });
}

// Logika Hitung Poin (1000 rupiah = 1 poin)
window.pesan = async (harga) => {
    const poinDidapat = Math.floor(harga / 1000);
    // Di sini tambahkan logika update ke Firestore untuk order dan update poin user
    alert(`Pesanan dibuat! Anda mendapatkan ${poinDidapat} Poin.`);
};

window.tanyaStok = (namaProduk) => {
    window.open(`https://wa.me/NOMOR_ADMIN?text=Halo, apakah stok ${namaProduk} masih ada?`);
};

window.logout = () => signOut(auth);
