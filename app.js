// Firebaseの初期化
const firebaseConfig = {
  apiKey: "AIzaSyC_Wz5FBQ70dZachJVIu9SgS-OSW6Wm9mA",
  authDomain: "maptestproject-bde89.firebaseapp.com",
  projectId: "maptestproject-bde89",
  storageBucket: "maptestproject-bde89.firebasestorage.app",
  messagingSenderId: "448505018336",
  appId: "1:448505018336:web:4d68b115f66d71af5c1d85",
  measurementId: "G-779EVBJVLY"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ログイン処理
document.getElementById("loginBtn").onclick = async () => {
  const user = await auth.signInAnonymously();
  alert("ログインしました：" + user.user.uid);
};

// マップ初期化
window.initMap = function () {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 35.6812, lng: 139.7671 },
    zoom: 15,
  });

  const drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      drawingModes: ["polygon"],
    },
  });
  drawingManager.setMap(map);

  google.maps.event.addListener(drawingManager, "overlaycomplete", function (event) {
    const coords = event.overlay.getPath().getArray().map(p => ({
      lat: p.lat(),
      lng: p.lng()
    }));
    const memo = prompt("メモを入力してください：");
    savePolygon(coords, memo);
  });
};

// 保存処理
async function savePolygon(coords, memo) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("ログインしてください！");
    return;
  }
  await db.collection("polygons").add({
    userId: user.uid,
    polygon: coords,
    memo: memo,
    createdAt: new Date()
  });
  alert("保存しました！");
}

// Google Maps APIのコールバック
window.addEventListener("load", () => {
  if (typeof google !== "undefined") window.initMap();
});
