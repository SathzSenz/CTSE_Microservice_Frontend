'use client'

import { useState } from 'react'

export default function AddProductPage() {
    const [form, setForm] = useState({
        id: '',
        name: '',
        description: '',
        price: 0,
        mood: '',
        category: '',
        image: '',
        stock: 0,
    })

    function handleChange(e: any) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: any) {
        e.preventDefault()

        try {
            const res = await fetch('http://localhost:8080/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    Role: localStorage.getItem('role') || '',
                },
                body: JSON.stringify({
                    ...form,
                    price: Number(form.price),
                    stock: Number(form.stock),
                }),
            })

            if (!res.ok) throw new Error('Failed')

            alert('Product added successfully ✅')

        } catch (err) {
            console.error(err)
            alert('Error adding product ❌')
        }
    }

    return (
        <div className="p-10 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add Product</h1>

    <form onSubmit={handleSubmit} className="space-y-4">

    <input name="id" placeholder="ID" onChange={handleChange} className="w-full border p-2" />
    <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2" />
    <input name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2" />
    <input name="price" placeholder="Price" type="number" onChange={handleChange} className="w-full border p-2" />
    <input name="category" placeholder="Category" onChange={handleChange} className="w-full border p-2" />
    <input name="mood" placeholder="Mood" onChange={handleChange} className="w-full border p-2" />
    <input name="image" placeholder="Image URL" onChange={handleChange} className="w-full border p-2" />
    <input name="stock" placeholder="Stock" type="number" onChange={handleChange} className="w-full border p-2" />

    <button className="bg-black text-white px-4 py-2 rounded">
        Add Product
    </button>
    </form>
    </div>
)
}