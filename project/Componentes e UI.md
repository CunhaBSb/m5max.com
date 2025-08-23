# Componentes e UI - M5 Max Produções

## 1. Design System Foundation

### 1.1 Tailwind Configuration
```typescript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ec',
          100: '#fdedd3',
          500: '#f97316', // Laranja pirotécnico
          600: '#ea580c',
          900: '#9a3412'
        },
        secondary: {
          50: '#f8fafc',
          500: '#64748b', // Cinza neutro
          900: '#0f172a'
        },
        accent: {
          gold: '#fbbf24', // Dourado faíscas
          red: '#dc2626',  // Vermelho explosão
          blue: '#2563eb', // Azul chá revelação
          pink: '#ec4899'  // Rosa chá revelação
        },
        safety: {
          green: '#16a34a', // Verde segurança
          warning: '#eab308' // Amarelo atenção
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif']
      },
      animation: {
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 0.6s ease-out',
        'slideInRight': 'slideInRight 0.5s ease-out'
      }
    }
  }
};
```

### 1.2 Component Architecture
```typescript
// Base component types
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

interface InteractiveComponentProps extends BaseComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

interface TrackingProps {
  analytics?: {
    event: string;
    properties?: Record<string, any>;
  };
}
```

## 2. Layout Components

### 2.1 Header Component
```typescript
interface HeaderProps {
  variant: 'default' | 'transparent' | 'sticky';
  showCTA?: boolean;
  audience?: 'b2b' | 'cha' | 'kits' | 'general';
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  variant = 'default',
  showCTA = true,
  audience = 'general',
  className
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <header className={cn(
      'w-full transition-all duration-300 z-50',
      {
        'bg-white/95 backdrop-blur-sm shadow-sm': variant === 'default' || isScrolled,
        'bg-transparent': variant === 'transparent' && !isScrolled,
        'fixed top-0': variant === 'sticky'
      },
      className
    )}>
      {/* Top bar com contato */}
      <div className="hidden lg:block bg-primary-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              (61) 8273-5575
            </span>
            <span className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              contato@m5max.com.br
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span>40+ anos de experiência</span>
            <WhatsAppButton 
              variant="minimal" 
              audience={audience}
              source="header-top"
            />
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo-m5.svg" 
              alt="M5 Max Produções" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink to="/shows-pirotecnicos">Shows Profissionais</NavLink>
            <NavLink to="/cha-revelacao">Chá Revelação</NavLink>
            <NavLink to="/kits">Kits DIY</NavLink>
            <NavLink to="/cases">Portfólio</NavLink>
            <NavLink to="/sobre">Sobre</NavLink>
            <NavLink to="/contato">Contato</NavLink>
          </nav>

          {/* CTA + Mobile menu button */}
          <div className="flex items-center space-x-4">
            {showCTA && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => openConversionModal({ source: 'header', audience })}
                className="hidden lg:flex"
              >
                Solicitar Orçamento
              </Button>
            )}
            
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3 pt-4">
              <MobileNavLink to="/shows-pirotecnicos">Shows Profissionais</MobileNavLink>
              <MobileNavLink to="/cha-revelacao">Chá Revelação</MobileNavLink>
              <MobileNavLink to="/kits">Kits DIY</MobileNavLink>
              <MobileNavLink to="/cases">Portfólio</MobileNavLink>
              <MobileNavLink to="/sobre">Sobre</MobileNavLink>
              <MobileNavLink to="/contato">Contato</MobileNavLink>
              
              {showCTA && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => openConversionModal({ source: 'header-mobile', audience })}
                  className="mt-4"
                >
                  Solicitar Orçamento
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
```

