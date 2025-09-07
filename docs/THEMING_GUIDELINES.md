# THEMING GUIDELINES - M5 MAX DESIGN SYSTEM

> **Purpose**: Comprehensive guide to the M5 Max theming system, providing clear guidelines for consistent visual implementation across the application.

## OVERVIEW

The M5 Max theming system is built around the concept of **professional pyrotechnics**, combining safety, technical expertise, and spectacular visual impact. All design decisions reflect these core values through carefully chosen colors, gradients, and visual effects.

**Source Reference**: `src/index.css:43-78` + `tailwind.config.ts:106-124`

---

## COLOR PALETTE

### Fire Color Family

The core brand colors representing the pyrotechnic expertise and visual impact:

```css
/* Primary Fire Colors - src/index.css:44-47 */
--fire-red: 0 85% 60%;        /* HSL(0, 85%, 60%) - #E63946 */
--fire-orange: 15 85% 58%;    /* HSL(15, 85%, 58%) - #F77F00 */ 
--fire-gold: 45 100% 70%;     /* HSL(45, 100%, 70%) - #FFD60A */
--fire-yellow: 50 100% 75%;   /* HSL(50, 100%, 75%) - #FFF3B0 */
```

**Usage Guidelines**:
- **fire-red**: Primary CTAs, urgent actions, high-impact elements
- **fire-orange**: Primary brand color, main accent, buttons, highlights  
- **fire-gold**: Premium elements, success states, golden accents
- **fire-yellow**: Subtle highlights, background accents, soft emphasis

### Tech Color Family

Professional technical colors representing precision and reliability:

```css
/* Tech Colors - src/index.css:49-50 */
--tech-blue: 210 45% 50%;      /* HSL(210, 45%, 50%) - #4682B4 */
--tech-blue-light: 210 35% 75%; /* HSL(210, 35%, 75%) - #A4C2E4 */
```

**Usage Guidelines**:
- **tech-blue**: Secondary buttons, professional elements, technical sections
- **tech-blue-light**: Soft accents, hover states, disabled states

### Metal Color Family  

Sophisticated neutral tones providing depth and professionalism:

```css
/* Metal Colors - src/index.css:52-53 */
--metal-silver: 220 10% 25%;   /* HSL(220, 10%, 25%) - #3D404A */
--metal-platinum: 220 10% 15%; /* HSL(220, 10%, 15%) - #26282E */
```

**Usage Guidelines**:
- **metal-silver**: Card backgrounds, subtle borders, secondary text
- **metal-platinum**: Deep backgrounds, section dividers, subtle elements

### Safety Color Family

Safety-focused colors for critical communications:

```css
/* Safety Colors - tailwind.config.ts:122-124 */
safety: {
  green: '#16a34a',   /* Success, safety confirmed */
  warning: '#eab308'  /* Caution, attention required */
}
```

---

## GRADIENTS SYSTEM

### Custom CSS Gradients

Professional gradient definitions for complex visual effects:

```css
/* Custom Gradients - src/index.css:56-59 */
--gradient-fire: linear-gradient(135deg, hsl(var(--fire-red)), hsl(var(--fire-orange)), hsl(var(--fire-gold)));
--gradient-tech: linear-gradient(135deg, hsl(var(--tech-blue)), hsl(var(--tech-blue-light)));
--gradient-hero: linear-gradient(135deg, hsl(var(--background)), hsl(var(--metal-platinum)));
--gradient-sparkle: radial-gradient(circle, hsl(var(--fire-gold) / 0.2), transparent);
```

### Gradient Usage Patterns

#### Fire Gradient
```css
.gradient-fire {
  background: var(--gradient-fire);
}
```
**Use Cases**: Primary CTAs, hero buttons, brand elements, high-impact visuals

#### Tech Gradient  
```css
.gradient-tech {
  background: var(--gradient-tech);
}
```
**Use Cases**: Secondary buttons, professional elements, technical sections

#### Hero Gradient
```css
.gradient-hero {
  background: var(--gradient-hero);
}
```
**Use Cases**: Hero sections, page backgrounds, subtle depth

