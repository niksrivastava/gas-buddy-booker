import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Package, Clock, CheckCircle, MapPin, CreditCard, Plus } from 'lucide-react';
import Header from '@/components/Header';
import BookingCard from '@/components/BookingCard';
import { getCurrentUser, updateUserAddress } from '@/lib/auth';
import { getBookings, createBooking } from '@/lib/bookings';
import { CylinderType, PaymentMethod } from '@/types/booking';
import { toast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [bookings, setBookings] = useState(getBookings(user?.id));
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAddressOpen, setIsAddressOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [bookingData, setBookingData] = useState<{
    cylinderType: CylinderType;
    quantity: number;
    deliveryAddress: string;
  } | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/auth');
    } else {
      setUser(currentUser);
      setBookings(getBookings(currentUser.id));
    }
  }, [navigate]);

  const handleBookingUpdate = () => {
    if (user) {
      setBookings(getBookings(user.id));
    }
  };

  const handleAddressUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const newAddress = formData.get('address') as string;

    if (updateUserAddress(user.id, newAddress)) {
      setUser(getCurrentUser());
      toast({
        title: 'Address Updated',
        description: 'Your delivery address has been updated successfully.',
      });
      setIsAddressOpen(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const cylinderType = formData.get('cylinderType') as CylinderType;
    const quantity = parseInt(formData.get('quantity') as string);
    const deliveryAddress = formData.get('deliveryAddress') as string;

    setBookingData({ cylinderType, quantity, deliveryAddress });
    setIsBookingOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !bookingData) return;

    const formData = new FormData(e.currentTarget);
    const paymentMethod = formData.get('paymentMethod') as PaymentMethod;

    createBooking(
      user.id,
      bookingData.cylinderType,
      bookingData.quantity,
      bookingData.deliveryAddress,
      paymentMethod
    );

    toast({
      title: 'Booking Confirmed!',
      description: 'Your LPG cylinder will be delivered within 48 hours.',
    });

    setIsPaymentOpen(false);
    setBookingData(null);
    handleBookingUpdate();
  };

  if (!user) return null;

  const activeBookings = bookings.filter(b => b.status !== 'delivered' && b.status !== 'cancelled');
  const completedBookings = bookings.filter(b => b.status === 'delivered' || b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Manage your LPG bookings and deliveries</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeBookings.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookings.filter(b => b.status === 'delivered').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Book New Cylinder
              </CardTitle>
              <CardDescription>Order your LPG cylinder for quick delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    New Booking
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleBookingSubmit}>
                    <DialogHeader>
                      <DialogTitle>Book New Cylinder</DialogTitle>
                      <DialogDescription>Fill in the details for your new booking</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="cylinderType">Cylinder Type</Label>
                        <Select name="cylinderType" required defaultValue="14.2kg">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="14.2kg">14.2kg (₹850)</SelectItem>
                            <SelectItem value="5kg">5kg (₹450)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          name="quantity"
                          type="number"
                          min="1"
                          max="5"
                          defaultValue="1"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deliveryAddress">Delivery Address</Label>
                        <Textarea
                          id="deliveryAddress"
                          name="deliveryAddress"
                          defaultValue={user.address}
                          required
                          rows={3}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Proceed to Payment</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Delivery Address
              </CardTitle>
              <CardDescription>Update your delivery location</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{user.address}</p>
              <Dialog open={isAddressOpen} onOpenChange={setIsAddressOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">Update Address</Button>
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleAddressUpdate}>
                    <DialogHeader>
                      <DialogTitle>Update Delivery Address</DialogTitle>
                      <DialogDescription>Enter your new delivery address</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          name="address"
                          defaultValue={user.address}
                          required
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Address</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Payment Dialog */}
        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent>
            <form onSubmit={handlePayment}>
              <DialogHeader>
                <DialogTitle>Complete Payment</DialogTitle>
                <DialogDescription>Choose your payment method</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <RadioGroup name="paymentMethod" defaultValue="upi" required>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <div className="font-medium">UPI</div>
                      <div className="text-sm text-muted-foreground">Pay via UPI apps</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="font-medium">Card</div>
                      <div className="text-sm text-muted-foreground">Credit or Debit card</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label htmlFor="netbanking" className="flex-1 cursor-pointer">
                      <div className="font-medium">Net Banking</div>
                      <div className="text-sm text-muted-foreground">Pay via your bank</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-muted-foreground">Pay when you receive</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full gap-2">
                  <CreditCard className="w-4 h-4" />
                  Confirm Payment
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Active Bookings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} onUpdate={handleBookingUpdate} />
              ))}
            </div>
          </div>
        )}

        {/* Booking History */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Booking History</h2>
          {completedBookings.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No completed bookings yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedBookings.map(booking => (
                <BookingCard key={booking.id} booking={booking} onUpdate={handleBookingUpdate} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
