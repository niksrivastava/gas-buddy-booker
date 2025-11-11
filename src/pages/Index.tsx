import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Shield, Clock, Truck, CreditCard, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import { getCurrentUser } from '@/lib/auth';

const Index = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Clock,
      title: 'Quick Booking',
      description: 'Book your LPG cylinder in just 2 minutes',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your cylinder delivered within 48 hours',
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Verified delivery partners for your safety',
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'Pay via UPI, Card, NetBanking, or Cash on Delivery',
    },
    {
      icon: MapPin,
      title: 'Track Your Order',
      description: 'Real-time tracking of your cylinder delivery',
    },
    {
      icon: Flame,
      title: '24/7 Support',
      description: 'Customer support available round the clock',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
              <Flame className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">India's Trusted LPG Booking Platform</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Book Your LPG Cylinder with Ease
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              Fast, reliable, and convenient LPG booking at your fingertips. 
              Get your cylinder delivered in just 48 hours!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="gap-2 shadow-glow"
                onClick={() => navigate('/auth')}
              >
                <Flame className="w-5 h-5" />
                Book Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose BookMyLPG?</h2>
            <p className="text-lg text-muted-foreground">
              Experience seamless LPG booking with our premium features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-all hover:-translate-y-1">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero text-primary-foreground shadow-glow">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of happy customers who trust BookMyLPG for their LPG needs
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="gap-2"
                onClick={() => navigate('/auth')}
              >
                Create Your Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 BookMyLPG. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