### 2.2 Footer Component
```typescript
interface FooterProps {
  showWhatsApp?: boolean;
  complianceLevel: 'basic' | 'full';
}

const Footer: React.FC<FooterProps> = ({ 
  showWhatsApp = true, 
  complianceLevel = 'basic' 
}) => {
  return (
    <footer className="bg-secondary-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <img src="/logo-m5-white.svg" alt="M5 Max" className="h-10 mb-4" />
            <p className="text-secondary-300 mb-4">
              40+ anos de experiência em pirotecnia profissional. 
              Segurança, qualidade e espetáculo garantidos.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Instagram />} />
              <SocialLink href="#" icon={<YouTube />} />
              <SocialLink href="#" icon={<Facebook />} />
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Serviços</h3>
            <div className="space-y-2">
              <FooterLink to="/shows-pirotecnicos">Shows Profissionais</FooterLink>
              <FooterLink to="/cha-revelacao">Chá Revelação</FooterLink>
              <FooterLink to="/kits">Kits DIY</FooterLink>
              <FooterLink to="/cases">Portfólio</FooterLink>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Suporte</h3>
            <div className="space-y-2">
              <FooterLink to="/faq">FAQ</FooterLink>
              <FooterLink to="/contato">Contato</FooterLink>
              <FooterLink to="/sobre">Sobre Nós</FooterLink>
              <FooterLink to="/legal">Termos Legais</FooterLink>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-primary-500" />
                <span>(61) 8273-5575</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-primary-500" />
                <span>contato@m5max.com.br</span>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 text-primary-500 mt-1" />
                <span>Brasília, DF<br />Atendemos todo o Brasil</span>
              </div>
              
              {showWhatsApp && (
                <WhatsAppButton 
                  variant="outline" 
                  size="sm"
                  audience="general"
                  source="footer"
                  className="mt-4"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-secondary-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-400 text-sm">
              © 2025 M5 Max Produções. Todos os direitos reservados.
            </p>
            
            {complianceLevel === 'full' && (
              <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm">
                <FooterLink to="/legal/privacidade">Privacidade</FooterLink>
                <FooterLink to="/legal/termos">Termos de Uso</FooterLink>
                <FooterLink to="/legal/cookies">Cookies</FooterLink>
                <div className="flex items-center text-safety-green">
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Site Seguro</span>
                </div>
              </div>
            )}
          </div>

          {/* Safety disclaimer */}
          <div className="mt-6 p-4 bg-secondary-800 rounded-lg">
            <p className="text-secondary-300 text-xs">
              <strong className="text-safety-warning">⚠️ Aviso de Segurança:</strong> 
              Produtos pirotécnicos devem ser manuseados apenas por maiores de 18 anos. 
              Siga sempre as instruções de segurança e verifique a regulamentação local. 
              A M5 Max não se responsabiliza pelo uso inadequado dos produtos.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

## 3. Core UI Components

### 3.1 Button Component
```typescript
interface ButtonProps extends InteractiveComponentProps, TrackingProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
  size: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  disabled = false,
  loading = false,
  children,
  className,
  analytics,
  ...props
}) => {
  const handleClick = () => {
    if (analytics) {
      trackEvent(analytics.event, analytics.properties);
    }
    onClick?.();
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        // Variants
        {
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500': variant === 'primary',
          'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500': variant === 'secondary',
          'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white': variant === 'outline',
          'text-primary-600 hover:bg-primary-50': variant === 'ghost',
          'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500': variant === 'whatsapp'
        },
        // Sizes
        {
          'px-3 py-1.5 text-sm rounded-md': size === 'sm',
          'px-4 py-2 text-base rounded-lg': size === 'md',
          'px-6 py-3 text-lg rounded-lg': size === 'lg',
          'px-8 py-4 text-xl rounded-xl': size === 'xl'
        },
        // States
        {
          'opacity-50 cursor-not-allowed': disabled || loading,
          'w-full': fullWidth
        },
        className
      )}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader className="w-4 h-4 animate-spin mr-2" />}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};
```

### 3.2 Card Component
```typescript
interface CardProps extends BaseComponentProps {
  variant: 'default' | 'elevated' | 'outlined' | 'glass';
  padding: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  onClick,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-lg transition-all duration-200',
        // Variants
        {
          'bg-white border border-gray-200': variant === 'default',
          'bg-white shadow-lg border border-gray-100': variant === 'elevated',
          'bg-transparent border-2 border-gray-300': variant === 'outlined',
          'bg-white/80 backdrop-blur-sm border border-white/20': variant === 'glass'
        },
        // Padding
        {
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
          'p-12': padding === 'xl'
        },
        // Interactive states
        {
          'hover:shadow-xl hover:-translate-y-1 cursor-pointer': hover && onClick,
          'hover:shadow-lg': hover && !onClick
        },
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};
```

## 4. Conversion Components

### 4.1 Conversion Modal
```typescript
interface ConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  audience: 'b2b' | 'cha' | 'kits' | 'general';
  source: 'header' | 'hero' | 'cta' | 'exit-intent';
  context?: {
    page: string;
    eventType?: string;
    productId?: string;
  };
}

