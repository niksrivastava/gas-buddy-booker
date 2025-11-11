import { Booking } from '@/types/booking';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Package, CreditCard } from 'lucide-react';
import { getStatusColor, getStatusLabel, cancelBooking } from '@/lib/bookings';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface BookingCardProps {
  booking: Booking;
  onUpdate?: () => void;
}

const BookingCard = ({ booking, onUpdate }: BookingCardProps) => {
  const handleCancel = () => {
    if (booking.status === 'cancelled' || booking.status === 'delivered') {
      toast({
        title: 'Cannot cancel',
        description: 'This booking cannot be cancelled.',
        variant: 'destructive',
      });
      return;
    }

    if (cancelBooking(booking.id)) {
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been cancelled successfully.',
      });
      onUpdate?.();
    }
  };

  return (
    <Card className="shadow-soft hover:shadow-medium transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">Booking #{booking.id.slice(0, 8)}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(booking.createdAt), 'PPP')}
            </p>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {getStatusLabel(booking.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Package className="w-4 h-4 text-muted-foreground" />
          <span>
            {booking.quantity}x {booking.cylinderType} Cylinder
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="line-clamp-1">{booking.deliveryAddress}</span>
        </div>
        {booking.deliveryDate && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Expected: {format(new Date(booking.deliveryDate), 'PPP')}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="capitalize">{booking.paymentMethod}</span>
          <span className="ml-auto font-semibold text-primary">₹{booking.amount}</span>
        </div>
      </CardContent>
      {booking.status !== 'cancelled' && booking.status !== 'delivered' && (
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full text-destructive hover:text-destructive"
            onClick={handleCancel}
          >
            Cancel Booking
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BookingCard;
