const express = require('express')
const fs = require('fs')
const router = express.Router()

const STOCK_FILE = './backend/data/stock.json'

// Helpers
function loadStock() {
  if (!fs.existsSync(STOCK_FILE)) fs.writeFileSync(STOCK_FILE, '[]')
  return JSON.parse(fs.readFileSync(STOCK_FILE))
}

function saveStock(data) {
  fs.writeFileSync(STOCK_FILE, JSON.stringify(data, null, 2))
}

// GET /api/stock/:userId
router.get('/:userId', (req, res) => {
  const stock = loadStock()
  const userStock = stock.filter(p => p.userId == req.params.userId)
  res.json(userStock)
})

// POST /api/stock/:userId
router.post('/:userId', (req, res) => {
  const { name, quantity } = req.body
  const userId = req.params.userId
  const stock = loadStock()
  if (stock.find(p => p.name === name && p.userId == userId)) {
    return res.status(400).json({ message: 'Product already exists' })
  }
  stock.push({ id: Date.now(), userId: Number(userId), name, quantity })
  saveStock(stock)
  res.json({ message: 'Product added' })
})

// PUT /api/stock/:userId/:productId
router.put('/:userId/:productId', (req, res) => {
  const { quantity } = req.body
  const stock = loadStock()
  const product = stock.find(p => p.userId == req.params.userId && p.id == req.params.productId)
  if (!product) return res.status(404).json({ message: 'Product not found' })
  product.quantity = quantity
  saveStock(stock)
  res.json({ message: 'Product updated' })
})

// DELETE /api/stock/:userId/:productId
router.delete('/:userId/:productId', (req, res) => {
  let stock = loadStock()
  const before = stock.length
  stock = stock.filter(p => !(p.userId == req.params.userId && p.id == req.params.productId))
  if (stock.length === before) return res.status(404).json({ message: 'Product not found' })
  saveStock(stock)
  res.json({ message: 'Product deleted' })
})

module.exports = router