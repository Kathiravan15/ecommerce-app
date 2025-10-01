import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProductList from './pages/ProductList'
import CartPage from './pages/CartPage'
import Header from './components/Header'

export default function App(){
  return (
    <div>
      <Header />
      <main style={{padding: '1rem'}}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </main>
    </div>
  )
}
