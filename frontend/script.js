const API = 'http://localhost:3000/api'

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('registerForm')) {
    document
      .getElementById('registerForm')
      .addEventListener('submit', registerUser)
  }
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', loginUser)
  }
  if (document.getElementById('addProductForm')) {
    document
      .getElementById('addProductForm')
      .addEventListener('submit', addProduct)
    loadProducts()
  }
})

function registerUser(e) {
  e.preventDefault()
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then((res) => res.json())
    .then((data) => {
      alert(data.message)
      if (!data.message.includes('already')) window.location.href = 'login.html'
    })
}

function loginUser(e) {
  e.preventDefault()
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.userId) {
        localStorage.setItem('userId', data.userId)
        window.location.href = 'dashboard.html'
      } else {
        alert(data.message)
      }
    })
}

function logout() {
  localStorage.removeItem('userId')
  window.location.href = 'login.html'
}

function addProduct(e) {
  e.preventDefault()
  const userId = localStorage.getItem('userId')
  const name = document.getElementById('productName').value
  const quantity = parseInt(document.getElementById('productQty').value)
  fetch(`${API}/stock/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, quantity })
  })
    .then((res) => res.json())
    .then(() => {
      document.getElementById('addProductForm').reset()
      loadProducts()
    })
}

function loadProducts() {
  const userId = localStorage.getItem('userId')
  if (!userId) return
  fetch(`${API}/stock/${userId}`)
    .then((res) => res.json())
    .then((products) => {
      const container = document.getElementById('products')
      container.innerHTML = ''
      products.forEach((p) => {
        const div = document.createElement('div')
        div.className = 'product'
        div.innerHTML = `
          <strong>${p.name}</strong> — Qty: ${p.quantity}
          <button onclick="editProduct(${p.id}, '${p.name}', ${p.quantity})">Edit</button>
          <button onclick="deleteProduct(${p.id})">Delete</button>
        `
        container.appendChild(div)
      })
    })
}

function editProduct(id, name, quantity) {
  const newQty = prompt(`Update quantity for "${name}"`, quantity)
  if (newQty !== null) {
    const userId = localStorage.getItem('userId')
    fetch(`${API}/stock/${userId}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: parseInt(newQty) })
    }).then(() => loadProducts())
  }
}

function deleteProduct(id) {
  const userId = localStorage.getItem('userId')
  fetch(`${API}/stock/${userId}/${id}`, {
    method: 'DELETE'
  }).then(() => loadProducts())
}