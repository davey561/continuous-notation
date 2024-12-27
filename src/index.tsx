import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import StrokeyMaker from "./StrokeyMaker"
import reportWebVitals from "./reportWebVitals"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import Strokey from "./Strokey"
import Gallery from "./Gallery"
import App from "./App"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA86JEObgsxZ5htBsrA4Ma7PfpzYy6SltY",
  authDomain: "text-to-stroke.firebaseapp.com",
  projectId: "text-to-stroke",
  storageBucket: "text-to-stroke.firebasestorage.app",
  messagingSenderId: "850540986162",
  appId: "1:850540986162:web:1a8848edf8d687dccd612b",
  measurementId: "G-4F9KCWXDBP",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
    {/* <Strokey text="Hello its fun to be playing around with a new form of react component woooohoooohwhoooo" /> */}
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