const ConversionModal: React.FC<ConversionModalProps> = ({
  isOpen,
  onClose,
  audience,
  source,
  context
}) => {
  const [selectedOption, setSelectedOption] = useState<'whatsapp' | 'form' | null>(null);

  useEffect(() => {
    if (isOpen) {
      trackEvent('conversion_modal_open', { source, audience, page: context?.page });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {getModalTitle(audience)}
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            {getModalDescription(audience)}
          </DialogDescription>
        </DialogHeader>

        {!selectedOption ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* WhatsApp Option */}
            <Card
              variant="outlined"
              padding="lg"
              hover
              onClick={() => setSelectedOption('whatsapp')}
              className="text-center border-green-200 hover:border-green-400"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold">WhatsApp</h3>
                <p className="text-gray-600">
                  Atendimento rápido e personalizado
                </p>
                <Badge variant="success">Resposta em minutos</Badge>
              </div>
            </Card>

            {/* Form Option */}
            <Card
              variant="outlined"
              padding="lg"
              hover
              onClick={() => setSelectedOption('form')}
              className="text-center border-blue-200 hover:border-blue-400"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">Formulário</h3>
                <p className="text-gray-600">
                  Orçamento detalhado em até 24h
                </p>
                <Badge variant="info">Mais informações</Badge>
              </div>
            </Card>
          </div>
        ) : selectedOption === 'whatsapp' ? (
          <WhatsAppRedirect 
            audience={audience} 
            context={context} 
            onBack={() => setSelectedOption(null)}
          />
        ) : (
          <QualificationForm 
            audience={audience} 
            context={context}
            onBack={() => setSelectedOption(null)}
            onSubmit={(data) => {
              trackEvent('lead_form_submit', { audience, source, ...data });
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
```

### 4.2 WhatsApp Button
```typescript
interface WhatsAppButtonProps extends ButtonProps {
  message?: string;
  audience: 'b2b' | 'cha' | 'kits' | 'general';
  source: string;
  context?: Record<string, any>;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  audience,
  source,
  context = {},
  variant = 'whatsapp',
  size = 'md',
  children = 'WhatsApp',
  ...props
}) => {
  const attribution = useAttribution();
  
  const handleWhatsAppClick = () => {
    const finalMessage = message || getDefaultMessage(audience, context);
    const whatsappUrl = generateWhatsAppURL(finalMessage, attribution.utm, { audience, source });
    
    trackEvent('whatsapp_click', {
      source,
      audience,
      utm_preserved: !!attribution.utm,
      ...context
    });

    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      variant={variant}
      size={size}
      icon={<MessageCircle className="w-4 h-4" />}
      onClick={handleWhatsAppClick}
      {...props}
    >
      {children}
    </Button>
  );
};
```

## 5. Content Components

### 5.1 Video Player
```typescript
interface VideoPlayerProps {
  youtubeId: string;
  title: string;
  thumbnail?: string;
  autoplay?: boolean;
  controls?: boolean;
  trackingEvents?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  youtubeId,
  title,
  thumbnail,
  autoplay = false,
  controls = true,
  trackingEvents = true,
  className
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const playerRef = useRef<any>(null);

  const onPlayerReady = (event: any) => {
    playerRef.current = event.target;
  };

  const onPlayerStateChange = (event: any) => {
    if (trackingEvents) {
      switch (event.data) {
        case YT.PlayerState.PLAYING:
          setIsPlaying(true);
          if (!hasStarted) {
            trackEvent('video_start', { video_id: youtubeId, video_title: title });
            setHasStarted(true);
          }
          break;
        case YT.PlayerState.PAUSED:
          setIsPlaying(false);
          break;
        case YT.PlayerState.ENDED:
          trackEvent('video_complete', { video_id: youtubeId, video_title: title });
          break;
      }
    }
  };

  return (
    <div className={cn('relative aspect-video rounded-lg overflow-hidden', className)}>
      {!isPlaying && thumbnail && (
        <div 
          className="absolute inset-0 bg-cover bg-center cursor-pointer group"
          style={{ backgroundImage: `url(${thumbnail})` }}
          onClick={() => setIsPlaying(true)}
        >
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        </div>
      )}
      
      <YouTube
        videoId={youtubeId}
        opts={{
          height: '100%',
          width: '100%',
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            controls: controls ? 1 : 0,
            modestbranding: 1,
            rel: 0
          }
        }}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
        className="absolute inset-0"
      />
    </div>
  );
};
```

### 5.2 Product Card
```typescript
interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price?: string;
    originalPrice?: string;
    features: string[];
    image: string;
    badge?: string;
    audience: 'cha' | 'kits';
  };
  onSelect: () => void;
  variant?: 'default' | 'featured';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  variant = 'default'
}) => {
  const trackProductView = () => {
    trackEvent('view_item', {
      item_id: product.id,
      item_name: product.name,
      item_category: product.audience,
      price: parseFloat(product.price?.replace(/[^\d]/g, '') || '0'),
      currency: 'BRL'
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackProductView();
        }
      },
      { threshold: 0.5 }
    );

    const cardElement = document.getElementById(`product-${product.id}`);
    if (cardElement) observer.observe(cardElement);

    return () => observer.disconnect();
  }, []);

  return (
    <Card
      id={`product-${product.id}`}
      variant={variant === 'featured' ? 'elevated' : 'default'}
      padding="none"
      hover
      onClick={onSelect}
      className={cn(
        'overflow-hidden group',
        variant === 'featured' && 'ring-2 ring-primary-500 scale-105'
      )}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.badge && (
          <Badge 
            variant="success" 
            className="absolute top-4 left-4"
          >
            {product.badge}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            {product.price && (
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-primary-600">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>
            )}
          </div>
          
          <Button
            variant="primary"
            size="md"
            onClick={(e) => {
              e.stopPropagation();
              trackEvent('select_item', {
                item_id: product.id,
                item_name: product.name,
                audience: product.audience
              });
              onSelect();
            }}
          >
            Escolher
          </Button>
        </div>
      </div>
    </Card>
  );
};
```

## 6. Form Components

### 6.1 Form Field
```typescript
interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'tel' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  error?: string;
  description?: string;
  value?: any;
  onChange?: (value: any) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  options = [],
  error,
  description,
  value,
  onChange,
  ...props
}) => {
  const fieldId = `field-${name}`;

  const renderInput = () => {
    const baseClasses = cn(
      'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all',
      error ? 'border-red-500' : 'border-gray-300'
    );

    switch (type) {
      case 'select':
        return (
          <select 
            id={fieldId}
            className={baseClasses}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            {...props}
          >
            <option value="">{placeholder || `Selecione ${label.toLowerCase()}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {options.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange?.(e.target.value)}
                  className="mr-3 text-primary-600 focus:ring-primary-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => onChange?.(e.target.checked)}
              className="mt-1 mr-3 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm">{description}</span>
          </label>
        );

      case 'textarea':
        return (
          <textarea
            id={fieldId}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            rows={4}
            className={baseClasses}
            {...props}
          />
        );

      case 'file':
        return (
          <input
            type="file"
            id={fieldId}
            onChange={(e) => onChange?.(e.target.files)}
            className={baseClasses}
            {...props}
          />
        );

      default:
        return (
          <input
            type={type}
            id={fieldId}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={baseClasses}
            {...props}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderInput()}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {description && type !== 'checkbox' && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};
```

## 7. Analytics Components

### 7.1 Page Tracker
```typescript
interface PageTrackerProps {
  pageName: string;
  audience: 'b2b' | 'cha' | 'kits' | 'general';
  category?: string;
}

const PageTracker: React.FC<PageTrackerProps> = ({ 
  pageName, 
  audience, 
  category 
}) => {
  const location = useLocation();
  const attribution = useAttribution();

  useEffect(() => {
    // Track page view
    trackEvent('page_view', {
      page_category: audience,
      page_slug: location.pathname,
      page_title: document.title,
      ...attribution.utm
    });

    // Update dataLayer for GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_context',
      page_category: audience,
      page_slug: location.pathname,
      page_title: document.title
    });

    // Scroll depth tracking
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const scrollPercent = (scrolled / scrollHeight) * 100;

      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        if (scrollPercent >= 50 && maxScrollDepth < 50) {
          trackEvent('scroll_depth_50', { page_slug: location.pathname });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location, audience]);

  return null; // This is a tracking-only component
};
```

## 8. Utility Components

### 8.1 Loading States
```typescript
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ 
  size = 'md' 
}) => (
  <div className={cn(
    'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
    {
      'w-4 h-4': size === 'sm',
      'w-8 h-8': size === 'md',
      'w-12 h-12': size === 'lg'
    }
  )} />
);

const LoadingSkeleton: React.FC<{ 
  className?: string;
  lines?: number;
}> = ({ className, lines = 3 }) => (
  <div className={cn('animate-pulse space-y-3', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i}
        className="h-4 bg-gray-200 rounded"
        style={{ width: `${Math.random() * 40 + 60}%` }}
      />
    ))}
  </div>
);
```

### 8.2 SEO Components
```typescript
interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
  schema?: any;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  ogImage = '/og-default.jpg',
  canonical,
  schema
}) => {
  const fullTitle = `${title} | M5 Max Produções`;
  const currentUrl = window.location.href;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};
```

---

*Este sistema de componentes fornece a base sólida para desenvolvimento da interface do website M5 Max Produções, com foco em conversão, usabilidade e tracking de analytics.*