#### Sparkle Gradient
```css
.gradient-sparkle {
  background: var(--gradient-sparkle);
}
```
**Use Cases**: Decorative elements, hover effects, subtle highlights

---

## SHADOW SYSTEM

### Shadow Definitions

Three-tier shadow system providing appropriate depth for different element types:

```css
/* Shadow System - src/index.css:62-64 */
--shadow-fire: 0 10px 30px -5px hsl(var(--fire-orange) / 0.3);
--shadow-tech: 0 8px 25px -8px hsl(var(--tech-blue) / 0.2);  
--shadow-elegant: 0 4px 20px -4px hsl(220 15% 20% / 0.1);
```

### Shadow Usage Guidelines

#### Fire Shadow
```css
.shadow-fire {
  box-shadow: var(--shadow-fire);
}
```
**Use Cases**: Primary buttons, important CTAs, fire-themed elements

#### Tech Shadow
```css
.shadow-tech {
  box-shadow: var(--shadow-tech);
}
```
**Use Cases**: Technical elements, secondary buttons, professional cards

#### Elegant Shadow
```css
.shadow-elegant {
  box-shadow: var(--shadow-elegant);
}
```
**Use Cases**: Cards, modals, subtle elevation, general UI elements

---

## SPACING SYSTEM

### Professional Spacing Variables

Consistent spacing system for layout harmony:

```css
/* Professional Spacing System - src/index.css:67-73 */
--spacing-section: 5rem;      /* 80px - between major sections */
--spacing-component: 2.5rem;  /* 40px - between components */
--spacing-element: 1.5rem;    /* 24px - between elements */
--spacing-separator-minimal: 0.75rem;   /* 12px - minimal separation */
--spacing-separator-subtle: 1rem;       /* 16px - subtle separation */
--spacing-separator-standard: 1.5rem;   /* 24px - standard separation */
--spacing-separator-emphasis: 2rem;     /* 32px - emphasis separation */
```

**Usage Guidelines**:
- Use spacing variables for consistent vertical rhythm
- Apply appropriate separation based on content hierarchy
- Maintain visual breathing room without excessive whitespace

---

## ANIMATION SYSTEM

### Transition Definitions

Two primary transition styles for different interaction types:

```css
/* Refined Animations - src/index.css:76-77 */
--transition-smooth: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
--transition-bounce: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Animation Usage Guidelines

#### Smooth Transitions
```css
.transition-smooth {
  transition: var(--transition-smooth);
}
```
**Use Cases**: Hover effects, color changes, subtle interactions

#### Bounce Transitions  
```css
.transition-bounce {
  transition: var(--transition-bounce);
}
```
**Use Cases**: Button interactions, playful elements, emphasis effects

---

## BUTTON THEMING

### M5 Max Button Variants

Professional button system implementing the M5 Max theming:

```typescript
// Button Variants - src/shared/ui/button.variants.ts:17-22
fire: "gradient-fire text-white shadow-fire hover:scale-105 transition-bounce font-semibold"
tech: "gradient-tech text-white shadow-tech hover:shadow-lg transition-smooth"  
hero: "bg-fire-orange text-white shadow-fire hover:bg-fire-red hover:shadow-lg hover:scale-105"
whatsapp: "bg-green-500 text-white hover:bg-green-600 shadow-elegant"
cta: "bg-fire-red text-white shadow-fire hover:bg-fire-orange hover:scale-105"
"outline-fire": "border-2 border-fire-orange/50 text-white bg-transparent hover:border-fire-orange hover:bg-fire-orange/15"
```

### Button Usage Matrix

| Variant | Use Case | Visual Impact | Interaction |
|---------|----------|---------------|-------------|
| **fire** | Primary CTAs, brand buttons | High impact, gradient | Bounce scale |
| **tech** | Technical sections, secondary | Professional, gradient | Smooth |
| **hero** | Hero sections, landing pages | Strong presence | Bounce scale |
| **whatsapp** | WhatsApp integration | Brand recognition | Smooth |
| **cta** | Call-to-action, conversions | High urgency | Bounce scale |
| **outline-fire** | Secondary CTAs, subtle actions | Clean, professional | Smooth fill |

---

## IMPLEMENTATION BEST PRACTICES

### CSS Variable Usage

Always use CSS variables for theming to ensure consistency:

```css
/* ✅ CORRECT - Using CSS variables */
.custom-element {
  background: hsl(var(--fire-orange));
  box-shadow: var(--shadow-fire);
  transition: var(--transition-smooth);
}

