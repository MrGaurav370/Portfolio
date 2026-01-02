import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { toast } from '../hooks/use-toast';
import { Toaster } from '../components/ui/toaster';

const Checkout = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: 'Order Placed Successfully!',
        description: 'Thank you for your purchase. Your order will be delivered soon.',
      });
      setTimeout(() => navigate('/shop'), 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Toaster />
      
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="container mx-auto px-6 py-4">
          <Link to="/shop">
            <Button
              variant="outline"
              className="border-[#2a2a2a] text-gray-300 hover:border-[#00d9ff] hover:text-[#00d9ff]"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>

      {/* Checkout Form */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Checkout</h1>
            <p className="text-gray-400">Complete your purchase</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Address</label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">City</label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">ZIP Code</label>
                    <Input
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Payment Information */}
            <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-[#00d9ff]" />
                Payment Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Card Number</label>
                  <Input
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                    placeholder="4242 4242 4242 4242"
                    maxLength="19"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Expiry Date</label>
                    <Input
                      name="expiry"
                      value={formData.expiry}
                      onChange={handleChange}
                      required
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">CVV</label>
                    <Input
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                      className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Order Summary */}
            <Card className="bg-[#1a1a1a] border-[#2a2a2a] p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-semibold">$299.97</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="font-semibold text-green-500">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax</span>
                  <span className="font-semibold">$24.00</span>
                </div>
                <div className="border-t border-[#2a2a2a] pt-3 flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-[#00d9ff] text-2xl">$323.97</span>
                </div>
              </div>
            </Card>

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-[#00d9ff] hover:bg-[#00b8e6] text-black font-semibold py-6 text-lg"
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <>
                  <CheckCircle size={20} className="mr-2" />
                  Place Order
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
