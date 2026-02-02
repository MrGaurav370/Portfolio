import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { productsData } from '../mockShop';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';

const Shop = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(productsData.map(p => p.category))];
  
  const filteredProducts = selectedCategory === 'all'
    ? productsData
    : productsData.filter(p => p.category === selectedCategory);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  const updateQuantity = (id, change) => {
    setCart(cart.map(item =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
    toast({
      title: 'Removed from cart',
      description: 'Item has been removed from your cart.',
    });
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Toaster />
      
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button
                  variant="outline"
                  className="border-[#2a2a2a] text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff]"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Portfolio
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#00d9ff]/10 border border-[#00d9ff]/30 rounded">
                  <ShoppingBag className="text-[#00d9ff]" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Tech Store</h1>
                  <p className="text-sm text-gray-400">Premium electronics & accessories</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Button className="bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold">
                <ShoppingCart size={16} className="mr-2" />
                Cart ({totalItems})
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Categories */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 font-semibold whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-[#00d9ff] text-black'
                      : 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:border-[#00d9ff]/50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="bg-[#1a1a1a] border-[#2a2a2a] overflow-hidden hover:border-[#00d9ff]/50 transition-all duration-300 group"
                >
                  <div className="relative h-64">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.inStock && (
                      <Badge className="absolute top-4 right-4 bg-green-500 text-white">
                        In Stock
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-[#00d9ff] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-500 text-yellow-500" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-400">({product.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-[#00d9ff]">${product.price}</p>
                      <Button
                        onClick={() => addToCart(product)}
                        size="sm"
                        className="bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingCart size={20} className="text-[#00d9ff]" />
                Shopping Cart
              </h2>
              
              {cart.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-3 pb-4 border-b border-[#2a2a2a]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm mb-2">{item.name}</h4>
                          <p className="text-[#00d9ff] font-bold text-sm">${item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 bg-[#0a0a0a] border border-[#2a2a2a] hover:border-[#00d9ff] rounded"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 bg-[#0a0a0a] border border-[#2a2a2a] hover:border-[#00d9ff] rounded"
                            >
                              <Plus size={12} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 ml-auto text-red-500 hover:text-red-400"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span className="font-semibold">Free</span>
                    </div>
                    <div className="border-t border-[#2a2a2a] pt-3 flex justify-between">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-[#00d9ff] text-xl">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Link to="/shop/checkout">
                    <Button className="w-full bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold py-6">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