/* ❌ INCORRECT - Hardcoded values */
.custom-element {
  background: #F77F00;
  box-shadow: 0 10px 30px -5px rgba(247, 127, 0, 0.3);
  transition: all 0.2s ease;
}
```

### Tailwind Integration

Leverage Tailwind's opacity modifiers with HSL variables:

```jsx
{/* ✅ CORRECT - Tailwind with opacity */}
<div className="bg-fire-orange/10 border-fire-gold/30 text-fire-orange">
  Content with proper theming
</div>

{/* ✅ CORRECT - CSS variable classes */}  
<button className="gradient-fire shadow-fire transition-bounce">
  Themed Button
</button>
```

### Accessibility Considerations

Ensure sufficient contrast ratios for all color combinations:

- **Fire colors on dark backgrounds**: Always use white text
- **Tech colors with content**: Verify contrast ratio ≥ 4.5:1
- **Metal colors**: Suitable for subtle UI elements only
- **Safety colors**: High contrast for critical information

### Component Theming Pattern

Establish consistent theming patterns for components:

```tsx
// Component theming pattern example
const ThemedCard = ({ variant = 'default', children }) => {
  const variants = {
    default: 'bg-card border-border',
    fire: 'bg-gradient-to-br from-fire-orange/10 to-fire-gold/5 border-fire-orange/20',
    tech: 'bg-gradient-to-br from-tech-blue/10 to-tech-blue-light/5 border-tech-blue/20',
    elegant: 'bg-card/80 backdrop-blur-sm border-border/50 shadow-elegant'
  };

  return (
    <div className={cn('rounded-lg p-6 transition-smooth', variants[variant])}>
      {children}
    </div>
  );
};
```

---

## THEMING CHECKLIST

When implementing new UI elements, verify:

- [ ] **Colors**: Uses CSS variables instead of hardcoded hex values
- [ ] **Gradients**: Leverages predefined gradient variables when appropriate  
- [ ] **Shadows**: Applies appropriate shadow tier (fire/tech/elegant)
- [ ] **Spacing**: Uses spacing variables for consistent rhythm
- [ ] **Transitions**: Implements appropriate transition style (smooth/bounce)
- [ ] **Accessibility**: Maintains sufficient contrast ratios
- [ ] **Consistency**: Follows established theming patterns
- [ ] **Scalability**: Design scales appropriately across breakpoints

---

## INTEGRATION WITH BUILD SYSTEM

### Tailwind Configuration

The theming system integrates seamlessly with Tailwind CSS:

```typescript
// tailwind.config.ts:106-124
extend: {
  colors: {
    fire: {
      red: 'hsl(var(--fire-red))',
      orange: 'hsl(var(--fire-orange))',  
      gold: 'hsl(var(--fire-gold))',
      yellow: 'hsl(var(--fire-yellow))'
    },
    tech: {
      blue: 'hsl(var(--tech-blue))',
      'blue-light': 'hsl(var(--tech-blue-light))'
    },
    metal: {
      silver: 'hsl(var(--metal-silver))',
      platinum: 'hsl(var(--metal-platinum))'
    }
  }
}
```

### CSS-in-JS Integration

For dynamic theming needs, the system works with CSS-in-JS:

```tsx
const dynamicStyles = {
  background: 'hsl(var(--fire-orange))',
  boxShadow: 'var(--shadow-fire)',
  transition: 'var(--transition-smooth)'
};
```

---

This theming system provides a robust, scalable foundation for the M5 Max brand identity while maintaining professional standards and accessibility requirements. All implementations should reference this guide to ensure visual consistency across the application.